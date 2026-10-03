import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ImagePlus,
  LayoutDashboard,
  Mail,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  X,
  Home,
  Settings2,
  KeyRound,
  UserPlus,
} from "lucide-react";
import {
  deleteContent,
  getImageUrl,
  getVentures,
  getContactSettings,
  getSiteSettings,
  getSession,
  saveContent,
  saveContactSettings,
  saveSiteSettings,
  syncServiceCatalog,
  changePassword,
  createAdminUser,
  signIn,
  signOut,
  uploadImage,
} from "@/api";
import { defaultSiteSettings } from "@/data/siteContent";
import styles from "./adminpanel.module.css";
import tabStyles from "./adminTabs.module.css";

const emptyItem = {
  name: "",
  description: "",
  image_url: "",
  website_url: "",
  is_live: true,
  display_order: 0,
};

const DESCRIPTION_WORD_LIMIT = 100;

function limitWords(value) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length > DESCRIPTION_WORD_LIMIT
    ? words.slice(0, DESCRIPTION_WORD_LIMIT).join(" ")
    : value;
}

function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function SiteEditor({ settings, onSave, onUpload, busy, message }) {
  const [draft, setDraft] = useState(settings || defaultSiteSettings);
  const [contentTab, setContentTab] = useState('home');
  const hero = draft.hero || defaultSiteSettings.hero;
  const services = draft.services || [];

  useEffect(() => setDraft(settings || defaultSiteSettings), [settings]);

  const updateHero = (key, value) => setDraft((current) => ({
    ...current,
    hero: { ...current.hero, [key]: value },
  }));
  const updateService = (index, key, value) => setDraft((current) => ({
    ...current,
    services: current.services.map((service, serviceIndex) => serviceIndex === index ? { ...service, [key]: value } : service),
  }));
  const uploadHero = async (event) => {
    const imageUrl = await onUpload(event.target.files[0], 'site');
    if (imageUrl) updateHero('portraitUrl', imageUrl);
  };
  const uploadServiceImage = async (index, event) => {
    const imageUrl = await onUpload(event.target.files[0], 'site');
    if (imageUrl) updateService(index, 'image', imageUrl);
  };
  const updatePage = (page, key, value) => setDraft((current) => ({
    ...current,
    pages: { ...current.pages, [page]: { ...current.pages[page], [key]: value } },
  }));
  const updateHome = (key, value) => setDraft((current) => ({ ...current, home: { ...current.home, [key]: value } }));
  const updateHomeKpi = (index, key, value) => setDraft((current) => ({ ...current, home: { ...current.home, kpis: current.home.kpis.map((kpi, kpiIndex) => kpiIndex === index ? { ...kpi, [key]: value } : kpi) } }));
  const updateHomeWay = (index, key, value) => setDraft((current) => ({ ...current, home: { ...current.home, ways: current.home.ways.map((way, wayIndex) => wayIndex === index ? { ...way, [key]: value } : way) } }));
  const addService = () => setDraft((current) => ({
    ...current,
    services: [...current.services, { id: `service-${Date.now()}`, graphic: 'events', name: 'New service', tagline: '', description: '', ctaLabel: "Let's Talk", image: '', is_active: true }],
  }));
  const removeService = (index) => setDraft((current) => ({
    ...current,
    services: current.services.filter((_, serviceIndex) => serviceIndex !== index),
  }));

  return (
    <section className={styles.siteEditor}>
      <div className={styles.editorIntro}>
        <div><p className={styles.kicker}>PUBLIC SITE CONTENT</p><h2>Edit your website</h2></div>
        <div><p>Choose a page, make your changes, then publish. Every field here maps to the live website.</p><a className={tabStyles.liveLink} href="/" target="_blank" rel="noreferrer">View live site <ArrowUpRight size={14} /></a></div>
      </div>
      <div className={tabStyles.tabs} role="tablist" aria-label="Website pages">
        {[['home', 'Home'], ['about', 'About'], ['services', 'Services'], ['ventures', 'Ventures'], ['contact', 'Contact']].map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={contentTab === key} className={contentTab === key ? tabStyles.tabActive : tabStyles.tab} onClick={() => setContentTab(key)}>{label}</button>
        ))}
      </div>
      <form onSubmit={(event) => { event.preventDefault(); onSave(draft); }} className={styles.form}>
        {contentTab === 'home' && <>
          <div className={styles.subheading}><Settings2 size={17} /><span>Homepage hero</span></div>
          <div className={styles.formRow}>
            <label>Eyebrow <input value={hero.tagline || ''} onChange={(event) => updateHero('tagline', event.target.value)} /></label>
            <label>Main title <input value={hero.title || ''} onChange={(event) => updateHero('title', event.target.value)} /></label>
          </div>
          <div className={styles.formRow}>
            <label>Title second line <input value={hero.titleLine || ''} onChange={(event) => updateHero('titleLine', event.target.value)} /></label>
            <label>Serif accent <input value={hero.titleAccent || ''} onChange={(event) => updateHero('titleAccent', event.target.value)} /></label>
          </div>
          <label>Hero side heading <input value={hero.sideTitle || ''} onChange={(event) => updateHero('sideTitle', event.target.value)} /></label>
          <label>Hero side copy <textarea rows="3" value={hero.sideText || ''} onChange={(event) => updateHero('sideText', event.target.value)} /></label>
          <label className={styles.uploadBox}><ImagePlus size={19} /><span><strong>Upload founder image</strong><small>Stored in website-images / site</small></span><input type="file" accept="image/*" onChange={uploadHero} disabled={busy} /></label>
          {hero.portraitUrl && <img className={styles.preview} src={getImageUrl(hero.portraitUrl)} alt="Founder preview" />}
          <div className={styles.subheading}><Settings2 size={17} /><span>Homepage sections</span></div>
          <div className={styles.formRow}>
            <label>Portfolio label <input value={draft.home?.buildingLabel || ''} onChange={(event) => updateHome('buildingLabel', event.target.value)} /></label>
            <label>Portfolio title <input value={draft.home?.buildingTitle || ''} onChange={(event) => updateHome('buildingTitle', event.target.value)} /></label>
          </div>
          <label>Portfolio description <textarea rows="3" value={draft.home?.buildingText || ''} onChange={(event) => updateHome('buildingText', event.target.value)} /></label>
          <div className={styles.formRow}>
            <label>Ways section label <input value={draft.home?.waysLabel || ''} onChange={(event) => updateHome('waysLabel', event.target.value)} /></label>
            <label>Ways section title <input value={draft.home?.waysTitle || ''} onChange={(event) => updateHome('waysTitle', event.target.value)} /></label>
          </div>
          <div className={styles.copyGroup}><strong>At-a-glance bar</strong>{(draft.home?.kpis || []).map((kpi, index) => <div className={styles.formRow} key={index}><label>Number {index + 1}<input type="number" value={kpi.value} onChange={(event) => updateHomeKpi(index, 'value', event.target.value)} /></label><label>Label {index + 1}<input value={kpi.label || ''} onChange={(event) => updateHomeKpi(index, 'label', event.target.value)} /></label></div>)}</div>
          <div className={styles.copyGroup}><strong>Three ways cards</strong>{(draft.home?.ways || []).map((way, index) => <div className={styles.serviceEditorCard} key={index}><div className={styles.formRow}><label>Kicker <input value={way.kicker || ''} onChange={(event) => updateHomeWay(index, 'kicker', event.target.value)} /></label><label>Heading <input value={way.heading || ''} onChange={(event) => updateHomeWay(index, 'heading', event.target.value)} /></label></div><label>Card copy <textarea rows="3" value={way.body || ''} onChange={(event) => updateHomeWay(index, 'body', event.target.value)} /></label></div>)}</div>
          <div className={styles.formRow}>
            <label>Founder section label <input value={draft.home?.founderLabel || ''} onChange={(event) => updateHome('founderLabel', event.target.value)} /></label>
            <label>Founder title <input value={draft.home?.founderTitle || ''} onChange={(event) => updateHome('founderTitle', event.target.value)} /></label>
          </div>
          <label>Founder copy <textarea rows="3" value={draft.home?.founderBody || ''} onChange={(event) => updateHome('founderBody', event.target.value)} /></label>
          <label>Founder quote <textarea rows="3" value={draft.home?.quote || ''} onChange={(event) => updateHome('quote', event.target.value)} /></label>
          <label>Quote attribution <input value={draft.home?.quoteFooter || ''} onChange={(event) => updateHome('quoteFooter', event.target.value)} /></label>
          <label>Closing section title <input value={draft.home?.closingTitle || ''} onChange={(event) => updateHome('closingTitle', event.target.value)} /></label>
          <label>Closing section copy <textarea rows="3" value={draft.home?.closingText || ''} onChange={(event) => updateHome('closingText', event.target.value)} /></label>
        </>}

        <div className={styles.subheading}><Settings2 size={17} /><span>Page copy</span></div>
        {[
          ['about', 'About page', ['heroLabel', 'heroTitle', 'heroSubtitle', 'storyLabel', 'storyTitle', 'storyOne', 'storyTwo', 'principlesLabel', 'principlesTitle', 'principleOneTitle', 'principleOneText', 'principleTwoTitle', 'principleTwoText', 'principleThreeTitle', 'principleThreeText']],
          ['services', 'Services page', ['label', 'title', 'intro', 'tailTitle', 'tailText', 'tailButton']],
          ['ventures', 'Ventures page', ['introLabel', 'introTitle', 'introText', 'tailTitle', 'tailText']],
          ['contact', 'Contact page', ['heroLabel', 'heroTitle', 'heroText', 'pillarInvestTitle', 'pillarInvestText', 'pillarWorkTitle', 'pillarWorkText', 'pillarGrowTitle', 'pillarGrowText', 'formTitle']],
        ].filter(([page]) => contentTab === page).map(([page, title, fields]) => (
          <fieldset className={styles.copyGroup} key={page}>
            <legend>{title}</legend>
            {fields.map((key) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
              const multiline = key.toLowerCase().includes('text') || key.toLowerCase().includes('intro') || key.toLowerCase().includes('one') || key.toLowerCase().includes('two');
              return <label key={key}>{label}{multiline ? <textarea rows="3" value={draft.pages?.[page]?.[key] || ''} onChange={(event) => updatePage(page, key, event.target.value)} /> : <input value={draft.pages?.[page]?.[key] || ''} onChange={(event) => updatePage(page, key, event.target.value)} />}</label>;
            })}
          </fieldset>
        ))}

        {contentTab === 'services' && <><div className={styles.serviceHeader}>
          <div className={styles.subheading}><Home size={17} /><span>Service cards <small>{services.length} total</small></span></div>
          <button type="button" className={styles.addButton} onClick={addService}><Plus size={17} /> Add card</button>
        </div></>}
        {contentTab === 'services' && <div className={styles.serviceEditorList}>
          {services.map((service, index) => (
            <article className={styles.serviceEditorCard} key={service.id || index}>
              <div className={styles.serviceEditorTitle}><span>{String(index + 1).padStart(2, '0')}</span><strong>{service.name || 'Untitled service'}</strong><button type="button" className={styles.iconButton} onClick={() => removeService(index)} title="Delete service"><Trash2 size={16} /></button></div>
              <div className={styles.formRow}>
                <label>Name <input value={service.name || service.title || ''} onChange={(event) => updateService(index, 'name', event.target.value)} required /></label>
                <label>Graphic key <input value={service.graphic || ''} onChange={(event) => updateService(index, 'graphic', event.target.value)} placeholder="events, visa, saas" /></label>
              </div>
              <label>Tagline <input value={service.tagline || ''} onChange={(event) => updateService(index, 'tagline', event.target.value)} /></label>
              <label>Description <textarea rows="4" value={service.description || ''} onChange={(event) => updateService(index, 'description', limitWords(event.target.value))} /></label>
              <div className={styles.formRow}>
                <label>Button label <input value={service.ctaLabel || ''} onChange={(event) => updateService(index, 'ctaLabel', event.target.value)} /></label>
                <label className={styles.uploadBox}><ImagePlus size={19} /><span><strong>Upload card image</strong><small>Optional service artwork</small></span><input type="file" accept="image/*" onChange={(event) => uploadServiceImage(index, event)} disabled={busy} /></label>
              </div>
              <label className={styles.switchLabel}>Visible on site <input className={styles.switch} type="checkbox" checked={service.is_active !== false} onChange={(event) => updateService(index, 'is_active', event.target.checked)} /></label>
            </article>
          ))}
        </div>}
        <div className={styles.formActions}><button className={styles.primaryButton} disabled={busy}>{busy ? 'Saving...' : 'Publish site changes'} <ArrowUpRight size={17} /></button></div>
        {message && <p className={styles.message} role="status">{message}</p>}
      </form>
    </section>
  );
}

