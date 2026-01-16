# Lakeshore Ragdolls - Complete Build Guide

> **Purpose**: This document serves as a comprehensive handoff guide for Claude Code to build the Lakeshore Ragdolls website from scratch. A fresh session should be able to execute this entire build with no other context.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Initial Setup](#4-initial-setup)
5. [Notion CMS Structure](#5-notion-cms-structure)
6. [Site Architecture](#6-site-architecture)
7. [Page Specifications](#7-page-specifications)
8. [Data Models](#8-data-models)
9. [Features & Integrations](#9-features--integrations)
10. [SEO Strategy](#10-seo-strategy)
11. [Content Manager Workflow](#11-content-manager-workflow)
12. [Deployment](#12-deployment)
13. [Implementation Order](#13-implementation-order)

---

## 1. Project Overview

### Business
- **Name**: Lakeshore Ragdolls
- **Type**: Ragdoll cat breeding business
- **Location**: Wauwatosa, Wisconsin
- **Domain**: lakeshoreragdolls.com (already configured in Cloudflare)

### Team
- **Developer**: Ryan - handles all coding via Claude Code
- **Content Manager**: Maddy O'Connell - non-technical, manages content via Notion
  - Primary device: Computer
  - Technical experience: Google Docs only
  - Needs: Simple, intuitive content management

### Key Requirements
- Easy for Maddy to add/edit cats, kittens, and blog posts without touching code
- Full SEO control for local business visibility
- Automatic video integration from YouTube
- Manual publish trigger (not automatic rebuilds)
- Free hosting via Cloudflare Pages

---

## 2. Tech Stack

### Core
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | **Astro** | Fast static builds, excellent SEO, great with Claude Code |
| UI Components | **React** (Astro islands) | Interactive components where needed |
| CMS | **Notion** (free tier) | Intuitive for non-technical users, feels like Google Docs |
| Hosting | **Cloudflare Pages** | Free, fast global CDN, easy GitHub integration |
| Repository | **GitHub** (`lakeshore-ragdolls`) | Version control, triggers Cloudflare builds |
| CSS | **Tailwind CSS** | Utility-first, fast iteration, Claude Code works well with it |

### APIs & Integrations
| Integration | Purpose |
|-------------|---------|
| Notion API | Fetch content at build time |
| YouTube Data API | Auto-fetch videos tagged with cat names |
| Stripe Payment Links | Deposit collection (no-code) |

### Key Dependencies
```
@astrojs/react
@astrojs/tailwind
@astrojs/sitemap
@notionhq/client
astro
react
react-dom
tailwindcss
```

---

## 3. Design System

### Color Palette: "Elegant Cool"
```css
:root {
  --color-background: #F9FAFB;      /* Cool white - main background */
  --color-background-alt: #F3F4F6; /* Slightly darker for sections */
  --color-primary: #E8D5D5;         /* Soft blush - buttons, accents */
  --color-primary-hover: #DCC5C5;   /* Darker blush for hover states */
  --color-secondary: #94A3B8;       /* Slate blue - secondary elements */
  --color-text: #334155;            /* Navy-charcoal - body text */
  --color-text-light: #64748B;      /* Lighter text for captions */
  --color-white: #FFFFFF;           /* Pure white for cards */
  --color-border: #E5E7EB;          /* Light gray borders */
}
```

### Tailwind Config Extension
```js
// tailwind.config.mjs
colors: {
  'brand': {
    'bg': '#F9FAFB',
    'bg-alt': '#F3F4F6',
    'primary': '#E8D5D5',
    'primary-hover': '#DCC5C5',
    'secondary': '#94A3B8',
    'text': '#334155',
    'text-light': '#64748B',
    'border': '#E5E7EB',
  }
}
```

### Typography
- **Headings**: Clean sans-serif (Inter or similar)
- **Body**: Readable sans-serif, 16px base
- **Style**: Premium, feminine but not overly so - elegant and trustworthy

### Logo
- Placeholder needed initially
- Space for logo in header (recommend ~200px wide max)

### Design Philosophy
- Clean, spacious layouts with generous whitespace
- High-quality cat photography as hero elements
- Soft shadows and rounded corners for warmth
- Mobile-first responsive design

> **IMPORTANT**: Before implementing each page, discuss the specific design with Ryan. Do not assume layouts - present options and get approval.

---

## 4. Initial Setup

### Prerequisites
- Node.js 18+ installed
- GitHub CLI (`gh`) installed and authenticated
- Cloudflare account (already exists)
- Notion account (needs to be created)

### Step 1: Create GitHub Repository
```bash
# Create new directory
mkdir lakeshore-ragdolls
cd lakeshore-ragdolls

# Initialize git
git init

# Create repo on GitHub and push
gh repo create lakeshore-ragdolls --public --source=. --remote=origin
```

### Step 2: Initialize Astro Project
```bash
# Create Astro project with official integrations
npm create astro@latest . -- --template minimal --install --git

# Add integrations
npx astro add react tailwind sitemap

# Install additional dependencies
npm install @notionhq/client
```

### Step 3: Configure Tailwind
Create `tailwind.config.mjs` with brand colors (see Design System section).

### Step 4: Set Up Environment Variables
Create `.env.example`:
```env
# Notion
NOTION_API_KEY=
NOTION_CATS_DATABASE_ID=
NOTION_KITTENS_DATABASE_ID=
NOTION_BLOG_DATABASE_ID=
NOTION_FAQ_DATABASE_ID=
NOTION_PAGES_DATABASE_ID=

# YouTube
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=

# Cloudflare (for deploy hook)
CLOUDFLARE_DEPLOY_HOOK_URL=

# Site
PUBLIC_SITE_URL=https://lakeshoreragdolls.com
PUBLIC_BUSINESS_EMAIL=
PUBLIC_BUSINESS_PHONE=
PUBLIC_BUSINESS_ADDRESS=
```

### Step 5: Set Up Notion
1. Go to notion.so and create free account
2. Create a new workspace called "Lakeshore Ragdolls"
3. Create databases (see Section 5 for structure)
4. Create Notion integration:
   - Go to notion.so/my-integrations
   - Create new integration named "Lakeshore Website"
   - Copy the API key to `.env`
5. Share each database with the integration

### Step 6: Connect Cloudflare Pages
1. Log into Cloudflare Dashboard
2. Go to Workers & Pages → Create application → Pages
3. Connect to GitHub repository `lakeshore-ragdolls`
4. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
5. Add environment variables from `.env`
6. Create deploy hook (Settings → Builds & deployments → Deploy hooks)
   - Save the webhook URL for Maddy's "Publish" button

---

## 5. Notion CMS Structure

### Database: Cats
| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Cat's name |
| Slug | Text | URL slug (auto-generate from name) |
| Photos | Files | Gallery of photos |
| Cover Photo | Files | Main photo for listings |
| DOB | Date | Date of birth |
| Color | Select | e.g., "Blue Bicolor", "Seal Point" |
| Pattern | Select | e.g., "Bicolor", "Mitted", "Colorpoint" |
| Gender | Select | "Male" / "Female" |
| Status | Select | "Active" / "Retired" / "Guardian Home" |
| Registration | Text | TICA/CFA registration info |
| Pedigree | Text | Pedigree information |
| Health Testing | Rich Text | Health test results (HCM, PKD, etc.) |
| Personality | Rich Text | Personality description |
| YouTube Tag | Text | Tag to match for videos (e.g., "Whiskers") |
| Sort Order | Number | For manual ordering |
| Published | Checkbox | Show on site? |

### Database: Kittens
| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Kitten's name |
| Slug | Text | URL slug |
| Photos | Files | Gallery of photos |
| Cover Photo | Files | Main photo for listings |
| DOB | Date | Date of birth |
| Color | Select | Color/pattern |
| Pattern | Select | Pattern type |
| Gender | Select | "Male" / "Female" |
| Status | Select | "Available" / "Reserved" / "Sold" / "Keeping" |
| Mother | Relation | → Cats database |
| Father | Relation | → Cats database |
| Price | Number | Price in dollars |
| Reserved By | Text | Name of person who reserved (if applicable) |
| Deposit Paid | Checkbox | Has deposit been received? |
| Personality | Rich Text | Personality description |
| YouTube Tag | Text | Tag to match for videos |
| Go Home Date | Date | When kitten can go to new home |
| Published | Checkbox | Show on site? |
| Litter | Select | Litter identifier (e.g., "Spring 2024 Litter") |

### Database: Past Kittens
| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Kitten's name |
| Photos | Files | Photos |
| Cover Photo | Files | Main photo |
| DOB | Date | Date of birth |
| Color | Select | Color/pattern |
| Gender | Select | Gender |
| Mother | Relation | → Cats database |
| Father | Relation | → Cats database |
| Went Home | Date | Date they went to new home |
| Published | Checkbox | Show in gallery? |

### Database: Blog Posts
| Property | Type | Description |
|----------|------|-------------|
| Title | Title | Post title |
| Slug | Text | URL slug |
| Cover Image | Files | Featured image |
| Content | Rich Text | Full blog content |
| Excerpt | Text | Short description for listings |
| Category | Select | e.g., "Care Tips", "News", "Kitten Updates" |
| Tags | Multi-select | For filtering |
| Author | Text | Author name |
| Published Date | Date | Publication date |
| Published | Checkbox | Is it live? |
| SEO Description | Text | Custom meta description (optional) |

### Database: FAQ
| Property | Type | Description |
|----------|------|-------------|
| Question | Title | The question |
| Answer | Rich Text | The answer |
| Category | Select | e.g., "Purchasing", "Care", "About Ragdolls" |
| Sort Order | Number | Display order |
| Published | Checkbox | Show on site? |

### Database: Pages
| Property | Type | Description |
|----------|------|-------------|
| Title | Title | Page title |
| Slug | Text | URL slug (e.g., "about") |
| Content | Rich Text | Page content |
| SEO Description | Text | Meta description |
| Published | Checkbox | Is it live? |

---

## 6. Site Architecture

### File Structure
```
lakeshore-ragdolls/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
│       └── placeholder-logo.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Navigation.astro
│   │   │   ├── MobileMenu.tsx (React - interactive)
│   │   │   └── SEO.astro
│   │   ├── cats/
│   │   │   ├── CatCard.astro
│   │   │   ├── CatGallery.tsx (React - lightbox)
│   │   │   └── VideoGallery.tsx (React - YouTube embeds)
│   │   ├── kittens/
│   │   │   ├── KittenCard.astro
│   │   │   ├── KittenStatus.astro
│   │   │   └── AvailabilityBadge.astro
│   │   ├── blog/
│   │   │   ├── BlogCard.astro
│   │   │   └── BlogContent.astro
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx (React)
│   │   │   └── WaitlistForm.tsx (React)
│   │   └── home/
│   │       ├── Hero.astro
│   │       ├── FeaturedKittens.astro
│   │       └── Testimonials.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── PageLayout.astro
│   │   └── BlogLayout.astro
│   ├── lib/
│   │   ├── notion.ts          (Notion API client)
│   │   ├── youtube.ts         (YouTube API client)
│   │   ├── utils.ts           (Helper functions)
│   │   └── types.ts           (TypeScript interfaces)
│   ├── pages/
│   │   ├── index.astro                    (Home)
│   │   ├── about.astro                    (About Us)
│   │   ├── cats/
│   │   │   ├── index.astro                (Our Cats - archive)
│   │   │   └── [slug].astro               (Individual cat page)
│   │   ├── kittens/
│   │   │   ├── index.astro                (Available Kittens - archive)
│   │   │   └── [slug].astro               (Individual kitten page)
│   │   ├── gallery/
│   │   │   └── index.astro                (Past Kittens Gallery)
│   │   ├── blog/
│   │   │   ├── index.astro                (Blog archive)
│   │   │   └── [slug].astro               (Individual blog post)
│   │   ├── faq.astro                      (FAQ page)
│   │   ├── contact.astro                  (Contact page)
│   │   ├── waitlist.astro                 (Waitlist/Application)
│   │   └── api/
│   │       └── rebuild.ts                 (Webhook endpoint if needed)
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

### Routing Summary
| URL | Page | Data Source |
|-----|------|-------------|
| `/` | Home | Featured kittens, about snippet |
| `/about` | About Us | Pages database |
| `/cats` | Our Cats (archive) | Cats database |
| `/cats/[slug]` | Individual cat | Cats database + YouTube API |
| `/kittens` | Available Kittens (archive) | Kittens database (status=Available) |
| `/kittens/[slug]` | Individual kitten | Kittens database + YouTube API |
| `/gallery` | Past Kittens | Past Kittens database |
| `/blog` | Blog archive | Blog database |
| `/blog/[slug]` | Blog post | Blog database |
| `/faq` | FAQ | FAQ database |
| `/contact` | Contact | Static + form |
| `/waitlist` | Waitlist Application | Static + form |

---

## 7. Page Specifications

> **CRITICAL**: Before implementing each page, present design options to Ryan and get approval. Do not assume layouts.

### Home Page
**Purpose**: First impression, showcase brand and available kittens

**Sections to discuss with Ryan**:
- Hero section (full-width image? slideshow? video background?)
- Featured/available kittens preview
- About us snippet
- Why choose us / differentiators
- Testimonials (if any)
- Call-to-action (waitlist? contact?)

**Data needed**: Featured kittens, about snippet

---

### About Us
**Purpose**: Tell Lakeshore Ragdolls' story, build trust

**Sections to discuss with Ryan**:
- Their story (how they started)
- Meet the breeders (Ryan & Maddy photos?)
- Their philosophy/approach to breeding
- Location info (Wauwatosa, WI)
- Certifications/registrations

**Data needed**: Pages database ("about" entry)

---

### Our Cats (Archive)
**Purpose**: Show all breeding cats

**Sections to discuss with Ryan**:
- Grid vs list layout
- Filtering options (gender? color?)
- How much info to show on cards
- Active vs retired cats display

**Data needed**: All published cats from Cats database

---

### Individual Cat Page
**Purpose**: Detailed profile of one cat

**Sections to discuss with Ryan**:
- Photo gallery layout
- Video gallery layout
- Health testing display format
- Pedigree display
- Related kittens (offspring)

**Data needed**: Single cat + their YouTube videos + offspring from Kittens database

---

### Available Kittens (Archive)
**Purpose**: Show kittens available for purchase

**Sections to discuss with Ryan**:
- Grid layout and card design
- Status badges (Available, Reserved, etc.)
- Price display format
- Filter by litter? color?
- Sorting (newest first? by availability?)

**Data needed**: Kittens where status = "Available" or "Reserved"

---

### Individual Kitten Page
**Purpose**: Detailed profile for potential buyers

**Sections to discuss with Ryan**:
- Photo gallery
- Video gallery
- Parent info (link to mom/dad)
- Price and deposit info
- Go-home date
- How to reserve CTA

**Data needed**: Single kitten + parents + YouTube videos

---

### Past Kittens / Gallery
**Purpose**: Showcase previous litters, build credibility

**Sections to discuss with Ryan**:
- Grid gallery layout
- Filter by year/litter?
- Lightbox for photos?
- Minimal info or detailed?

**Data needed**: Past Kittens database

---

### Blog (Archive)
**Purpose**: Content marketing, SEO, updates

**Sections to discuss with Ryan**:
- Card layout for posts
- Category filtering
- Featured/pinned posts?
- Sidebar or full-width?

**Data needed**: All published blog posts

---

### Individual Blog Post
**Purpose**: Full article content

**Sections to discuss with Ryan**:
- Content width (narrow reading column?)
- Related posts at bottom?
- Share buttons?
- Author display?

**Data needed**: Single blog post

---

### FAQ
**Purpose**: Answer common questions, reduce support inquiries

**Sections to discuss with Ryan**:
- Accordion style or flat list?
- Group by category?
- Search functionality?

**Data needed**: FAQ database entries

---

### Contact
**Purpose**: Allow inquiries

**Sections to discuss with Ryan**:
- Contact form fields needed
- Display email/phone directly?
- Map embed?
- Business hours?

**Business info to display**:
- Email: (from env)
- Phone: (from env)
- Address: Wauwatosa, WI (full address from env)

**Form handling**: Discuss options (Cloudflare Workers, email service, Google Forms)

---

### Waitlist / Application
**Purpose**: Collect serious inquiries for future kittens

**Sections to discuss with Ryan**:
- What info to collect (name, email, phone, preferences, living situation?)
- How detailed should the application be?
- Deposit info
- Process explanation

**Form handling**: Same as contact form discussion

---

## 8. Data Models

### TypeScript Interfaces

```typescript
// src/lib/types.ts

export interface Cat {
  id: string;
  name: string;
  slug: string;
  photos: string[];
  coverPhoto: string;
  dob: string;
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
  dob: string;
  color: string;
  pattern: string;
  gender: 'Male' | 'Female';
  status: 'Available' | 'Reserved' | 'Sold' | 'Keeping';
  mother: Cat | null;
  father: Cat | null;
  price: number;
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
  dob: string;
  color: string;
  gender: 'Male' | 'Female';
  mother: Cat | null;
  father: Cat | null;
  wentHome: string;
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

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
}
```

---

## 9. Features & Integrations

### Notion Integration
```typescript
// src/lib/notion.ts
import { Client } from '@notionhq/client';

const notion = new Client({ auth: import.meta.env.NOTION_API_KEY });

export async function getCats(): Promise<Cat[]> {
  const response = await notion.databases.query({
    database_id: import.meta.env.NOTION_CATS_DATABASE_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true }
    },
    sorts: [{ property: 'Sort Order', direction: 'ascending' }]
  });

  return response.results.map(transformCatFromNotion);
}

// Similar functions for kittens, blog posts, FAQ, etc.
```

### YouTube Video Integration
```typescript
// src/lib/youtube.ts

const API_KEY = import.meta.env.YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.YOUTUBE_CHANNEL_ID;

export async function getVideosForCat(tag: string): Promise<YouTubeVideo[]> {
  // Search channel videos where description/title contains the tag
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&channelId=${CHANNEL_ID}&q=${encodeURIComponent(tag)}` +
    `&type=video&maxResults=20&key=${API_KEY}`;

  const response = await fetch(searchUrl);
  const data = await response.json();

  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high.url,
    publishedAt: item.snippet.publishedAt,
  }));
}
```

**How it works**:
1. Maddy posts a YouTube Short about "Whiskers"
2. She includes "Whiskers" or "#Whiskers" in the title or description
3. At build time, site searches YouTube for videos matching that tag
4. Videos automatically appear on Whiskers' page

### Image Optimization
Use Astro's built-in `<Image />` component to optimize Notion images at build time:

```astro
---
import { Image } from 'astro:assets';
---

<Image
  src={cat.coverPhoto}
  alt={cat.name}
  width={800}
  height={600}
  format="webp"
/>
```

### Forms
**Options to discuss with Ryan**:
1. **Cloudflare Workers** - Handle form submissions serverlessly
2. **Formspree** - Simple, free tier available
3. **Google Forms embed** - Simplest but less customizable
4. **Email service (Resend, SendGrid)** - Full control

### Stripe Payment Links
For deposits:
1. Ryan creates a Stripe Payment Link for $500 deposit
2. Link is placed on kitten pages
3. No code required - Stripe handles everything

---

## 10. SEO Strategy

### Technical SEO
- **Sitemap**: Auto-generated via `@astrojs/sitemap`
- **Robots.txt**: Allow all, point to sitemap
- **Canonical URLs**: Set on all pages
- **Meta tags**: Title, description, OG tags on every page

### Schema Markup

**LocalBusiness** (site-wide):
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Lakeshore Ragdolls",
  "description": "Ragdoll cat breeder in Wauwatosa, Wisconsin",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Wauwatosa",
    "addressRegion": "WI",
    "addressCountry": "US"
  },
  "telephone": "...",
  "email": "...",
  "url": "https://lakeshoreragdolls.com"
}
```

**Product** (on kitten pages):
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Luna - Blue Bicolor Ragdoll Kitten",
  "description": "...",
  "image": "...",
  "offers": {
    "@type": "Offer",
    "price": "2500",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

**Article** (on blog posts):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "datePublished": "...",
  "author": { "@type": "Person", "name": "..." }
}
```

**FAQPage** (on FAQ page):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

### Target Keywords
- "Ragdoll breeder Wisconsin"
- "Ragdoll kittens Wauwatosa"
- "Ragdoll cats Milwaukee"
- "Ragdoll kittens for sale Wisconsin"
- "TICA registered Ragdoll breeder"

### Google Business Profile
- Create/claim Google Business Profile
- Use same NAP (Name, Address, Phone) as website
- Add photos regularly
- Collect reviews from kitten families

---

## 11. Content Manager Workflow

### For Maddy O'Connell

#### Adding a New Cat
1. Open Notion → "Cats" database
2. Click "+ New"
3. Fill in fields:
   - Name (required)
   - Drag photos into Photos field
   - Select a Cover Photo
   - Fill DOB, Color, Pattern, Gender
   - Set Status to "Active"
   - Add Registration, Health Testing info
   - Write Personality description
   - Set YouTube Tag (e.g., "Whiskers")
   - Check "Published" when ready
4. Click the "Publish Website" bookmark

#### Adding a New Kitten
1. Open Notion → "Kittens" database
2. Click "+ New"
3. Fill in fields:
   - Name, photos, cover photo
   - DOB, Color, Pattern, Gender
   - Select Mother and Father (from Cats)
   - Set Price
   - Set Status ("Available")
   - Set Go Home Date
   - Write Personality
   - Set YouTube Tag
   - Check "Published"
4. Click "Publish Website" bookmark

#### Moving Kitten to "Sold"
1. Open the kitten in Notion
2. Change Status to "Sold"
3. Add their info to "Past Kittens" database (optional)
4. Uncheck "Published" on original or leave for reference
5. Click "Publish Website"

#### Writing a Blog Post
1. Open Notion → "Blog Posts" database
2. Click "+ New"
3. Fill in Title, add Cover Image
4. Write content using Notion's editor (like Google Docs)
5. Add Excerpt, Category, Tags
6. Set Published Date
7. Check "Published"
8. Click "Publish Website"

#### Publishing Changes
1. After making changes in Notion
2. Open browser bookmark "Publish Website"
3. Wait ~60 seconds
4. Changes are live!

### Setting Up the "Publish" Button
Ryan will create a browser bookmark:
- Name: "Publish Website"
- URL: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/[HOOK_ID]`
- One click triggers a rebuild

---

## 12. Deployment

### Cloudflare Pages Configuration

**Build settings**:
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

**Environment variables** (add in Cloudflare dashboard):
- All variables from `.env.example`

**Deploy hook**:
1. Cloudflare Dashboard → Pages → Settings
2. Builds & deployments → Deploy hooks
3. Create hook named "Manual Publish"
4. Copy URL → create bookmark for Maddy

### DNS (already configured)
- Domain `lakeshoreragdolls.com` is already in Cloudflare
- Point to Pages project when ready

### First Deployment
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
Cloudflare will auto-deploy on push to main.

---

## 13. Implementation Order

### Phase 1: Foundation
1. [ ] Create GitHub repo and Astro project
2. [ ] Configure Tailwind with brand colors
3. [ ] Set up base layout (Header, Footer, SEO component)
4. [ ] Create Notion account and databases
5. [ ] Set up Notion integration and API connection
6. [ ] Test fetching data from Notion

### Phase 2: Core Pages (discuss design for each)
7. [ ] **Discuss Home page design with Ryan** → implement
8. [ ] **Discuss Our Cats archive design** → implement
9. [ ] **Discuss Individual cat page design** → implement
10. [ ] **Discuss Available Kittens archive** → implement
11. [ ] **Discuss Individual kitten page** → implement

### Phase 3: Content Pages
12. [ ] **Discuss About page design** → implement
13. [ ] **Discuss Blog archive design** → implement
14. [ ] **Discuss Blog post page design** → implement
15. [ ] **Discuss Past Kittens gallery design** → implement
16. [ ] **Discuss FAQ page design** → implement

### Phase 4: Interactive Features
17. [ ] **Discuss Contact page & form** → implement
18. [ ] **Discuss Waitlist page & form** → implement
19. [ ] Set up YouTube API integration
20. [ ] Add video galleries to cat/kitten pages

### Phase 5: SEO & Polish
21. [ ] Add all schema markup
22. [ ] Configure sitemap
23. [ ] Add robots.txt
24. [ ] Test all meta tags
25. [ ] Mobile responsiveness pass
26. [ ] Performance optimization

### Phase 6: Deployment & Training
27. [ ] Configure Cloudflare Pages
28. [ ] Set up environment variables
29. [ ] Create deploy hook
30. [ ] Create "Publish Website" bookmark for Maddy
31. [ ] Test full workflow
32. [ ] Create quick reference guide for Maddy

---

## Quick Reference

### Key Files to Create First
1. `astro.config.mjs` - Astro configuration
2. `tailwind.config.mjs` - Tailwind with brand colors
3. `src/lib/notion.ts` - Notion API client
4. `src/lib/types.ts` - TypeScript interfaces
5. `src/layouts/BaseLayout.astro` - Main layout
6. `src/components/common/SEO.astro` - SEO component

### Commands
```bash
npm run dev      # Local development
npm run build    # Production build
npm run preview  # Preview production build
```

### Important Reminders
- **Always discuss page designs with Ryan before implementing**
- **Handle missing Notion fields gracefully** (defensive coding)
- **Optimize images** using Astro's Image component
- **Test on mobile** - many visitors will be on phones
- **Keep it simple** - avoid over-engineering

---

*Last updated: January 2025*
*Guide version: 1.0*
