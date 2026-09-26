import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MenuIcon, XIcon, PhoneIcon } from 'lucide-react';
import { brand, navigation, callLink } from '../data/brand';
import { LUX } from './Reveal';
import { NavbarProjectSearch } from './NavbarProjectSearch';

interface NavbarProps {
  /** Home has a full-bleed hero, so the bar starts transparent there only. */
  transparentOnTop?: boolean;
  onEnquire?: () => void;
}

export function Navbar({ transparentOnTop = false, onEnquire }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = open ? 'hidden' : '';
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('mobile-menu-open', open);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.body.classList.remove('mobile-menu-open');
    };
  }, [open]);

  const solid = scrolled || !transparentOnTop || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 transition-all duration-200 ease-lux ${open ? 'z-[10000]' : 'z-50'} ${
      solid ? 'border-b border-[#d4af37]/25 bg-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,0.2)]' : 'border-b border-[#d4af37]/25 bg-[rgba(10,10,10,0.84)] backdrop-blur-md'}
      `}>
      
      <div className="mx-auto flex h-[72px] max-w-shell items-center justify-between gap-4 px-5 sm:h-[78px] lg:h-[82px] lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label={`${brand.name} — home`}>
          <span className="flex h-12 items-center justify-center px-0 sm:h-14 lg:h-16">
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="h-full w-auto max-w-[132px] object-contain sm:max-w-[158px] lg:max-w-[180px]" />
            
          </span>
          <span className="hidden xs:block">
            <span className="block font-display text-[1rem] leading-tight text-white">
              Chauhan Realtors
            </span>
            <span className="block text-[0.52rem] uppercase tracking-[0.2em] text-[#d4af37]">
              {brand.tagline}
            </span>
          </span>
        </Link>

          <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navigation.map((item) =>
            <li key={item.to}>
                <NavLink
                to={item.to}
                className={({ isActive }) =>
                `group relative block py-2 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-150 ease-lux ${
                isActive ? 'text-[#d4af37]' : 'text-white/75 hover:text-white'}`

                }>
                
                  {({ isActive }) =>
                <>
                      {item.label}
                      <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px bg-[#d4af37] transition-[width] duration-200 ease-lux ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'}`
                    } />
                  
                    </>
                }
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={callLink(brand.founder.phone)}
            aria-label="Call Chauhan Realtors"
            onClick={(event) => {
              event.preventDefault();
              onEnquire?.();
            }}
            className="call-button-pulse relative hidden h-11 items-center gap-2 overflow-hidden rounded-full border border-[#d4af37] bg-[#d4af37] px-5 text-[0.7rem] font-semibold tracking-[0.04em] text-[#111111] shadow-[0_3px_12px_rgba(212,175,55,0.18)] transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-lux hover:border-[#e5c45a] hover:bg-[#e5c45a] hover:text-[#111111] hover:shadow-[0_6px_18px_rgba(212,175,55,0.25)] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] active:bg-[#b89425] active:shadow-[0_3px_12px_rgba(212,175,55,0.2)] active:translate-y-0 md:flex">
            <PhoneIcon className="h-4 w-4" aria-hidden="true" />
            <span className="relative z-[1]">Call Now</span>
          </a>
          <NavbarProjectSearch onNavigate={() => setOpen(false)} />
          <button
            type="button"
            onClick={onEnquire}
            aria-label="Open enquiry form"
            className="hidden h-10 items-center border border-[#d4af37] bg-[#d4af37] px-5 text-[0.68rem] uppercase tracking-[0.2em] text-[#111111] transition-colors duration-150 ease-lux hover:bg-[#e5c45a] md:flex">

            Schedule a Visit
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#d4af37]/40 bg-[#050505]/30 text-white transition-colors duration-150 ease-lux hover:border-[#d4af37] hover:text-[#d4af37] md:hidden">
            
            {open ? <XIcon className="h-4 w-4" aria-hidden="true" /> : <MenuIcon className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ?
        <motion.div
          id="mobile-menu"
          initial={reduce ? undefined : { opacity: 0, y: -8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: LUX }}
          className="mobile-menu-overlay pointer-events-none fixed inset-0 z-[99999] h-[100dvh] min-h-[100dvh] max-w-[100vw] overflow-hidden border-t border-[#d4af37]/15 bg-[#080808] md:hidden">
          
          <div className="pointer-events-auto absolute inset-x-0 top-0 z-[100000] flex h-[72px] items-center justify-between border-b border-[#d4af37]/15 bg-[#080808] px-5">
            <Link to="/" onClick={() => setOpen(false)} className="flex min-w-0 shrink items-center" aria-label={`${brand.name} — home`}>
              <img src={brand.logo} alt={`${brand.name} logo`} className="h-12 w-auto max-w-[132px] object-contain" />
            </Link>
            <div className="flex shrink-0 items-center gap-3">
              <NavbarProjectSearch onNavigate={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-12 w-12 items-center justify-center border border-[#d4af37]/55 bg-[#080808] text-white transition-colors duration-150 hover:bg-[#d4af37] hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          
            <nav aria-label="Mobile" className="mobile-menu-content pointer-events-auto mt-[72px] flex h-[calc(100%-72px)] flex-col overflow-hidden px-5 pb-8 pt-4">
              <ul className="mobile-menu-list flex min-h-0 flex-none flex-col divide-y divide-[#d4af37]/15">
                {navigation.map((item) =>
              <li key={item.to}>
                    <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                  `block py-4 font-display text-xl ${isActive ? 'text-[#d4af37]' : 'text-white'}`
                  }>
                  
                      {item.label}
                    </NavLink>
                  </li>
              )}
              </ul>
              <div className="mobile-menu-actions mt-4 grid shrink-0 gap-3">
                <button
                type="button"
                onClick={onEnquire}
                className="flex h-12 items-center justify-center bg-[#d4af37] text-[0.7rem] uppercase tracking-[0.2em] text-[#111111]">
                
                  Schedule a Visit
                </button>
                <a
                href={callLink(brand.founder.phone)}
                className="flex h-12 items-center justify-center gap-2 border border-[#d4af37]/40 text-[0.7rem] uppercase tracking-[0.2em] text-white">
                
                  <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                  {brand.founder.phoneDisplay}
                </a>
              </div>
            </nav>
          </motion.div> :
        null}
      </AnimatePresence>
    </header>);

}