// import { ExclamationTriangleIcon } from "@radix-ui/";

import { BiCheckCircle } from "react-icons/bi";
import { BsExclamationTriangle } from "react-icons/bs";

interface FormErrorProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="fixed left-[50%] top-[100%] translate-x-[-50%]">
      <div className="m-5 flex w-fit items-center gap-x-2 rounded-xl bg-[#BFFFC6] px-20 py-3 text-sm font-semibold text-[#00C844]">
        <BiCheckCircle className="h-4 w-4" />
        <p>{message}</p>
      </div>
    </div>
  );
};
