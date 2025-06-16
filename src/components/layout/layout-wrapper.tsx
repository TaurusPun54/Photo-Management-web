"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Header } from "@/components/header/header";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  //   const isAuthPage = pathname?.startsWith("/auth")
  const isAuthPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/refresh");
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return children;
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
