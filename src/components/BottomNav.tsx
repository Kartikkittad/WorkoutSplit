'use client';

import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    path: '/app',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
      </svg>
    ),
  },
  {
    label: 'Log',
    path: '/app/log',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H7zm7 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-3z" />
      </svg>
    ),
  },
  {
    label: 'History',
    path: '/app/history',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 11H7v-1.5h4V7h1.5v6z" />
      </svg>
    ),
  },
  {
    label: 'Progress',
    path: '/app/progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/app') return pathname === '/app';
    return pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            className={`nav-item${active ? ' active' : ''}`}
            onClick={() => router.push(item.path)}
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
            {active && <div className="nav-dot" />}
          </button>
        );
      })}
    </nav>
  );
}
