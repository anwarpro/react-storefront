import { useAuth } from "@saleor/sdk";
import sideBg from "assets/login-side-shape.png";
import bg from "assets/loginbg.png";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "@/components/translations";
import { usePaths } from "@/lib/paths";

export interface RegisterFormData {
  email: string;
  password: string;
}

function RegisterPage() {
  const router = useRouter();
  const paths = usePaths();
  const t = useIntl();

  const { register } = useAuth();
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<RegisterFormData>({});

  const handleRegister = handleSubmitForm(async (formData: RegisterFormData) => {
    const { data } = await register({
      email: formData.email,
      password: formData.password,
      redirectUrl: `${window.location.origin}/account/confirm`,
    });

    if (data?.accountRegister?.errors.length) {
      // Unable to sign in.
      data?.accountRegister?.errors.forEach((e) => {
        if (e.field === "email") {
          setErrorForm("email", { message: e.message! });
        } else if (e.field === "password") {
          setErrorForm("password", { message: e.message! });
        } else {
          console.error("Registration error:", e);
        }
      });
      return;
    }
    // User signed in successfully.
    router.push(paths.$url());
  });

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
            <form onSubmit={handleRegister}>
              <div>
                <h1 className="text-xl font-bold">{t.formatMessage(messages.registerHeader)}</h1>
              </div>

              <div className="my-3">
                <label htmlFor="email" className="block text-md mb-2">
                  {t.formatMessage(messages.registerEmailFieldLabel)}
                </label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="email"
                  id="email"
                  {...registerForm("email", {
                    required: true,
                  })}
                />
                {!!errorsForm.email && (
                  <p className="text-sm text-red-500 pt-2">{errorsForm.email?.message}</p>
                )}
              </div>
              <div className="mt-5">
                <label htmlFor="password" className="block text-md mb-2">
                  {t.formatMessage(messages.registerPasswordFieldLabel)}
                </label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="password"
                  id="password"
                  {...registerForm("password", {
                    required: true,
                  })}
                />
                {!!errorsForm.password && (
                  <p className="text-sm text-red-500 pt-2">{errorsForm.password?.message}</p>
                )}
              </div>

              <div className="">
                <button
                  type="submit"
                  className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white text-3xl py-2 rounded-md transition duration-100"
                >
                  {t.formatMessage(messages.registerButton)}
                </button>
              </div>
            </form>
            <p className="mt-8">
              <Link href={paths.account.login.$url()} passHref>
                <a href="pass" className="text-2xl">
                  {t.formatMessage(messages.backToLogin)}
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
