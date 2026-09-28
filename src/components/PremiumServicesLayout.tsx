import React from 'react';
import { services } from './ServicesSection';
import { Reveal } from './Reveal';

const featured = services.slice(0, 3);
const categories = services.slice(3);

export function PremiumServicesLayout() {
  return (
    <>
      <section aria-labelledby="services-introduction-heading" className="bg-[#f2efe8] py-14 text-[#151515] sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-shell gap-8 px-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-10">
          <div>
            <p className="eyebrow text-[#c9a227]">Services</p>
            <span className="mt-5 block h-px w-14 bg-[#c9a227]" aria-hidden="true" />
            <h2 id="services-introduction-heading" className="mt-6 max-w-xl font-display text-[2.5rem] font-medium leading-[1.08] tracking-[-0.03em] sm:text-[3.5rem]">Guidance for the decisions that matter.</h2>
          </div>
          <p className="max-w-2xl self-end border-l border-[#c9a227]/50 pl-6 text-[1rem] leading-[1.75] text-[#4e4b45] sm:text-[1.12rem]">Practical, personal assistance from first conversation to a clearer property decision.</p>
        </div>
      </section>

      <section aria-labelledby="featured-services-heading" className="overflow-hidden bg-[#0b0b0b] py-14 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-shell px-5 lg:px-10">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="eyebrow text-[#d4af37]">How We Help</p>
              <span className="mt-5 block h-px w-14 bg-[#d4af37]" aria-hidden="true" />
              <h2 id="featured-services-heading" className="mt-6 font-display text-[2.5rem] font-medium leading-[1.08] !text-white sm:text-[3.5rem]">Focused assistance at every step.</h2>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map(([title, text, Icon]) => (
              <Reveal key={title} className="group flex min-h-[280px] flex-col border border-white/12 bg-[#151515] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/70 hover:shadow-[0_18px_40px_rgba(0,0,0,0.3)] sm:p-8">
                <div className="flex items-start">
                  <span className="flex h-12 w-12 items-center justify-center border border-[#c9a227]/45 text-[#d4af37] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-[#f0c94c]"><Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" /></span>
                </div>
                <h3 className="mt-7 max-w-[15rem] font-display text-[1.65rem] font-medium uppercase leading-[1.1] !text-white">{title}</h3>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-white/65">{text}</p>
                <span className="mt-auto block h-px w-16 bg-[#c9a227] pt-0" aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="service-categories-heading" className="bg-[#f7f5f0] py-14 text-[#151515] sm:py-20 lg:py-24">
        <div className="mx-auto max-w-shell px-5 lg:px-10">
          <p className="eyebrow text-[#c9a227]">Our Services</p>
          <span className="mt-5 block h-px w-14 bg-[#c9a227]" aria-hidden="true" />
          <h2 id="service-categories-heading" className="mt-6 max-w-2xl font-display text-[2.5rem] font-medium leading-[1.08] sm:text-[3.5rem]">More ways we can help.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(([title, text, Icon]) => (
              <Reveal key={title} className="group min-h-[190px] border border-[#b48c32]/25 bg-[#f2efe8] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c9a227]/70 sm:p-8">
                <div className="flex items-start"><span className="flex h-10 w-10 items-center justify-center border border-[#c9a227]/40 text-[#c9a227] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-[#a98232]"><Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /></span></div>
                <h3 className="mt-7 max-w-[14rem] font-display text-[1.35rem] font-medium uppercase leading-[1.12] text-[#151515]">{title}</h3>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-[#4e4b45]">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
