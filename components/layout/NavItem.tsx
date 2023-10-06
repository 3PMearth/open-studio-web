'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { HiChevronRight } from 'react-icons/hi';

type NavItemProps = {
  href: string;
  icon: IconType;
  children: string;
};

export default function NavItem({ href, icon: Icon, children }: NavItemProps) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^(\/(en|ko))\b/, '/');
  const isSelected = pathWithoutLocale.endsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={`flex h-10 items-center rounded-[0.25rem] p-2 hover:bg-primary-light hover:text-primary aria-selected:pointer-events-none aria-selected:bg-primary-light aria-selected:text-primary`}
        aria-selected={isSelected}
      >
        <Icon className="mr-4" size="1.5rem" />
        <span className="flex-1">{children}</span>
        <HiChevronRight size="1.25rem" />
      </Link>
    </li>
  );
}
