export interface StaticStoryEntry {
  label: string;
  storySlug: string;
  videoId: string;
  title: string;
}

const STATIC_STORY_REGISTRY: StaticStoryEntry[] = [
  {
    label: "hoguom",
    storySlug: "su-tich-ho-guom",
    videoId: "Mb0RWyh3sqQ",
    title: "Sự tích Hồ Gươm",
  },
  {
    label: "thanhgiong",
    storySlug: "su-tich-thanh-giong",
    videoId: "Mb0RWyh3sqQ",
    title: "Sự tích Thánh Gióng",
  },
  {
    label: "auco_laclongquan",
    storySlug: "auco-laclongquan",
    videoId: "Mb0RWyh3sqQ",
    title: "Lạc Long Quân và Âu Cơ",
  },
  {
    label: "laclongquan_auco",
    storySlug: "auco-laclongquan",
    videoId: "Mb0RWyh3sqQ",
    title: "Lạc Long Quân và Âu Cơ",
  },
];

export function findStaticStoryByLabel(label: string): StaticStoryEntry | undefined {
  const key = label.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return STATIC_STORY_REGISTRY.find((entry) => entry.label === key);
}

export function getStaticStoryRegistry(): StaticStoryEntry[] {
  return [...STATIC_STORY_REGISTRY];
}
