"use client";

import React, { useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
} from "@tabler/icons-react";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  DashboardSidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/dashboard-sidebar/dashboard-sidebar";
import { Pickaxe } from "lucide-react";
import { useRouter } from "next/navigation";

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  price?: number;
}

export interface Form {
  id: number;
  title: string;
  description: string;
  fields: FormField[];
  urlId: string;
  createdAt: string;
}

const Dashboardlinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Submissions",
    href: "/submissions",
    icon: (
      <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },

  {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <DashboardSidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div
              className="gap-2 cursor-pointer w-full flex flex-row items-evenly group/title"
              onClick={() => router.push("/")}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Pickaxe className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none group-hover/title:translate-x-1 transition duration-150 whitespace-pre">
                <span className="text-2xl font-bold text-blue-600 ">
                  FormCraft
                </span>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {Dashboardlinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="/climber.jpeg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </DashboardSidebar>
      {children}
    </div>
  );
};

export default DashboardLayout;
