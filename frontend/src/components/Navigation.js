'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/curriculum', label: 'Courses', icon: '🎨' },
    { href: '/diagnostic', label: 'Diagnostic', icon: '🎯' },
    { href: '/forum', label: 'Forum', icon: '💬' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b-4 border-art-purple-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-rainbow flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform shadow-glow-rainbow">
              🎨
            </div>
            <span className="text-xl font-bold text-rainbow hidden sm:inline">
              Art Roadmap
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-art-purple-100 text-art-purple-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}

            <div className="ml-4 pl-4 border-l-2 border-gray-300">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">@{user.username}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-art-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-gradient-rainbow text-white rounded-lg font-medium hover:shadow-glow-rainbow transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
