import path from "path";
import { createWriteStream, WriteStream } from "fs";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const LOG_ROOT = "logs";
const OP_LOG_PATH =
    process.env.NODE_ENV == "production"
        ? path.join(process.cwd(), LOG_ROOT, "prod", "operate")
        : path.join(process.cwd(), LOG_ROOT, "dev", "operate");

const ERROR_LOG_PATH =
    process.env.NODE_ENV == "production"
        ? path.join(process.cwd(), LOG_ROOT, "prod", "error")
        : path.join(process.cwd(), LOG_ROOT, "dev", "error");

const accessLogStream: WriteStream =
    process.env.NODE_ENV == "production"
        ? createWriteStream(
              path.join(process.cwd(), "logs/prod", "api-access.log"),
              { flags: "a" }
          )
        : createWriteStream(
              path.join(process.cwd(), "logs/dev", "api-access.log"),
              { flags: "a" }
          );

const { combine, timestamp, printf } = winston.format;
const logFormat = printf((info) => {
    return `${info.timestamp} [${info.level}] ${info.message}`;
});

const opLogger = winston.createLogger({
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
    ),
    transports: [
        new winstonDaily({
            level: "info",
            datePattern: "YYYY-MM-DD",
            dirname: OP_LOG_PATH,
            filename: `%DATE%.log`,
            maxFiles: 30,
        }),
    ],
});

if (process.env.NODE_ENV === "development") {
    opLogger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

const errorLogger = winston.createLogger({
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
    ),
    transports: [
        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: ERROR_LOG_PATH,
            filename: `%DATE%.error.log`,
            maxFiles: 30,
        }),
    ],
});

export { opLogger, errorLogger, accessLogStream };
