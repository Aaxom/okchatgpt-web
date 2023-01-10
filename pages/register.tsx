import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const SMS_CODE_RETRY_INTERVAL = 60;
const EMAIL_CODE_RETRY_INTERVAL = 60;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Register() {
  const router = useRouter();

  const [supportGlobalMobile, setSupportGlobalMobile] = useState(false);
  const [mobilePrefix, setMobilePrefix] = useState("+86");
  const [showMobilePart, setShowMobilePart] = useState(false);
  const [showEmailPart, setShowEmailPart] = useState(false);
  const [mobile, setMobile] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [blockSmsBtn, setBlockSmsBtn] = useState(false);
  const [blockEmailBtn, setBlockEmailBtn] = useState(false);
  const [smsCodeCountdown, setSmsCodeCountdown] = useState(
    SMS_CODE_RETRY_INTERVAL
  );
  const [emailCodeCountdown, setEmailCodeCountdown] = useState(
    EMAIL_CODE_RETRY_INTERVAL
  );
  let smsCountDownIntervalRef = useRef<NodeJS.Timer>();
  let emailCountDownIntervalRef = useRef<NodeJS.Timer>();

  const resetSmsCountDownInterval = () => {
    clearInterval(smsCountDownIntervalRef.current);
    smsCountDownIntervalRef.current = undefined;
  };

  const resetEmailCountDownInterval = () => {
    clearInterval(emailCountDownIntervalRef.current);
    emailCountDownIntervalRef.current = undefined;
  };

  useEffect(() => {
    console.log("init useEffect");

    fetch(`${process.env.BACKEND_API_URL}/api/register/config`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          if (resJson.is_mobile_register === "1") {
            setShowMobilePart(true);
          } else {
            setShowMobilePart(false);
          }
          if (resJson.is_email_register === "1") {
            setShowEmailPart(true);
          } else {
            setShowEmailPart(false);
          }
          setErrorMessage("");
        } else {
          setErrorMessage(
            "获取注册配置失败，原因：" + resJson.error || "未知错误"
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("获取注册配置失败，原因：" + err || "未知错误");
      });

    return () => {
      resetSmsCountDownInterval();
      resetEmailCountDownInterval();
    };
  }, []);

  useEffect(() => {
    console.log("smsCodeCountdown changed, countdown: " + smsCodeCountdown);
    if (smsCodeCountdown <= 0) {
      resetSmsCountDownInterval();
      setBlockSmsBtn(false);
      setSmsCodeCountdown(SMS_CODE_RETRY_INTERVAL);
      console.log("sms timer end");
    }
  }, [smsCodeCountdown]);

  useEffect(() => {
    console.log("emailCodeCountdown changed, countdown: " + emailCodeCountdown);
    if (emailCodeCountdown <= 0) {
      resetEmailCountDownInterval();
      setBlockEmailBtn(false);
      setEmailCodeCountdown(EMAIL_CODE_RETRY_INTERVAL);
      console.log("email timer end");
    }
  }, [emailCodeCountdown]);

  const handleSendSmsCodeClicked = () => {
    setBlockSmsBtn(true);
    smsCountDownIntervalRef.current = setInterval(() => {
      setSmsCodeCountdown((prev) => prev - 1);
    }, 1000);

    fetch(`${process.env.BACKEND_API_URL}/api/register/sms-code`, {
      method: "POST",
      body: JSON.stringify({
        mobile: `${mobilePrefix} ${mobile}`,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setErrorMessage("");
        } else {
          setSuccessMessage("");
          setErrorMessage(
            "验证码发送失败，原因：" + resJson.error || "未知错误"
          );
          resetSmsCountDownInterval();
          setBlockSmsBtn(false);
          setSmsCodeCountdown(SMS_CODE_RETRY_INTERVAL);
        }
      })
      .catch((err) => {
        console.log(err);
        setSuccessMessage("");
        setErrorMessage("验证码发送失败，原因：" + err || "未知错误");
        resetSmsCountDownInterval();
        setBlockSmsBtn(false);
        setSmsCodeCountdown(SMS_CODE_RETRY_INTERVAL);
      });
  };

  const handleSendEmailCodeClicked = () => {
    setBlockEmailBtn(true);
    emailCountDownIntervalRef.current = setInterval(() => {
      setEmailCodeCountdown((prev) => prev - 1);
    }, 1000);

    fetch(`${process.env.BACKEND_API_URL}/api/register/email-code`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setErrorMessage("");
        } else {
          setSuccessMessage("");
          setErrorMessage(
            "验证码发送失败，原因：" + resJson.error || "未知错误"
          );
          resetEmailCountDownInterval();
          setBlockEmailBtn(false);
          setEmailCodeCountdown(EMAIL_CODE_RETRY_INTERVAL);
        }
      })
      .catch((err) => {
        console.log(err);
        setSuccessMessage("");
        setErrorMessage("验证码发送失败，原因：" + err || "未知错误");
        resetEmailCountDownInterval();
        setBlockEmailBtn(false);
        setEmailCodeCountdown(EMAIL_CODE_RETRY_INTERVAL);
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let res = await fetch(`${process.env.BACKEND_API_URL}/api/register`, {
        method: "POST",
        body: JSON.stringify({
          mobile: `${showMobilePart ? `${mobilePrefix} ` : ""}${mobile}`,
          sms_code: smsCode,
          email: email,
          email_code: emailCode,
          username: username,
          password: password,
          re_password: rePassword,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200 && resJson.success) {
        setSuccessMessage("注册成功，即将前往登录");
        setErrorMessage("");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setSuccessMessage("");
        setErrorMessage("注册失败，原因：" + resJson.error || "未知错误");
      }
    } catch (err) {
      console.log(err);
      setSuccessMessage("");
      setErrorMessage("注册失败，原因：" + err || "未知错误");
    }
  };

  return (
    <div className="mt-16">
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-20 w-auto"
            src="/logo.svg"
            alt="OkGPT"
            width={600}
            height={600}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            注册您的账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            已经有账号？{" "}
            <Link
              href="/login"
              className="font-medium text-gray-400 hover:text-gray-100"
            >
              点此登录
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md m-3">
          <div className="bg-white py-8 px-4 shadow rounded-md sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {showMobilePart && (
                <>
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      手机号码
                    </label>
                    <div className="mt-1 flex flex-row">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <Menu.Button
                          disabled={!supportGlobalMobile}
                          className={`${
                            supportGlobalMobile ? "" : "cursor-not-allowed"
                          } inline-flex justify-center w-full h-full rounded-md border border-gray-300 shadow-sm px-3 py-2 ${
                            supportGlobalMobile ? "bg-white" : "bg-gray-100"
                          } text-sm font-medium text-gray-700 ${
                            supportGlobalMobile ? "hover:bg-gray-50" : ""
                          } focus:outline-none text-sm`}
                        >
                          {mobilePrefix}
                          <ChevronDownIcon
                            className="-mr-1 ml-2 h-5 w-5"
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
                          <Menu.Items className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href="#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    +86
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <input
                        id="mobile"
                        name="mobile"
                        type="mobile"
                        autoComplete="mobile"
                        required
                        className="bg-white caret-black text-black block ml-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="sms_code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      手机验证码
                    </label>
                    <div className="mt-1 flex flex-row">
                      <input
                        id="sms_code"
                        name="sms_code"
                        type="sms_code"
                        autoComplete="sms_code"
                        required
                        className="bg-white caret-black text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={smsCode}
                        onChange={(e) => setSmsCode(e.target.value)}
                      />

                      <button
                        type="button"
                        disabled={blockSmsBtn}
                        className={`${
                          blockSmsBtn ? "cursor-not-allowed" : ""
                        } ml-2 flex flex-shrink-0 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          blockSmsBtn
                            ? "bg-gray-300"
                            : "bg-blue-600 hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        onClick={() => {
                          console.log("获取验证码");
                          handleSendSmsCodeClicked();
                        }}
                      >
                        {blockSmsBtn
                          ? `重新发送（${smsCodeCountdown}s）`
                          : "获取验证码"}
                      </button>
                    </div>
                  </div>
                </>
              )}
              {showEmailPart && (
                <>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      邮箱
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="bg-white caret-black text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email_code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      邮箱验证码
                    </label>
                    <div className="mt-1 flex flex-row">
                      <input
                        id="email_code"
                        name="email_code"
                        type="email_code"
                        autoComplete="email_code"
                        required
                        className="bg-white caret-black text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                      />

                      <button
                        type="button"
                        disabled={blockEmailBtn}
                        className={`${
                          blockEmailBtn ? "cursor-not-allowed" : ""
                        } ml-2 flex flex-shrink-0 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          blockEmailBtn
                            ? "bg-gray-300"
                            : "bg-blue-600 hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        onClick={() => {
                          console.log("获取验证码");
                          handleSendEmailCodeClicked();
                        }}
                      >
                        {blockEmailBtn
                          ? `重新发送（${emailCodeCountdown}s）`
                          : "获取验证码"}
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  用户名
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    required
                    className="bg-white caret-black text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  密码
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="bg-white caret-black text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="re_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  确认密码
                </label>
                <div className="mt-1">
                  <input
                    id="re_password"
                    name="re_password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="bg-white caret-black text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                  />
                </div>
              </div>

              {successMessage && (
                <div className="text-green-500 text-sm">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  提交
                </button>
              </div>
            </form>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <Link
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>

                <div>
                  <Link
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Twitter</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </Link>
                </div>

                <div>
                  <Link
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with GitHub</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
