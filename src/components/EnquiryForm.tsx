import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react';
import { whatsappLink } from '../data/brand';
import { configurationOptions, budgetOptions, callbackOptions } from '../data/site';
import { LUX } from './Reveal';
import { createEnquiry } from '../services/api';

interface EnquiryFormProps {
  source?: string;
  id?: string;
}

interface Values {
  fullName: string;
  phone: string;
  email: string;
  configuration: string;
  budget: string;
  callbackTime: string;
  message: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const emptyValues = (): Values => ({
  fullName: '',
  phone: '',
  email: '',
  configuration: '',
  budget: '',
  callbackTime: '',
  message: ''
});

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.fullName.trim().length < 2) errors.fullName = 'Please enter your full name.';
  const digits = values.phone.replace(/\D/g, '');
  if (!/^(?:91)?[6-9]\d{9}$/.test(digits)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  return errors;
}

const fieldClass =
'h-12 w-full border border-[#e8e6e0] bg-white px-4 text-sm text-[#111111] placeholder:text-[#666666] transition-colors duration-150 ease-lux focus:border-[#c9a227] focus:outline-none';
const labelClass = 'mb-2 block text-[0.62rem] uppercase tracking-[0.2em] text-[#666666]';

function FieldError({ id, message }: {id: string;message?: string;}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-gold-bright">
      <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>);

}

export function EnquiryForm({ source = 'website', id }: EnquiryFormProps) {
  const [values, setValues] = useState<Values>(emptyValues());
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'opening' | 'done'>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const reduce = useReducedMotion();
  const update =
  (key: keyof Values) =>
  (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const keys = Object.keys(nextErrors);
    if (keys.length > 0) {
      document.getElementById(`enquiry-${keys[0]}`)?.focus();
      return;
    }
    setStatus('opening');
    setSubmissionError('');
    const whatsappMessage = [
      'Hello Chauhan Realtors,',
      '',
      'I would like to request a callback regarding a property.',
      '',
      `Name: ${values.fullName.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Email: ${values.email.trim() || 'Not provided'}`,
      `Preferred Configuration: ${values.configuration || 'Not specified'}`,
      `Budget: ${values.budget || 'Not specified'}`,
      `Preferred Callback Time: ${values.callbackTime || 'Not specified'}`,
      '',
      'Message:',
      values.message.trim() || 'No additional message provided.',
      '',
      'Thank you.'
    ].join('\n');

    try {
      await createEnquiry({
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        configuration: values.configuration,
        budget: values.budget,
        callbackTime: values.callbackTime,
        message: values.message.trim(),
        source
      });
      window.open(whatsappLink(whatsappMessage), '_blank', 'noopener,noreferrer');
      setStatus('done');
    } catch {
      setSubmissionError('Unable to save your enquiry. Please try again.');
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <motion.div
        id={id}
        role="status"
        initial={reduce ? undefined : { opacity: 0, y: 12 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: LUX }}
        className="border border-[#e8e6e0] bg-[#f8f8f6] p-8 text-center sm:p-12">
        
        <span className="mx-auto flex h-14 w-14 items-center justify-center border border-[#c9a227] text-[#c9a227]">
          <CheckIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-2xl font-light text-[#111111] sm:text-3xl">
          Opening WhatsApp
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#666666]">
          Your callback details are ready in a WhatsApp message.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(emptyValues());
            setStatus('idle');
          }}
          className="mt-8 border border-[#c9a227] px-6 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-[#c9a227] transition-colors duration-150 ease-lux hover:bg-[#c9a227] hover:text-[#111111]">
          
          Submit another enquiry
        </button>
      </motion.div>);

  }

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="border border-[#e8e6e0] bg-white p-6 sm:p-8">
      <h3 className="font-display text-2xl font-light text-[#111111]">Request a Callback</h3>
      <p className="mt-2 text-sm text-[#666666]">
        Share a few details and we will come back with a shortlist, current availability and
        verified project information.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="enquiry-fullName">
            Full Name <span className="text-gold">*</span>
          </label>
          <input
            id="enquiry-fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={update('fullName')}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'error-fullName' : undefined}
            className={fieldClass}
            placeholder="Your name" />
          
          <FieldError id="error-fullName" message={errors.fullName} />
        </div>

        <div>
          <label className={labelClass} htmlFor="enquiry-phone">
            Phone Number <span className="text-gold">*</span>
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={update('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'error-phone' : undefined}
            className={fieldClass}
            placeholder="+91" />
          
          <FieldError id="error-phone" message={errors.phone} />
        </div>

        <div>
          <label className={labelClass} htmlFor="enquiry-email">
            Email
          </label>
          <input
            id="enquiry-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'error-email' : undefined}
            className={fieldClass}
            placeholder="Your email address" />
          
          <FieldError id="error-email" message={errors.email} />
        </div>

        <div>
          <label className={labelClass} htmlFor="enquiry-configuration">
            Preferred Configuration
          </label>
          <select
            id="enquiry-configuration"
            value={values.configuration}
            onChange={update('configuration')}
            className={fieldClass}>
            
            <option value="">Optional</option>
            {configurationOptions.map((option) =>
            <option key={option} value={option}>
                {option}
              </option>
            )}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="enquiry-budget">
            Budget
          </label>
          <select id="enquiry-budget" value={values.budget} onChange={update('budget')} className={fieldClass}>
            <option value="">Optional</option>
            {budgetOptions.map((option) =>
            <option key={option} value={option}>
                {option}
              </option>
            )}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="enquiry-callbackTime">
            Preferred Callback Time
          </label>
          <select
            id="enquiry-callbackTime"
            value={values.callbackTime}
            onChange={update('callbackTime')}
            className={fieldClass}>
            
            <option value="">Optional</option>
            {callbackOptions.map((option) =>
            <option key={option} value={option}>
                {option}
              </option>
            )}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="enquiry-message">
            Message
          </label>
          <textarea
            id="enquiry-message"
            rows={4}
            value={values.message}
            onChange={update('message')}
            className="w-full border border-[#e8e6e0] bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-[#666666] transition-colors duration-150 ease-lux focus:border-[#c9a227] focus:outline-none"
            placeholder="Anything specific we should know — timeline, floor preference, family requirement." />
          
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'opening'}
        className="mt-8 flex w-full items-center justify-center gap-2 bg-[#c9a227] text-[0.7rem] uppercase tracking-[0.2em] text-[#111111] transition-colors duration-150 ease-lux hover:bg-[#d4af37] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10"
        style={{ height: '3.25rem' }}>
        
        {status === 'opening' ?
        <>
            <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
        Opening WhatsApp
          </> :

        'Request a Callback'
        }
      </button>

      {submissionError ? <p role="alert" className="mt-3 text-sm text-red-700">{submissionError}</p> : null}

      <p className="mt-4 text-[0.68rem] leading-relaxed text-[#666666]">
        By submitting this form you agree to be contacted about your property enquiry. We do not
        share your details with third parties.
      </p>
    </form>);

}