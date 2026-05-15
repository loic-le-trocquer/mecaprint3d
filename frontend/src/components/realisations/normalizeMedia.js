export default function normalizeMedia(item) {
  const media = Array.isArray(item?.media)
    ? item.media.filter((m) => m?.url)
    : [];

  if (media.length) return media;

  if (item?.imageUrl) {
    return [{ type: "image", url: item.imageUrl }];
  }

  if (item?.videoUrl) {
    return [{ type: "video", url: item.videoUrl }];
  }

  return [];
}