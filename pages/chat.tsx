import { Fragment, useEffect, useState, useRef } from "react";
import { fetchSSE } from "./fetch-sse.mjs";
import { fetchText } from "./fetch-text.mjs";
import { v4 as uuidv4 } from "uuid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as Popover from "@radix-ui/react-popover";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Switch } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import "react-toastify/dist/ReactToastify.css";
import {
  MegaphoneIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

type ChatHistory = {
  id: string;
  input: string;
  output: string;
  loading: boolean;
  error: boolean;
};

// const DEMO_HISTORY = [
//   {
//     input: "你好！",
//     output: "你好！",
//     loading: false,
//     error: false,
//   },
//   {
//     input: "你是谁？",
//     output: "我是ChatGPT。",
//     loading: false,
//     error: false,
//   },
//   {
//     input: "做一下自我介绍吧！",
//     output:
//       "我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。",
//     loading: false,
//     error: false,
//   },
//   {
//     input: "再做一下自我介绍吧！",
//     output:
//       "我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。我是ChatGPT，一个基于GPT-3的聊天机器人。",
//     loading: false,
//     error: false,
//   },
// ];

type ToastMessageType = "info" | "success" | "warning" | "error";

type FetchMode = "text" | "sse";

export default function Chat() {
  let historyEnd = useRef<HTMLDivElement>(null);
  let inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [showInput, setShowInput] = useState(true);
  const [showOutput, setShowOutput] = useState(true);

  const [parentMessageId, setParentMessageId] = useState("");
  const [conversationId, setConversationId] = useState("");

  const [showBanner, setShowBanner] = useState(true);
  const [fetchMode, setFetchMode] = useState<FetchMode>("text");

  const prevHistory = useRef<ChatHistory[]>(history);

  const handleSubmit = (inputContent: string) => {
    if (inputContent !== "") {
      prevHistory.current = history;
      // historyEnd.current?.scrollIntoView({
      //   behavior: "smooth",
      // });

      setLoading(true);
      setInput("");
      let id = uuidv4();
      setHistory([
        ...history,
        {
          id: id,
          input: inputContent,
          output: "...",
          loading: true,
          error: false,
        },
      ]);

      getAnswer(id, inputContent, (id: string, text: string) => {
        console.log(`output: ${text}`);
        setHistory([
          ...prevHistory.current,
          {
            id: id,
            input: inputContent,
            output: text,
            loading: false,
            error: false,
          },
        ]);
      });
    } else {
      inputRef.current?.focus();
      notify("请输入内容！", "warning");
    }
  };

  useEffect(() => {
    console.log("useEffect");
  }, []);

  // useEffect(() => {
  //   console.log("fetchMode changed: ", fetchMode);
  // }, [fetchMode]);

  const notify = (content: string, type: string = "info") => {
    switch (type) {
      case "info":
        toast.info(content, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case "success":
        toast.success(content, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case "warning":
        toast.warning(content, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case "error":
        toast.error(content, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      default:
        toast.info(content, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
    }
  };

  const getBanner = () => {
    return (
      <div className="w-full bg-yellow-600">
        <div className="mx-auto max-w-7xl py-2 px-2 sm:px-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-0 flex-1 items-center">
              <span className="flex rounded-lg bg-orange-600 p-2">
                <MegaphoneIcon
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 font-medium text-white">
                <span className="md:inline">
                  {"当前使用人数较多，如果加载缓慢，请稍后重试。🙉🙊🙈有任何问题可以加Q群671616422反馈~"}
                </span>
              </p>
            </div>
            {/* <div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
              <a
                href="#"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
              >
                Learn more
              </a>
            </div> */}
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                className="-mr-1 flex rounded-md p-1 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                onClick={() => {
                  setShowBanner(false);
                }}
              >
                <XMarkIcon className="h-4 w-4 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const getAnswer = async (id: string, question: string, callback: any) => {
    let body = "";
    console.debug(
      `parentMessageId: ${parentMessageId}, conversationId: ${conversationId}`
    );
    if (parentMessageId !== "" && conversationId !== "") {
      body = JSON.stringify({
        msg: question,
        parent_message_id: parentMessageId,
        conversation_id: conversationId,
      });
    } else {
      body = JSON.stringify({
        msg: question,
      });
    }

    if (fetchMode === "sse") {
      await fetchSSE("http://119.91.201.57:38080/msg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        onMessage(message: string) {
          console.debug("full sse message", message);
          console.log("id", id);
          if (message === "[DONE]") {
            // enable Input
            setLoading(false);
            // let t = setTimeout(() => {
            //   console.log("start run code in setTimeout...");

            //   try {
            //     console.log("history", history);
            //     let final = history.find((item) => item.id === id);
            //     if (final) {
            //       final.loading = false;
            //       setHistory([...prevHistory.current, final]);
            //       console.log("final", final);
            //     }

            //     clearTimeout(t);
            //   } catch (error) {
            //     clearTimeout(t);
            //     console.log("error", error);
            //   }
            // }, 5000);
            console.log("history", history);
            return;
          }
          if (message === "[ERROR]") {
            console.error("sse error", errorMsg);
            setHistory([
              ...prevHistory.current,
              {
                id: id,
                input: question,
                output: "服务器出错了，可能ChatGPT崩了，请稍后重试。",
                loading: false,
                error: true,
              },
            ]);
            setErrorMsg("服务器出错了，可能ChatGPT崩了，请稍后重试。");
            setLoading(false);
            return;
          }
          const data = JSON.parse(message);
          setParentMessageId(data.message?.id);
          setConversationId(data.conversation_id ? data.conversation_id : "");
          const text = data.message?.content?.parts?.[0];
          if (text) {
            callback(id, text);
          }
        },
        onError(error: Error) {
          console.error("sse error", error);
          setHistory([
            ...prevHistory.current,
            {
              id: id,
              input: question,
              output: "服务器出错了，可能ChatGPT崩了，请稍后重试。",
              loading: false,
              error: true,
            },
          ]);
          setErrorMsg("服务器出错了，可能ChatGPT崩了，请稍后重试。");
          setLoading(false);
        },
      });
    } else {
      try {
        const resp = await fetchText("http://119.91.201.57:38080/msg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        });

        console.debug("resp", resp);
        setParentMessageId(resp.parent_id);
        setConversationId(resp.conversation_id);
        setLoading(false);
        callback(id, resp.message);
      } catch (error) {
        console.error("fetch error", error);
        const errorString = "" + error;
        if (errorString.includes("Too many requests")) {
          setHistory([
            ...prevHistory.current,
            {
              id: id,
              input: question,
              output: "当前太多人使用了，被OpenAI限流了，请1小时后重试。",
              loading: false,
              error: true,
            },
          ]);
          setErrorMsg("当前太多人使用了，被OpenAI限流了，请1小时后重试。");
        } else if (errorString.includes("Missing necessary credentials")) {
          setHistory([
            ...prevHistory.current,
            {
              id: id,
              input: question,
              output: "账号信息失效，请联系开发者或稍后重试。",
              loading: false,
              error: true,
            },
          ]);
          setErrorMsg("账号信息失效，请联系开发者或稍后重试。");
        } else if (errorString.includes("Incorrect response from OpenAI API")) {
          setHistory([
            ...prevHistory.current,
            {
              id: id,
              input: question,
              output: "OpenAI官方接口崩了，请稍后重试。",
              loading: false,
              error: true,
            },
          ]);
          setErrorMsg("OpenAI官方接口崩了，请稍后重试。");
        } else if (errorString.includes("something seems to have gone wrong")) {
          setHistory([
            ...prevHistory.current,
            {
              id: id,
              input: question,
              output:
                "可能触发了OpenAPI内容限制政策，请稍后重试并注意合规使用。",
              loading: false,
              error: true,
            },
          ]);
          setErrorMsg(
            "可能触发了OpenAPI内容限制政策，请稍后重试并注意合规使用。。"
          );
        } else {
          setHistory([
            ...prevHistory.current,
            {
              id: id,
              input: question,
              output: "服务器出错了，请稍后重试。错误信息：" + error,
              loading: false,
              error: true,
            },
          ]);
          setErrorMsg("服务器出错了，请稍后重试。错误信息：" + error);
        }
        setLoading(false);
      }
    }
  };

  const renderChatGPTOutput = (output: string) => {
    if (loading && output === "...") {
      return (
        <div>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      );
    } else {
      return <div>{output}</div>;
    }
  };
  const getChatHistory = (chats: ChatHistory[]) => {
    if (chats.length == 0) {
      return (
        <div className="p-4 w-full h-full place-items-center">
          <div className="flex flex-col">
            <div className="flex flex-col justify-center items-center my-2 md:my-4">
              <div className="text-center font-extrabold text-transparent text-4xl sm:text-6xl lg:text-8xl bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
                欢迎使用ChatGPT
              </div>
              <div className="text-gray-300 pt-4 md:pt-8">
                输入你想说的话，ChatGPT会回复你。
              </div>
            </div>

            <div className="my-2 md:my-8 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8">
              <CopyToClipboard
                text={"用简单的术语解释量子计算。"}
                onCopy={() => {
                  console.log("copied");
                  notify("已复制到剪贴板！", "success");
                }}
              >
                <div className="p-8 md:p-4 rounded-lg shadow-2xl mt-4 w-full border-b border-gray-900/50 text-gray-200 group bg-gradient-to-br from-gray-600 to-gray-900 transition ease-in-out delay-150 duration-300 hover:-translate-y-1 hover:scale-110">
                  {`"用简单的术语解释量子计算。"`}
                </div>
              </CopyToClipboard>

              <CopyToClipboard
                text={"给一个10岁的孩子过生日有什么创意吗？"}
                onCopy={() => {
                  console.log("copied");
                  notify("已复制到剪贴板！", "success");
                }}
              >
                <div className="p-8 md:p-4 rounded-lg shadow-2xl mt-4 w-full border-b border-gray-900/50 text-gray-200 group bg-gradient-to-br from-red-700 to-yellow-500 transition ease-in-out delay-150 duration-300 hover:-translate-y-1 hover:scale-110">
                  {`"给一个10岁的孩子过生日有什么创意吗？"`}
                </div>
              </CopyToClipboard>
              <CopyToClipboard
                text={"我如何在javascript中做一个htpt请求？"}
                onCopy={() => {
                  console.log("copied");
                  notify("已复制到剪贴板！", "success");
                }}
              >
                <div className="p-8 md:p-4 rounded-lg shadow-2xl mt-4 w-full border-b border-gray-900/50 text-gray-200 group bg-gradient-to-br from-green-600 to-blue-600 transition ease-in-out delay-150 duration-300 hover:-translate-y-1 hover:scale-110">
                  {`"我如何在javascript中做一个htpt请求？"`}
                </div>
              </CopyToClipboard>
              <CopyToClipboard
                text={"请以成长为主题写一篇作文，不少于800字。"}
                onCopy={() => {
                  console.log("copied");
                  notify("已复制到剪贴板！", "success");
                }}
              >
                <div className="p-8 md:p-4 rounded-lg shadow-2xl mt-4 w-full border-b border-gray-900/50 text-gray-200 group bg-gradient-to-br from-indigo-600 to-rose-600 transition ease-in-out delay-150 duration-300 hover:-translate-y-1 hover:scale-110">
                  {`"请以成长为主题写一篇作文，不少于800字。"`}
                </div>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      );
    }
    return chats.map((item, index) => {
      return (
        <div key={index} className="w-full">
          {showInput && (
            <div
              className={`transition-opacity ease-in-out duration-700 opacity-100 hover:opacity-100 rounded-lg shadow-lg mt-4 w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gradient-to-br from-gray-600`}
            >
              <div className="text-base gap-3 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex">
                <div className="w-[30px] flex flex-col relative items-end">
                  <div className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center">
                    <span
                      style={{
                        boxSizing: "border-box",
                        display: "inline-block",
                        overflow: "hidden",
                        background: "none",
                        opacity: 1,
                        border: "0px",
                        margin: "0px",
                        padding: "0px",
                        position: "relative",
                        maxWidth: "100%",
                      }}
                    ></span>
                    我:
                  </div>
                </div>
                <div className="relative w-full flex flex-col p-1">
                  {item.input}
                </div>
              </div>
            </div>
          )}
          {showOutput && (
            <div
              className={`${
                item.loading ? "animate-pulse" : ""
              } transition-opacity ease-in-out duration-700 opacity-100 hover:opacity-100 rounded-lg shadow-lg mt-4 w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gradient-to-br from-gray-400`}
            >
              <div className="text-base gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex">
                <div className="w-[30px] flex flex-col relative items-end">
                  <div className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center">
                    <svg
                      width="41"
                      height="41"
                      viewBox="0 0 41 41"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      strokeWidth="1.5"
                      className="w-6 h-6"
                    >
                      <path
                        d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="relative w-full flex flex-col">
                  <div>
                    <div
                      className={`float-right ${item.loading ? "hidden" : ""}`}
                    >
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-2 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                          操作
                          <ChevronDownIcon
                            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="z-20 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1 ">
                              <Menu.Item>
                                {({ active }) => (
                                  <div>
                                    <CopyToClipboard
                                      text={item.output}
                                      onCopy={() => {
                                        notify("已复制到剪贴板！", "success");
                                      }}
                                    >
                                      <button
                                        className={`${
                                          active
                                            ? "bg-gray-500 text-white"
                                            : "text-gray-900"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      >
                                        {active ? (
                                          <DuplicateActiveIcon
                                            className="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <DuplicateInactiveIcon
                                            className="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        )}
                                        复制
                                      </button>
                                    </CopyToClipboard>
                                  </div>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                      active
                                        ? "bg-gray-500 text-white"
                                        : "text-gray-900"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    onClick={() => {
                                      notify("别急，还在开发呢。。。", "info");
                                    }}
                                  >
                                    {active ? (
                                      <ShareActiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ShareInactiveIcon
                                        className="mr-2 h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                    分享
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="min-h-[20px] whitespace-pre-wrap flex flex-col items-start gap-4 p-1">
                    <div className="markdown prose light">
                      {renderChatGPTOutput(item.output)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-transparent overflow-hidden w-full h-full relative">
      <nav className="bg-opacity-0 backdrop-blur w-full p-5 z-10 bg-transparent fixed sm:justify-center space-x-4">
        {[
          ["首页", "/"],
          ["联系", "mailto:aaxomlee@gmail.com"],
        ].map(([title, url]) => (
          <a
            key={url}
            href={url}
            className="rounded-lg px-3 py-2 text-white font-medium hover:bg-slate-100 hover:text-slate-900"
          >
            {title}
          </a>
        ))}
        <div className="float-right flex flex-row gap-2">
          <div className="m-0">
            <Popover.Root>
              <Popover.Trigger className="flex flex-row gap-0">
                <div className="p-1">
                  <QuestionMarkCircleIcon
                    className="h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                </div>
                开启流式传输
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="z-20 bg-white text-black rounded p-5 w-52">
                  开启流式传输可以实时获取聊天结果，但是在官方接口异常时可能造成无限加载。如果发现开启该功能后，加载时间反而变长，请刷新网页或关闭该功能。
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
          <div className="mt-0.5">
            <Switch
              checked={fetchMode === "sse"}
              onChange={() => {
                if (!loading) {
                  if (fetchMode === "text") {
                    setFetchMode("sse");
                  } else {
                    setFetchMode("text");
                  }
                } else {
                  notify("请等待当前请求完成", "info");
                }
              }}
              className={`${
                fetchMode === "sse" ? "bg-purple-600" : "bg-gray-300"
              }
          relative inline-flex h-[21px] w-[37px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">流式传输开关</span>
              <span
                aria-hidden="true"
                className={`${
                  fetchMode === "sse" ? "translate-x-4" : "translate-x-0"
                }
            pointer-events-none inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
        </div>
      </nav>
      {showBanner ? <div className="mt-16 w-full">{getBanner()}</div> : ""}
      <div className="m-5">
        <main className="relative w-full transition-width flex flex-col h-full items-stretch flex-1">
          <div className="w-full mt-10 flex-1 mb-16 lg:mb-20">
            <div className="max-w-2xl h-full mx-auto">
              <div className="flex flex-col items-center text-sm h-full">
                {getChatHistory(history)}
                <div
                  className="hidden"
                  ref={(el) => {
                    // historyEnd = el;
                  }}
                >
                  chat history bottom
                </div>
              </div>
            </div>
          </div>
          <div className="z-10 bg-opacity-0 backdrop-blur fixed bg-transparent bottom-0 left-0 w-full">
            <div className="flex flex-row stretch gap-3 mx-2 pt-2 lg:mx-auto lg:pt-6 lg:max-w-3xl last:mb-2 md:last:mb-6">
              <div className="relative flex-1 h-full flex flex-col">
                <div className="flex flex-col w-full py-2 pl-3 relative dark:text-white rounded-md">
                  <TextareaAutosize
                    ref={inputRef}
                    minRows={1}
                    className={`${
                      loading ? "cursor-not-allowed " : ""
                    }resize-none max-h-fit rounded-lg border-solid border-2 border-gray-500 caret-blue-300 focus:border-blue-300 p-2 w-full`}
                    placeholder={loading ? "正在等待AI回答..." : "输入内容..."}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                    disabled={loading}
                  />
                  <button
                    className={`${
                      loading ? "cursor-not-allowed " : ""
                    }fixed m-5 p-1 rounded-md text-gray-500 bottom-0.5 right-1 md:bottom-5 md:right-1 lg:right-32 xl:right-72 2xl:right-1/4 2xl:mr-28 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent`}
                    disabled={loading}
                    onClick={() => {
                      handleSubmit(input);
                      // console.log(`input: ${input}, submit btn clicked...`);
                      // // 开启计时器
                      // // setTimer(
                      // //   setInterval(() => {
                      // //     if (timeoutCounter <= 30) {
                      // //       console.log(`timeoutCounter: ${timeoutCounter}`);
                      // //       setTimeoutCounter(timeoutCounter + 1);
                      // //     } else {
                      // //       clearInterval(timer);
                      // //       setLoading(false);
                      // //       setErrorMsg(
                      // //         "服务器出错了，可能ChatGPT崩了，请稍后重试。"
                      // //       );
                      // //       setTimeoutCounter(0);
                      // //     }
                      // //   }, 1000)
                      // // );

                      // prevHistory.current = history;
                      // // historyEnd.current?.scrollIntoView({
                      // //   behavior: "smooth",
                      // // });

                      // setLoading(true);
                      // setInput("");
                      // let id = uuidv4();
                      // setHistory([
                      //   ...history,
                      //   {
                      //     id: id,
                      //     input: input,
                      //     output: "...",
                      //     loading: true,
                      //     error: false,
                      //   },
                      // ]);

                      // getAnswer(id, input, (id: string, text: string) => {
                      //   console.log(`output: ${text}`);
                      //   setHistory([
                      //     ...prevHistory.current,
                      //     {
                      //       id: id,
                      //       input: input,
                      //       output: text,
                      //       loading: false,
                      //       error: false,
                      //     },
                      //   ]);
                      // });
                    }}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      className="w-6 h-6 rotate-90"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

function DuplicateInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#4e535d"
        stroke="#1e2836"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#4e535d"
        stroke="#1e2836"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#1e2836"
        stroke="#4e535d"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#1e2836"
        stroke="#4e535d"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShareInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#4e535d" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#4e535d" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#4e535d" strokeWidth="2" />
    </svg>
  );
}

function ShareActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#4e535d" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#4e535d" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#4e535d" strokeWidth="2" />
    </svg>
  );
}
