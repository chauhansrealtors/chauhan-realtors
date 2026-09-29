import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

const developers = [
  { name: 'Signature Global', logo: '/developers/download.png' },
  { name: 'Max Estates', logo: '/developers/download-1.png' },
  { name: 'SOBHA', logo: '/developers/download-2.png' },
  { name: 'Ganga Realty', logo: '/developers/godrej-properties-logo.png' },
  { name: 'Ganga Properties', logo: '/developers/smartworl.png' },
  { name: 'Adani Realty', logo: '/developers/Whiteland-logo-1.png' },
  { name: 'Shapoorji Pallonji', logo: '/developers/elan-logo.png' },
  { name: 'Laburnum Developers', logo: '/developers/BPTP-scaled.webp' },
  { name: 'Trusted Developer', logo: '/c-5.jpeg' },
  { name: 'Trusted Developer', logo: '/c-6.jpeg' },
  { name: 'Trusted Developer', logo: '/c-7.jpeg' },
  { name: 'Trusted Developer', logo: '/c-8.jpeg' },
  { name: 'Trusted Developer', logo: '/c-9.jpeg' },
  { name: 'Trusted Developer', logo: '/c-10.jpeg' },
  { name: 'Trusted Developer', logo: '/c-11.jpeg' },
  { name: 'Trusted Developer', logo: '/c-12.jpeg' }
] as const;

const AUTOPLAY_MS = 3200;
const developersPerCycle = developers.length;
const initialIndex = developersPerCycle + developersPerCycle - 2;
const slides = [...developers, ...developers, ...developers, ...developers];

export function TrustedDeveloperNetwork() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [trackOffset, setTrackOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const updateTrackOffset = () => {
    const track = trackRef.current;
    const slide = track?.children[activeIndex] as HTMLElement | undefined;
    if (slide) setTrackOffset(slide.offsetLeft);
  };

  useEffect(() => {
    updateTrackOffset();
    window.addEventListener('resize', updateTrackOffset);
    return () => window.removeEventListener('resize', updateTrackOffset);
  }, [activeIndex]);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setInterval(() => setActiveIndex((index) => index + 1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const move = (direction: number) => setActiveIndex((index) => index + direction);

  const handleTransitionEnd = () => {
    if (activeIndex >= initialIndex + developersPerCycle) {
      setIsTransitioning(false);
      setActiveIndex(initialIndex);
    } else if (activeIndex <= initialIndex - developersPerCycle) {
      setIsTransitioning(false);
      setActiveIndex(initialIndex);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        updateTrackOffset();
        requestAnimationFrame(() => setIsTransitioning(true));
      });
    }
  }, [isTransitioning]);

  const displayIndex = ((activeIndex % developersPerCycle) + developersPerCycle) % developersPerCycle;

  return (
    <section aria-labelledby="trusted-developers-heading" className="overflow-x-hidden bg-[#fafaf8] pb-12 pt-20 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-28">
      <div className="mx-auto max-w-shell px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-[#c9a227]">Our Network</p>
          <span className="mx-auto mt-5 block h-px w-14 bg-[#c9a227]" aria-hidden="true" />
          <h2 id="trusted-developers-heading" className="mt-6 font-display text-[2.35rem] font-light leading-[1.04] tracking-[-0.03em] text-[#111111] sm:text-[3.2rem]">
            Our Trusted Developer Network
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[0.92rem] leading-relaxed text-[#666666]">
            We collaborate with leading real estate developers to bring you reliable property opportunities and verified project options.
          </p>
        </div>

        <div
          className="relative mt-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
          }}>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous developer"
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#c9a227]/35 bg-[#efeee9] text-[#151515] shadow-[0_8px_20px_rgba(17,17,17,0.08)] transition hover:border-[#c9a227] hover:text-[#c9a227] lg:flex">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="developer-mobile-viewport overflow-hidden px-1 py-2">
            <div
              ref={trackRef}
              className="developer-mobile-track flex gap-4 sm:gap-5"
              style={{ transform: `translateX(-${trackOffset}px)`, transition: isTransitioning ? 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none' }}
              onTransitionEnd={handleTransitionEnd}>
              {slides.map((developer, index) => (
                <div key={`${developer.logo}-${index}`} className="flex min-w-0 shrink-0 basis-[78%] sm:basis-[calc(33.333%-0.85rem)] lg:basis-[calc(20%-1rem)]">
                  <div className="flex aspect-[1.8/1] w-full items-center justify-center border border-[#d4af37]/20 bg-[#f1f0ec] p-5 shadow-[0_8px_24px_rgba(17,17,17,0.04)] sm:p-6">
                    <img src={developer.logo} alt={developer.name} loading="lazy" className="h-full w-full object-contain" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next developer"
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#c9a227]/35 bg-[#efeee9] text-[#151515] shadow-[0_8px_20px_rgba(17,17,17,0.08)] transition hover:border-[#c9a227] hover:text-[#c9a227] lg:flex">
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

      </div>
    </section>
  );
}