function AccountEditor({ user, busy, message, onPasswordChange, onInvite }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteConfirmPassword, setInviteConfirmPassword] = useState('');

  function submitPassword(event) {
    event.preventDefault();
    if (password.length < 6) return onPasswordChange(null, 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return onPasswordChange(null, 'Passwords do not match.');
    onPasswordChange(password);
  }

  function submitInvite(event) {
    event.preventDefault();
    if (invitePassword.length < 6) return onInvite(null, null, 'New user password must be at least 6 characters.');
    if (invitePassword !== inviteConfirmPassword) return onInvite(null, null, 'New user passwords do not match.');
    onInvite(inviteEmail, invitePassword);
    setInviteEmail('');
    setInvitePassword('');
    setInviteConfirmPassword('');
  }

  return (
    <section className={styles.siteEditor}>
      <div className={styles.editorIntro}>
        <div><p className={styles.kicker}>ADMIN ACCESS</p><h2>Account & users</h2></div>
        <p>Manage your own password and invite trusted people to help maintain the site.</p>
      </div>
      <div className={styles.contentGrid}>
        <form onSubmit={submitPassword} className={`${styles.editor} ${styles.form}`}>
          <div className={styles.subheading}><KeyRound size={17} /><span>Change my password</span></div>
          <p className={styles.accountMeta}>{user.email}</p>
          <label>New password <input type="password" minLength="6" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <label>Confirm password <input type="password" minLength="6" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
          <button className={styles.primaryButton} disabled={busy}>{busy ? 'Updating...' : 'Update password'} <ArrowUpRight size={17} /></button>
        </form>
        <form onSubmit={submitInvite} className={`${styles.editor} ${styles.form}`}>
          <div className={styles.subheading}><UserPlus size={17} /><span>Create another admin</span></div>
          <p className={styles.accountMeta}>Create a confirmed admin account with an email and password now.</p>
          <label>Admin email <input type="email" required value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="team@example.com" /></label>
          <label>New user password <input type="password" minLength="6" required value={invitePassword} onChange={(event) => setInvitePassword(event.target.value)} /></label>
          <label>Confirm password <input type="password" minLength="6" required value={inviteConfirmPassword} onChange={(event) => setInviteConfirmPassword(event.target.value)} /></label>
          <button className={styles.secondaryButton} disabled={busy}>{busy ? 'Creating...' : 'Create admin user'} <UserPlus size={16} /></button>
        </form>
      </div>
      {message && <p className={styles.message} role="status">{message}</p>}
    </section>
  );
}

