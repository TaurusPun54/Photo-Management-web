"use client"

import Link from "next/link"
import { UserAvatar } from "../avatar/userAvatar"
import { userInterface } from "@/lib/types/userInterface"

interface HeaderProps {
  user: userInterface | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">{process.env.NEXT_PUBLIC_APP_NAME}</span>
        </Link>
        <div className="flex items-center gap-4">
          <UserAvatar user={user} />
        </div>
      </div>
    </header>
  )
}

