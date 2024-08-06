"use client";

import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "./auth/user-button";
import { Button } from "./ui/button";
import { LogoutButton } from "./auth/logout-button";
import Link from "next/link";
import { IoMdExit } from "react-icons/io";
import { LogOut } from "lucide-react";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex gap-x-2">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button variant="ghost">
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        )}
        <UserButton />
      </div>
    </>
  );
};
