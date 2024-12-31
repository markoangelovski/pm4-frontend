"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TopBar = () => {
  const router = useRouter();
  const userData = JSON.parse(sessionStorage.getItem("access") || "{}");

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <Image
          src={process.env.LOGO_PATH || "/logo-min.png"}
          alt="Logo"
          className="h-10 w-10 mr-2"
          height={40}
          width={40}
        />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>{userData.username}</DropdownMenuItem>
          <Link href="/profile" className="">
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href="/settings" className="">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => {
              sessionStorage.removeItem("access");
              router.push("/login");
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default TopBar;
