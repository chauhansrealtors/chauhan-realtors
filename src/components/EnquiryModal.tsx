import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { EnquiryForm } from './EnquiryForm';

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
}

export function EnquiryModal({ open, onClose }: EnquiryModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9000] flex items-center justify-center overflow-y-auto bg-[#111111]/70 p-3 backdrop-blur-sm sm:p-6"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}>
          <motion.div
            className="relative my-auto w-full max-w-5xl overflow-y-auto border border-[#e8e6e0] bg-white shadow-[0_25px_80px_rgba(17,17,17,0.12)] sm:max-h-[90vh]"
            initial={reduce ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry form"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center border border-[#e8e6e0] text-[#111111] transition-colors hover:bg-[#c9a227] hover:text-[#111111]">
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
              <div className="hidden border-r border-[#e8e6e0] bg-[#f8f8f6] p-10 lg:block">
                <p className="eyebrow text-[#c9a227]">Chauhan Realtors</p>
                <h2 id="enquiry-modal-title" className="mt-5 max-w-sm font-display text-4xl font-light leading-tight text-[#111111]">
                  Find Your Next Address
                </h2>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#666666]">
                  Tell us what you&apos;re looking for and our property consultant will get in touch with you.
                </p>
                <img src="/image-1.png" alt="Dharmendra Pratap Singh, Founder" className="mt-10 aspect-[4/5] w-full object-cover object-top" />
              </div>
              <div className="p-5 pt-16 sm:p-8 sm:pt-16 lg:p-10">
                <div className="lg:hidden">
                  <p className="eyebrow text-[#c9a227]">Chauhan Realtors</p>
                  <h2 className="mt-4 font-display text-3xl font-light text-[#111111]">Find Your Next Address</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#666666]">Tell us what you&apos;re looking for and our property consultant will get in touch with you.</p>
                </div>
                <div className="mt-6 lg:mt-0">
                  <EnquiryForm source="enquiry-modal" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}