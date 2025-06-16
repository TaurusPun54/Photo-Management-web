import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUser } from "../action";
import Profile from "./profile";

export default async function ProfilePage() {
  const token = (await cookies()).get("access_token")?.value || null;
  if (token == null) {
    const originalUrl = `/profile`;
    redirect(`/refresh?redirect=${encodeURIComponent(originalUrl)}`);
  }
  try {
    const user = await getUser(token);
    return <Profile token={token || ""} user={user} />;
  } catch (error) {
    console.error("Error fetching user:", error);
    return <div>Error loading user</div>;
  }
}
