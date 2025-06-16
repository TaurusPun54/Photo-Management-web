import type React from "react";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Header } from "@/components/header/header";
import { getUser } from "@/app/(root)/action";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  let token = "";
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("access_token")?.value || "";
    user = await getUser(token);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
  return (
    <div className="flex h-screen">
      <Sidebar user={user} token={token} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}