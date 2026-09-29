import React, { useEffect, useState } from 'react';
import { BarChart3Icon, FileTextIcon, FolderKanbanIcon, ImageIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../admin/AdminAuthContext';
import { getDashboardStats } from '../../services/api';

const navigation = [
  ['Dashboard', BarChart3Icon, '/admin/dashboard'],
  ['Projects', FolderKanbanIcon, '/admin/projects'],
  ['Categories', FolderKanbanIcon, '/admin/categories'],
  ['Blogs', FileTextIcon, '/admin/blogs'],
  ['Home Hero', ImageIcon, '/admin/home-hero']
] as const;

export function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, token, logout } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({ properties: 0, projects: 0, blogs: 0, newEnquiries: 0 });

  useEffect(() => {
    if (!token) return;
    getDashboardStats(token).then((response) => setStats(response.data)).catch(() => undefined);
  }, [token]);

  const signOut = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return <div className="min-h-screen bg-[#f2efe8] text-[#151515]">
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[#c9a227]/20 bg-[#111111] p-6 text-white transition-transform duration-200 md:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-start justify-between border-b border-white/15 pb-7">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#d8b968]">Chauhan Realtors</p>
          <p className="mt-3 font-display text-xl">Admin Panel</p>
        </div>
        <button type="button" className="md:hidden" onClick={() => setMenuOpen(false)} aria-label="Close admin menu"><XIcon className="h-5 w-5" /></button>
      </div>
      <nav className="mt-8 space-y-1" aria-label="Admin navigation">
        {navigation.map(([label, Icon, path], index) => <Link key={label} to={path} className={`flex w-full items-center gap-3 px-3 py-3 text-left text-sm transition-colors ${index === 0 ? 'bg-[#c9a227] text-[#111111]' : 'text-white/70 hover:bg-white/10'}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</Link>)}
      </nav>
      <div className="absolute bottom-6 left-6 right-6 border-t border-white/15 pt-5">
        <p className="mb-3 truncate text-xs text-white/55">{admin?.email}</p>
        <button type="button" onClick={signOut} className="flex items-center gap-3 text-sm text-[#d8b968] transition-colors hover:text-white"><LogOutIcon className="h-4 w-4" aria-hidden="true" />Logout</button>
      </div>
    </aside>

    {menuOpen ? <button type="button" className="fixed inset-0 z-30 bg-black/40 md:hidden" aria-label="Close admin menu" onClick={() => setMenuOpen(false)} /> : null}
    <main className="min-h-screen md:pl-72">
      <header className="flex items-center justify-between border-b border-[#b48c32]/25 bg-[#f7f5f0] px-5 py-5 sm:px-8 lg:px-12">
        <button type="button" className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open admin menu"><MenuIcon className="h-5 w-5" /></button>
        <div className="ml-auto text-right"><p className="text-[0.66rem] uppercase tracking-[0.16em] text-[#857d70]">Signed in as</p><p className="mt-1 text-sm font-medium">{admin?.name}</p></div>
      </header>
      <div className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#a98232]">Overview</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] sm:text-5xl">Dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#625d53]">Live counts from MongoDB. Use the navigation to manage migrated website records.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[['Total Projects', stats.projects], ['Total Blogs', stats.blogs]].map(([label, value]) => <article key={label} className="border border-[#b48c32]/25 bg-[#f7f5f0] p-6"><p className="text-[0.66rem] uppercase tracking-[0.16em] text-[#857d70]">{label}</p><p className="mt-7 font-display text-4xl text-[#a98232]">{value}</p></article>)}
        </div>
      </div>
    </main>
  </div>;
}
