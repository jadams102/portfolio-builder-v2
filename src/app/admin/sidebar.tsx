'use client';

import Link from 'next/link';
import Image from 'next/image';
import SidebarMenuItem from './sidebarMenuItem';
import { logOut } from '@/app/lib/firebase/auth';
import { useAuth } from '@/app/hooks/useAuth';

type AdminSidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export default function AdminSidebar({ isOpen, toggleSidebar }: AdminSidebarProps) {
  const { isAuthenticated, userRole, user } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`sidebar-admin__sidebar w-64 fixed top-0 left-0 h-[100vh] bg-dark-gray transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-64'
      }`}
    >
      <div className="sidebar-admin__sidebar-content flex flex-col h-full w-full px-4 py-12">
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
        {userRole === 'admin' && (
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
        )}

        <ul>
          <li>Pages</li>
          <li>Posts</li>
        </ul>

        <div className="sidebar-admin__footer flex flex-row items-center mt-auto justify-between">
          <div className="sidebar-admin__user-info-container flex items-center gap-2.5 justify-center">
            <div className="sidebar-admin__user-avatar">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="User Avatar"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              ) : (
                <Image
                  src="/icons/circle-user-solid.svg"
                  alt="No avatar selected"
                  width={30}
                  height={30}
                />
              )}
            </div>
            <div className="sidebar-admin__user-name h-fit">
              {user?.fullName || 'User Name'}
            </div>
          </div>

          <div className="sidebar-admin__user-options-container flex">
            <ul className="flex gap-2.5">
              <SidebarMenuItem
                label=""
                alt="User Account Settings"
                icon="/icons/gear-solid.svg"
                url="/admin/settings"
              />
              <li className="flex items-center">
                <button
                  className="cursor-pointer opacity-50 hover:opacity-100 active:opacity-100"
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