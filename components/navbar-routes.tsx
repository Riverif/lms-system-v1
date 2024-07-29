"use client";

import { UserButton } from "./auth/user-button";

export const NavbarRoutes = () => {
  return (
    <div className="ml-auto flex gap-x-2">
      <UserButton />
    </div>
  );
};
