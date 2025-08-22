"use client";
import React, { useState } from "react";
import { FloatingNav } from "./ui/floating-navbar";
import { ConnectWalletButton } from "./connect-wallet-button";
import { IconHome, IconShieldCheck, IconDashboard, IconInfoCircle } from "@tabler/icons-react";

export function Header() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <IconDashboard className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Scanner",
      link: "/dashboard/scanner",
      icon: <IconShieldCheck className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconInfoCircle className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
      <div className="fixed top-4 right-4 z-[5001]">
        <ConnectWalletButton />
      </div>
    </div>
  );
}
