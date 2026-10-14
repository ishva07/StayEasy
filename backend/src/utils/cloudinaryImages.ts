import cloudinary from "../config/cloudinary";
import ApiError from "./ApiError";

function getCloudinaryPublicId(imageUrl: string): string | undefined {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return undefined;
  }

  if (parsedUrl.hostname !== "res.cloudinary.com") return undefined;

  const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
  const uploadIndex = pathSegments.indexOf("upload");
  if (uploadIndex === -1) return undefined;

  const versionIndex = pathSegments.findIndex(
    (segment, index) => index > uploadIndex && /^v\d+$/.test(segment),
  );
  if (versionIndex === -1) return undefined;

  const publicId = pathSegments
    .slice(versionIndex + 1)
    .map((segment) => decodeURIComponent(segment))
    .join("/")
    .replace(/\.(?:jpe?g|png|gif|webp|avif)$/i, "");

  return publicId || undefined;
}

export async function deleteCloudinaryImages(imageUrls: Array<string | null | undefined>) {
  const publicIds = [...new Set(imageUrls.flatMap((url) => {
    if (!url) return [];
    const publicId = getCloudinaryPublicId(url);
    return publicId ? [publicId] : [];
  }))];

  const results = await Promise.allSettled(
    publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
  );
  const failures = results.flatMap((result, index) => {
    if (result.status === "rejected") {
      const reason = result.reason;
      return [{
        publicId: publicIds[index],
        reason: reason instanceof Error ? reason.message : String(reason),
      }];
    }

    if (result.value.result !== "ok" && result.value.result !== "not found") {
      return [{ publicId: publicIds[index], reason: result.value.result }];
    }

    return [];
  });

  if (failures.length) {
    console.error("Cloudinary image cleanup failed:", failures);
    throw new ApiError(502, "Database changes succeeded, but Cloudinary image cleanup failed.");
  }
}
