"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";

import AuthProvider from "components/auth/AuthProvider";
import Sidebar from "components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarShowing, setIsSidebarShowing] = useState(false);

  return (
    <AuthProvider>
      <div className="relative flex min-h-screen">
        <Dialog
          as="div"
          className="fixed inset-y-0 z-40 lg:hidden"
          open={isSidebarShowing}
          onClose={() => setIsSidebarShowing(false)}
        >
          <Transition
            as="div"
            className="absolute inset-y-0"
            show={isSidebarShowing}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Sidebar />
          </Transition>
        </Dialog>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col">
          <header className="flex h-12 items-center border-b border-[#d9d9d9] bg-white px-6 lg:px-10">
            <button
              id="menu"
              className="mr-4 lg:hidden"
              onClick={() => setIsSidebarShowing(prev => !prev)}
            >
              <AiOutlineMenu color="black" />
            </button>
            <div className="flex-1 text-[#667085]">Breadcrumb</div>
          </header>
          <main className="flex-1 bg-gray-background p-6 text-black lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
