"use client";

import { Pickaxe } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <header className="flex flex-col items-center justify-center space-y-2 text-center gap-y-2 my-2">
      <div
        className="gap-2 cursor-pointer w-full flex flex-row items-evenly group/title justify-center"
        onClick={() => router.push("/")}
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Pickaxe className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none group-hover/title:translate-x-1 transition duration-150 whitespace-pre">
          <span className="text-2xl font-bold text-blue-600 ">FormCraft</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground italic">
        Simplify form creation.
      </p>
    </header>
  );
}
