import { createClient } from '@supabase/supabase-js';
import { fallbackServices, fallbackVentures } from '@/data/portfolio';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'website-images';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;


function contentTable(type) {
  if (type !== 'ventures' && type !== 'services') {
    throw new Error(`Unsupported content type: ${type}`);
  }
  return type;
}

export async function getContent(type) {
  const table = contentTable(type);
  if (!supabase) return table === 'ventures' ? fallbackVentures : fallbackServices;

  const { data, error } = await supabase.from(table).select('*').order('display_order', { ascending: true });
  if (error) {
    console.warn(`Could not load ${table} from Supabase.`, error.message);
    return [];
  }
  return data;
}

export const getVentures = () => getContent('ventures');
export const getServices = () => getContent('services');

// No invented contact details: fill these from the admin panel (Contact details tab).
const defaultContactSettings = {
  primary_email: '',
  primary_whatsapp: '',
  linkedin_url: '',
  instagram_url: '',
  twitter_url: '',
  location: 'Bangalore, Karnataka, India',
};

export async function getContactSettings() {
  if (!supabase) return defaultContactSettings;
  const { data, error } = await supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle();
  if (error) {
    console.warn('Could not load contact settings from Supabase.', error.message);
    return defaultContactSettings;
  }
  return { ...defaultContactSettings, ...data };
}

export async function saveContactSettings(settings) {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.');
  const payload = {
    id: 1,
    primary_email: settings.primary_email?.trim() || null,
    primary_whatsapp: settings.primary_whatsapp?.trim() || null,
    linkedin_url: settings.linkedin_url?.trim() || null,
    instagram_url: settings.instagram_url?.trim() || null,
    twitter_url: settings.twitter_url?.trim() || null,
    location: settings.location?.trim() || null,
  };
  const { data, error } = await supabase.from('contact_settings').upsert(payload).select().single();
  if (error) {
    if (error.code === '42P01' || error.message?.includes('contact_settings')) {
      throw new Error('Contact settings table is missing. Run the contact_settings section from supabase/schema.sql in Supabase SQL Editor, then refresh the admin panel.');
    }
    throw error;
  }
  return data;
}

export function createWhatsAppUrl(phone, message) {
  return `https://wa.me/${(phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (/^(https?:)?\/\//.test(imagePath) || imagePath.startsWith('/')) return imagePath;
  const normalizedPath = imagePath.replace(new RegExp(`^${storageBucket}/`), '').replace(/^\/+/, '');
  return supabase?.storage.from(storageBucket).getPublicUrl(normalizedPath).data.publicUrl || imagePath;
}

export const getSession = () => supabase?.auth.getSession();
export const signIn = (email, password) => {
  if (!supabase) return Promise.reject(new Error('Supabase is not configured. Restart the Vite dev server after checking your .env file.'));
  return supabase.auth.signInWithPassword({ email, password });
};
export const signUp = (email, password) => {
  if (!supabase) return Promise.reject(new Error('Supabase is not configured.'));
  return supabase.auth.signUp({ email, password });
};
export const signOut = () => {
  if (!supabase) return Promise.reject(new Error('Supabase is not configured.'));
  return supabase.auth.signOut();
};

export async function saveContent(type, item) {
  const table = contentTable(type);
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.');

  const payload = {
    name: item.name,
    description: item.description,
    image_url: item.image_url || null,
    is_active: item.is_live !== false,
    display_order: Number(item.display_order) || 0,
    ...(table === 'ventures' ? { website_url: item.website_url || null } : {}),
  };
  const query = item.id
    ? supabase.from(table).update(payload).eq('id', item.id).select().single()
    : supabase.from(table).insert(payload).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function deleteContent(type, id) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from(contentTable(type)).delete().eq('id', id);
  if (error) throw error;
}

export async function uploadImage(file, type) {
  if (!supabase) throw new Error('Supabase is not configured.');
  if (type !== 'ventures' && type !== 'services') throw new Error('Choose ventures or services before uploading an image.');
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('Your admin session has expired. Please sign in again.');
  const extension = file.name.split('.').pop();
  const path = `${type}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(storageBucket).upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(`Image upload failed for bucket "${storageBucket}": ${error.message}`);
  return supabase.storage.from(storageBucket).getPublicUrl(path).data.publicUrl;
}