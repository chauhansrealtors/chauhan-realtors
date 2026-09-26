import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { legalPages } from '../data/site';
import { PageHeader } from '../components/PageHeader';
import { Reveal, GoldLine } from '../components/Reveal';

type LegalKey = keyof typeof legalPages;

const legalAliases: Record<string, LegalKey> = {
  privacy: 'privacy',
  terms: 'terms',
  disclaimer: 'disclaimer',
  'privacy-policy': 'privacy',
  'terms-and-conditions': 'terms'
};

export function Legal() {
  const { doc } = useParams<{doc: string;}>();
  const location = useLocation();
  const routeKey = doc || location.pathname.split('/').filter(Boolean).pop();
  const key: LegalKey = legalAliases[routeKey || ''] || 'disclaimer';
  const page = legalPages[key];

  useSeo({
    title: page.title + ' | Chauhan Realtors',
    description: page.intro,
    canonicalPath: key === 'privacy' ? '/privacy-policy' : key === 'terms' ? '/terms-and-conditions' : '/disclaimer'
  });

  if (!legalAliases[routeKey || '']) return <Navigate to="/disclaimer" replace />;

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={page.title}
        intro={page.intro}
        crumbs={[{ label: 'Home', to: '/' }, { label: page.title }]} />
      

      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-10">
          <div className="space-y-12">
            {page.sections.map((section, index) =>
            <Reveal key={section.heading} delay={index * 0.04}>
                <section>
                  <h2 className="font-display text-2xl font-light text-[#111111]">{section.heading}</h2>
                  <GoldLine className="mt-4" width="2.5rem" />
                  <p className="mt-5 text-[0.92rem] leading-relaxed text-[#666666]">{section.body}</p>
                </section>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.08}>
            <p className="mt-16 border-t border-[#e8e6e0] pt-8 text-[0.72rem] leading-relaxed text-[#666666]">
              Chauhan Realtors is a real estate consultancy and is not the promoter or developer of
              the projects presented on this website. For any project, the particulars recorded with
              the Haryana Real Estate Regulatory Authority at haryanarera.gov.in should be treated
              as the controlling source.
            </p>
          </Reveal>
        </div>
      </div>
    </>);

}