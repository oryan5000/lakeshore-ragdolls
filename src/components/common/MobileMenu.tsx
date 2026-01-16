import { useState, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Our Cats', href: '/cats' },
  { label: 'Available Kittens', href: '/kittens' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    return currentPath === href || (href !== '/' && currentPath.startsWith(href));
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-brand-text hover:text-brand-primary transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <nav
            className="fixed top-0 right-0 h-full w-64 bg-brand-white shadow-xl z-50 transform transition-transform"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="p-4 border-b border-brand-border flex justify-between items-center">
              <span className="font-semibold text-brand-text">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-brand-text hover:text-brand-primary transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul className="py-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`block px-6 py-3 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-brand-primary bg-brand-bg-alt'
                        : 'text-brand-text hover:text-brand-primary hover:bg-brand-bg'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="px-4 py-4 border-t border-brand-border">
              <a
                href="/waitlist"
                className="block w-full py-3 px-4 bg-brand-primary text-brand-text text-center font-medium rounded-lg hover:bg-brand-primary-hover transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Join Waitlist
              </a>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
