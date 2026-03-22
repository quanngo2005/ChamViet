import storyVideo from "../../../data/story-video.json";

export const COLORS = {
  bg: "#1f1313",
  surface: "#ffffff",
  surfaceAlt: "rgba(255, 255, 255, 0.06)",
  title: "#ffffff",
  titleDark: "#0f172a",
  body: "rgba(255, 255, 255, 0.78)",
  bodyDark: "#334155",
  muted: "rgba(255, 255, 255, 0.60)",
  mutedDark: "#64748b",
  accent: "#a83232",
  accentSoft: "rgba(168, 50, 50, 0.10)",
  borderSoft: "rgba(168, 50, 50, 0.18)",
};

export type StoryVideoContent = {
  hero: { currentTime: string; separator: string; totalTime: string };
  story: {
    category: string;
    title: string;
    meta: string[];
    paragraphs: string[];
    closing: string;
  };
  cta: { title: string; description: string; buttonLabel: string; to: string };
  explore: { title: string; items: Array<{ title: string; meta: string }> };
  projectIntro: { title: string; subtitle: string; buttonLabel: string; to: string };
};

export const CONTENT = storyVideo as StoryVideoContent;
