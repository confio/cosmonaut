import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useGetLessonPic } from "../../libs/api/getLessonPic";
import { useGetUserProgress } from "../../libs/api/getUserProgress";
import { lessonEngInfo } from "../../states/Information/lessonInfoAtoms";
import { ProgressBar1 } from "../Common/ProgressBar";

const Container = tw.div`fixed h-screen bottom-0 w-full z-50 flex items-center bg-gray-900 bg-opacity-80`;
const Button = tw.button`animate-bounce block mx-auto lg:mt-8 md:mt-4 md:mb-4 text-center lg:text-lg md:text-sm border-3 transition duration-200 rounded-full py-2 px-8 bg-gradient-to-r to-orange-400 from-yellow-500 font-heading text-indigo-900 hover:from-green-500 border-indigo-900 hover:border-white hover:to-blue-500 hover:text-white mt-3 text-xs`;

export const ChapterModal = () => {
  const navigate = useNavigate();
  const { lessonID, chID } = useParams();
  const lessonInfos = useRecoilValue(lessonEngInfo);
  const nextCh = Number(chID) + 1;
  const nextChapter = () => {
    navigate(`/lesson/${lessonID}/chapter/${nextCh}/unit/0`);
  };
  const [lessonPic, picFetch] = useGetLessonPic({ lessonID });
  const [userRes, userFetch] = useGetUserProgress({ lessonID });

  useEffect(() => {
    picFetch();
    userFetch();
  }, []);

  return (
    <>
      <Container>
        <div class="container flex my-auto px-4 mx-auto items-center justify-center">
          <div class="container  lg:mx-40 md:mx-24 justify-center items-center max-h-screen bg-twinkle">
            <h4 class="font-heading text-center lg:text-3xl md:text-lg mb-4 text-lg">
              Great Job!
            </h4>
            <div class="mx-auto mb-4 lg:w-80 md:w-64 w-56">
              <div class="mx-2 shadow rounded-xl bg-yellow-500 p-1">
                <div class="bg-white border-4 border-indigo-900 rounded-xl text-center p-3 px-6">
                  <img
                    class="block mx-auto mb-2 max-h-56"
                    src={lessonPic}
                    alt="Blob URL"
                  />
                  <p class="text-indigo-900 font-heading mb-1 leading-tight text-base">
                    Lesson {lessonID}.
                  </p>
                  <p class="text-indigo-900 font-heading mb-2 leading-tight text-xs">
                    {lessonInfos[lessonID]?.title}
                  </p>
                  <ProgressBar1 progress={userRes.chapter} />
                  <p class="block mx-auto px-4 py-0.5 rounded-full border-2 bg-gray-50 border-gray-500 text-gray-500 font-heading text-sm">
                    Completed
                  </p>
                </div>
              </div>
            </div>
            <h4 class="font-heading mb-4 text-center leading-tight lg:text-lg md:text-sm text-xs">
              You’ve completed your chapter.
            </h4>
            <Button onClick={nextChapter}>Ready for Next Chapter?</Button>
          </div>
        </div>
      </Container>
    </>
  );
};
