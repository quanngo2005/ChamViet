const DEFAULT_API_ORIGIN = "http://localhost:8081";

function stripKnownApiSuffix(value: string): string {
  return value.replace(/\/api(?:\/v1(?:\/voice)?)?(?:\/public)?\/?$/i, "");
}

export function resolveApiOrigin(rawBaseUrl?: string): string {
  const trimmed = (rawBaseUrl ?? "").trim();
  if (!trimmed) {
    return DEFAULT_API_ORIGIN;
  }

  return stripKnownApiSuffix(trimmed).replace(/\/$/, "") || DEFAULT_API_ORIGIN;
}

export function buildApiUrl(rawBaseUrl: string | undefined, path: string): string {
  const origin = resolveApiOrigin(rawBaseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}
