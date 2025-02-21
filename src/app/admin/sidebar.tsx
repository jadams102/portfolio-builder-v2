"use client";

import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import SidebarMenuItem from "./sidebarMenuItem";
import { logOut } from "../lib/firebase/auth";

export default function AdminSidebar() {

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="sidebar-admin__sidebar w-64  fixed top-0 left-0 h-[100vh] bg-dark-gray">
      <div className="sidebar-admin__sidebar-content flex flex-col h-full px-4 py-5">
        <div className="sidebar-admin__site-info-container flex flex-row items-center gap-2 mb-4">
          <div className="sidebar-admin__site-logo">
            <Image
              src="/icons/circle-exclamation-solid-red.svg"
              alt="No icon has been selected for this site"
              width={32}
              height={32}
            />
          </div>
          <div className="sidebar-admin__site-name font-bold text-lg">
            Site Name
          </div>
        </div>

        <ul className="mb-4">
          <SidebarMenuItem
            label="Site Options"
            icon="/icons/gear-solid.svg"
            url="/admin/site-options"
          />
          <SidebarMenuItem
            label="Users"
            icon="/icons/users-solid.svg"
            url="/admin/users"
          />
        </ul>

        <ul>
          <li>Pages</li>
          <li>Posts</li>
        </ul>

        <div className="sidebar-admin__footer flex flex-row items-center mt-auto justify-between">

          <div className="sidebar-admin__user-info-container flex items-center gap-2.5 justify-center">
            <div className="sidebar-admin__user-avatar">
              <Image
                src="/icons/circle-user-solid.svg"
                alt="No icon has been selected for this user"
                width={30}
                height={30}
              />
            </div>
            <div className="sidebar-admin__user-name h-fit">User Name</div>
          </div>

          <div className="sidebar-admin__user-options-container flex">
            <ul className="flex gap-2.5">
              <SidebarMenuItem
                label=""
                alt="User Account Settings"
                icon="/icons/gear-solid.svg"
                url="/admin/settings"
              />
              <li>
                <button
                  className="opacity-50 hover:opacity-100 active:opacity-100"
                  onClick={() => {
                    logOut();
                  }}
                >
                  <Image
                    src="/icons/right-from-bracket-solid.svg"
                    alt="Logout"
                    width={16}
                    height={16}
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
