"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { refresh } from "@/app/(auth)/action";
// import { cookies } from "next/headers";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/home";

  useEffect(() => {
    const refreshToken = async () => {
      try {
        await refresh();
        const newAccessToken = Cookies.get("access_token");
        const newRefreshToken = Cookies.get("refresh_token");
        if (newAccessToken && newRefreshToken) {
          // Redirect to the original URL or default to /albums
          router.push(redirectUrl);
        } else {
          Cookies.remove("access_token", { path: "/" });
          Cookies.remove("refresh_token", { path: "/" });
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
        router.push("/login");
      }
    };

    refreshToken();
  }, [router, redirectUrl]);

  return <div>Refreshing token...</div>;
}