export default function AdminPanel() {
  const [type, setType] = useState("site");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [contactSettings, setContactSettings] = useState(null);
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);

  useEffect(() => {
    getSession()?.then(({ data }) => setUser(data.session?.user || null));
  }, []);
  useEffect(() => {
    if (user && type === "ventures") loadItems();
    if (user && type === "contact") getContactSettings().then(setContactSettings);
    if (user && type === "site") getSiteSettings().then(setSiteSettings);
  }, [type, user]);
  async function loadItems() {
    setItems(await getVentures());
  }

  function editItem(item) {
    setForm({ ...emptyItem, ...item, is_live: item.is_active !== false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyItem);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await saveContent(type, { ...form, description: limitWords(form.description) });
      resetForm();
      await loadItems();
      setMessage("Changes saved and published.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await saveContactSettings(contactSettings);
      setMessage("Contact details saved and published.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSiteImage(file, type) {
    if (!file) return '';
    setBusy(true);
    setMessage("Uploading image...");
    try {
      const imageUrl = await uploadImage(file, type);
      setMessage("Image uploaded. Publish to make it live.");
      return imageUrl;
    } catch (error) {
      setMessage(error.message);
      return '';
    } finally {
      setBusy(false);
    }
  }

  async function handleSiteSubmit(settings) {
    setBusy(true);
    setMessage("");
    try {
      setSiteSettings(await saveSiteSettings(settings));
      await syncServiceCatalog(settings.services || []);
      setMessage("Homepage and all service cards published to the site and database.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordChange(password, validationMessage) {
    if (validationMessage) { setMessage(validationMessage); return; }
    setBusy(true);
    setMessage("");
    try {
      await changePassword(password);
      setMessage("Password updated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleInvite(email, password, validationMessage) {
    if (validationMessage) { setMessage(validationMessage); return; }
    setBusy(true);
    setMessage("");
    try {
      await createAdminUser(email, password);
      setMessage(`Admin user created for ${email}.`);
    } catch (error) {
      setMessage(error.message || 'Could not send invitation.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      await deleteContent(type, id);
      await loadItems();
      setMessage("Item deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    setBusy(true);
    setMessage("Uploading image...");
    try {
      const image_url = await uploadImage(file, type);
      setForm((current) => ({ ...current, image_url }));
      setMessage("Image uploaded. Save to publish it.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  const descriptionWords = countWords(form.description);

  async function handleAuth(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = await signIn(credentials.email, credentials.password);
      if (result.error) throw result.error;
      setUser(result.data.user);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  if (!user)
    return (
      <main className={styles.authPage}>
        <div className={styles.authPanel}>
          <p className={styles.kicker}>HOUSE OF VENTURES</p>
          <h1>Welcome back.</h1>
          <p className={styles.authIntro}>Sign in with your registered Supabase admin account.</p>
          <form onSubmit={handleAuth} className={styles.authForm}>
            <label>
              Email address
              <input
                required
                type="email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials({ ...credentials, email: event.target.value })
                }
              />
            </label>
            <label>
              Password
              <input
                required
                minLength="6"
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  })
                }
              />
            </label>
            <button className={styles.primaryButton} disabled={busy}>
              {busy ? "Please wait..." : "Sign in"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </form>
          {message && (
            <p className={styles.message} role="alert">
              {message}
            </p>
          )}
        </div>
        <div className={styles.authAside}>
          <span>01 / CONTENT WORKSPACE</span>
          <h2>Make the work visible.</h2>
          <p>
            One quiet place to shape the ventures, services, and stories that
            make up the ecosystem.
          </p>
        </div>
      </main>
    );

  return (
    <main className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandMark}></span>
          <span>
            SONKAR
            <br />
            <small>CONTENT STUDIO</small>
          </span>
        </div>
        <nav>
          <p className={styles.navLabel}>Content control</p>
          <button
            className={type === "site" ? styles.navActive : styles.navItem}
            onClick={() => { setType("site"); resetForm(); }}
          >
            <Home size={17} /> Site content <span>{type === "site" ? "•" : ""}</span>
          </button>
          <button
            className={type === "ventures" ? styles.navActive : styles.navItem}
            onClick={() => {
              setType("ventures");
              resetForm();
            }}
          >
            <LayoutDashboard size={17} /> Ventures{" "}
            <span>{type === "ventures" ? "•" : ""}</span>
          </button>
          <button
            className={type === "contact" ? styles.navActive : styles.navItem}
            onClick={() => {
              setType("contact");
              resetForm();
            }}
          >
            <Mail size={17} /> Contact details{" "}
            <span>{type === "contact" ? "•" : ""}</span>
          </button>
          <button
            className={type === "account" ? styles.navActive : styles.navItem}
            onClick={() => { setType("account"); resetForm(); }}
          >
            <KeyRound size={17} /> Account & users <span>{type === "account" ? "•" : ""}</span>
          </button>
        </nav>
        <div className={styles.sidebarFoot}>
          <span className={styles.userDot} />
          {user.email}
          <button
            title="Sign out"
            onClick={() => signOut().then(() => setUser(null))}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.kicker}>
              CONTENT WORKSPACE / {type.toUpperCase()}
            </p>
            <h1>{type === "ventures" ? "Ventures" : type === "site" ? "Site content" : type === "account" ? "Account & users" : "Contact details"}</h1>
          </div>
          <span className={styles.liveBadge}>
            <span /> Live database
          </span>
        </header>
        <div className={styles.contentGrid}>
          {type === "account" ? (
            <AccountEditor user={user} busy={busy} message={message} onPasswordChange={handlePasswordChange} onInvite={handleInvite} />
          ) : type === "site" ? (
            <SiteEditor settings={siteSettings} onSave={handleSiteSubmit} onUpload={handleSiteImage} busy={busy} message={message} />
          ) : type === "contact" ? (
            <section className={styles.editor}>
              <div className={styles.sectionHeading}>
                <div><p className={styles.kicker}>PUBLIC FOOTER AND FORM RECIPIENT</p><h2>Contact details</h2></div>
              </div>
              {contactSettings && (
                <form onSubmit={handleContactSubmit} className={styles.form}>
                  {[
                    ["primary_email", "Admin email", "hello@example.com", "email"],
                    ["primary_whatsapp", "WhatsApp number", "+91 98765 43210", "tel"],
                    ["linkedin_url", "LinkedIn URL", "https://linkedin.com/in/...", "url"],
                    ["instagram_url", "Instagram URL", "https://instagram.com/...", "url"],
                    ["twitter_url", "Twitter / X URL", "https://twitter.com/...", "url"],
                    ["location", "Location", "Bangalore, Karnataka, India", "text"],
                  ].map(([key, label, placeholder, inputType]) => (
                    <label key={key}>
                      {label}
                      <input type={inputType} value={contactSettings[key] || ""} placeholder={placeholder} onChange={(event) => setContactSettings({ ...contactSettings, [key]: event.target.value })} />
                    </label>
                  ))}
                  <div className={styles.formActions}>
                    <button className={styles.primaryButton} disabled={busy}>{busy ? "Saving..." : "Save contact details"} <ArrowUpRight size={17} /></button>
                  </div>
                  {message && <p className={styles.message} role="status">{message}</p>}
                </form>
              )}
            </section>
          ) : (
          <section className={styles.editor}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.kicker}>
                  {form.id ? "EDITING ITEM" : "NEW ITEM"}
                </p>
                <h2>
                  {form.id
                    ? form.name
                    : `Add a ${type === "ventures" ? "venture" : "service"}`}
                </h2>
              </div>
              {form.id && (
                <button
                  className={styles.iconButton}
                  onClick={resetForm}
                  title="Close editor"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Impactshaala"
                />
              </label>
              <label>
                Description
                <textarea
                  required
                  rows="5"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: limitWords(event.target.value) })}
                  placeholder="Describe this item..."
                />
                <small>{descriptionWords}/{DESCRIPTION_WORD_LIMIT} words</small>
              </label>
              <label>
                Image
                <input
                  value={form.image_url || ""}
                  onChange={(event) =>
                    setForm({ ...form, image_url: event.target.value })
                  }
                  placeholder="Paste an image URL or upload below"
                />
              </label>
              <label className={styles.uploadBox}>
                <ImagePlus size={21} />
                <span>
                  <strong>Upload image</strong>
                  <small>Stored in website-images / {type}</small>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  disabled={busy}
                />
              </label>
              {form.image_url && (
                <img
                  className={styles.preview}
                  src={getImageUrl(form.image_url)}
                  alt="Preview"
                />
              )}
              {type === "ventures" && (
                <label>
                  Website URL
                  <input
                    value={form.website_url || ""}
                    onChange={(event) =>
                      setForm({ ...form, website_url: event.target.value })
                    }
                    placeholder="https://..."
                  />
                </label>
              )}
              <div className={styles.formRow}>
                <label>
                  Display order
                  <input
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(event) =>
                      setForm({ ...form, display_order: event.target.value })
                    }
                  />
                </label>
                <label className={styles.switchLabel}>
                  Visible on site
                  <input
                    className={styles.switch}
                    type="checkbox"
                    checked={form.is_live !== false}
                    onChange={(event) =>
                      setForm({ ...form, is_live: event.target.checked })
                    }
                  />
                </label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.primaryButton} disabled={busy}>
                  {busy
                    ? "Saving..."
                    : form.id
                      ? "Update item"
                      : "Publish item"}{" "}
                  <ArrowUpRight size={17} />
                </button>
                {form.id && (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
              {message && (
                <p className={styles.message} role="status">
                  {message}
                </p>
              )}
            </form>
          </section>
          )}
          {type === "ventures" && <section className={styles.library}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.kicker}>DATABASE RECORDS</p>
                <h2>
                  {items.length} {type}
                </h2>
              </div>
              <button className={styles.addButton} onClick={resetForm}>
                <Plus size={17} /> New
              </button>
            </div>
            <div className={styles.itemList}>
              {items.map((item) => (
                <article className={styles.item} key={item.id}>
                  <div className={styles.itemImage}>
                    {item.image_url ? (
                      <img src={getImageUrl(item.image_url)} alt="" />
                    ) : (
                      <ImagePlus size={18} />
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemTitle}>
                      <h3>{item.name}</h3>
                      <span
                        className={
                          item.is_active
                            ? styles.statusLive
                            : styles.statusHidden
                        }
                      >
                        {item.is_active ? "Live" : "Hidden"}
                      </span>
                    </div>
                    <p>{item.description}</p>
                    <small>Order {item.display_order ?? 0}</small>
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={() => editItem(item)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>}
        </div>
      </section>
    </main>
  );
}
