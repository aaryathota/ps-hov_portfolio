import { useEffect, useState } from 'react';
import { ArrowUpRight, Mail, MessageCircle, X } from 'lucide-react';
import { createWhatsAppUrl, getContactSettings } from '@/api';
import styles from './ContactModal.module.css';

const INTENTS = ['Back a venture', 'Join the team', 'Grow my business'];

export default function ContactModal({ open, subject = '', onClose }) {
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', intent: INTENTS[0], message: '' });

  useEffect(() => {
    if (!open) return undefined;
    getContactSettings().then(setSettings);
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const message = [`New enquiry from ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone}`, `I want to: ${form.intent}`, subject && `About: ${subject}`, `Message: ${form.message || 'No additional message'}`].filter(Boolean).join('\n');
  const closeOnBackdrop = (event) => { if (event.target === event.currentTarget) onClose(); };

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={closeOnBackdrop}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close enquiry form"><X size={20} /></button>
        <p className={styles.kicker}>LET'S TALK</p>
        <h2 id="contact-modal-title">Tell me what you are looking for.</h2>
        {subject && <p className={styles.subject}>About: {subject}</p>}
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.grid}>
            <label>Full name *<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="John Doe" /></label>
            <label>Email address *<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="john@example.com" /></label>
            <label>Phone number *<input required type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+91 98765 43210" /></label>
            <label>I want to *<select value={form.intent} onChange={(event) => update('intent', event.target.value)}>{INTENTS.map((intent) => <option key={intent}>{intent}</option>)}</select></label>
          </div>
          <label>Message<textarea rows="3" value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell me a little more..." /></label>
          <div className={styles.actions}>
            <a className={styles.email} href={`mailto:${settings.primary_email || ''}?subject=${encodeURIComponent(subject || 'New enquiry')}&body=${encodeURIComponent(message)}`}><Mail size={17} /> Reach out via email</a>
            <a className={styles.whatsapp} href={createWhatsAppUrl(settings.primary_whatsapp, message)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Reach out via WhatsApp</a>
          </div>
          <p className={styles.note}>Your message will go to the contact details configured in the admin panel.</p>
        </form>
      </section>
    </div>
  );
}