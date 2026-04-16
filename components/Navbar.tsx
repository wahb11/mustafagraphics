'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const services = [
  { label: 'Logo Design', slug: 'logo-design' },
  { label: 'Social Media', slug: 'social-media' },
  { label: 'Banner Design', slug: 'banner-design' },
  { label: 'YouTube Thumbnail', slug: 'youtube-thumbnail' },
  { label: 'Graphic Design', slug: 'graphic-design' },
  { label: 'Branding Package', slug: 'branding-package' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-[60px] py-[22px] md:py-[26px] transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(8,8,16,0.95)'
            : 'linear-gradient(to bottom, rgba(8,8,16,0.95) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(8px)' : 'blur(4px)',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        }}
      >
        <Link href="/" className="text-[17px] sm:text-[20px] font-semibold tracking-[-0.3px] text-white no-underline">
          Mustafa <span style={{ color: 'var(--purple-light)' }}>Graphics</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-9 list-none items-center">
          {[
            { href: '/', label: 'Home' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-[13px] tracking-[0.8px] uppercase font-medium no-underline transition-colors duration-200 relative ${
                  isActive(href) ? 'nav-active' : 'text-[var(--muted)] hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Services dropdown */}
          <li className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <Link
              href="/services"
              className={`text-[13px] tracking-[0.8px] uppercase font-medium no-underline transition-colors duration-200 relative flex items-center gap-1 ${
                isActive('/services') ? 'nav-active text-white' : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Services
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-60 mt-0.5">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-3 w-52 rounded-[12px] overflow-hidden shadow-xl"
                  style={{ background: 'var(--deep)', border: '1px solid var(--border)' }}
                >
                  {services.map(svc => (
                    <Link
                      key={svc.slug}
                      href={`/services/${svc.slug}`}
                      className="block px-4 py-3 text-[12px] tracking-[0.5px] uppercase font-medium transition-all duration-150 hover:text-white"
                      style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}
                    >
                      {svc.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {[
            { href: '/work', label: 'Portfolio' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-[13px] tracking-[0.8px] uppercase font-medium no-underline transition-colors duration-200 relative ${
                  isActive(href) ? 'nav-active text-white' : 'text-[var(--muted)] hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-[280px] z-[300] flex flex-col pt-20 pb-8 px-8"
            style={{ background: 'var(--deep)', borderLeft: '1px solid var(--border)' }}
          >
            <div className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/work', label: 'Portfolio' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={href}
                    className={`block py-3 text-[13px] tracking-[1px] uppercase font-medium no-underline transition-colors ${
                      isActive(href) ? 'text-[var(--purple-light)]' : 'text-[var(--muted)] hover:text-white'
                    }`}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile services sub-links */}
              <div className="mt-2 pl-3 flex flex-col gap-1">
                {services.map((svc, i) => (
                  <motion.div
                    key={svc.slug}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 4) * 0.06 }}
                  >
                    <Link
                      href={`/services/${svc.slug}`}
                      className="block py-2 text-[11px] tracking-[0.8px] uppercase font-medium text-[var(--muted)] hover:text-[var(--purple-light)] no-underline transition-colors"
                    >
                      — {svc.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] md:hidden"
            style={{ background: 'rgba(8,8,16,0.7)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
