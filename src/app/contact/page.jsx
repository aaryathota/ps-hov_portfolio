import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, ChartNoAxesCombined, HandCoins, Mail, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import AnimatedText from '@/components/ui/AnimatedText';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Arcs from '@/components/ui/Arcs';
import styles from './page.module.css';
import { createWhatsAppUrl, getContactSettings, getSiteSettings, getVentures } from '@/api';
import { defaultSiteSettings } from '@/data/siteContent';
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

const INTENTS = [
  { value: 'invest', label: 'Back A Venture' },
  { value: 'work', label: 'Join The Team' },
  { value: 'grow', label: 'Grow Your Business' },
];

const PILLARS = [
  {
    intent: 'invest', icon: HandCoins, title: 'Back A Venture',
    text: 'I am building a small, focused set of ventures. If something in the portfolio interests you and you want to be part of it, let us talk.',
  },
  {
    intent: 'work', icon: Users, title: 'Join The Team',
    text: 'Internships, part-time, and full-time roles across active ventures. Real work, real ownership, no corporate layers.',
  },
  {
    intent: 'grow', icon: ChartNoAxesCombined, title: 'Grow Your Business',
    text: 'Need a growth partner with real resources and hands-on experience? I work with founders and businesses who are serious about growing.',
  },
];

const INVEST_INTEREST = [
  { value: 'An In-House Venture', label: 'An In-House Venture' },
  { value: 'A Collaborated Service', label: 'A Collaborated Service' },
  { value: 'Both', label: 'Both' },
  { value: 'I want to learn more first', label: 'I want to learn more first' },
];
const WORK_ROLES = [
  { value: 'Internship', label: 'Internship' },
  { value: 'Part-Time Role', label: 'Part-Time Role' },
  { value: 'Full-Time Role', label: 'Full-Time Role' },
  { value: 'Open to whatever fits', label: 'Open to whatever fits' },
];
const GROW_STAGES = [
  { value: 'Just Starting Out', label: 'Just Starting Out' },
  { value: 'Early Stage', label: 'Early Stage' },
  { value: 'Growing', label: 'Growing' },
  { value: 'Looking to Scale', label: 'Looking to Scale' },
];

