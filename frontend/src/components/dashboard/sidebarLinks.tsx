"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconBrandTabler, IconLink } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import UserProfileImage from "./userProfileImage";

interface SidebarLinksProps {
  children: React.ReactNode;
}
export function SidebarLinks({ children }: SidebarLinksProps) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-indigo-600 dark:text-indigo-400 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "URLs",
      href: "/dashboard/urls",
      icon: (
        <IconLink className="text-indigo-600 dark:text-indigo-400 h-7 w-7 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col border-r md:flex-row bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 w-full flex-1 mx-auto border border-indigo-200 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) =>
                link.label === "Logout" ? (
                  <div key={idx} onClick={() => () => {}}>
                    <SidebarLink key={idx} link={link} />
                  </div>
                ) : (
                  <SidebarLink key={idx} link={link} />
                )
              )}
            </div>
          </div>
          <UserProfileImage />
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="p-0 overflow-auto scrollbar-hidden md:p-0 rounded-bl-2xl border border-indigo-200  bg-white/80 backdrop-blur-sm  flex flex-col gap-2 flex-1 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-indigo-600 py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-indigo-600 dark:text-indigo-400 whitespace-pre"
      >
        Shortify
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-indigo-600 py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
