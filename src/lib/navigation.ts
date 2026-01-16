import type { NavItem } from './types';

/**
 * Shared navigation items used by both desktop and mobile menus
 * Single source of truth to prevent drift between components
 */
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Our Cats', href: '/cats' },
  { label: 'Available Kittens', href: '/kittens' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Check if a path is active (exact match or starts with href for nested routes)
 */
export function isActivePath(currentPath: string, href: string): boolean {
  return currentPath === href || (href !== '/' && currentPath.startsWith(href));
}
