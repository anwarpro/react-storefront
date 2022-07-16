import { useAuth, useAuthState } from "@saleor/sdk";
import sideBg from "assets/login-side-shape.png";
import bg from "assets/loginbg.png";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "@/components/translations";
import { DEMO_MODE } from "@/lib/const";
import { usePaths } from "@/lib/paths";

export type OptionalQuery = {
  next?: string;
};

export interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const router = useRouter();
  const paths = usePaths();
  const t = useIntl();

  const { login } = useAuth();
  const { authenticated } = useAuthState();

  const defaultValues = DEMO_MODE
    ? {
        email: "admin@example.com",
        password: "admin",
      }
    : {};

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<LoginFormData>({ defaultValues });

  const redirectURL = router.query.next?.toString() || paths.$url();

  const handleLogin = handleSubmitForm(async (formData: LoginFormData) => {
    const { data } = await login({
      email: formData.email,
      password: formData.password,
    });

    if (data?.tokenCreate?.errors[0]) {
      // Unable to sign in.
      setErrorForm("email", { message: "Invalid credentials" });
    }
  });
  if (authenticated) {
    // User signed in successfully.
    if (router.query.next?.toString()) {
      router.push(paths.checkout.$url());
    } else {
      router.push(redirectURL);
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center">
      <div
        className="flex"
        style={{
          backgroundImage: `url(${bg.src})`,
          width: "100%",
          height: "100%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="min-h-screen w-[512px]">
          <div
            className="flex px-[50px] py-[50px] items-center"
            style={{
              backgroundImage: `url(${sideBg.src})`,
              width: "100%",
              height: "100%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          >
            <div className="ml-6">
              <h1 className="text-6xl font-bold text-white">Musafir</h1>
              <span className="text-xl text-white font-medium">Online Wholesales</span>
            </div>
          </div>
        </div>

        <div className="min-h-screen px-[200px] flex flex-1 justify-center items-center">
          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div>
                <span className="text-3xl text-gray-900">
                  {t.formatMessage(messages.loginWelcomeMessage)}
                </span>
                <h1 className="text-xl font-bold">{t.formatMessage(messages.loginHeader)}</h1>
              </div>

              <div className="my-3">
                <label htmlFor="email" className="block text-md mb-2">
                  {t.formatMessage(messages.loginEmailFieldLabel)}
                </label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="email"
                  id="email"
                  {...registerForm("email", {
                    required: true,
                  })}
                />
              </div>
              <div className="mt-5">
                <label htmlFor="password" className="block text-md mb-2">
                  {t.formatMessage(messages.loginPasswordFieldLabel)}
                </label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="password"
                  id="password"
                  {...registerForm("password", {
                    required: true,
                  })}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700 hover:underline cursor-pointer pt-2">
                  {t.formatMessage(messages.loginRemindPasswordButtonLabel)}
                </span>
              </div>
              <div className="">
                <button
                  type="submit"
                  className="mt-4 mb-3 py-3 w-full bg-green-500 hover:bg-green-400 text-white text-3xl rounded-md transition duration-100"
                >
                  {t.formatMessage(messages.logIn)}
                </button>
                {!!errorsForm.email && (
                  <p className="text-md text-red-500 pt-2">{errorsForm.email?.message}</p>
                )}
              </div>
            </form>
            <p className="mt-8">
              <Link href={paths.account.register.$url()} passHref>
                <a href="pass" className="text-2xl">
                  {t.formatMessage(messages.createAccount)}
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
