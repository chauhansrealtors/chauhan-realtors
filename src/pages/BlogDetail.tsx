import React, { type ReactNode } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useCmsData } from '../cms/CmsDataContext';
import { useSeo } from '../hooks/useSeo';
import { PageHeader } from '../components/PageHeader';
import { blogs as fallbackBlogs } from '../data/blogs';

function renderInline(value: string): ReactNode[] {
  return value.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="text-[#a98232] underline">{link[1]}</a>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function renderContentBlock(block: string, index: number): ReactNode {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return null;
  if (lines[0].startsWith('## ')) return <h2 key={index} className="font-display text-3xl font-medium text-[#151515]">{renderInline(lines[0].slice(3))}</h2>;
  if (lines[0].startsWith('> ')) return <blockquote key={index} className="border-l-2 border-[#c9a227] pl-5 italic text-[#6f695f]">{renderInline(lines.map((line) => line.replace(/^>\s?/, '')).join(' '))}</blockquote>;
  if (lines.every((line) => line.startsWith('- '))) return <ul key={index} className="list-disc space-y-2 pl-6">{lines.map((line) => <li key={line}>{renderInline(line.slice(2))}</li>)}</ul>;
  if (lines.every((line) => /^\d+\.\s/.test(line))) return <ol key={index} className="list-decimal space-y-2 pl-6">{lines.map((line) => <li key={line}>{renderInline(line.replace(/^\d+\.\s/, ''))}</li>)}</ol>;
  return <p key={index}>{renderInline(lines.join(' '))}</p>;
}

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { blogs } = useCmsData();
  const article = blogs.find((item) => item.slug === slug);
  useSeo({ title: article ? `${article.title} | Chauhan Realtors` : 'Real Estate Insights | Chauhan Realtors', description: article?.excerpt ?? 'Real estate guidance from Chauhan Realtors.', image: article?.image, canonicalPath: location.pathname });
  if (!article) return <Navigate to="/blog" replace />;
  const fallbackImage = fallbackBlogs.find((fallback) => fallback.slug === article.slug)?.image || fallbackBlogs[0].image;
  return <><PageHeader eyebrow={article.category} title={article.title} intro={article.excerpt} image={article.image} fallbackImage={fallbackImage} crumbs={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: article.title }]} /><article className="bg-white py-16 text-[#111111] sm:py-24"><div className="mx-auto max-w-3xl px-5 sm:px-8"><p className="text-xs uppercase tracking-[0.16em] text-[#777777]">{article.date} · {article.readTime} · {article.author}</p><div className="mt-10 space-y-6 text-[1.05rem] leading-[1.9] text-[#555555]">{article.content.map((paragraph, index) => renderContentBlock(paragraph, index))}</div><div className="mt-14 border-t border-[#e7e3d8] pt-10"><p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#c9a227]">Need help finding the right property?</p><Link to="/contact" className="mt-4 inline-flex bg-[#c9a227] px-6 py-3 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#111111]">Schedule a Visit</Link></div></div></article></>;
}
