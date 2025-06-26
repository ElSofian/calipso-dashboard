"use client";

import Header from "@/components/global/header";
import Sidebar from "@/components/global/sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { User } from "@/types";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ResponsiveLayoutProps {
  user: User;
  ingame?: boolean;
  children: ReactNode;
}

export default function ResponsiveLayout({
  user,
  ingame = false,
  children,
}: ResponsiveLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(isDesktop);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);

  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop]);

  const handleToggleSidebar = () => {
    setIsTransitioning(true);
    setIsOpen((o) => !o);
  };

  if (ingame) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#18181B] overflow-hidden">
        <div
          className={`
						flex-1 flex flex-col bg-white dark:bg-black
						m-3 rounded-2xl border border-[var(--border)] dark:border-none shadow-xs
						overflow-y-auto transition-all duration-300 ease-in-out
						[&::-webkit-scrollbar]:w-2
						[&::-webkit-scrollbar-track]:bg-transparent
						[&::-webkit-scrollbar-thumb]:bg-gray-200
						[&::-webkit-scrollbar-thumb]:rounded-full
						dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
					`}
        >
          <Header onToggleSidebar={handleToggleSidebar} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#18181B] overflow-hidden">
      {isDesktop && (
        <aside
          className={`
            flex-none h-full overflow-y-auto
            ${isTransitioning ? "transition-all duration-300 ease-in-out" : ""}
            ${isOpen ? "w-72" : "w-0"}
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
          `}
        >
          {isOpen && <Sidebar user={user} />}
        </aside>
      )}

      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out"
          onClick={() => handleToggleSidebar()}
        >
          <div
            className={`
              absolute left-0 top-0 h-full w-64 bg-gray-50 dark:bg-neutral-800 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar user={user} />
          </div>
        </div>
      )}

      <div
        className={`
          flex-1 flex flex-col bg-white dark:bg-black
          m-3 rounded-2xl border border-[var(--border)] dark:border-none shadow-xs
          overflow-y-auto transition-all duration-300 ease-in-out
        `}
      >
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 
						[&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700">{children}</main>
      </div>
    </div>
  );
}
