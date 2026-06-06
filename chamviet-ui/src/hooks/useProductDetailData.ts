import { useEffect, useMemo, useState } from "react";
import { PRODUCT_CATALOG } from "../pages/products/catalog";
import { PRODUCT_DETAIL_COPY } from "../data/productDetail";
import { buildApiUrl } from "../utils/apiBase";
import type {
  ApiResponseEnvelope,
  ProductApi,
  ProductDetailData,
  ProductDetailViewModel,
  ProductIncludedItem,
  ProductStoryContent,
  ProductVariantApi,
  ProductVariantComponentApi,
} from "../types/productApi";
import { buildStoryConfigFromComponent } from "../types/productApi";

const PRODUCT_ID_ALIASES: Record<string, string> = {
  "box-tuong-tac-ke-chuyen": "1",
  "cham-viet-box-2-tranh": "1",
  "hop-lac-long-quan": "1",
};

function resolveProductLookupId(productId: string | undefined): string | undefined {
  if (!productId) {
    return undefined;
  }

  return PRODUCT_ID_ALIASES[productId] ?? productId;
}

function formatCurrency(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Liên hệ";
  }

  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

function splitStoryParagraphs(storyContent?: string): string[] {
  if (!storyContent?.trim()) {
    return PRODUCT_DETAIL_COPY.story.paragraphs;
  }

  const paragraphs = storyContent
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return paragraphs.length > 0 ? paragraphs : [storyContent.trim()];
}

function buildStorySection(puzzleComponent: ProductVariantComponentApi | null): ProductStoryContent {
  if (!puzzleComponent?.storyContent) {
    return PRODUCT_DETAIL_COPY.story;
  }

  return {
    heading: puzzleComponent.storyTitle?.trim() || PRODUCT_DETAIL_COPY.story.heading,
    paragraphs: splitStoryParagraphs(puzzleComponent.storyContent),
  };
}

function buildIncludedItems(components: ProductVariantComponentApi[]): ProductIncludedItem[] {
  if (components.length === 0) {
    return PRODUCT_DETAIL_COPY.included;
  }

  const puzzleComponents = components.filter((item) => item.componentType === "PUZZLE");
  const pepperGhostCount = components.filter((item) => item.componentType === "PEPPER_GHOST").length;
  const puzzleNames = puzzleComponents.map((item) => item.componentName).filter(Boolean);

  return [
    {
      title: `${String(Math.max(puzzleComponents.length, 1)).padStart(2, "0")} tranh puzzle gỗ`,
      description: puzzleNames.length > 0
        ? `${puzzleNames.join(", ")} để bé lắp ghép và mở câu chuyện.`
        : "Các tranh puzzle gỗ sẵn sàng để bé lắp ghép và mở câu chuyện.",
    },
    {
      title: "Thẻ truyện tương tác",
      description: "Quét để mở video kể chuyện, nghe nội dung và tiếp tục hỏi đáp sau khi xem xong.",
    },
    {
      title: "Hộp phản chiếu Pepper's Ghost",
      description: pepperGhostCount > 0
        ? "Hộp được thiết kế để đặt điện thoại và tạo hiệu ứng phản chiếu như một sân khấu nhỏ."
        : PRODUCT_DETAIL_COPY.included[2].description,
    },
  ];
}

function mapProduct(productApi: ProductApi): ProductDetailData {
  const primaryVariant: ProductVariantApi | undefined = productApi.variants?.[0];
  const components = primaryVariant?.components ?? [];
  const puzzleComponent = components.find((component) => component.componentType === "PUZZLE") ?? null;
  const childAge = primaryVariant?.ageRangeName
    ? Number(primaryVariant.ageRangeName.split("-")[0]) || 6
    : 6;
  const storyConfig = buildStoryConfigFromComponent(puzzleComponent, childAge);
  const imageUrls = (productApi.images ?? [])
    .map((image) => image.imageUrl)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl));

  const product: ProductDetailViewModel = {
    id: String(productApi.id),
    apiId: productApi.id,
    slug: productApi.slug,
    variantId: primaryVariant?.id,
    variantSku: primaryVariant?.sku,
    title: productApi.name,
    shortDescription: productApi.description?.trim() || PRODUCT_DETAIL_COPY.notFound.description,
    priceLabel: formatCurrency(primaryVariant?.price),
    compareAtPriceLabel: "",
    discountLabel: "",
    collectionLabel: productApi.category?.name?.trim() || "Chạm Việt Box",
    reviewsLabel: primaryVariant?.ageRangeName?.trim()
      ? `Độ tuổi ${primaryVariant.ageRangeName.trim()}`
      : "Phiên bản sẵn sàng trải nghiệm",
    ageLabel: primaryVariant?.ageRangeName?.trim() || undefined,
    topicLabel: puzzleComponent?.storyTitle?.trim() || productApi.category?.name?.trim() || undefined,
    badgeLabel: primaryVariant?.sku?.trim() || "Có sẵn",
    image: imageUrls[0],
    imageUrls,
  };

  return {
    product,
    includedItems: buildIncludedItems(components),
    storySection: buildStorySection(puzzleComponent),
    puzzleComponent,
    storyConfig,
    storyVideoId: storyConfig?.videoId ?? null,
  };
}

export function useProductDetailData(productId: string | undefined) {
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState<ProductDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resolvedProductId = useMemo(() => resolveProductLookupId(productId), [productId]);

  useEffect(() => {
    if (!resolvedProductId) {
      setProductData(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    setIsLoading(true);
    setErrorMessage(null);

    void (async () => {
      try {
        const response = await fetch(
          buildApiUrl(
            import.meta.env.VITE_API_BASE_URL as string | undefined,
            `/api/public/products/${resolvedProductId}`,
          ),
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(response.status === 404 ? "Không tìm thấy sản phẩm." : "Không tải được sản phẩm.");
        }

        const payload = (await response.json()) as ApiResponseEnvelope<ProductApi>;
        if (!payload.success || !payload.data) {
          throw new Error(payload.error || payload.message || "Không tải được sản phẩm.");
        }

        setProductData(mapProduct(payload.data));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setProductData(null);
        setErrorMessage(error instanceof Error ? error.message : "Không tải được sản phẩm.");
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [resolvedProductId]);

  const relatedProducts = useMemo(() => {
    return PRODUCT_CATALOG.slice(0, 4).map((p) => ({
      id: p.id,
      title: p.title,
      shortDescription: p.listCardDescription,
      priceLabel: p.priceLabel,
      compareAtPriceLabel: p.compareAtPriceLabel,
      discountLabel: p.discountLabel,
      collectionLabel: p.collectionLabel,
      reviewsLabel: p.reviewsLabel,
      badgeLabel: "Sắp ra mắt",
      ageLabel: p.listAgeLabel,
      topicLabel: p.listTopicLabel,
      image: undefined,
    }));
  }, []);

  return {
    product: productData?.product ?? null,
    includedItems: productData?.includedItems ?? PRODUCT_DETAIL_COPY.included,
    storySection: productData?.storySection ?? PRODUCT_DETAIL_COPY.story,
    puzzleComponent: productData?.puzzleComponent ?? null,
    storyConfig: productData?.storyConfig ?? null,
    storyVideoId: productData?.storyVideoId ?? null,
    quantity,
    setQuantity,
    relatedProducts,
    isLoading,
    errorMessage,
  };
}
