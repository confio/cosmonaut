import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDiffApi } from "../../../../../core/api/postDiff";
import { useGetUserProgress } from "../../../../../core/api/getUserProgress";
import { codeAns } from "./L4C2U1Ans";
import { codeEx } from "./L4C2U1Ex";
import L4C2U1S1Code from "./Problem/L4C2U1S1Code";
import L4C2U1S2Code from "./Problem/L4C2U1S2Code";

export const L4C2U1Pb = () => {
  const { lessonID, chID, uID, pID } = useParams();
  const [openTab, setOpenTab] = useState(1);
  const [difSuccess, setDifSuccess] = useState(false);
  const [ex, setEx] = useState(codeEx.Q1);
  const [ans, setAns] = useState(codeAns.Q1);
  const [readOnly, setReadOnly] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userLoading, userRes, userFetch] = useGetUserProgress(lessonID);

  useEffect(() => {
    userFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [response, isLoading, isSuccess, diffFetch] = useDiffApi(true);
  const handleAns = async () => {
    setDifSuccess(true);
    setReadOnly(true);
    if (chID >= String(userRes) && !(userRes === 0)) {
      await diffFetch();
    }
  };

  const navigate = useNavigate();
  const nextCh = async () => {
    if (lessonID === "4" && chID === "2" && uID === "1" && pID === "1") {
      return navigate(`/lesson/4/chapter/3/unit/1`);
    }
  };

  let codeDiff;
  switch (openTab) {
    case 1:
      codeDiff = (
        <L4C2U1S1Code
          read={readOnly}
          difSuccess={difSuccess}
          ex={ex}
          ans={ans}
        />
      );
      break;
    case 2:
      codeDiff = (
        <L4C2U1S2Code
          read={readOnly}
          difSuccess={difSuccess}
          ex={ex}
          ans={ans}
        />
      );
      break;
    default:
      break;
  }

  return (
    <>
      <div class="flex container w-full mx-auto">
        {/* Side Tabs */}
        <div class="w-14 ">
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpenTab(1);
              setEx(codeEx.Q1);
              setAns(codeAns.Q1);
            }}
            class="w-full rounded-tl-xl text-gray-300 bg-gray-100 focus:bg-blue-500 focus:text-gray-900  transform h-12 justify-center transition ease-in-out hover:scale-105 hover:text-gray-900 flex items-center py-2 lg:text-base text-xs font-heading"
          >
            1
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpenTab(2);
              setEx(codeEx.Q2);
              setAns(codeAns.Q2);
            }}
            class="w-full rounded-bl-xl text-gray-300 bg-gray-100 focus:bg-blue-500 focus:text-gray-900  transform h-12 justify-center transition ease-in-out hover:scale-105 hover:text-gray-900 flex items-center py-2 lg:text-base text-xs font-heading"
          >
            2
          </button>
        </div>
        {/* Code Editor */}
        <div className="flex flex-wrap bg-indigo-900 rounded-r-2xl rounded-bl-2xl w-full">
          {codeDiff}
        </div>
      </div>
      {difSuccess ? (
        <div class="flex items-center justify-center md:mt-8 mt-3 ">
          <button
            onClick={nextCh}
            class=" md:w-auto rounded-full mx-auto text-center md:shadow-md shadow-sm transform transition md:mx-0 md:px-10 ease-in-out hover:scale-105 bg-gradient-to-r from-green-400 to-blue-500 border-3 border-indigo-900 md:py-3 py-2 px-12  font-heading text-lg text-gray-50"
          >
            Jump to Next Chapter
          </button>
        </div>
      ) : (
        <div class="flex items-center justify-center md:mt-8 mt-3 ">
          <button
            onClick={handleAns}
            class="md:w-auto rounded-full mx-auto text-center md:shadow-md shadow-sm transform transition md:mx-0 md:px-10 ease-in-out hover:scale-105  bg-blue-700 hover:bg-blue-500 hover:text-white border-3 border-indigo-900 md:py-3 py-2 px-12  font-heading text-lg text-white"
          >
            View Solution
          </button>
        </div>
      )}
    </>
  );
};
