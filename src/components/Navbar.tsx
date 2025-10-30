'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { navLinks, mobileMenuButton } from '@/lib/constants'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/logo');
        const data = await res.json();
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
      }
    };
    fetchLogo();
  }, []);

  return (
    <nav className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link href="/" className="text-white text-xl font-bold">
                {logoUrl ? (
                  <Image src={logoUrl} alt="CodeSpark Logo" width={128} height={32} className="h-8 w-auto" />
                ) : (
                  'CodeSpark'
                )}
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-primary inline-flex items-center justify-center p-2 rounded-md text-neutral-light hover:text-text-primary-dark hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">{mobileMenuButton}</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
