import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, PhoneIcon } from 'lucide-react';
import { brand, callLink } from '../data/brand';
import { heroContent } from '../data/site';
import { HERO_IMAGE } from '../data/projects';
import { getHeroSlides, type HeroSlide } from '../services/api';
import { LUX } from './Reveal';

const CTA_HEIGHT = { height: '3.25rem' };
const defaultHeroSlides = [
  { image: HERO_IMAGE, altText: 'Chauhan Realtors luxury real estate cityscape' },
  { image: '/developers/c-01.jpeg', altText: 'Modern residential tower with landscaped grounds' }
] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const [slides, setSlides] = useState<Array<Pick<HeroSlide, 'image' | 'altText'>>>(defaultHeroSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    let active = true;
    getHeroSlides()
      .then(({ data }) => {
        if (!active) return;
        setSlides(data.length
          ? data.map((slide) => ({ image: slide.image, altText: slide.altText || slide.title }))
          : defaultHeroSlides);
        setActiveSlide(0);
      })
      .catch(() => undefined);

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const preload = new Image();
    preload.src = slides[(activeSlide + 1) % slides.length].image;
  }, [activeSlide, slides]);

  useEffect(() => {
    if (reduce || slides.length < 2) return;
    let frameId = 0;
    let resetTimeout: number | undefined;
    const interval = window.setInterval(() => {
      setTransitioning(true);
      frameId = window.requestAnimationFrame(() => {
        frameId = window.requestAnimationFrame(() => {
          setActiveSlide((current) => (current + 1) % slides.length);
          resetTimeout = window.setTimeout(() => setTransitioning(false), 900);
        });
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
      window.cancelAnimationFrame(frameId);
      if (resetTimeout !== undefined) window.clearTimeout(resetTimeout);
    };
  }, [reduce, slides.length]);

  return (
    <section className="relative isolate flex min-h-[clamp(560px,100svh,680px)] w-full flex-col justify-end overflow-hidden bg-[#050505] pb-[calc(1.5rem+var(--mobile-action-bar-height))] pt-20 sm:min-h-[clamp(600px,78svh,680px)] sm:pb-14 sm:pt-28">
      <motion.div
        className="absolute inset-0 -z-20 overflow-hidden"
        initial={reduce ? undefined : { scale: 1.04 }}
        animate={reduce ? undefined : { scale: 1.12 }}
        transition={{ duration: 26, ease: 'linear' }}>
        {slides.map((slide, index) => {
          const x = index === activeSlide ? 0 : transitioning ? -100 : 100;
          const slideStyle = {
            transform: `translateX(${x}%)`,
            transition: transitioning ? 'transform 900ms ease-in-out' : 'none'
          };
          return (
            <React.Fragment key={slide.image}>
              <img
                src={slide.image}
                alt={slide.altText}
                aria-hidden={index !== activeSlide}
                onError={() => {
                  if (slides !== defaultHeroSlides) {
                    setSlides(defaultHeroSlides);
                    setActiveSlide(0);
                    setTransitioning(false);
                  }
                }}
                style={slideStyle}
                className="absolute inset-0 h-full w-full object-cover object-center" />
              {index === 1 ? <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/20" style={slideStyle} /> : null}
            </React.Fragment>
          );
        })}
      </motion.div>
      <div aria-hidden="true" className="image-overlay image-overlay-left" />
      <div className="relative z-10 mx-auto box-border min-w-0 w-full max-w-full max-w-shell px-5 lg:px-10">

        <motion.p
          className="eyebrow text-[#d4af37]"
          initial={reduce ? undefined : { opacity: 0, y: 14 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: LUX }}>
          
          {heroContent.eyebrow}
        </motion.p>

        <motion.span
          aria-hidden="true"
          className="mt-5 block h-px bg-[#d4af37]"
          initial={reduce ? undefined : { width: 0 }}
          animate={reduce ? undefined : { width: '5rem' }}
          transition={{ duration: 0.3, delay: 0.1, ease: LUX }} />
        

        <h1 className="mt-7 box-border w-full max-w-full min-w-0 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[0.98] tracking-[-0.04em] text-[#ffffff]">
          {heroContent.headingLines.map((line, index) =>
          <span key={line} className="block max-w-full">
              <motion.span
              className="block max-w-full break-words"
              initial={reduce ? undefined : { y: '110%' }}
              animate={reduce ? undefined : { y: '0%' }}
              transition={{ duration: 0.3, delay: 0.14 + index * 0.07, ease: LUX }}>
              
                {index === heroContent.headingLines.length - 1 ?
              <span className="text-[#d4af37]">{line}</span> :

              line
              }
              </motion.span>
            </span>
          )}
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-[0.95rem] leading-relaxed text-white/75 sm:text-base"
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.36, ease: LUX }}>
          
          {heroContent.supporting}
        </motion.p>

        <motion.div
          className="mt-9 flex min-w-0 max-w-full flex-col gap-3 sm:flex-row sm:items-center"
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.44, ease: LUX }}>
          
          <Link
            to="/projects"
            className="group flex min-w-0 max-w-full items-center justify-center gap-2 bg-[#d4af37] px-7 text-[0.7rem] uppercase tracking-[0.2em] text-[#111111] transition-colors duration-150 ease-lux hover:bg-[#e5c45a] sm:w-auto"
            style={CTA_HEIGHT}>
            
            Explore Projects
            <ArrowRightIcon
              className="h-4 w-4 transition-transform duration-150 ease-lux group-hover:translate-x-1"
              aria-hidden="true" />
            
          </Link>
          <a
            href={callLink(brand.founder.phone)}
            className="flex min-w-0 max-w-full items-center justify-center gap-2 border border-white/25 bg-[#050505]/30 px-7 text-[0.7rem] uppercase tracking-[0.2em] text-white transition-colors duration-150 ease-lux hover:border-[#d4af37] hover:text-[#d4af37] sm:w-auto"
            style={CTA_HEIGHT}>
            
            <PhoneIcon className="h-4 w-4" aria-hidden="true" />
            Talk to an Expert
          </a>
        </motion.div>
      </div>
    </section>);

}