export default function ContactPage() {
  const [formIntent, setFormIntent] = useState('');
  const [selectedVenture, setSelectedVenture] = useState('');
  const [contactSettings, setContactSettings] = useState({});
  const [copy, setCopy] = useState(defaultSiteSettings.pages.contact);
  const [status, setStatus] = useState('');
  const [investInterest, setInvestInterest] = useState(INVEST_INTEREST[0].value);
  const [workRole, setWorkRole] = useState(WORK_ROLES[0].value);
  const [growStage, setGrowStage] = useState(GROW_STAGES[0].value);
  const formRef = useRef(null);
  const pageRef = useRef(null);

  const [activeVentures, setActiveVentures] = useState([]);

  useGsap(pageRef, createContactEntrance);

  useEffect(() => {
    getVentures().then((ventures) => setActiveVentures(ventures.filter((venture) => venture.is_active !== false)));
    getContactSettings().then(setContactSettings);
    getSiteSettings().then((settings) => setCopy(settings.pages.contact));
    const params = new URLSearchParams(window.location.search);
    const venture = params.get('venture');
    const intent = params.get('intent');
    if (venture) {
      setSelectedVenture(venture);
      setFormIntent('invest');
    }
    if (INTENTS.some((option) => option.value === intent)) setFormIntent(intent);
  }, []);

  const handlePillarClick = (intent) => {
    setFormIntent(intent);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  async function submitContact(event, method) {
    event.preventDefault();
    setStatus('Sending...');
    const form = event.currentTarget.form || event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    const workVentures = data.getAll('workVentures').join(', ');
    const needs = data.getAll('growNeeds').join(', ');
    const message = [
      `New enquiry from ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `I want to: ${INTENTS.find((option) => option.value === values.intent)?.label || values.intent}`,
      values.intent === 'invest' && `Venture: ${values.venture || 'General enquiry'}`,
      values.intent === 'invest' && `Interested in: ${values.investInterest}`,
      values.intent === 'work' && `Looking for: ${values.workRole}`,
      values.intent === 'work' && workVentures && `Ventures: ${workVentures}`,
      values.intent === 'work' && values.workLink && `Link: ${values.workLink}`,
      values.intent === 'grow' && `Business: ${values.growBusiness}`,
      values.intent === 'grow' && `Stage: ${values.growStage}`,
      values.intent === 'grow' && needs && `Needs help with: ${needs}`,
      `Message: ${values.message || values.investAbout || values.workSkills || values.growDesc || 'No additional message'}`,
    ].filter(Boolean).join('\n');

    if (method === 'whatsapp') {
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
          intent: INTENTS.find((option) => option.value === values.intent)?.label || values.intent,
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
      {/* ============ HERO ============ */}
      <section className={`${styles.hero} grain`}>
        <Arcs className={styles.heroArcs} />
        <div className="container">
          <div className={styles.heroContent}>
            <SectionLabel>{copy.heroLabel}</SectionLabel>
            <AnimatedText
              text={copy.heroTitle}
              as="h1"
              animation="words"
            />
            <motion.p
              className={styles.subheadline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {copy.heroText}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============ THREE PILLARS ============ */}
      <section className={`${styles.pillarsSection} section`} data-contact-motion="pillars">
        <div className="container">
          <div className={styles.pillarsGrid}>
            
            {PILLARS.map(({ intent, icon: Icon }, index) => {
              const pillarCopy = intent === 'invest'
                ? [copy.pillarInvestTitle, copy.pillarInvestText]
                : intent === 'work'
                  ? [copy.pillarWorkTitle, copy.pillarWorkText]
                  : [copy.pillarGrowTitle, copy.pillarGrowText];
              return (
              <motion.button
                key={intent}
                type="button"
                aria-pressed={formIntent === intent}
                className={`${styles.pillarCard} ${formIntent === intent ? styles.pillarActive : ''}`}
                data-contact-motion="pillar"
                onClick={() => handlePillarClick(intent)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <div className={styles.pillarIcon}><Icon size={26} strokeWidth={1.5} /></div>
                <h3 className={styles.pillarTitle}>{pillarCopy[0]}</h3>
                <p className={styles.pillarText}>{pillarCopy[1]}</p>
              </motion.button>
            ); })}
          </div>
        </div>
      </section>

      {/* ============ SMART FORM ============ */}
      <section className={`${styles.formSection} section`} ref={formRef} data-contact-motion="form">
        <div className="container">
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{copy.formTitle}</h2>
            </div>

            <form className={styles.form} onSubmit={(e) => submitContact(e, 'email')}>
              
              {/* Common Fields */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input name="name" type="text" id="name" required placeholder="John Doe" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input name="email" type="email" id="email" required placeholder="john@example.com" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number *</label>
                  <input name="phone" type="tel" id="phone" required placeholder="+91 98765 43210" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="intent">I want to: *</label>
<Select
                    id="intent"
                    name="intent"
                    required
                    value={formIntent}
                    onChange={setFormIntent}
                    options={INTENTS}
                  />
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
                      <Select id="investInterest" name="investInterest" value={investInterest} onChange={setInvestInterest} options={INVEST_INTEREST} />
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
                      <Select id="workRole" name="workRole" value={workRole} onChange={setWorkRole} options={WORK_ROLES} />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Ventures I am most interested in:</label>
                      <div className={styles.checkboxGrid}>
                        {activeVentures.map((v) => (
                          <label key={v.id || v.name} className={styles.checkboxLabel}>
                            <input type="checkbox" name="workVentures" value={v.name} />
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
                      <Select id="growStage" name="growStage" value={growStage} onChange={setGrowStage} options={GROW_STAGES} />
                    </div>

                    <div className={styles.formGroup}>
                      <label>What you need help with:</label>
                      <div className={styles.checkboxGrid}>
                        {['Digital Presence', 'Marketing', 'Operations', 'Strategy', 'Business Development', 'Not Sure Yet'].map((need) => (
                          <label key={need} className={styles.checkboxLabel}>
                            <input type="checkbox" name="growNeeds" value={need} />
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
