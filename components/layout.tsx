/* This example requires Tailwind CSS v2.0+ */
import {
  Fragment,
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Switch } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import { Disclosure, Dialog, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  PlusSmallIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import { globalReducer } from "../reducers/reducers";
import type { GlobalState } from "../reducers/reducers";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

let initialGlobalState: GlobalState = {
  userProfile: {
    uuid: "",
    username: "",
    nickname: "",
    mobile: "",
    email: "",
    avatar_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    description: "",
    disabled: 0,
    level: 0,
  },
  isLoggedIn: false,
  fetchMode: "text",
  sendingData: false,
};

export const GlobalContext = createContext(initialGlobalState);

export const GlobalDispatchContext = createContext((value: any) => {
  return;
});

export function useGlobal() {
  return useContext(GlobalContext);
}

export function useGlobalDispatch() {
  return useContext(GlobalDispatchContext);
}

export default function Layout({ children }: any) {
  const [globalState, globalDispatch] = useReducer(
    globalReducer,
    initialGlobalState
  );

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // const user = {
  //   name: "Tom Cook",
  //   email: "tom@example.com",
  //   imageUrl:
  //     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  // };

  useEffect(() => {
    console.log("Layout.tsx useEffect");
    // Perform localStorage action
    const localUserProfile = JSON.parse(
      localStorage.getItem("userProfile") ||
        `{"uuid":"","username":"","nickname":"","mobile":"","email":"","avatar_url":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80","description":"","disabled":0,"level":0}`
    );
    const localIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // console.log("localUserProfile", localUserProfile);
    // console.log("localIsLoggedIn", localIsLoggedIn);

    globalDispatch({
      type: "SET_USER_PROFILE",
      payload: {
        userProfile: localUserProfile,
      },
    });
    globalDispatch({
      type: "SET_IS_LOGGED_IN",
      payload: {
        isLoggedIn: localIsLoggedIn,
      },
    });
    globalDispatch({
      type: "SET_FETCH_MODE",
      payload: {
        fetchMode: localStorage.getItem("fetchMode") || "text",
      },
    });
  }, []);

  const navigation = [
    {
      name: "home",
      title: "首页",
      href: "/",
      current: router.pathname === "/",
    },
    {
      name: "chat",
      title: "优化版",
      href: "/chat",
      current: router.pathname === "/chat",
    },
    {
      name: "lite",
      title: "轻量版",
      href: "/lite",
      current: router.pathname === "/lite",
    },
    {
      name: "join_group",
      title: "加群",
      href: "https://jq.qq.com/?_wv=1027&k=e01ZjnJv",
      current: false,
    },
    {
      name: "donat",
      title: "捐赠",
      href: "/donate",
      current: router.pathname === "/donate",
    },
  ];

  const userNavigation = [
    // { name: "个人中心", href: "/usercenter" },
    { name: "setting", title: "账户设置", href: "/setting" },
    { name: "logout", title: "退出登录", href: "/logout" },
  ];

  // const [sendingData, setSendingData] = useState(false);
  // const [fetchMode, setFetchMode] = useState<FetchMode>("sse");

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

  const handleLogout = () => {
    console.log("logout");
    globalDispatch({
      type: "LOGOUT",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <>
      <header className="bg-transparent overflow-hidden w-full relative">
        <Disclosure as="nav" className="bg-transparent w-full">
          {({ open }) => (
            <>
              <div
                className={`${
                  open
                    ? "bg-gradient-to-r from-black to-gray-800"
                    : "bg-opacity-0 backdrop-blur bg-transparent"
                } fixed z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
              >
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="-ml-2 mr-2 flex items-center md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      <Image
                        className="block lg:hidden h-12 w-auto"
                        src="/logo.svg"
                        alt="OkGPT"
                        width={500}
                        height={500}
                      />
                      <Image
                        className="hidden lg:block h-14 w-auto"
                        src="/logo-horizontal.svg"
                        alt="OkGPT"
                        width={500}
                        height={500}
                      />
                    </div>
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`flex flex-row gap-2 flex-shrink-0 ${
                        router.pathname !== "/chat" || true ? "hidden" : ""
                      }`}
                    >
                      <span className="m-0">
                        <Popover.Root>
                          <Popover.Trigger className="flex flex-row gap-0">
                            <div className="p-1">
                              <QuestionMarkCircleIcon
                                className="h-4 w-4 text-white"
                                aria-hidden="true"
                              />
                            </div>
                            流式传输
                          </Popover.Trigger>
                          <Popover.Portal>
                            <Popover.Content className="z-20 bg-white text-black rounded p-5 w-52">
                              开启流式传输可以实时获取聊天结果，但是在官方接口异常时可能造成无限加载。如果发现开启该功能后，加载时间反而变长，请刷新网页或关闭该功能。
                              <Popover.Arrow className="fill-white" />
                            </Popover.Content>
                          </Popover.Portal>
                        </Popover.Root>
                      </span>
                      <span className="mt-0.5">
                        <Switch
                          checked={globalState.fetchMode === "sse"}
                          onChange={() => {
                            if (!globalState.sendingData) {
                              if (globalState.fetchMode === "text") {
                                localStorage.setItem("fetchMode", "sse");
                                globalDispatch({
                                  type: "SET_FETCH_MODE",
                                  payload: {
                                    fetchMode: "sse",
                                  },
                                });
                              } else {
                                localStorage.setItem("fetchMode", "text");
                                globalDispatch({
                                  type: "SET_FETCH_MODE",
                                  payload: {
                                    fetchMode: "text",
                                  },
                                });
                              }
                            } else {
                              notify("请等待当前请求完成", "info");
                            }
                          }}
                          className={`${
                            globalState.fetchMode === "sse"
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }
          relative inline-flex h-[21px] w-[37px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">流式传输开关</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              globalState.fetchMode === "sse"
                                ? "translate-x-4"
                                : "translate-x-0"
                            }
            pointer-events-none inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </span>
                    </div>
                    {globalState.isLoggedIn && (
                      <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                        <button
                          type="button"
                          className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="ml-3 relative">
                          <div>
                            <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none">
                              <span className="sr-only">Open user menu</span>
                              <Image
                                className="h-8 w-8 rounded-full"
                                src={globalState.userProfile.avatar_url}
                                alt=""
                                width={256}
                                height={256}
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item key={"nickname"}>
                                {({ active }) => (
                                  <div
                                    className={classNames(
                                      "w-full",
                                      "block px-4 py-2 text-left text-sm text-gray-700 border-b"
                                    )}
                                  >
                                    {globalState.userProfile.nickname}
                                  </div>
                                )}
                              </Menu.Item>
                              {userNavigation.map((item) => {
                                if (item.name === "logout") {
                                  return (
                                    <Menu.Item key={item.name}>
                                      {({ active }) => (
                                        <button
                                          className={classNames(
                                            "w-full",
                                            active ? "bg-gray-100" : "",
                                            "block px-4 py-2 text-left text-sm text-gray-700"
                                          )}
                                          onClick={() => {
                                            handleLogout();
                                          }}
                                        >
                                          {item.title}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  );
                                }
                                return (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <Link
                                        href={item.href}
                                        className={classNames(
                                          active ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                      >
                                        {item.title}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                );
                              })}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    )}
                    {!globalState.isLoggedIn && (
                      <>
                        <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                          <button
                            type="button"
                            className="text-gray-400 text-sm px-3 py-2 rounded-md hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            onClick={() => {
                              router.push("/login");
                            }}
                          >
                            登录
                          </button>
                        </div>
                        <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                          <button
                            type="button"
                            className="text-gray-400 text-sm px-3 py-2 rounded-md hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            onClick={() => {
                              router.push("/register");
                            }}
                          >
                            注册
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Disclosure.Panel
                className={`${
                  open ? "bg-gradient-to-r from-black to-gray-800 mt-16" : ""
                } fixed z-20 w-full md:hidden`}
              >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item, index) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        `block px-3 py-2 rounded-md text-base font-medium`
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.title}
                    </Disclosure.Button>
                  ))}
                </div>
                {globalState.isLoggedIn && (
                  <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="flex items-center px-5 sm:px-6">
                      <div className="flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={globalState.userProfile.avatar_url}
                          alt=""
                          width={256}
                          height={256}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">
                          {globalState.userProfile.nickname}
                        </div>
                        <div className="text-sm font-medium text-gray-400">
                          {globalState.userProfile.mobile
                            ? globalState.userProfile.mobile
                            : globalState.userProfile.email}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ml-auto flex-shrink-0 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 px-2 space-y-1 sm:px-3">
                      {userNavigation.map((item) => {
                        if (item.name === "logout") {
                          return (
                            <Disclosure.Button
                              key={item.name}
                              as="a"
                              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                              onClick={() => {
                                handleLogout();
                              }}
                            >
                              {item.title}
                            </Disclosure.Button>
                          );
                        }
                        return (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                          >
                            {item.title}
                          </Disclosure.Button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {!globalState.isLoggedIn && (
                  <div className="pb-3 border-t border-gray-700">
                    <div className="mt-3 px-2 space-y-1 sm:px-3">
                      <Disclosure.Button
                        as="a"
                        href="/login"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        登录
                      </Disclosure.Button>
                      <Disclosure.Button
                        as="a"
                        href="/register"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        注册
                      </Disclosure.Button>
                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </header>
      <div className="h-full">
        <main className="h-full">
          <GlobalContext.Provider value={globalState}>
            <GlobalDispatchContext.Provider value={globalDispatch}>
              {children}
            </GlobalDispatchContext.Provider>
          </GlobalContext.Provider>
        </main>
      </div>
    </>
  );
}
