"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Social } from "./social";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./signup-form";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const AuthCard = () => {
  const [signUp, setSignUp] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const updateAuthInfo = (
    errorMessage: string | undefined,
    successMessage: string | undefined,
  ) => {
    setError(errorMessage);
    setSuccess(successMessage);
  };

  return (
    <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] drop-shadow-2xl">
      <FormError message={error} />
      <FormSuccess message={success} />
      <div className="group relative grid h-[500px] w-[800px] grid-cols-2 gap-x-24 overflow-hidden rounded-xl border border-slate-300 bg-[#37B7C3]">
        <div
          className={cn(
            "absolute flex h-[100%] w-[450px] flex-col items-center justify-center gap-y-6 rounded-lg bg-background p-[75px] transition-all duration-1000",
            signUp ? "left-0" : "left-[350px]",
          )}
        >
          <LoginForm
            className={cn(signUp ? "hidden" : "block")}
            updateAuthInfo={updateAuthInfo}
          />
          <SignUpForm
            className={cn(signUp ? "block" : "hidden")}
            updateAuthInfo={updateAuthInfo}
          />
          <Social />
        </div>
        <div className="flex flex-col justify-center gap-y-5 p-6 pr-2 text-white">
          <h2 className="text-4xl font-bold">
            {`Log in`}
            <br />
            {`to website`}
          </h2>
          <p>
            Rifki Alfian Nahar nextAuth project with authorization, session
            management, and middleware
          </p>
          <Button
            className="w-fit"
            variant="outline"
            onClick={() => setSignUp(true)}
          >
            Sign Up
          </Button>
        </div>
        <div className="flex flex-col items-end justify-center gap-y-5 p-6 pl-2 text-right text-white">
          <h2 className="text-4xl font-bold">
            {`Create a new`}
            <br />
            {`account`}
          </h2>
          <p>
            Rifki Alfian Nahar nextAuth project with authorization, session
            management, and middleware
          </p>
          <Button
            className="w-fit"
            variant="outline"
            onClick={() => setSignUp(false)}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};
