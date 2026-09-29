import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BarChart3Icon, FileTextIcon, FolderKanbanIcon, ImageIcon, LogOutIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../admin/AdminAuthContext';
import { createCategory, deleteCategory, getAdminCategories, type Category, updateCategory } from '../../services/api';

const navigation = [['Dashboard', BarChart3Icon, '/admin/dashboard'], ['Projects', FolderKanbanIcon, '/admin/projects'], ['Categories', FolderKanbanIcon, '/admin/categories'], ['Blogs', FileTextIcon, '/admin/blogs'], ['Home Hero', ImageIcon, '/admin/home-hero']] as const;
const fieldClass = 'h-11 w-full border border-[#b48c32]/30 bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#c9a227]';

export function Categories() {
  const { token, admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try { setCategories((await getAdminCategories(token)).data); setError(''); } catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Unable to load categories.'); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => categories.filter((category) => category.name.toLowerCase().includes(query.toLowerCase())), [categories, query]);
  const openForm = (category?: Category) => { setEditing(category || null); setFormOpen(true); setName(category?.name || ''); setStatus(category?.status || 'active'); setError(''); setNotice(''); };
  const closeForm = () => { if (!saving) { setEditing(null); setFormOpen(false); } };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) { setError('Category name must be at least 2 characters.'); return; }
    if (categories.some((category) => category.name.toLowerCase() === trimmedName.toLowerCase() && category._id !== editing?._id)) { setError('Category already exists.'); return; }
    if (!token) return;
    setSaving(true); setError('');
    try { if (editing) { await updateCategory(editing._id, { name: trimmedName, status }, token); setNotice('Category updated successfully.'); } else { await createCategory({ name: trimmedName, status }, token); setNotice('Category created successfully.'); } setEditing(null); setFormOpen(false); await load(); } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Unable to save category.'); } finally { setSaving(false); }
  };
  const remove = async (category: Category) => {
    if (!token || !window.confirm(`Delete Category?\n\nAre you sure you want to delete "${category.name}"?`)) return;
    setError('');
    try { await deleteCategory(category._id, token); setNotice('Category deleted successfully.'); await load(); } catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete category.'); }
  };
  const signOut = () => { logout(); navigate('/admin/login', { replace: true }); };

  return <div className="min-h-screen bg-[#f2efe8] text-[#151515]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#c9a227]/20 bg-[#111111] p-6 text-white md:block"><div className="border-b border-white/15 pb-7"><p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#d8b968]">Chauhan Realtors</p><p className="mt-3 font-display text-xl">Admin Panel</p></div><nav className="mt-8 space-y-1">{navigation.map(([label, Icon, path]) => <Link key={label} to={path} className={`flex items-center gap-3 px-3 py-3 text-sm ${path === '/admin/categories' ? 'bg-[#c9a227] text-[#111111]' : 'text-white/70 hover:bg-white/10'}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav><div className="absolute bottom-6 left-6 right-6 border-t border-white/15 pt-5"><p className="mb-3 truncate text-xs text-white/55">{admin?.email}</p><button type="button" onClick={signOut} className="flex items-center gap-3 text-sm text-[#d8b968]"><LogOutIcon className="h-4 w-4" />Logout</button></div></aside>
    <main className="min-h-screen md:pl-72"><header className="border-b border-[#b48c32]/25 bg-[#f7f5f0] px-5 py-5 sm:px-8 lg:px-12"><button type="button" onClick={() => navigate('/admin/dashboard')} className="text-[0.68rem] uppercase tracking-[0.16em] text-[#a98232]">Dashboard</button><span className="float-right text-sm">{admin?.name}</span></header><div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#a98232]">Admin CMS</p><h1 className="mt-3 font-display text-4xl font-medium">Categories</h1><p className="mt-3 text-sm text-[#6f695f]">Manage property categories used across Chauhan Realtors.</p></div><button type="button" onClick={() => openForm()} className="inline-flex h-11 items-center justify-center gap-2 bg-[#c9a227] px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]"><PlusIcon className="h-4 w-4" />Add Category</button></div><div className="mt-8"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." className={`${fieldClass} max-w-md`} /></div>{error ? <p role="alert" className="mt-5 border border-red-900/20 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}{notice ? <p className="mt-5 border border-emerald-900/20 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}{loading ? <p className="mt-10 text-sm text-[#6f695f]">Loading categories...</p> : <div className="mt-8 overflow-x-auto border border-[#b48c32]/25 bg-[#f7f5f0]"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-[#b48c32]/25 text-[0.66rem] uppercase tracking-[0.16em] text-[#857d70]"><tr><th className="px-5 py-4">#</th><th className="px-5 py-4">Category Name</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Properties</th><th className="px-5 py-4">Created At</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{filtered.map((category, index) => <tr key={category._id} className="border-b border-[#e8e2d6] last:border-0"><td className="px-5 py-4 text-[#857d70]">{index + 1}</td><td className="px-5 py-4 font-medium">{category.name}</td><td className="px-5 py-4"><span className={category.status === 'inactive' ? 'text-[#857d70]' : 'text-[#a98232]'}>{category.status === 'inactive' ? 'Inactive' : 'Active'}</span></td><td className="px-5 py-4 text-[#6f695f]">{category.propertyCount || 0} {category.propertyCount === 1 ? 'Property' : 'Properties'}</td><td className="px-5 py-4 text-[#6f695f]">{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : '-'}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openForm(category)} aria-label={`Edit ${category.name}`} className="border border-[#b48c32]/30 p-2 text-[#a98232]"><PencilIcon className="h-4 w-4" /></button><button type="button" onClick={() => void remove(category)} aria-label={`Delete ${category.name}`} disabled={Boolean(category.propertyCount)} className="border border-red-900/20 p-2 text-red-700 disabled:cursor-not-allowed disabled:opacity-30"><Trash2Icon className="h-4 w-4" /></button></div></td></tr>)}</tbody></table>{!filtered.length ? <p className="p-8 text-center text-sm text-[#6f695f]">No categories found.</p> : null}</div>}</div></main>
    {formOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><form onSubmit={submit} className="w-full max-w-lg border border-[#c9a227]/30 bg-[#f2efe8] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-display text-2xl">{editing ? 'Edit Category' : 'Add Category'}</h2><button type="button" onClick={closeForm} aria-label="Close category form"><XIcon className="h-5 w-5" /></button></div><label className="mt-6 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Category Name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} className={`${fieldClass} mt-2`} placeholder="Commercial" /></label><label className="mt-5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Status<select value={status} onChange={(event) => setStatus(event.target.value as 'active' | 'inactive')} className={`${fieldClass} mt-2`}><option value="active">Active</option><option value="inactive">Inactive</option></select></label><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={closeForm} className="border border-[#b48c32]/30 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em]">Cancel</button><button type="submit" disabled={saving} className="bg-[#c9a227] px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em]">{saving ? (editing ? 'Saving...' : 'Adding...') : (editing ? 'Update Category' : 'Add Category')}</button></div></form></div> : null}
  </div>;
}