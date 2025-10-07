'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

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
            <div className="flex-shrink-0">
              <Link href="/" className="text-white text-xl font-bold">
                {logoUrl ? (
                  <img src={logoUrl} alt="CodeSpark Logo" className="h-8 w-auto" />
                ) : (
                  'CodeSpark'
                )}
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/about" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link href="/services" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  Services
                </Link>
                <Link href="/courses" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  Courses
                </Link>
                <Link href="/projects" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  Projects
                </Link>
                <Link href="/testimonials" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  Testimonials
                </Link>
                <Link href="/contact" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
                <Link href="/apply" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  Apply
                </Link>
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
              <span className="sr-only">Open main menu</span>
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
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/about" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Link href="/services" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium">
              Services
            </Link>
            <Link href="/courses" className="text-neutral-light hover:bg-secondary hover.text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium">
              Courses
            </Link>
            <Link href="/projects" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium">
              Projects
            </Link>
            <Link href="/testimonials" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium">
              Testimonials
            </Link>
            <Link href="/contact" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </Link>
            <Link href="/apply" className="text-neutral-light hover:bg-secondary hover:text-text-primary-dark block px-3 py-2 rounded-md text-base font-medium">
              Apply
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
