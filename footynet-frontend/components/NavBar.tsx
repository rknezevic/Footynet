'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
}

interface NavBarProps {
  links: NavLink[];
  onLogout: () => void;
}

export default function NavBar({ links, onLogout }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight text-neutral-900">FootyNet</h1>
        <div className="flex gap-8 items-center">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-neutral-900 border-b-2 border-neutral-900 pb-0.5'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={onLogout}
            className="text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
