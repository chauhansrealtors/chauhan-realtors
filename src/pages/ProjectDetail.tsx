import React, { useRef, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  MapPinIcon,
  PhoneIcon,
  DownloadIcon,
  CalendarCheckIcon,
  CheckIcon,
  InfoIcon } from
'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useCmsData } from '../cms/CmsDataContext';
import {
  brand,
  callLink,
  whatsappLink,
  siteVisitMessage,
  DISCLAIMER_VISUALS } from
'../data/brand';
import type { Confidence } from '../types/project';
import { PageHeader } from '../components/PageHeader';
import { EnquiryForm } from '../components/EnquiryForm';
import { ProjectGallery } from '../components/Lightbox';
import { Reveal, GoldLine } from '../components/Reveal';
import { ProjectGrid } from '../components/ProjectCard';
import { BrochureLeadModal } from '../components/BrochureLeadModal';
import { getProjectGallery, getProjectHero, normalizeProjectImages } from '../utils/projectMedia';
import { projects as fallbackProjects } from '../data/projects';

const confidenceLabel: Record<Confidence, string> = {
  verified: 'Confirmed in supplied material',
  reference: 'Reference figure - verify',
  onRequest: 'On request'
};

const confidenceClass: Record<Confidence, string> = {
  verified: 'text-[#c9a227]',
  reference: 'text-[#666666]',
  onRequest: 'text-[#666666]'
};

function Block({
  title,
  children,
  id




}: {title: string;children: React.ReactNode;id?: string;}) {
  return (
    <section id={id} aria-labelledby={id ? id + '-h' : undefined} className="scroll-mt-24">
      <Reveal>
        <h2 id={id ? id + '-h' : undefined} className="font-display text-3xl font-light leading-tight text-[#111111] sm:text-4xl">
          {title}
        </h2>
        <GoldLine className="mt-4" width="2.5rem" />
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>);

}

