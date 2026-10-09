import { useEffect, useRef } from 'react';
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

const slides = [...developers, ...developers, ...developers];
const CYCLE_LENGTH = developers.length;
const AUTOPLAY_SPEED = 24;
const RESUME_DELAY_MS = 2500;

export function TrustedDeveloperNetwork() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;
    const carousel = viewport.parentElement;
    if (!carousel) return undefined;

    let animationFrame = 0;
    let idleTimer = 0;
    let previousFrameTime = 0;
    let fractionalScroll = 0;
    let cycleWidth = 0;
    let isVisible = false;
    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isPointerActive = false;

    const normalizePosition = () => {
      if (!cycleWidth) return;
      while (viewport.scrollLeft < cycleWidth * 0.5) viewport.scrollLeft += cycleWidth;
      while (viewport.scrollLeft >= cycleWidth * 2.5) viewport.scrollLeft -= cycleWidth;
    };

    const updateCycleWidth = () => {
      const firstSlide = track.children[0] as HTMLElement | undefined;
      const nextCycleSlide = track.children[CYCLE_LENGTH] as HTMLElement | undefined;
      if (!firstSlide || !nextCycleSlide) return;

      const nextCycleWidth = nextCycleSlide.offsetLeft - firstSlide.offsetLeft;
      if (!nextCycleWidth) return;
      cycleWidth = nextCycleWidth;
      normalizePosition();
    };

    const canAutoplay = () =>
      isVisible && !isReducedMotion && !document.hidden && !isPointerActive;

    const stopAutoplay = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousFrameTime = 0;
      fractionalScroll = 0;
    };

    const animate = (time: number) => {
      animationFrame = 0;
      if (!canAutoplay()) return;

      if (previousFrameTime) {
        const elapsed = Math.min(time - previousFrameTime, 50);
        fractionalScroll += elapsed * AUTOPLAY_SPEED / 1000;
        const distance = Math.floor(fractionalScroll);
        if (distance) {
          viewport.scrollLeft += distance;
          fractionalScroll -= distance;
          normalizePosition();
        }
      }
      previousFrameTime = time;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAutoplay = () => {
      if (canAutoplay() && !animationFrame) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const resumeAfterIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        normalizePosition();
        startAutoplay();
      }, RESUME_DELAY_MS);
    };

    const pauseForInteraction = () => {
      stopAutoplay();
      window.clearTimeout(idleTimer);
    };

    const handlePointerDown = () => {
      isPointerActive = true;
      pauseForInteraction();
    };

    const handlePointerUp = () => {
      if (!isPointerActive) return;
      isPointerActive = false;
      resumeAfterIdle();
    };

    const handleWheel = () => {
      pauseForInteraction();
      resumeAfterIdle();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End', ' ', 'Enter'].includes(event.key)) {
        pauseForInteraction();
        resumeAfterIdle();
      }
    };

    const checkVisibility = () => {
      const bounds = viewport.getBoundingClientRect();
      const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      if (visible === isVisible) return;
      isVisible = visible;
      if (isVisible) startAutoplay();
      else pauseForInteraction();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) pauseForInteraction();
      else checkVisibility();
    };

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      isReducedMotion = event.matches;
      if (isReducedMotion) pauseForInteraction();
      else startAutoplay();
    };

    updateCycleWidth();
    viewport.scrollLeft = cycleWidth;

    const intersectionObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(checkVisibility, { threshold: 0.1 })
      : undefined;
    intersectionObserver?.observe(viewport);

    const resizeObserver = new ResizeObserver(updateCycleWidth);
    resizeObserver.observe(viewport);
    checkVisibility();

    carousel.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    viewport.addEventListener('wheel', handleWheel, { passive: true });
    carousel.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionPreference.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      stopAutoplay();
      window.clearTimeout(idleTimer);
      intersectionObserver?.disconnect();
      resizeObserver.disconnect();
      carousel.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      viewport.removeEventListener('wheel', handleWheel);
      carousel.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionPreference.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);

  const move = (direction: number) => {
    const viewport = viewportRef.current;
    const card = viewport?.querySelector<HTMLElement>('[data-developer-slide]');
    if (!viewport || !card) return;

    const gap = Number.parseFloat(getComputedStyle(card.parentElement as HTMLElement).gap) || 0;
    viewport.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };

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

        <div className="relative mt-12">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous developer"
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#c9a227]/35 bg-[#efeee9] text-[#151515] shadow-[0_8px_20px_rgba(17,17,17,0.08)] transition hover:border-[#c9a227] hover:text-[#c9a227] lg:flex">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>

          <div
            ref={viewportRef}
            className="developer-mobile-viewport overflow-x-auto overflow-y-hidden py-2"
            role="region"
            aria-label="Trusted developers"
            tabIndex={0}>
            <div
              ref={trackRef}
              className="flex w-full gap-4 sm:gap-5">
              {slides.map((developer, index) => (
                <div
                  key={`${developer.logo}-${index}`}
                  data-developer-slide
                  aria-hidden={index < CYCLE_LENGTH || index >= CYCLE_LENGTH * 2}
                  className="flex min-w-0 shrink-0 basis-[78%] sm:basis-[calc(33.333%-0.85rem)] lg:basis-[calc(20%-1rem)]">
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
