"use client";

import Image from "next/image";
import Link from "next/link";

import AuthProvider from "components/auth/AuthProvider";

export default function ShopLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen">
        <div className="flex flex-1 flex-col">
          <header className="flex h-12 items-center border-b border-[#d9d9d9] bg-white px-6 lg:px-10">
            <Link href="/" className="flex items-center justify-center">
              <Image
                alt="logo"
                src="/images/logo.svg"
                width={89.41}
                height={36}
              />
            </Link>
          </header>
          <main className="flex-1 bg-gray-background text-black lg:p-10">
            <div className="mx-auto min-h-full overflow-hidden bg-white shadow-md lg:min-h-0 lg:max-w-2xl lg:rounded-lg">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
