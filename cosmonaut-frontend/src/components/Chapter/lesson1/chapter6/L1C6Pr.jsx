import React, { useEffect, useRef, useState } from "react";
import PracticePart from "../../../../components/CodeEditor/PracticePart";
import BgV4 from "../../../../assets/images/bg-v4.svg";
import EditorDesc from "../../../../components/CodeEditor/EditorDesc";
import ProblemSection from "../../../../components/Contents/ProblemSection";
import Problem from "../../../../components/Contents/Problem";
import ListStyle from "../../../../components/Contents/ListStyle";
import CodeBlock from "../../../../components/Contents/CodeBlock";
import BasicP from "../../../../components/Contents/BasicP";
import HintButton from "../../../../components/Contents/HintButton";
import Hint from "../../../../components/Contents/Hint";
import PracticeCode from "../../../../components/CodeEditor/PracticeCode";
import { useNavigate, useParams } from "react-router-dom";
import ResultTab from "../../../../components/CodeEditor/ResultTab";
import EditorPractice from "../../../CodeEditor/EditorPractice";
import { Loading } from "../../../../components/Common/Loading";
import TabHeader from "../../../../components/Practice/TabHeader";
import PracticeName from "../../../../components/Practice/PracticeName";
import CodeStart from "../../../../components/CodeEditor/CodeStart";
import { useBuild } from "../../../../core/hook/useBuild";
import { BuildButton, NextButton } from "../../../Common/buttons";
import { useTargetCode } from "../../../../core/hook/useTartgetCode";
import { Base64 } from "js-base64";