export function ProjectDetail() {
  const { slug } = useParams<{slug: string;}>();
  const { projects } = useCmsData();
  const project = slug ? projects.find((item) => item.slug === slug) : undefined;
  const formRef = useRef<HTMLDivElement>(null);
  const [brochureOpen, setBrochureOpen] = useState(false);

  // Hooks must run unconditionally, so SEO is applied before the redirect guard.
  useSeo({
    title: project ?
    project.name + ' | Chauhan Realtors, Gurgaon' :
    'Project | Chauhan Realtors',
    description: project ? project.tagline : 'Premium residential projects across Gurgaon.',
    image: project ? getProjectHero(project as any) : undefined
  });

  if (!project) return <Navigate to="/projects" replace />;

  const others = projects.filter((item) => item.id !== project.id).slice(0, 3);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHeader
        eyebrow={project.developer}
        title={project.name}
        intro={project.tagline}
        image={getProjectHero(project as any)}
          fallbackImage={fallbackProjects.find((item) => item.slug === project.slug)?.card || fallbackProjects[0].card}
        crumbs={[
        { label: 'Home', to: '/' },
        { label: 'Projects', to: '/projects' },
        { label: project.name }]
        } />
      

      <div className="border-b border-[#e5e1d8] bg-white">
        <div className="mx-auto max-w-shell px-5 py-8 lg:px-10 lg:py-10">
          <div className="grid gap-px border border-[#e5e1d8] bg-[#e5e1d8] sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-[#faf9f6] p-5 sm:p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#c9a227]">Location</p>
              <p className="mt-3 flex items-start gap-2 text-[0.98rem] leading-relaxed text-[#111111]"><MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-[#c9a227]" aria-hidden="true" />{project.location}</p>
            </div>
            <div className="bg-white p-5 sm:p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#c9a227]">Configuration</p>
              <p className="mt-3 text-[1.05rem] text-[#111111]">{project.configuration}</p>
            </div>
            <div className="bg-white p-5 sm:p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#c9a227]">Size</p>
              <p className="mt-3 text-[1.05rem] text-[#111111]">{project.area}</p>
            </div>
            <div className="bg-white p-5 sm:p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#c9a227]">Price</p>
              <p className="mt-3 text-[1.05rem] text-[#c9a227]">{project.price}</p>
            </div>
          </div>
          {project.registeredAs ?
          <p className="mt-4 text-[0.78rem] leading-relaxed text-[#555555]">Also identified as: {project.registeredAs}</p> :
          null}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={whatsappLink(siteVisitMessage(project.name))}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 w-full items-center justify-center gap-2 border border-[#c9a227] px-4 text-[0.68rem] uppercase tracking-[0.16em] text-[#c9a227] transition-all duration-200 ease-lux hover:-translate-y-0.5 hover:bg-[#c9a227] hover:text-[#111111] sm:w-auto sm:px-7 sm:text-[0.72rem] sm:tracking-[0.2em]">
              
              <CalendarCheckIcon className="h-4 w-4" aria-hidden="true" />
              Schedule Site Visit
            </a>
            <button
              type="button"
              onClick={() => setBrochureOpen(true)}
              className="flex h-14 w-full items-center justify-center gap-2 border border-[#111111]/20 px-4 text-[0.68rem] uppercase tracking-[0.16em] text-[#111111] transition-all duration-200 ease-lux hover:-translate-y-0.5 hover:border-[#c9a227] hover:text-[#c9a227] sm:w-auto sm:px-7 sm:text-[0.72rem] sm:tracking-[0.2em]">
              
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              Download Brochure
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#faf9f6] pb-24 pt-14 sm:pb-32 sm:pt-24">
        <div className="mx-auto max-w-shell px-5 lg:px-10">
          <div className="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
            <div className="min-w-0 space-y-16 sm:space-y-24">
              <Block title="Overview" id="overview">
                <div className="max-w-3xl space-y-6">
                  {project.overview.map((paragraph) =>
                  <p key={paragraph.slice(0, 32)} className="text-[1.02rem] leading-[1.85] text-[#333333]">
                      {paragraph}
                    </p>
                  )}
                </div>
              </Block>

              <Block title="Highlights" id="highlights">
                <ul className="grid gap-px border border-[#e5e1d8] bg-[#e5e1d8] sm:grid-cols-2">
                  {project.highlights.map((item, index) =>
                  <Reveal as="li" key={item.title} delay={index * 0.04} className="group bg-white p-7 transition-colors duration-200 hover:bg-[#faf9f6] sm:p-8">
                      <span className="inline-flex h-3.5 w-3.5 rotate-45 border border-[#c9a227]/70 bg-[#c9a227]/10" aria-hidden="true" />
                      <h3 className="mt-5 font-display text-[1.55rem] font-light leading-tight text-[#111111]">{item.title}</h3>
                      <p className="mt-3 text-[0.95rem] leading-[1.7] text-[#444444]">{item.text}</p>
                    </Reveal>
                  )}
                </ul>
              </Block>

              <Block title="Configuration and project facts" id="configuration">
                <dl className="divide-y divide-[#e5e1d8] border-y border-[#e5e1d8] bg-white">
                  {project.facts.map((fact) =>
                  <div key={fact.label} className="grid gap-2 px-5 py-5 sm:grid-cols-[15rem_1fr] sm:gap-8 sm:px-7">
                      <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-[#c9a227]">
                        {fact.label}
                      </dt>
                      <dd>
                        <span className="block text-[1rem] leading-relaxed text-[#111111]">{fact.value}</span>
                        <span className={'mt-1.5 block text-[0.75rem] ' + confidenceClass[fact.confidence]}>
                          {confidenceLabel[fact.confidence]}
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </Block>

              <Block title="Amenities" id="amenities">
                <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {project.amenities.map((amenity) =>
                  <li key={amenity} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-[#333333]">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c9a227]" aria-hidden="true" />
                      {amenity}
                    </li>
                  )}
                </ul>
              </Block>

              <Block title="Floor plans" id="floor-plans">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.floorPlans.map((plan) =>
                  <li key={plan.label} className="border border-[#e8e6e0] bg-[#f8f8f6] p-5">
                      <p className="font-display text-lg text-[#111111]">{plan.label}</p>
                      <p className="mt-1.5 text-[0.75rem] text-[#666666]">{plan.note}</p>
                    </li>
                  )}
                </ul>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-[#666666]">
                  Carpet area, super area and room dimensions must be read from the latest official
                  floor plan for the specific tower and unit.
                </p>
              </Block>

              <Block title="Gallery" id="gallery">
                <ProjectGallery images={getProjectGallery(project as any)} />
                <p className="mt-4 text-[0.75rem] leading-relaxed text-[#666666]">
                  {DISCLAIMER_VISUALS}
                </p>
              </Block>

              <Block title="Location and connectivity" id="location">
                <p className="flex items-start gap-2 text-[0.95rem] text-[#444444]">
                  <MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-[#c9a227]" aria-hidden="true" />
                  {project.location}
                </p>
                <ul className="mt-6 grid gap-px border border-[#e8e6e0] bg-[#e8e6e0] sm:grid-cols-2">
                  {project.connectivity.map((item) =>
                  <li key={item} className="bg-[#f8f8f6] px-5 py-4 text-[0.85rem] text-[#444444]">
                      {item}
                    </li>
                  )}
                </ul>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-[#666666]">
                  Corridors and landmarks are listed by name only. We do not publish travel times
                  or distances that have not been confirmed.
                </p>
              </Block>

              <Reveal>
                <aside className="border-l border-[#c9a227] bg-[#f8f8f6] p-6">
                  <h2 className="flex items-center gap-2 eyebrow text-[#c9a227]">
                    <InfoIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Verification note
                  </h2>
                  <p className="mt-4 text-[0.82rem] leading-relaxed text-[#444444]">
                    {project.verificationNote}
                  </p>
                </aside>
              </Reveal>

              <div ref={formRef} className="scroll-mt-24">
                <Block title="Enquire about this project" id="enquire">
                  <EnquiryForm
                    source={'project-detail:' + project.slug}
                    id={'enquiry-' + project.slug} />
                  
                </Block>
              </div>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <div className="border border-[#e5e1d8] bg-white p-7 shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[#c9a227]">At a glance</p>
                <dl className="mt-7 space-y-6">
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-[#777777]">
                      Configuration
                    </dt>
                    <dd className="mt-2 text-[1rem] text-[#111111]">{project.configuration}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-[#777777]">Size</dt>
                    <dd className="mt-2 text-[1rem] text-[#111111]">{project.area}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-[#777777]">Price</dt>
                    <dd className="mt-2 text-[1rem] text-[#c9a227]">{project.price}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-[#777777]">Corridor</dt>
                    <dd className="mt-2 text-[1rem] leading-relaxed text-[#111111]">{project.map.corridor}</dd>
                  </div>
                </dl>

                <div className="mt-7 space-y-3 border-t border-[#e8e6e0] pt-6">
                  <a
                    href={callLink(brand.founder.phone)}
                    className="flex h-12 items-center justify-center gap-2 border border-[#c9a227] text-[0.66rem] uppercase tracking-[0.2em] text-[#c9a227] transition-colors duration-150 ease-lux hover:bg-[#c9a227] hover:text-[#111111]">
                    
                    <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                    {brand.founder.phoneDisplay}
                  </a>
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="flex h-12 w-full items-center justify-center border border-[#111111]/15 text-[0.66rem] uppercase tracking-[0.2em] text-[#111111] transition-colors duration-150 ease-lux hover:border-[#c9a227] hover:text-[#c9a227]">
                    
                    Request a Callback
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <section aria-labelledby="other-projects" className="mt-20 border-t border-[#e8e6e0] pt-14">
            <Reveal>
              <h2 id="other-projects" className="eyebrow text-[#c9a227]">
                Other projects
              </h2>
            </Reveal>
            <div className="mt-8">
              <ProjectGrid projects={others} staticGrid />
            </div>
          </section>
        </div>
      </div>

      <BrochureLeadModal open={brochureOpen} project={project} onClose={() => setBrochureOpen(false)} />

    </>);

}