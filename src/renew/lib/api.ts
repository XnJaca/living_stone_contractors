// Same-server setup: the Express API runs on PORT next to Astro.
const API_URL = `http://localhost:${process.env.PORT || 3001}`;

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  icon?: string;
  featured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  content: string;
  rating: number;
  featured: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export interface HomePage {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutContent: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
}

export const LICENSES = [
  { label: 'MHIC', number: '165925' },
  { label: 'Commercial', number: '15358199' },
];

export const SERVICE_AREA = [
  'Germantown',
  'Gaithersburg',
  'Rockville',
  'Bethesda',
  'Silver Spring',
  'Frederick',
  'Washington, DC',
  'Northern Virginia',
];

const defaultContact: ContactInfo = {
  email: 'lstonecontractors@gmail.com',
  phone: '(202) 373-8568',
  address: 'Germantown, MD 20874',
  hours: 'Mon-Fri: 8:00AM-5:00PM\nSat-Sun: Closed',
};

const defaultHome: HomePage = {
  heroTitle: 'Building Trust',
  heroSubtitle: 'Delivering Excellence',
  heroDescription: 'Transforming spaces into functional, modern, and durable places.',
  heroImage: '/images/placeholders/hero-bg.png',
  aboutTitle: 'About Living Stone Contractors',
  aboutDescription: 'We specialize in commercial renovations & home improvement.',
  aboutContent: '',
  whyChooseTitle: 'Why Choose Living Stone Contractors?',
  whyChooseDescription:
    'We are passionate about every detail of the process, from planning to execution, ensuring high-quality results that reflect the style and needs of each client.',
  feature1Title: 'Licensed & Insured',
  feature1Description: 'Fully licensed contractors with comprehensive insurance coverage',
  feature2Title: 'Transparent Pricing',
  feature2Description: 'No hidden fees. Clear estimates before we start',
  feature3Title: 'Expert Team',
  feature3Description: 'Skilled craftsmen with decades of combined experience',
};

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    return res.ok ? ((await res.json()) as T) : null;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  const services = (await get<Service[]>('/api/services')) ?? [];
  return services.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await get<Testimonial[]>('/api/testimonials')) ?? [];
}

export async function getContact(): Promise<ContactInfo> {
  const data = await get<Partial<ContactInfo>>('/api/contact');
  return { ...defaultContact, ...data };
}

export async function getHome(): Promise<HomePage> {
  const data = await get<{ home?: Partial<HomePage> }>('/api/pages');
  return { ...defaultHome, ...data?.home };
}

export const slugMatches = (a?: string, b?: string) =>
  a?.trim().toLowerCase() === b?.trim().toLowerCase();

export const serviceHref = (service: Pick<Service, 'slug'>) =>
  `/preview/services/${encodeURIComponent(service.slug.trim().toLowerCase())}`;

export const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '').replace(/^1/, '')}`;

export const hoursLines = (hours: string) =>
  hours
    .split('\n')
    .map((line) => line.replace(/,\s*$/, '').trim())
    .filter(Boolean);

const stripTags = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/\s+/g, ' ')
    .trim();

// Groups the short lines of the admin's rich text (list items or one-line paragraphs) under the
// heading above them. The editor produces both formats, so both are accepted.
export function serviceLists(html: string): { heading: string; items: string[] }[] {
  const groups: { heading: string; items: string[] }[] = [];
  let current: { heading: string; items: string[] } | null = null;
  for (const [, tag, inner] of html.matchAll(/<(h[2-6]|p|li)[^>]*>([\s\S]*?)<\/\1>/g)) {
    const text = stripTags(inner);
    if (!text) continue;
    const boldLine = tag === 'p' && /^\s*<strong>[\s\S]*<\/strong>\s*$/.test(inner);
    if (tag.startsWith('h') || boldLine) {
      current = { heading: text.replace(/:$/, ''), items: [] };
      groups.push(current);
    } else if (current && (tag === 'li' || (text.length <= 60 && !/[.!?]$/.test(text)))) {
      current.items.push(text);
    }
  }
  return groups.filter((g) => g.items.length >= 2);
}

/** Resized, auto-format Cloudinary URL; other URLs pass through untouched. */
export function cld(url: string, width: number) {
  return url.includes('res.cloudinary.com') && url.includes('/upload/')
    ? url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`)
    : url;
}

export const cldSrcset = (url: string, widths: number[]) =>
  url.includes('res.cloudinary.com') ? widths.map((w) => `${cld(url, w)} ${w}w`).join(', ') : undefined;

export const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

/** Ordered steps (<ol>) from any service's rich text, used for the process section. */
export function processSteps(services: Service[]) {
  for (const s of services) {
    const ol = s.content?.match(/<ol>([\s\S]*?)<\/ol>/);
    if (!ol) continue;
    const items = [...ol[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
    if (items.length >= 3) return items;
  }
  return [
    'Initial consultation and site assessment',
    'Design and planning',
    'Permit acquisition',
    'Construction and project management',
    'Final inspection and completion',
  ];
}

/** Splits an admin feature title like "Licensed & Insured. Commercial # 1535 MHIC #1659" into title + detail. */
export function splitFeatureTitle(raw: string) {
  const clean = raw.replace(/\s+/g, ' ').trim();
  const dot = clean.indexOf('.');
  return dot > 0 && dot < clean.length - 1
    ? { title: clean.slice(0, dot).trim(), detail: clean.slice(dot + 1).trim().replace(/#\s+/g, '#') }
    : { title: clean.replace(/\.$/, ''), detail: '' };
}

/** Turns runs of one-line paragraphs from the admin editor into proper lists. */
export function normalizeRich(html: string) {
  const isLine = (inner: string) => {
    const text = stripTags(inner);
    return text.length > 0 && text.length <= 60 && !/[.!?:]$/.test(text) && !/^\s*<strong>[\s\S]*<\/strong>\s*$/.test(inner);
  };
  return html.replace(/(?:<p>(?:(?!<\/p>)[\s\S])*<\/p>\s*){2,}/g, (run) => {
    const paras = [...run.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]).filter((p) => stripTags(p));
    if (paras.length < 2 || !paras.every(isLine)) return run;
    return `<ul>${paras.map((p) => `<li>${p}</li>`).join('')}</ul>`;
  });
}