export const L1C6Pr = () => {
  const { lessonID, chID } = useParams();
  const [hide, setHide] = useState(true);
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [tab, setTab] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const [getTargetCode, example, exLoading] = useTargetCode();
  const key = tab + lessonID;
  let initCode = "";
  if (sessionStorage.getItem(key)) {
    initCode = sessionStorage.getItem(key);
  } else if (example) {
    initCode = example[tab];
  } else {
    initCode = "";
  }
  const [code, setCode] = useState(initCode);
  const [files, setFiles] = useState({});
  useEffect(() => {
    setFiles({ ...files, [tab]: Base64.encode(code) });
    sessionStorage.setItem(key, code);
  }, [code]);
  let stateCode = sessionStorage.getItem("state.rs1");
  let msgCode = sessionStorage.getItem("msg.rs1");
  let contractCode = sessionStorage.getItem("contract.rs1");
  let executeCode = sessionStorage.getItem("execute.rs1");
  let file = {
    "state.rs": Base64.encode(stateCode),
    "msg.rs": Base64.encode(msgCode),
    "contract.rs": Base64.encode(contractCode),
    "execute.rs": Base64.encode(executeCode),
  };

  const [postBuild, runSuccess, runError, runLoading, executeRes, queryRes] =
    useBuild();

  const handleNextLesson = () => {
    navigate(`/lesson/1/chapter/6/unit/2`);
  };
  const handleBuildButton = async () => {
    await postBuild(lessonID, chID, file);
  };
  const handleTargetCode = async () => {
    setTab("state.rs");
    await getTargetCode(lessonID, chID);
  };

  let Button;
  if (executeRes.result === "success" && queryRes.result === "success") {
    Button = (
      <NextButton onClick={handleNextLesson} content={"Jump to Next Lesson"} />
    );
  } else {
    Button = (
      <BuildButton onClick={handleBuildButton} content={"Deploy the code"} />
    );
  }

  return (
    <>
      <PracticeName color={"rgba(86, 84, 141, 1)"} />
      <div
        style={{ backgroundImage: `url(${BgV4})` }}
        class="pt-8 pb-20 md:px-6 px-4 lg:px-10 bg-black bg-cover bg-center md:pt-8"
      >
        <PracticePart lesson={lessonID} />
        {runError && !runSuccess ? (
          <ResultTab executeState={"error"} executeError={executeRes} />
        ) : null}
        {runSuccess && (
          <ResultTab
            executeState={executeRes?.result}
            queryState={queryRes?.result}
            executeIncorrect={executeRes?.differences}
            queryIncorrect={queryRes?.differences}
            executeError={executeRes?.errors}
            queryError={queryRes?.errors}
          />
        )}
        <div class="flex container w-full mx-auto">
          {/* Problem Part */}
          <div class="flex flex-wrap h-auto bg-indigo-900 rounded-2xl">
            <EditorDesc>
              <ProblemSection>
                <Problem>Problem 1.</Problem>
                <ListStyle>
                  <li>
                    <b>
                      Where to Implement: <CodeBlock>state.rs</CodeBlock>
                    </b>
                  </li>
                </ListStyle>
                <BasicP>
                  Declare extension as type of struct{" "}
                  <CodeBlock>Metadata</CodeBlock> below.
                </BasicP>
              </ProblemSection>
              <ProblemSection>
                <Problem>Problem 2.</Problem>
                <ListStyle>
                  <li>
                    <b>
                      Where to Implement: <CodeBlock>state.rs</CodeBlock>
                    </b>
                  </li>
                </ListStyle>
                <BasicP>
                  Declare <CodeBlock>freights</CodeBlock> as vector of{" "}
                  <CodeBlock>Freight</CodeBlock>.
                </BasicP>
              </ProblemSection>
              <ProblemSection>
                <Problem>Problem 3.</Problem>
                <ListStyle>
                  <li>
                    <b>
                      Where to Implement: <CodeBlock>msg.rs</CodeBlock>
                    </b>
                  </li>
                  <li>
                    <b>
                      References: <CodeBlock>state.rs</CodeBlock>
                    </b>
                  </li>
                </ListStyle>
                <BasicP>
                  Declare message <CodeBlock>Mint</CodeBlock> which extends{" "}
                  <CodeBlock>MintMsg</CodeBlock> of cw721_base with
                  <CodeBlock>Extension</CodeBlock> type.
                </BasicP>
              </ProblemSection>
              <ProblemSection>
                <Problem>Problem 4.</Problem>
                <ListStyle>
                  <li>
                    <b>
                      Where to Implement: <CodeBlock>msg.rs</CodeBlock>
                    </b>
                  </li>
                </ListStyle>
                <BasicP>
                  Route <CodeBlock>TransferNft</CodeBlock> from{" "}
                  <CodeBlock>ExecuteMsg</CodeBlock> to{" "}
                  <CodeBlock>Cw721ExecuteMsg</CodeBlock> with parameters{" "}
                  <CodeBlock>recipient</CodeBlock> and{" "}
                  <CodeBlock>token_id</CodeBlock>.
                </BasicP>
              </ProblemSection>
              <ProblemSection>
                <Problem>Problem 5.</Problem>
                <ListStyle>
                  <li>
                    <b>
                      Where to Implement: <CodeBlock>contract.rs</CodeBlock>
                    </b>
                  </li>
                </ListStyle>
                <BasicP>
                  Instantiate cw721_contract through method{" "}
                  <CodeBlock>instantiate</CodeBlock>.
                </BasicP>
                <HintButton onClick={() => setHide(!hide)}>
                  <Hint hide={hide} />
                  {hide ? null : (
                    <BasicP>
                      <CodeBlock>DepsMut</CodeBlock>, <CodeBlock>Env</CodeBlock>
                      , <CodeBlock>MessageInfo</CodeBlock>, and{" "}
                      <CodeBlock>InstantiateMsg</CodeBlock> should be passed to
                      cw721_contract’s <CodeBlock>instantiate</CodeBlock>.
                    </BasicP>
                  )}
                </HintButton>
              </ProblemSection>
              <ProblemSection>
                <Problem>Problem 6.</Problem>
                <ListStyle>
                  <li>
                    <b>
                      Where to Implement: <CodeBlock>execute.rs</CodeBlock>
                    </b>
                  </li>
                </ListStyle>
                <BasicP>
                  Execute <CodeBlock>msg</CodeBlock> through method{" "}
                  <CodeBlock>execute</CodeBlock>.
                </BasicP>
                <HintButton onClick={() => setHide(!hide)}>
                  <Hint hide={hide} />
                  {hide ? null : (
                    <BasicP>
                      We already has method <CodeBlock>execute</CodeBlock> in{" "}
                      <CodeBlock>self</CodeBlock>.
                    </BasicP>
                  )}
                </HintButton>
              </ProblemSection>
              <ProblemSection>
                <Problem>Problem 7.</Problem>
                <ListStyle>
                  <li>
                    <b>
                      Where to Implement: <CodeBlock>execute.rs</CodeBlock>
                    </b>
                  </li>
                </ListStyle>
                <BasicP>
                  Declare <CodeBlock>candidated_idx</CodeBlock>.
                </BasicP>
                <BasicP>
                  Iterate <CodeBlock>freights</CodeBlock> at{" "}
                  <CodeBlock>extension</CodeBlock> and collect elements whose{" "}
                  <CodeBlock>denom</CodeBlock> is the same as argument's one.
                </BasicP>
                <HintButton onClick={() => setHide(!hide)}>
                  <Hint hide={hide} />
                  {hide ? null : (
                    <BasicP>
                      <CodeBlock>position</CodeBlock> searches for an element in
                      an iterator, returning its index.
                    </BasicP>
                  )}
                </HintButton>
              </ProblemSection>
              <ProblemSection>
                <Problem>Problem 8.</Problem>
                <ListStyle>
                  <li>
                    <b>
                      Where to Implement: <CodeBlock>execute.rs</CodeBlock>
                    </b>
                  </li>
                </ListStyle>
                <BasicP>
                  Remove <CodeBlock>freight</CodeBlock> from{" "}
                  <CodeBlock>extension</CodeBlock> if its amount is zero.
                </BasicP>
                <BasicP>
                  Otherwise, decrease amount of <CodeBlock>freight</CodeBlock>.
                </BasicP>
                <HintButton onClick={() => setHide(!hide)}>
                  <Hint hide={hide} />
                  {hide ? null : (
                    <BasicP>Don’t forget to check overflow.</BasicP>
                  )}
                </HintButton>
              </ProblemSection>
            </EditorDesc>
            {/* Code Editor Part */}
            <PracticeCode>
              <div class="mb-1 px-4">
                <TabHeader>
                  <button
                    class="block mr-[1px] py-3 px-2 md:px-4 md:mb-0 mb-1 bg-purple-500 font-bold text-xs rounded-t-md transform transition ease-in-out focus:scale-105 focus:text-gray-900 hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("state.rs");
                      setReadOnly(false);
                    }}
                  >
                    state.rs
                  </button>
                  <button
                    class="block mr-[1px] py-3 px-2 md:px-4 md:mb-0 mb-1  bg-purple-500 font-bold text-xs rounded-t-md transform transition ease-in-out focus:scale-105 focus:text-gray-900 hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("msg.rs");
                      setReadOnly(false);
                    }}
                  >
                    msg.rs
                  </button>
                  <button
                    class="block mr-[1px] py-3 px-2 md:px-4 md:mb-0 mb-1  bg-purple-500 font-bold text-xs rounded-t-md transform transition ease-in-out focus:scale-105 focus:text-gray-900 hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("contract.rs");
                      setReadOnly(false);
                    }}
                  >
                    contract.rs
                  </button>
                  <button
                    class="block mr-[1px] py-3 px-2 md:px-4 md:mb-0 mb-1  bg-purple-500 font-bold text-xs rounded-t-md transform transition ease-in-out focus:scale-105 focus:text-gray-900 hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("execute.rs");
                      setReadOnly(false);
                    }}
                  >
                    execute.rs
                  </button>
                  <button
                    class="block mr-[1px] py-3 px-2 md:px-4 md:mb-0 mb-1  bg-orange-400 font-bold text-xs rounded-t-md transform transition ease-in-out focus:scale-105 focus:text-gray-900 hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("error.rs");
                      setReadOnly(true);
                    }}
                  >
                    error.rs
                  </button>
                  <button
                    class="block mr-[1px] py-3 px-2 md:px-4 md:mb-0 mb-1  bg-orange-400 font-bold text-xs rounded-t-md transform transition ease-in-out focus:scale-105 focus:text-gray-900 hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("lib.rs");
                      setReadOnly(true);
                    }}
                  >
                    lib.rs
                  </button>
                  <button
                    class="block mr-[1px] py-3 px-2 md:px-4 md:mb-0 mb-1  bg-orange-400 font-bold text-xs rounded-t-md transform transition ease-in-out focus:scale-105 focus:text-gray-900 hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("query.rs");
                      setReadOnly(true);
                    }}
                  >
                    query.rs
                  </button>
                </TabHeader>
                <div class="mx-auto mb-1">
                  {exLoading && <CodeStart onClick={handleTargetCode} />}
                  {runLoading ? (
                    <Loading />
                  ) : (
                    <EditorPractice
                      defaultLanguage="rust"
                      exCode={example[tab]}
                      path={key}
                      onChange={(e) => setCode(e)}
                      onMount={(editor) => (editorRef.current = editor)}
                      files={file}
                      readOnly={readOnly}
                    />
                  )}
                </div>
              </div>
            </PracticeCode>
          </div>
        </div>
        <div class="flex items-center justify-center md:mt-8 mt-3 ">
          {Button}
        </div>
      </div>
    </>
  );
};
