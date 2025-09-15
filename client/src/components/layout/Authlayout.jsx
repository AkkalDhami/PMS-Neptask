import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Outlet } from "react-router-dom";
import AppLogo from "../home/AppLogo";

const Authlayout = () => {
  return (
    <>
      <header className="flex fixed top-0 z-50 bg-background w-full h-16 items-center justify-between gap-2 border-b px-4">
        <AppLogo />
        <ThemeToggle />
      </header>
      <main className="flex items-center min-h-screen w-full justify-center flex-1 flex-col gap-4 p-4 mt-6">
        <Outlet />
      </main>
    </>
  );
};

export default Authlayout;
