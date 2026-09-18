import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, LineChart, Coins, Mail, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import PageBackdrop from '@/components/ui/PageBackdrop';
import { mediaFor } from '@/data/media';
import styles from './page.module.css';
import { createWhatsAppUrl, getContactSettings, getVentures } from '@/api';
import { useGsap } from '@/hooks/useGsap';

function createContactEntrance(gsap, ScrollTrigger) {
  gsap.fromTo('[data-contact-motion="pillar"]',
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-contact-motion="pillars"]', start: 'top 80%', once: true },
    },
  );

  gsap.fromTo('[data-contact-motion="form"]',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-contact-motion="form"]', start: 'top 82%', once: true },
    },
  );
}

export default function ContactPage() {
  const [formIntent, setFormIntent] = useState('');
  const [selectedVenture, setSelectedVenture] = useState('');
  const [contactSettings, setContactSettings] = useState({});
  const [status, setStatus] = useState('');
  const formRef = useRef(null);
  const pageRef = useRef(null);

  const [activeVentures, setActiveVentures] = useState([]);

  useGsap(pageRef, createContactEntrance);

  useEffect(() => {
    getVentures().then((ventures) => setActiveVentures(ventures.filter((venture) => venture.is_active !== false)));
    getContactSettings().then(setContactSettings);
    const params = new URLSearchParams(window.location.search);
    const venture = params.get('venture');
    const intent = params.get('intent');
    if (venture) {
      setSelectedVenture(venture);
      setFormIntent('invest');
    }
    if (['invest', 'work', 'grow'].includes(intent)) {
      setFormIntent(intent);
      window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);
    }
  }, []);

  const handlePillarClick = (intent) => {
    setFormIntent(intent);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  async function submitContact(event, method) {
    event.preventDefault();
    const form = event.currentTarget.form || event.currentTarget;
    // The WhatsApp button is type="button", so it skips the browser's required-field check
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    // Honeypot: real visitors never see or fill this field; bots usually do
    if (values.company_website) {
      setStatus('Thanks. Your enquiry has been sent.');
      return;
    }
    setStatus('Sending...');
    const message = [
      `New enquiry from ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Interest: ${values.intent}`,
      `Venture: ${values.venture || 'General enquiry'}`,
      `Message: ${values.message || values.investAbout || values.workSkills || values.growDesc || 'No additional message'}`,
    ].join('\n');

    if (method === 'whatsapp') {
      if (!contactSettings.primary_whatsapp) {
        setStatus('WhatsApp is not configured yet. Please use email for now.');
        return;
      }
      window.open(createWhatsAppUrl(contactSettings.primary_whatsapp, message), '_blank', 'noopener,noreferrer');
      setStatus('WhatsApp opened with your enquiry details.');
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    try {
      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, {
          to_email: contactSettings.primary_email,
          from_name: values.name,
          reply_to: values.email,
          phone: values.phone,
          intent: values.intent,
          venture: values.venture || 'General enquiry',
          message,
        }, publicKey);
        setStatus('Thanks. Your enquiry has been sent.');
      } else {
        window.location.href = `mailto:${contactSettings.primary_email}?subject=${encodeURIComponent(`Enquiry: ${values.venture || values.intent}`)}&body=${encodeURIComponent(message)}`;
        setStatus('Your email app is opening with the enquiry details.');
      }
    } catch (error) {
      setStatus(`Could not send the email: ${error.text || error.message}`);
    }
  }

  return (
    <div ref={pageRef}>
      <PageBackdrop fixed src={(mediaFor('Guideshaala') || {}).src} fallback="/images/plates/guideshaala.jpg" />
      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <SectionLabel>Get in touch</SectionLabel>
            <AnimatedText
              text="Tell me what you are looking for."
              as="h1"
              animation="words"
            />
            <motion.p
              className={styles.subheadline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Three ways to be part of what I am building. Pick the one that fits and fill in the form below.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============ THREE PILLARS ============ */}
      <section className={`${styles.pillarsSection} section`} data-contact-motion="pillars">
        <div className="container">
          <div className={styles.pillarsGrid}>
            
            {/* Pillar 1 */}
            <motion.div 
              className={`${styles.pillarCard} ${formIntent === 'invest' ? styles.pillarActive : ''}`}
              data-contact-motion="pillar"
              onClick={() => handlePillarClick('invest')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={styles.pillarIcon}><Coins size={26} strokeWidth={1.5} /></div>
              <h3 className={styles.pillarTitle}>Invest with me</h3>
              <p className={styles.pillarText}>I am building a small, focused set of ventures. If something in the portfolio interests you and you want to be part of it, let us talk.</p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div 
              className={`${styles.pillarCard} ${formIntent === 'work' ? styles.pillarActive : ''}`}
              data-contact-motion="pillar"
              onClick={() => handlePillarClick('work')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={styles.pillarIcon}><Users size={26} strokeWidth={1.5} /></div>
              <h3 className={styles.pillarTitle}>Work with me</h3>
              <p className={styles.pillarText}>Internships, part-time, and full-time roles across active ventures. Real work, real ownership, no corporate layers.</p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div 
              className={`${styles.pillarCard} ${formIntent === 'grow' ? styles.pillarActive : ''}`}
              data-contact-motion="pillar"
              onClick={() => handlePillarClick('grow')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className={styles.pillarIcon}><LineChart size={26} strokeWidth={1.5} /></div>
              <h3 className={styles.pillarTitle}>Grow with me</h3>
              <p className={styles.pillarText}>Need a growth partner with real resources and hands-on experience? I work with founders and businesses who are serious about growing.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============ SMART FORM ============ */}
      <section className={`${styles.formSection} section`} ref={formRef} data-contact-motion="form">
        <div className="container">
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Leave your details and I will get back to you.</h2>
            </div>

            <form className={styles.form} onSubmit={(e) => submitContact(e, 'email')}>
              <div className="visually-hidden" aria-hidden="true">
                <label htmlFor="company_website">Leave this field empty</label>
                <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              
              {/* Common Fields */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input name="name" type="text" id="name" required autoComplete="name" placeholder="Your name" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input name="email" type="email" id="email" required autoComplete="email" placeholder="you@company.com" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number *</label>
                  <input name="phone" type="tel" id="phone" required autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="intent">I want to: *</label>
                  <select 
                    id="intent" 
                    name="intent"
                    required 
                    value={formIntent} 
                    onChange={(e) => setFormIntent(e.target.value)}
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="invest">Invest</option>
                    <option value="work">Work</option>
                    <option value="grow">Grow</option>
                  </select>
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                
                {/* INVEST FIELDS */}
                {formIntent === 'invest' && (
                  <motion.div 
                    key="invest"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={styles.dynamicFields}
                  >
                    <div className={styles.formGroup}>
                      <label htmlFor="investVenture">Which venture caught your attention? (Optional)</label>
                      <input name="venture" type="text" id="investVenture" value={selectedVenture} onChange={(e) => setSelectedVenture(e.target.value)} placeholder="e.g. Impactshaala" />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="investInterest">I am interested in:</label>
                      <select id="investInterest" name="investInterest">
                        <option value="in-house">An In-House Venture</option>
                        <option value="collaborated">A Collaborated Service</option>
                        <option value="both">Both</option>
                        <option value="learn">I want to learn more first</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="investAbout">A little about yourself and why this interests you (Optional)</label>
                      <textarea name="investAbout" id="investAbout" rows={4} placeholder="Tell me about your background..." />
                    </div>
                    
                    <p className={styles.formNoteHighlight}>
                      I personally read every investment enquiry. I only move forward when there is a genuine mutual fit.
                    </p>
                  </motion.div>
                )}

                {/* WORK FIELDS */}
                {formIntent === 'work' && (
                  <motion.div 
                    key="work"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={styles.dynamicFields}
                  >
                    <div className={styles.formGroup}>
                      <label htmlFor="workRole">I am looking for:</label>
                      <select id="workRole" name="workRole">
                        <option value="internship">Internship</option>
                        <option value="part-time">Part-Time Role</option>
                        <option value="full-time">Full-Time Role</option>
                        <option value="open">Open to whatever fits</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Ventures I am most interested in:</label>
                      <div className={styles.checkboxGrid}>
                        {activeVentures.map((v) => (
                          <label key={v.id || v.name} className={styles.checkboxLabel}>
                            <input type="checkbox" name="interestedVentures" value={v.name} />
                            <span className={styles.checkboxText}>{v.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="workSkills">Skills or areas of experience *</label>
                      <textarea name="workSkills" id="workSkills" required rows={4} placeholder="Marketing, Operations, React, Design..." />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="workLink">LinkedIn profile or portfolio link (Optional)</label>
                      <input name="workLink" type="url" id="workLink" placeholder="https://linkedin.com/in/..." />
                    </div>
                  </motion.div>
                )}

                {/* GROW FIELDS */}
                {formIntent === 'grow' && (
                  <motion.div 
                    key="grow"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={styles.dynamicFields}
                  >
                    <div className={styles.formGroup}>
                      <label htmlFor="growBusiness">Business Name *</label>
                      <input name="growBusiness" type="text" id="growBusiness" required placeholder="Your Company Ltd" />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="growStage">Stage of Business:</label>
                      <select id="growStage" name="growStage">
                        <option value="starting">Just Starting Out</option>
                        <option value="early">Early Stage</option>
                        <option value="growing">Growing</option>
                        <option value="scaling">Looking to Scale</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>What you need help with:</label>
                      <div className={styles.checkboxGrid}>
                        {['Digital Presence', 'Marketing', 'Operations', 'Strategy', 'Business Development', 'Not Sure Yet'].map((need) => (
                          <label key={need} className={styles.checkboxLabel}>
                            <input type="checkbox" name="growthNeeds" value={need} />
                            <span className={styles.checkboxText}>{need}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="growDesc">Brief description of your business and what you are trying to solve *</label>
                      <textarea name="growDesc" id="growDesc" required rows={4} placeholder="We are a B2B SaaS struggling with..." />
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              <div className={styles.formActions}>
                <Button variant="primary" type="submit" icon={<Mail size={16} />}>
                  Reach out via email
                </Button>
                <Button variant="secondary" type="button" icon={<MessageCircle size={16} />} onClick={(event) => submitContact(event, 'whatsapp')}>
                  Reach out via WhatsApp
                </Button>
                {status && <p className={styles.formFooterNote} role="status">{status}</p>}
                <p className={styles.formFooterNote}>
                  I read every message personally. If there is a fit, I will reach out directly.
                </p>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
