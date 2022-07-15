import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import compression from "compression";
import { createClient } from "redis";
import connectredis from "connect-redis";
import httpStatus from "http-status";
import passport from "passport";

import { default as conf, log } from "./config";
import baseRoute from "./routes";
import v1Route from "./routes/v1";
import { apiLimiter } from "./middlewares/rate-limit";
import { errorConverter, errorHandler } from "./middlewares/error";
import { APIError } from "@d3lab/types";

const app = express();
app.use(express.static(conf.staticPath))
app.locals.cargoPrefix = "cargo-projects/cosm";

app.use(apiLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
const RedisStore = connectredis(session);
let redisClient = createClient({ legacyMode: true, url: conf.redis.url });
redisClient.connect().catch(console.error);
const sessOpt: session.SessionOptions = {
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: conf.sessSecret as string,
    resave: false,
    cookie: { secure: false, sameSite: "lax" }
};

const corsOpts = {
    origin: conf.corsWhiteList,
    credentials: true,
};
if (conf.nodeEnv == "production") {
    app.use(cors(corsOpts));
    app.set("trust proxy", 1);
    if (sessOpt.cookie) {
        sessOpt.cookie.maxAge = 1000 * 60 * 60 * 2;
        // sessOpt.cookie.secure = true;
    }

    app.use(
        morgan("combined", {
            skip: (req, res) => {
                return res.statusCode < 400;
            },
        })
    );
    app.use(morgan("common", { stream: log.accessLogStream}));
} else {
    app.use(cors(corsOpts));
    app.use(morgan("dev")); //log to console on development
}

app.use(session(sessOpt));
app.use(passport.authenticate("session"));
app.locals.redis = redisClient;

app.use(helmet());
app.use(compression());

app.use(
    "/",
    (req, res, next) => {
        next();
    },
    baseRoute
);
app.use("/v1", v1Route)

app.use((req, res, next) => {
    next(new APIError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
app.use(errorHandler);

export default app;
