// Notion CMS Integration for Lakeshore Ragdolls
import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { Cat, Kitten, PastKitten, BlogPost, FAQ, Page } from './types';
import { slugify } from './utils';

// The Notion SDK types are incomplete - query method exists at runtime
// Define a simple filter type for our use case
type PropertyFilter = {
  property: string;
  checkbox?: { equals: boolean };
  select?: { equals: string };
  rich_text?: { equals: string };
};

type DatabaseFilter = PropertyFilter | { and: (PropertyFilter | DatabaseFilter)[] } | undefined;

// Initialize Notion client
const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

// Database IDs from environment
const DATABASE_IDS = {
  cats: import.meta.env.NOTION_CATS_DATABASE_ID,
  kittens: import.meta.env.NOTION_KITTENS_DATABASE_ID,
  pastKittens: import.meta.env.NOTION_PAST_KITTENS_DATABASE_ID,
  blog: import.meta.env.NOTION_BLOG_DATABASE_ID,
  faq: import.meta.env.NOTION_FAQ_DATABASE_ID,
  pages: import.meta.env.NOTION_PAGES_DATABASE_ID,
};

// Type guard for PageObjectResponse
function isPageObjectResponse(page: unknown): page is PageObjectResponse {
  return (
    typeof page === 'object' &&
    page !== null &&
    'properties' in page &&
    'id' in page
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert Notion rich text array to HTML string
 */
export function richTextToHtml(richText: RichTextItemResponse[]): string {
  if (!richText || !Array.isArray(richText)) return '';

  return richText
    .map((item) => {
      if (item.type !== 'text') return '';

      let text = item.text.content;

      // Apply annotations
      if (item.annotations.bold) {
        text = `<strong>${text}</strong>`;
      }
      if (item.annotations.italic) {
        text = `<em>${text}</em>`;
      }
      if (item.annotations.underline) {
        text = `<u>${text}</u>`;
      }
      if (item.annotations.strikethrough) {
        text = `<s>${text}</s>`;
      }
      if (item.annotations.code) {
        text = `<code>${text}</code>`;
      }

      // Handle links
      if (item.text.link) {
        text = `<a href="${item.text.link.url}">${text}</a>`;
      }

      return text;
    })
    .join('')
    .replace(/\n/g, '<br>');
}

/**
 * Convert Notion rich text array to plain text
 */
export function richTextToPlain(richText: RichTextItemResponse[]): string {
  if (!richText || !Array.isArray(richText)) return '';

  return richText.map((item) => {
    if (item.type !== 'text') return '';
    return item.text.content;
  }).join('');
}

/**
 * Extract file URLs from Notion files property
 * Handles both external URLs and Notion-hosted files
 */
export function extractFileUrls(
  files: Array<{ type: string; file?: { url: string }; external?: { url: string }; name?: string }>
): string[] {
  if (!files || !Array.isArray(files)) return [];

  return files
    .map((file) => {
      if (file.type === 'file' && file.file?.url) {
        return file.file.url;
      }
      if (file.type === 'external' && file.external?.url) {
        return file.external.url;
      }
      return null;
    })
    .filter((url): url is string => url !== null);
}

/**
 * Safely get a property value from a Notion page
 * Returns the default value if property doesn't exist or is empty
 */
export function getProperty<T>(
  properties: PageObjectResponse['properties'],
  key: string,
  defaultValue: T
): T {
  const prop = properties[key];
  if (!prop) return defaultValue;

  try {
    switch (prop.type) {
      case 'title':
        const titleText = prop.title?.[0]?.plain_text;
        return (titleText ?? defaultValue) as T;

      case 'rich_text':
        const richText = prop.rich_text?.[0]?.plain_text;
        return (richText ?? defaultValue) as T;

      case 'select':
        return (prop.select?.name ?? defaultValue) as T;

      case 'multi_select':
        const multiSelect = prop.multi_select?.map((s) => s.name) ?? [];
        return (multiSelect.length > 0 ? multiSelect : defaultValue) as T;

      case 'number':
        return (prop.number ?? defaultValue) as T;

      case 'checkbox':
        return prop.checkbox as T;

      case 'date':
        return (prop.date?.start ?? defaultValue) as T;

      case 'files':
        const urls = extractFileUrls(prop.files as Array<{ type: string; file?: { url: string }; external?: { url: string } }>);
        return (urls.length > 0 ? urls : defaultValue) as T;

      case 'relation':
        const relationIds = prop.relation?.map((r) => r.id) ?? [];
        return (relationIds.length > 0 ? relationIds : defaultValue) as T;

      case 'url':
        return (prop.url ?? defaultValue) as T;

      default:
        return defaultValue;
    }
  } catch {
    return defaultValue;
  }
}

/**
 * Get rich text property as HTML
 */
export function getRichTextHtml(
  properties: PageObjectResponse['properties'],
  key: string
): string {
  const prop = properties[key];
  if (!prop || prop.type !== 'rich_text') return '';
  return richTextToHtml(prop.rich_text);
}

// =============================================================================
// TRANSFORM FUNCTIONS
// =============================================================================

/**
 * Transform Notion page to Cat object
 */
function transformCat(page: PageObjectResponse): Cat {
  const { properties, id } = page;

  const name = getProperty<string>(properties, 'Name', 'Unnamed Cat');
  const slug = getProperty<string>(properties, 'Slug', '') || slugify(name);
  const photos = getProperty<string[]>(properties, 'Photos', []);

  return {
    id,
    name,
    slug,
    photos,
    coverPhoto: photos[0] || '',
    dob: getProperty<string | null>(properties, 'Date of Birth', null),
    color: getProperty<string>(properties, 'Color', ''),
    pattern: getProperty<string>(properties, 'Pattern', ''),
    gender: getProperty<'Male' | 'Female'>(properties, 'Gender', 'Female'),
    status: getProperty<'Active' | 'Retired' | 'Guardian Home'>(properties, 'Status', 'Active'),
    registration: getProperty<string>(properties, 'Registration', ''),
    pedigree: getProperty<string>(properties, 'Pedigree', ''),
    healthTesting: getRichTextHtml(properties, 'Health Testing'),
    personality: getRichTextHtml(properties, 'Personality'),
    youtubeTag: getProperty<string>(properties, 'YouTube Tag', ''),
    sortOrder: getProperty<number>(properties, 'Sort Order', 0),
  };
}

/**
 * Transform Notion page to Kitten object
 */
function transformKitten(page: PageObjectResponse): Kitten {
  const { properties, id } = page;

  const name = getProperty<string>(properties, 'Name', 'Unnamed Kitten');
  const slug = getProperty<string>(properties, 'Slug', '') || slugify(name);
  const photos = getProperty<string[]>(properties, 'Photos', []);
  const motherIds = getProperty<string[]>(properties, 'Mother', []);
  const fatherIds = getProperty<string[]>(properties, 'Father', []);

  return {
    id,
    name,
    slug,
    photos,
    coverPhoto: photos[0] || '',
    dob: getProperty<string | null>(properties, 'Date of Birth', null),
    color: getProperty<string>(properties, 'Color', ''),
    pattern: getProperty<string>(properties, 'Pattern', ''),
    gender: getProperty<'Male' | 'Female'>(properties, 'Gender', 'Female'),
    status: getProperty<'Available' | 'Reserved' | 'Sold' | 'Keeping'>(properties, 'Status', 'Available'),
    mother: null, // Will be resolved separately
    motherId: motherIds[0] || null,
    father: null, // Will be resolved separately
    fatherId: fatherIds[0] || null,
    price: getProperty<number | null>(properties, 'Price', null),
    reservedBy: getProperty<string | null>(properties, 'Reserved By', null),
    depositPaid: getProperty<boolean>(properties, 'Deposit Paid', false),
    personality: getRichTextHtml(properties, 'Personality'),
    youtubeTag: getProperty<string>(properties, 'YouTube Tag', ''),
    goHomeDate: getProperty<string | null>(properties, 'Go Home Date', null),
    litter: getProperty<string>(properties, 'Litter', ''),
  };
}

/**
 * Transform Notion page to PastKitten object
 */
function transformPastKitten(page: PageObjectResponse): PastKitten {
  const { properties, id } = page;

  const name = getProperty<string>(properties, 'Name', 'Unnamed Kitten');
  const photos = getProperty<string[]>(properties, 'Photos', []);
  const motherIds = getProperty<string[]>(properties, 'Mother', []);
  const fatherIds = getProperty<string[]>(properties, 'Father', []);

  return {
    id,
    name,
    photos,
    coverPhoto: photos[0] || '',
    dob: getProperty<string | null>(properties, 'Date of Birth', null),
    color: getProperty<string>(properties, 'Color', ''),
    gender: getProperty<'Male' | 'Female'>(properties, 'Gender', 'Female'),
    mother: null,
    motherId: motherIds[0] || null,
    father: null,
    fatherId: fatherIds[0] || null,
    wentHome: getProperty<string | null>(properties, 'Went Home', null),
  };
}

/**
 * Transform Notion page to BlogPost object
 */
function transformBlogPost(page: PageObjectResponse): BlogPost {
  const { properties, id } = page;

  const title = getProperty<string>(properties, 'Title', 'Untitled Post');
  const slug = getProperty<string>(properties, 'Slug', '') || slugify(title);
  const coverImages = getProperty<string[]>(properties, 'Cover Image', []);

  return {
    id,
    title,
    slug,
    coverImage: coverImages[0] || '',
    content: getRichTextHtml(properties, 'Content'),
    excerpt: getProperty<string>(properties, 'Excerpt', ''),
    category: getProperty<string>(properties, 'Category', 'General'),
    tags: getProperty<string[]>(properties, 'Tags', []),
    author: getProperty<string>(properties, 'Author', 'Lakeshore Ragdolls'),
    publishedDate: getProperty<string>(properties, 'Published Date', new Date().toISOString()),
    seoDescription: getProperty<string | null>(properties, 'SEO Description', null),
  };
}

/**
 * Transform Notion page to FAQ object
 */
function transformFAQ(page: PageObjectResponse): FAQ {
  const { properties, id } = page;

  return {
    id,
    question: getProperty<string>(properties, 'Question', ''),
    answer: getRichTextHtml(properties, 'Answer'),
    category: getProperty<string>(properties, 'Category', 'General'),
    sortOrder: getProperty<number>(properties, 'Sort Order', 0),
  };
}

/**
 * Transform Notion page to Page object
 */
function transformPage(page: PageObjectResponse): Page {
  const { properties, id } = page;

  const title = getProperty<string>(properties, 'Title', 'Untitled');
  const slug = getProperty<string>(properties, 'Slug', '') || slugify(title);

  return {
    id,
    title,
    slug,
    content: getRichTextHtml(properties, 'Content'),
    seoDescription: getProperty<string | null>(properties, 'SEO Description', null),
  };
}

// =============================================================================
// QUERY FUNCTIONS
// =============================================================================

/**
 * Generic query function with error handling
 */
async function queryDatabase<T>(
  databaseId: string | undefined,
  transform: (page: PageObjectResponse) => T,
  additionalFilter?: DatabaseFilter
): Promise<T[]> {
  if (!databaseId) {
    console.warn('Database ID not configured');
    return [];
  }

  try {
    const filter: DatabaseFilter = additionalFilter
      ? {
          and: [
            { property: 'Published', checkbox: { equals: true } },
            additionalFilter,
          ],
        }
      : { property: 'Published', checkbox: { equals: true } };

    // @ts-expect-error - Notion SDK types are incomplete, query method exists at runtime
    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
    });

    return response.results
      .filter(isPageObjectResponse)
      .map(transform);
  } catch (error) {
    console.error(`Error querying database ${databaseId}:`, error);
    return [];
  }
}

