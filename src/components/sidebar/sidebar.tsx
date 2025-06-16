"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Home, Heart, FolderOpen, Archive, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StorageUsage } from "@/components/sidebar/storageUsage";
import { userInterface } from "@/lib/types/userInterface";
import { getUser } from "@/app/(root)/action";

interface SidebarProps {
  user: userInterface;
  token: string;
}

export function Sidebar({ user, token }: SidebarProps) {
  const pathname = usePathname();

  const { data: currentUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(token),
    initialData: user,
    staleTime: 5 * 60 * 1000,
  });

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Liked", href: "/liked", icon: Heart },
    { name: "Albums", href: "/albums", icon: FolderOpen },
    { name: "Archive", href: "/archive", icon: Archive },
  ];

  return (
    <div className="h-screen w-64 bg-background border-r flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold">Photo App</h2>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 mr-2",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <StorageUsage user={currentUser} token={token} />
    </div>
  );
}
