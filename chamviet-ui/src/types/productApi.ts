import type { Product } from "./product";
import type { StoryConfig, StoryQA } from "../data/video-story-qa";

export interface ApiResponseEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
}

export interface ProductImageApi {
  id?: number;
  imageUrl: string;
  sortOrder?: number;
  primary?: boolean;
}

export interface ProductVariantComponentApi {
  id: number;
  componentId: number;
  componentSku: string;
  componentName: string;
  componentType: string;
  quantity: number;
  sortOrder: number;
  videoUrl?: string;
  storyTitle?: string;
  storyContent?: string;
  storyQaJson?: string;
  pieceCount?: number;
}

export interface ProductVariantApi {
  id: number;
  sku: string;
  price?: number | null;
  ageRangeId?: number | null;
  ageRangeName?: string | null;
  attributes?: unknown;
  components: ProductVariantComponentApi[];
}

export interface ProductApi {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  status?: string;
  category?: {
    id?: number;
    name?: string;
    slug?: string;
  };
  images?: ProductImageApi[];
  variants?: ProductVariantApi[];
}

export interface ProductStoryContent {
  heading: string;
  paragraphs: string[];
}

export interface ProductIncludedItem {
  title: string;
  description: string;
}

export interface ProductDetailViewModel extends Product {
  apiId: number;
  slug?: string;
  variantId?: number;
  variantSku?: string;
  imageUrls: string[];
}

export interface ProductDetailData {
  product: ProductDetailViewModel | null;
  includedItems: ProductIncludedItem[];
  storySection: ProductStoryContent;
  puzzleComponent: ProductVariantComponentApi | null;
  storyConfig: StoryConfig | null;
  storyVideoId: string | null;
}

export function buildStoryConfigFromComponent(
  component: ProductVariantComponentApi | null,
  childAge: number,
): StoryConfig | null {
  if (!component || !component.storyContent || !component.storyQaJson) {
    return null;
  }

  const qaList = parseStoryQaJson(component.storyQaJson);
  if (qaList.length === 0) {
    return null;
  }

  return {
    componentId: component.componentId,
    componentSku: component.componentSku,
    videoId: extractVideoId(component.videoUrl) ?? undefined,
    videoUrl: component.videoUrl,
    storyTitle: component.storyTitle?.trim() || component.componentName,
    childAge,
    pieceCount: component.pieceCount,
    storyContent: component.storyContent,
    qaList,
  };
}

export function extractVideoId(videoUrl?: string): string | null {
  if (!videoUrl) {
    return null;
  }

  const normalized = videoUrl.trim();
  if (!normalized) {
    return null;
  }

  if (!normalized.includes("://")) {
    return normalized;
  }

  if (normalized.includes("watch?v=")) {
    return normalized.split("watch?v=")[1]?.split("&")[0] ?? null;
  }

  if (normalized.includes("youtu.be/")) {
    return normalized.split("youtu.be/")[1]?.split("?")[0] ?? null;
  }

  return normalized;
}

function parseStoryQaJson(storyQaJson: string): StoryQA[] {
  try {
    const parsed = JSON.parse(storyQaJson) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const record = item as Record<string, unknown>;
        const question = typeof record.question === "string" ? record.question.trim() : "";
        const answer = typeof record.answer === "string" ? record.answer.trim() : "";

        if (!question || !answer) {
          return null;
        }

        return { question, answer };
      })
      .filter((item): item is StoryQA => item !== null);
  } catch {
    return [];
  }
}
