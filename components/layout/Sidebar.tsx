'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiLogOut } from 'react-icons/fi';
import { HiUser } from 'react-icons/hi2';
import { RiLayout3Fill, RiShoppingBag3Fill, RiSettings3Fill } from 'react-icons/ri';

import { useAuth } from 'components/auth/AuthProvider';

import NavItem from './NavItem';

export default function Sidebar() {
  const { logout } = useAuth();
  const t = useTranslations('sidebar');

  const handleLogout = () => {
    if (window.confirm(t('logoutConfirm'))) {
      logout();
    }
  };

  return (
    <div
      id="sidebar"
      className="flex h-full w-64 flex-col border-r border-[#d9d9d9] bg-white text-lg text-gray-semilight"
    >
      <header>
        <Link href="/" className="m-10 flex items-center justify-center">
          <Image alt="logo" src="/images/logo.svg" width={89.41} height={36} />
        </Link>
      </header>
      <nav className="mx-4 mt-2 flex-1">
        <ul className="space-y-4">
          <NavItem href="/" icon={RiLayout3Fill}>
            Home
          </NavItem>
          <NavItem href="/sales" icon={RiShoppingBag3Fill}>
            Sales
          </NavItem>
          <NavItem href="/settings" icon={RiSettings3Fill}>
            Settings
          </NavItem>
        </ul>
      </nav>
      <div className="m-6 space-y-2">
        <Link href="/my" className="flex items-center p-2 hover:text-primary">
          <HiUser size="1.5rem" className="mr-4" />
          My Page
        </Link>
        <button onClick={handleLogout} className="flex items-center p-2 hover:text-primary">
          <FiLogOut size="1.5rem" className="mr-4" />
          Logout
        </button>
      </div>
    </div>
  );
}