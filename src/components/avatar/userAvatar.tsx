"use client";
import { useRouter } from "next/navigation";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";

import { logout } from "@/app/(auth)/action";

import { userInterface } from "@/lib/types/userInterface";

interface UserAvatarProps {
  user: userInterface | null;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const router = useRouter();

  // const getInitials = (name: string | null | undefined) => {
  //   if (!name) return "UU";
  //   return name
  //     .split(" ")
  //     .map((part) => part[0])
  //     .join("")
  //     .toUpperCase()
  //     .substring(0, 2);
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 focus:outline-none">
          <User className="h-5 w-5 text-primary" />
        </button>
        {/* <Avatar className="h-10 w-10 cursor-pointer border-2 border-primary/10">
          <AvatarImage src={user?.avatar || ""} alt={user?.full_name || "Unknown User"} />
          <AvatarFallback>{getInitials(user?.full_name)}</AvatarFallback>
        </Avatar> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">
              {user?.first_name.concat(" ", user?.last_name) || "Unknown User"}
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.email || "No Email"}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
