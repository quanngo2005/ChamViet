export interface StoryVideoEntry {
  slug: string;
  title: string;
  videoId: string;
  aliases: string[];
}

const DEFAULT_VIDEO_ID = "Mb0RWyh3sqQ";
const DEFAULT_STORY_SLUG = "con-rong-chau-tien";

const STORY_VIDEO_ENTRIES: StoryVideoEntry[] = [
  {
    slug: DEFAULT_STORY_SLUG,
    title: "Con Rồng Cháu Tiên",
    videoId: DEFAULT_VIDEO_ID,
    aliases: [
      "con rong chau tien",
      "con-rong-chau-tien",
      "sample",
      "default",
      "demo",
    ],
  },
  {
    slug: "su-tich-ho-guom",
    title: "Sự tích Hồ Gươm",
    videoId: DEFAULT_VIDEO_ID,
    aliases: [
      "su tich ho guom",
      "sự tích hồ gươm",
      "ho guom",
      "hồ gươm",
      "ho hoan kiem",
      "hồ hoàn kiếm",
      "su ho guom",
    ],
  },
  {
    slug: "su-tich-thanh-giong",
    title: "Sự tích Thánh Gióng",
    videoId: DEFAULT_VIDEO_ID,
    aliases: [
      "su tich thanh giong",
      "sự tích thánh gióng",
      "thanh giong",
      "thánh gióng",
      "giong",
      "thanhgiong",
    ],
  },
  {
    slug: "auco-laclongquan",
    title: "Lạc Long Quân và Âu Cơ",
    videoId: DEFAULT_VIDEO_ID,
    aliases: [
      "lac long quan va au co",
      "lạc long quân và âu cơ",
      "lac long quan",
      "lạc long quân",
      "au co",
      "âu cơ",
      "auco laclongquan",
      "auco_laclongquan",
    ],
  },
];

const FEATURED_STORY_SLUGS = ["su-tich-ho-guom"] as const;

function normalizeKey(value: string): string {
  return value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchesEntry(entry: StoryVideoEntry, key: string): boolean {
  if (normalizeKey(entry.slug) === key) {
    return true;
  }

  if (normalizeKey(entry.title) === key) {
    return true;
  }

  return entry.aliases.some((alias) => normalizeKey(alias) === key);
}

export function getDefaultStoryVideoEntry(): StoryVideoEntry {
  return STORY_VIDEO_ENTRIES[0];
}

export function getFeaturedStoryVideoEntries(): StoryVideoEntry[] {
  return FEATURED_STORY_SLUGS
    .map((slug) => STORY_VIDEO_ENTRIES.find((entry) => entry.slug === slug))
    .filter((entry): entry is StoryVideoEntry => entry !== undefined);
}

export function getDefaultFeaturedStoryEntry(): StoryVideoEntry {
  return getFeaturedStoryVideoEntries()[0] ?? getDefaultStoryVideoEntry();
}

export function findStoryVideoEntryBySlug(slug?: string | null): StoryVideoEntry | null {
  if (!slug) {
    return null;
  }

  const key = normalizeKey(slug);
  return STORY_VIDEO_ENTRIES.find((entry) => matchesEntry(entry, key)) ?? null;
}

export function findStoryVideoEntryByName(name?: string | null): StoryVideoEntry | null {
  if (!name) {
    return null;
  }

  const key = normalizeKey(name);
  return STORY_VIDEO_ENTRIES.find((entry) => matchesEntry(entry, key)) ?? null;
}

export function resolveStoryRouteFromName(name?: string | null): string | undefined {
  const entry = findStoryVideoEntryByName(name);
  return entry ? `/story/${entry.slug}` : undefined;
}

export function resolveStoryVideoId(slug?: string | null): string {
  return findStoryVideoEntryBySlug(slug)?.videoId ?? getDefaultStoryVideoEntry().videoId;
}
