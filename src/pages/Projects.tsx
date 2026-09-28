import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { projects as fallbackProjects } from '../data/projects';
import { useCmsData } from '../cms/CmsDataContext';
import { DISCLAIMER_SHORT, DISCLAIMER_VISUALS } from '../data/brand';
import { PageHeader } from '../components/PageHeader';
import { ProjectGrid } from '../components/ProjectCard';
import { ContactSection } from '../components/ContactSection';
import { Reveal } from '../components/Reveal';
import { getProjectCard, getProjectType } from '../utils/projectMedia';

function priceInLakhs(value: string | undefined): number | null {
  const text = String(value ?? '').toLowerCase().replace(/,/g, '');
  const amount = Number.parseFloat(text.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(amount)) return null;
  if (text.includes('cr')) return amount * 100;
  if (text.includes('lakh') || text.includes('lac')) return amount;
  return amount > 1000 ? amount / 100000 : amount;
}

function normalizeProjectStatus(value: string | undefined): string {
  const raw = String(value ?? '').trim();
  if (!raw) return 'Unknown';

  const normalized = raw.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  if (normalized.includes('ready to move') || normalized.includes('ready tomove') || normalized.includes('ready_to_move') || normalized.includes('readytomove')) {
    return 'Ready to Move';
  }

  if (normalized.includes('under construction') || normalized.includes('underconstruction')) {
    return 'Under Construction';
  }

  return raw;
}

export function Projects() {
  const { projects, categories } = useCmsData();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [budget, setBudget] = useState('All');

  const projectTypes = useMemo(() => categories.length ? ['All', ...categories.map((category) => category.name)] : ['All', ...Array.from(new Set(projects.map((project) => getProjectType(project)).filter(Boolean)))], [categories, projects]);
  const projectStatuses = useMemo(() => ['All', ...Array.from(new Set(projects.map((project) => normalizeProjectStatus(project.status)).filter(Boolean)))], [projects]);
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const searchable = [project.name, project.title, project.developer, project.location, project.tagline, project.shortDescription].filter(Boolean).join(' ').toLowerCase();
      const price = priceInLakhs(project.price);
      const matchesBudget = budget === 'All' || (budget === 'under-150' && price !== null && price < 150) || (budget === '150-250' && price !== null && price >= 150 && price <= 250) || (budget === '250-400' && price !== null && price > 250 && price <= 400) || (budget === 'over-400' && price !== null && price > 400);
      const normalizedStatus = normalizeProjectStatus(project.status);
      return (!query || searchable.includes(query)) && (type === 'All' || getProjectType(project) === type) && (status === 'All' || normalizedStatus === status) && matchesBudget;
    });
  }, [budget, projects, search, status, type]);
  useSeo({
    title: 'Projects | Chauhan Realtors — Premium Gurgaon Residences',
    description:
    location.pathname === '/properties' ? 'Explore residential and commercial properties available through Chauhan Realtors.' : 'Explore premium residential projects across Gurgaon curated by Chauhan Realtors — M3M GIC Forestia, Ganga Nine Zero, Smartworld Wellness, ATS HomeKraft and Wall Senior Living.',
    image: projects[0]?.card || fallbackProjects[0].card,
    canonicalPath: '/projects'
  });

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Five addresses, each considered on its own terms."
        intro="We do not force the same level of detail onto every project. Where developer material supports a specification we present it; where a figure is a market reference, it is labelled as one."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Projects' }]}
        image={getProjectCard(projects[0]) || fallbackProjects[0].card}
        fallbackImage={fallbackProjects[0].card} />
      

      <section aria-label="All projects" className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-[90%] max-w-shell">
          <div className="mb-10 border border-[#b48c32]/25 bg-[#f7f5f0] p-4 sm:p-5">
            <label className="sr-only" htmlFor="project-search">Search projects</label>
            <input id="project-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects..." className="h-11 w-full border border-[#b48c32]/30 bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#c9a227]" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label><span className="mb-2 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Category</span><select value={type} onChange={(event) => setType(event.target.value)} className="h-11 w-full border border-[#b48c32]/30 bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#c9a227]"><option value="All">All Categories</option>{projectTypes.filter((item) => item !== 'All').map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label><span className="mb-2 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 w-full border border-[#b48c32]/30 bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#c9a227]"><option value="All">All Status</option><option value="Ready to Move">Ready to Move</option><option value="Under Construction">Under Construction</option>{projectStatuses.filter((item) => item !== 'All' && item !== 'Ready to Move' && item !== 'Under Construction').map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label><span className="mb-2 block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Budget</span><select value={budget} onChange={(event) => setBudget(event.target.value)} className="h-11 w-full border border-[#b48c32]/30 bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#c9a227]"><option value="All">Any Price</option><option value="under-150">Under ₹1.5 Cr</option><option value="150-250">₹1.5 Cr - ₹2.5 Cr</option><option value="250-400">₹2.5 Cr - ₹4 Cr</option><option value="over-400">Above ₹4 Cr</option></select></label>
            </div>
          </div>
          {filteredProjects.length ? <ProjectGrid projects={filteredProjects} staticGrid /> : <p className="border border-[#b48c32]/25 bg-[#f7f5f0] p-8 text-center text-sm text-[#6f695f]">No projects match these filters.</p>}

          <Reveal delay={0.05}>
            <div className="mt-12 border-l border-[#c9a227] pl-5 sm:pl-6">
              <h2 className="eyebrow text-[#c9a227]">Before you rely on any detail</h2>
              <p className="mt-3 max-w-3xl text-[0.78rem] leading-relaxed text-[#666666]">
                {DISCLAIMER_SHORT}
              </p>
              <p className="mt-3 max-w-3xl text-[0.78rem] leading-relaxed text-[#666666]">
                {DISCLAIMER_VISUALS}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </>);

}