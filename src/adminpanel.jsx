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
} from "lucide-react";
import {
  deleteContent,
  getImageUrl,
  getServices,
  getVentures,
  getContactSettings,
  getSession,
  saveContent,
  saveContactSettings,
  signIn,
  signOut,
  uploadImage,
} from "@/api";
import styles from "./adminpanel.module.css";

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

export default function AdminPanel() {
  const [type, setType] = useState("ventures");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [contactSettings, setContactSettings] = useState(null);

  useEffect(() => {
    getSession()?.then(({ data }) => setUser(data.session?.user || null));
  }, []);
  useEffect(() => {
    if (user && type !== "contact") loadItems();
    if (user && type === "contact") getContactSettings().then(setContactSettings);
  }, [type, user]);
  async function loadItems() {
    setItems(type === "ventures" ? await getVentures() : await getServices());
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
          <p className={styles.navLabel}>Manage</p>
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
            className={type === "services" ? styles.navActive : styles.navItem}
            onClick={() => {
              setType("services");
              resetForm();
            }}
          >
            <ArrowUpRight size={17} /> Services{" "}
            <span>{type === "services" ? "•" : ""}</span>
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
            <h1>{type === "ventures" ? "Ventures" : type === "services" ? "Services" : "Contact details"}</h1>
          </div>
          <span className={styles.liveBadge}>
            <span /> Live database
          </span>
        </header>
        <div className={styles.contentGrid}>
          {type === "contact" ? (
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
          {type !== "contact" && <section className={styles.library}>
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