/**
 * Get a single page by slug
 */
async function getBySlug<T>(
  databaseId: string | undefined,
  slug: string,
  transform: (page: PageObjectResponse) => T
): Promise<T | null> {
  if (!databaseId || !slug) return null;

  try {
    // @ts-expect-error - Notion SDK types are incomplete, query method exists at runtime
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          { property: 'Slug', rich_text: { equals: slug } },
        ],
      },
    });

    const page = response.results[0];
    if (!isPageObjectResponse(page)) return null;

    return transform(page);
  } catch (error) {
    console.error(`Error fetching by slug "${slug}":`, error);
    return null;
  }
}

// -----------------------------------------------------------------------------
// CATS
// -----------------------------------------------------------------------------

export async function getCats(): Promise<Cat[]> {
  const cats = await queryDatabase(DATABASE_IDS.cats, transformCat);
  return cats.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCatBySlug(slug: string): Promise<Cat | null> {
  return getBySlug(DATABASE_IDS.cats, slug, transformCat);
}

export async function getCatById(id: string): Promise<Cat | null> {
  if (!id) return null;

  try {
    const page = await notion.pages.retrieve({ page_id: id });
    if (!isPageObjectResponse(page)) return null;
    return transformCat(page);
  } catch (error) {
    console.error(`Error fetching cat by ID "${id}":`, error);
    return null;
  }
}

// -----------------------------------------------------------------------------
// KITTENS
// -----------------------------------------------------------------------------

export async function getKittens(status?: Kitten['status']): Promise<Kitten[]> {
  const filter = status
    ? { property: 'Status', select: { equals: status } }
    : undefined;

  return queryDatabase(DATABASE_IDS.kittens, transformKitten, filter);
}

export async function getAvailableKittens(): Promise<Kitten[]> {
  return getKittens('Available');
}

export async function getKittenBySlug(slug: string): Promise<Kitten | null> {
  return getBySlug(DATABASE_IDS.kittens, slug, transformKitten);
}

// -----------------------------------------------------------------------------
// PAST KITTENS
// -----------------------------------------------------------------------------

export async function getPastKittens(): Promise<PastKitten[]> {
  return queryDatabase(DATABASE_IDS.pastKittens, transformPastKitten);
}

// -----------------------------------------------------------------------------
// BLOG
// -----------------------------------------------------------------------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await queryDatabase(DATABASE_IDS.blog, transformBlogPost);
  // Sort by published date, newest first
  return posts.sort((a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return getBySlug(DATABASE_IDS.blog, slug, transformBlogPost);
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const filter = { property: 'Category', select: { equals: category } };
  const posts = await queryDatabase(DATABASE_IDS.blog, transformBlogPost, filter);
  return posts.sort((a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

// -----------------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------------

export async function getFAQs(): Promise<FAQ[]> {
  const faqs = await queryDatabase(DATABASE_IDS.faq, transformFAQ);
  return faqs.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  const filter = { property: 'Category', select: { equals: category } };
  const faqs = await queryDatabase(DATABASE_IDS.faq, transformFAQ, filter);
  return faqs.sort((a, b) => a.sortOrder - b.sortOrder);
}

// -----------------------------------------------------------------------------
// PAGES
// -----------------------------------------------------------------------------

export async function getPages(): Promise<Page[]> {
  return queryDatabase(DATABASE_IDS.pages, transformPage);
}

export async function getPage(slug: string): Promise<Page | null> {
  return getBySlug(DATABASE_IDS.pages, slug, transformPage);
}

// =============================================================================
// RELATION RESOLUTION
// =============================================================================

/**
 * Resolve parent cats for a kitten
 * Fetches the full Cat objects for mother and father
 */
export async function resolveKittenParents(kitten: Kitten): Promise<Kitten> {
  const [mother, father] = await Promise.all([
    kitten.motherId ? getCatById(kitten.motherId) : null,
    kitten.fatherId ? getCatById(kitten.fatherId) : null,
  ]);

  return {
    ...kitten,
    mother,
    father,
  };
}

/**
 * Resolve parents for multiple kittens
 */
export async function resolveKittensParents(kittens: Kitten[]): Promise<Kitten[]> {
  // Get unique parent IDs to minimize API calls
  const parentIds = new Set<string>();
  kittens.forEach((kitten) => {
    if (kitten.motherId) parentIds.add(kitten.motherId);
    if (kitten.fatherId) parentIds.add(kitten.fatherId);
  });

  // Fetch all parents in parallel
  const parentPromises = Array.from(parentIds).map((id) => getCatById(id));
  const parents = await Promise.all(parentPromises);

  // Create a map for quick lookup
  const parentMap = new Map<string, Cat>();
  parents.forEach((parent) => {
    if (parent) parentMap.set(parent.id, parent);
  });

  // Assign parents to kittens
  return kittens.map((kitten) => ({
    ...kitten,
    mother: kitten.motherId ? parentMap.get(kitten.motherId) || null : null,
    father: kitten.fatherId ? parentMap.get(kitten.fatherId) || null : null,
  }));
}

/**
 * Resolve parents for past kittens
 */
export async function resolvePastKittensParents(kittens: PastKitten[]): Promise<PastKitten[]> {
  const parentIds = new Set<string>();
  kittens.forEach((kitten) => {
    if (kitten.motherId) parentIds.add(kitten.motherId);
    if (kitten.fatherId) parentIds.add(kitten.fatherId);
  });

  const parentPromises = Array.from(parentIds).map((id) => getCatById(id));
  const parents = await Promise.all(parentPromises);

  const parentMap = new Map<string, Cat>();
  parents.forEach((parent) => {
    if (parent) parentMap.set(parent.id, parent);
  });

  return kittens.map((kitten) => ({
    ...kitten,
    mother: kitten.motherId ? parentMap.get(kitten.motherId) || null : null,
    father: kitten.fatherId ? parentMap.get(kitten.fatherId) || null : null,
  }));
}
