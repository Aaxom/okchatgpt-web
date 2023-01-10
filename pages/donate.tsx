import { Fragment, useEffect, useState, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ToastContainer, toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import "react-toastify/dist/ReactToastify.css";
import { MegaphoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type ToastMessageType = "info" | "success" | "warning" | "error";

export default function LiteChat() {
  let historyEnd = useRef<HTMLDivElement>(null);
  let inputRef = useRef<HTMLTextAreaElement>(null);

  const [showBanner, setShowBanner] = useState(true);

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
                  {"有任何问题和建议可以加Q群671616422反馈~"}
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

  return (
    <div className="bg-transparent overflow-hidden w-full h-full relative">
      {/* <nav className="bg-opacity-0 backdrop-blur w-full p-5 z-10 bg-transparent fixed sm:justify-center space-x-1">
        {[
          ["回首页", "/"],
          ["加群", "https://jq.qq.com/?_wv=1027&k=e01ZjnJv"],
        ].map(([title, url]) => (
          <a
            key={url}
            href={url}
            className="rounded-lg px-3 py-2 text-white font-medium hover:bg-slate-100 hover:text-slate-900"
          >
            {title}
          </a>
        ))}
      </nav> */}
      {showBanner ? <div className="mt-16 w-full">{getBanner()}</div> : ""}
      <div className={`${showBanner ? "" : "mt-16"} m-5`}>
        <main className="relative w-full transition-width flex flex-col h-full items-stretch flex-1">
          <div className="w-full flex-1 mb-16 lg:mb-20">
            <div className="w-full h-full mx-auto">
              <div className="flex flex-col items-center text-sm h-full">
                <div className="my-4 text-center font-extrabold text-transparent text-4xl sm:text-6xl lg:text-8xl bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
                  云乞讨
                </div>
                <div className="text-gray-300 py-4 md:py-8 text-center">
                  距今为止，账号已经消耗了$918.00，欢迎捐赠以支持开发者继续开发。
                </div>
                <div className="flex flex-row flex-wrap gap-4">
                  <div className="flex-auto grow">
                    <Image
                      src="/zfb.jpg"
                      width={350}
                      height={350}
                      alt={"zfb-img"}
                    />
                  </div>
                  <div className="flex-auto grow">
                    <Image
                      src="/wxzf.jpg"
                      width={350}
                      height={350}
                      alt={"wxzf-img"}
                    />
                  </div>
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
