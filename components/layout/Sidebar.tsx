import Image from "next/image";
import Link from "next/link";
import { RiLayout3Fill } from "react-icons/ri";

import NavItem from "./NavItem";

export default function Sidebar() {
  return (
    <div
      id="sidebar"
      className="flex h-full w-64 flex-col border-r border-[#d9d9d9] bg-white text-gray-semilight"
    >
      <header>
        <Link href="/" className="m-10 flex items-center justify-center">
          <Image alt="logo" src="/images/logo.svg" width={89.41} height={36} />
        </Link>
      </header>
      <nav className="mx-4 mt-2 flex-1">
        <ul className="space-y-4 text-lg text-gray-semilight">
          <NavItem href="/" icon={RiLayout3Fill}>
            Home
          </NavItem>
        </ul>
      </nav>
    </div>
  );
}
