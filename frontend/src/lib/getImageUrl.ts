const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

export function getImageUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${UPLOADS_URL}${path.startsWith("/") ? path : `/${path}`}`;
}