import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpIcon, ImagePlusIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../admin/AdminAuthContext';
import { createHeroSlide, deleteHeroSlide, getAdminHeroSlides, reorderHeroSlides, updateHeroSlide, updateHeroSlideStatus, uploadProjectImage, type HeroSlide } from '../../services/api';

type HeroDraft = Omit<HeroSlide, '_id' | 'createdAt'>;

const fieldClass = 'h-11 w-full border border-[#b48c32]/30 bg-[#fbfaf6] px-3 text-sm outline-none focus:border-[#c9a227]';
const navigation = [
  ['Dashboard', '/admin/dashboard'],
  ['Projects', '/admin/projects'],
  ['Categories', '/admin/categories'],
  ['Blogs', '/admin/blogs'],
  ['Home Hero', '/admin/home-hero']
] as const;

export function HomeHero() {
  const { token, admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [draft, setDraft] = useState<HeroDraft | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => () => {
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setSlides((await getAdminHeroSlides(token)).data);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load hero slides.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setDraft(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const openForm = (slide?: HeroSlide) => {
    const nextOrder = Math.max(0, ...slides.map((item) => item.order)) + 1;
    setEditing(slide || null);
    setDraft(slide
      ? { image: slide.image, title: slide.title, altText: slide.altText, status: slide.status, order: slide.order }
      : { image: '', title: `Hero Slide ${nextOrder}`, altText: '', status: 'active', order: nextOrder });
    setSelectedFile(null);
    setPreviewUrl(slide?.image || '');
    setError('');
    setNotice('');
    setFormOpen(true);
  };

  const selectImage = (file?: File) => {
    setSelectedFile(file || null);
    setPreviewUrl(file ? URL.createObjectURL(file) : (editing?.image || ''));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !draft) return;
    if (!selectedFile && !draft.image) {
      setError('Please select a hero image.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const image = selectedFile ? (await uploadProjectImage(selectedFile, token)).data.url : draft.image;
      const payload = { ...draft, image, order: Number(draft.order) };
      if (!Number.isInteger(payload.order) || payload.order < 1) {
        setError('Order must be a positive whole number.');
        return;
      }
      if (editing) await updateHeroSlide(editing._id, payload, token);
      else await createHeroSlide(payload, token);
      setNotice(editing ? 'Hero slide updated successfully.' : 'Hero slide added successfully.');
      setFormOpen(false);
      setEditing(null);
      setDraft(null);
      setSelectedFile(null);
      setPreviewUrl('');
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save hero slide.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (slide: HeroSlide) => {
    if (!token) return;
    try {
      await updateHeroSlideStatus(slide._id, slide.status === 'active' ? 'inactive' : 'active', token);
      await load();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Unable to update slide status.');
    }
  };

  const moveSlide = async (index: number, direction: -1 | 1) => {
    if (!token) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    try {
      setSlides((await reorderHeroSlides(reordered.map((slide) => slide._id), token)).data);
      setError('');
    } catch (reorderError) {
      setError(reorderError instanceof Error ? reorderError.message : 'Unable to reorder hero slides.');
    }
  };

  const remove = async (slide: HeroSlide) => {
    if (!token || !window.confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      await deleteHeroSlide(slide._id, token);
      setNotice('Hero slide deleted successfully.');
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete hero slide.');
    }
  };

  const signOut = () => { logout(); navigate('/admin/login', { replace: true }); };

  return <div className="min-h-screen bg-[#f2efe8] text-[#151515]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[#c9a227]/20 bg-[#111111] p-6 text-white md:block">
      <div className="border-b border-white/15 pb-7"><p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#d8b968]">Chauhan Realtors</p><p className="mt-3 font-display text-xl">Admin Panel</p></div>
      <nav className="mt-8 space-y-1" aria-label="Admin navigation">{navigation.map(([label, path]) => <Link key={path} to={path} className={`flex items-center px-3 py-3 text-sm ${path === '/admin/home-hero' ? 'bg-[#c9a227] text-[#111111]' : 'text-white/70 hover:bg-white/10'}`}>{label}</Link>)}</nav>
      <div className="absolute bottom-6 left-6 right-6 border-t border-white/15 pt-5"><p className="mb-3 truncate text-xs text-white/55">{admin?.email}</p><button type="button" onClick={signOut} className="text-sm text-[#d8b968] hover:text-white">Logout</button></div>
    </aside>

    <main className="min-h-screen md:pl-72">
      <header className="flex items-center justify-between border-b border-[#b48c32]/25 bg-[#f7f5f0] px-5 py-5 sm:px-8 lg:px-12">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] text-[#a98232]"><ArrowLeftIcon className="h-4 w-4" />Dashboard</Link>
        <span className="text-right text-sm">{admin?.name}</span>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#a98232]">Admin CMS</p><h1 className="mt-3 font-display text-4xl font-medium">Home Hero Slider</h1><p className="mt-3 max-w-xl text-sm text-[#6f695f]">Manage the images displayed in the Home page hero slider.</p></div>
          <button type="button" onClick={() => openForm()} className="inline-flex h-11 items-center justify-center gap-2 bg-[#c9a227] px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]"><PlusIcon className="h-4 w-4" />Add New Slide</button>
        </div>

        {error ? <p role="alert" className="mt-5 border border-red-900/20 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
        {notice ? <p role="status" className="mt-5 border border-emerald-900/20 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p> : null}

        {loading ? <p className="mt-10 text-sm text-[#6f695f]">Loading hero slides...</p> : slides.length === 0 ? <div className="mt-8 border border-[#b48c32]/25 bg-[#f7f5f0] px-5 py-12 text-center"><p className="text-sm text-[#6f695f]">No hero slides found.</p><button type="button" onClick={() => openForm()} className="mt-5 inline-flex h-11 items-center gap-2 bg-[#c9a227] px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]"><PlusIcon className="h-4 w-4" />Add Hero Slide</button></div> : <div className="mt-8 border border-[#b48c32]/25 bg-[#f7f5f0]">
          <div className="hidden grid-cols-[64px_112px_minmax(120px,1fr)_110px_70px_230px] gap-4 border-b border-[#b48c32]/25 px-5 py-4 text-[0.66rem] uppercase tracking-[0.16em] text-[#857d70] sm:grid"><span>#</span><span>Image</span><span>Title / Name</span><span>Status</span><span>Order</span><span className="text-right">Actions</span></div>
          <div className="divide-y divide-[#b48c32]/20">
            {slides.map((slide, index) => <article key={slide._id} className="grid gap-4 p-4 sm:grid-cols-[64px_112px_minmax(120px,1fr)_110px_70px_230px] sm:items-center sm:px-5">
              <span className="text-xs text-[#857d70]">{index + 1}</span>
              <img src={slide.image} alt={slide.altText || slide.title} className="aspect-video w-full object-cover sm:aspect-[16/9]" />
              <div className="min-w-0"><p className="break-words text-sm font-medium">{slide.title}</p><p className="mt-1 break-all text-xs text-[#857d70]">{slide.image}</p></div>
              <button type="button" onClick={() => void toggleStatus(slide)} aria-label={`${slide.status === 'active' ? 'Deactivate' : 'Activate'} ${slide.title}`} className={`w-fit border px-3 py-2 text-xs ${slide.status === 'active' ? 'border-emerald-800/20 bg-emerald-50 text-emerald-800' : 'border-[#b48c32]/25 bg-[#eee9df] text-[#6f695f]'}`}>{slide.status === 'active' ? 'Active' : 'Inactive'}</button>
              <span className="text-sm">{slide.order}</span>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <button type="button" disabled={index === 0} onClick={() => void moveSlide(index, -1)} title="Move up" aria-label={`Move ${slide.title} up`} className="border border-[#b48c32]/30 p-2 disabled:opacity-35"><ArrowUpIcon className="h-4 w-4" /></button>
                <button type="button" disabled={index === slides.length - 1} onClick={() => void moveSlide(index, 1)} title="Move down" aria-label={`Move ${slide.title} down`} className="border border-[#b48c32]/30 p-2 disabled:opacity-35"><ArrowDownIcon className="h-4 w-4" /></button>
                <button type="button" onClick={() => openForm(slide)} className="inline-flex items-center gap-1 border border-[#b48c32]/30 px-3 py-2 text-xs"><PencilIcon className="h-3.5 w-3.5" />Edit</button>
                <button type="button" onClick={() => void remove(slide)} className="inline-flex items-center gap-1 border border-red-900/20 px-3 py-2 text-xs text-red-800"><Trash2Icon className="h-3.5 w-3.5" />Delete</button>
              </div>
            </article>)}
          </div>
        </div>}
      </div>
    </main>

    {formOpen && draft ? <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="presentation">
      <form onSubmit={submit} className="my-auto max-h-[calc(100svh-2rem)] w-full max-w-2xl overflow-y-auto border border-[#c9a227]/30 bg-[#f2efe8] p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between"><div><p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#a98232]">Home Hero</p><h2 className="mt-2 font-display text-2xl">{editing ? 'Edit Hero Slide' : 'Add Hero Slide'}</h2></div><button type="button" onClick={closeForm} aria-label="Close hero slide form"><XIcon className="h-5 w-5" /></button></div>
        {error ? <p role="alert" className="mt-5 border border-red-900/20 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Title / Name<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={`${fieldClass} mt-2`} maxLength={100} /></label>
          <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Order<input type="number" min="1" step="1" required value={draft.order} onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })} className={`${fieldClass} mt-2`} /></label>
          <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Alt Text<input value={draft.altText} onChange={(event) => setDraft({ ...draft, altText: event.target.value })} className={`${fieldClass} mt-2`} maxLength={200} /></label>
          <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Status<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as HeroSlide['status'] })} className={`${fieldClass} mt-2`}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
        </div>
        <label className="mt-5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a7368]">Hero Image{!editing ? ' *' : ''}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectImage(event.target.files?.[0])} className="mt-2 block w-full text-sm file:mr-4 file:border-0 file:bg-[#e6dfd1] file:px-4 file:py-3 file:text-xs file:font-semibold" /></label>
        {previewUrl ? <div className="mt-4 overflow-hidden border border-[#b48c32]/25 bg-[#111111]"><img src={previewUrl} alt="Hero image preview" className="aspect-video max-h-[38vh] w-full object-cover" /></div> : <div className="mt-4 flex aspect-video max-h-[38vh] items-center justify-center border border-dashed border-[#b48c32]/40 text-sm text-[#857d70]"><ImagePlusIcon className="mr-2 h-5 w-5" />Image preview</div>}
        <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row"><button type="button" onClick={closeForm} className="h-11 border border-[#b48c32]/30 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em]">Cancel</button><button type="submit" disabled={saving} className="h-11 bg-[#c9a227] px-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] disabled:opacity-60">{saving ? 'Uploading and saving...' : editing ? 'Save Changes' : 'Add Hero Slide'}</button></div>
      </form>
    </div> : null}
  </div>;
}