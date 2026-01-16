// TypeScript interfaces for Lakeshore Ragdolls

export interface Cat {
  id: string;
  name: string;
  slug: string;
  photos: string[];
  coverPhoto: string;
  dob: string | null;
  color: string;
  pattern: string;
  gender: 'Male' | 'Female';
  status: 'Active' | 'Retired' | 'Guardian Home';
  registration: string;
  pedigree: string;
  healthTesting: string; // Rich text as HTML
  personality: string; // Rich text as HTML
  youtubeTag: string;
  sortOrder: number;
}

export interface Kitten {
  id: string;
  name: string;
  slug: string;
  photos: string[];
  coverPhoto: string;
  dob: string | null;
  color: string;
  pattern: string;
  gender: 'Male' | 'Female';
  status: 'Available' | 'Reserved' | 'Sold' | 'Keeping';
  mother: Cat | null;
  motherId: string | null;
  father: Cat | null;
  fatherId: string | null;
  price: number | null;
  reservedBy: string | null;
  depositPaid: boolean;
  personality: string;
  youtubeTag: string;
  goHomeDate: string | null;
  litter: string;
}

export interface PastKitten {
  id: string;
  name: string;
  photos: string[];
  coverPhoto: string;
  dob: string | null;
  color: string;
  gender: 'Male' | 'Female';
  mother: Cat | null;
  motherId: string | null;
  father: Cat | null;
  fatherId: string | null;
  wentHome: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  content: string; // Rich text as HTML
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedDate: string;
  seoDescription: string | null;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string; // Rich text as HTML
  category: string;
  sortOrder: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string; // Rich text as HTML
  seoDescription: string | null;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
}

// SEO Props
export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'product';
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  noindex?: boolean;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
