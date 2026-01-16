Lakeshore Ragdolls - Claude Code Instructions
Project Overview
Site: Cat breeding business website for Lakeshore Ragdolls (lakeshoreragdolls.com)
Developer: Ryan - handles all coding via Claude Code
Content Manager: Maddy O'Connell - non-technical, manages content via Notion (only knows Google Docs)
Location: Wauwatosa, Wisconsin
Tech Stack
Framework: Astro with React islands
CSS: Tailwind CSS with custom brand colors
CMS: Notion (free tier) - content fetched at build time
Hosting: Cloudflare Pages (static output)
APIs: Notion API, YouTube Data API
Repo: GitHub lakeshore-ragdolls
Styling Rules
NO underlines on links - use no-underline class on <a> tags
Brand colors (defined in tailwind.config.mjs):
Background: brand-bg (#F9FAFB)
Primary accent: brand-primary (#E8D5D5) - soft blush
Secondary: brand-secondary (#94A3B8) - slate blue
Text: brand-text (#334155) - navy-charcoal
Design philosophy: Premium, elegant, feminine but not overly so. Clean layouts, generous whitespace, soft shadows, rounded corners.
Typography: Inter or similar clean sans-serif
Key Architecture
Content lives in Notion databases (Cats, Kittens, Blog, FAQ, Pages)
Pages are statically generated at build time from Notion
YouTube videos auto-fetched by searching for cat name tags
Manual publish via Cloudflare deploy hook (Maddy clicks a bookmark)
Important Files
src/lib/notion.ts - Notion API client and data fetching
src/lib/youtube.ts - YouTube API for video galleries
src/lib/types.ts - TypeScript interfaces for all data models
src/layouts/BaseLayout.astro - Main layout with SEO component
src/components/common/SEO.astro - Meta tags, schema markup
Design Decisions - ASK FIRST
CRITICAL: Before implementing any page layout, present design options to Ryan and get approval. Do not assume:
Hero section styles
Grid vs list layouts
Card designs
Form field requirements
Gallery layouts
Notion Data Handling
Always check Published === true before displaying content
Handle missing/empty fields gracefully (defensive coding)
Notion images come from their CDN - optimize with Astro's <Image /> component
Rich text fields are converted to HTML
Deployment
Build: npm run build (outputs to dist/)
Deploy: Push to main branch triggers Cloudflare Pages auto-deploy
Manual rebuild: Maddy uses browser bookmark pointing to Cloudflare deploy hook
Environment variables: Stored in Cloudflare Pages dashboard (see .env.example)
Local Development
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
Pre-Push Checklist
npm run build - ensure build succeeds
Check for TypeScript errors
Test on mobile viewport
Verify Notion data fetching works
No hardcoded content that should come from Notion
Content Manager Context
Maddy (fiancée) is the primary content user. She:
Only knows Google Docs (Notion is similar)
Edits from computer (not mobile)
Needs simple, clear workflows
Should never need to touch code or Git
Any features affecting her workflow should prioritize simplicity.
SEO Requirements
Every page needs: title, meta description, OG tags
Schema markup: LocalBusiness (site-wide), Product (kittens), Article (blog), FAQPage (FAQ)
Target keywords: "Ragdoll breeder Wisconsin", "Ragdoll kittens Wauwatosa", "Ragdoll cats Milwaukee"
Sitemap auto-generated via @astrojs/sitemap
Don't Forget
Mobile-first responsive design
Image alt text for all cat/kitten photos
Prices displayed publicly on kitten pages
Address included for Google Business Profile / local SEO
YouTube tag field on cats/kittens for auto video matching