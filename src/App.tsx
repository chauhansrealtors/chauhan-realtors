import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileBottomCTA } from './components/MobileBottomCTA';
import { EnquiryModal } from './components/EnquiryModal';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { WhyChauhan } from './pages/WhyChauhan';
import { Location } from './pages/Location';
import { Services } from './pages/Services';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Contact } from './pages/Contact';
import { Reviews } from './pages/Reviews';
import { Legal } from './pages/Legal';
import { NotFound } from './pages/NotFound';
import { FaqSection } from './components/FaqSection';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminResourcePage } from './pages/admin/AdminResourcePage';
import { Categories } from './pages/admin/Categories';
import { CmsDataProvider } from './cms/CmsDataContext';

const CALLBACK_POPUP_SHOWN_KEY = 'callbackPopupShown';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function Shell() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAdminRoute = pathname.startsWith('/admin');
  const [enquiryOpen, setEnquiryOpen] = React.useState(false);

  React.useEffect(() => {
    if (isAdminRoute) return;
    if (sessionStorage.getItem(CALLBACK_POPUP_SHOWN_KEY)) return;

    const delay = Math.floor(Math.random() * 3000) + 2000;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(CALLBACK_POPUP_SHOWN_KEY, 'true');
      setEnquiryOpen(true);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isAdminRoute]);

  const openEnquiry = () => {
    sessionStorage.setItem(CALLBACK_POPUP_SHOWN_KEY, 'true');
    setEnquiryOpen(true);
  };

  return <AdminAuthProvider>
    <CmsDataProvider>
    <div className="site-shell flex min-h-screen w-full flex-col bg-[#f8f8f6] text-[#111111]">
      
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-[#c9a227] focus:px-4 focus:py-2 focus:text-[0.7rem] focus:uppercase focus:tracking-[0.2em] focus:text-[#111111]">
        
        Skip to content
      </a>

      {isAdminRoute ? <main className="flex-1">
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminResourcePage resource="projects" />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/blogs" element={<AdminResourcePage resource="blogs" />} />
          </Route>
          <Route path="*" element={<AdminLogin />} />
        </Routes>
      </main> : <>
        <Navbar transparentOnTop={isHome} onEnquire={openEnquiry} />
        <main id="main" className="flex-1">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/properties" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/properties/:slug" element={<ProjectDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/why-chauhan" element={<WhyChauhan />} />
          <Route path="/location" element={<Location />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/privacy-policy" element={<Legal />} />
          <Route path="/terms-and-conditions" element={<Legal />} />
          <Route path="/disclaimer" element={<Legal />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/legal/:doc" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <FaqSection />
        <Footer />

        <WhatsAppButton />
        <MobileBottomCTA />
        <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
      </>}
    </div>
    </CmsDataProvider>
  </AdminAuthProvider>;

}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Shell />
    </BrowserRouter>);

}