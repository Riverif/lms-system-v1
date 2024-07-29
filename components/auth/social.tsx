import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="secondary"
        onClick={() => onClick("google")}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <FcGoogle className="h-5 w-5" />
        </div>
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="secondary"
        onClick={() => onClick("github")}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <FaGithub className="h-5 w-5" />
        </div>
      </Button>
    </div>
  );
};
