export default function MediaPreview({
  media,
  title,
  className = "",
}) {
  if (!media?.url) return null;

  // ================= VIDEO =================
  if (media.type === "video") {
    return (
      <video
        src={media.url}
        className={className}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  // ================= IMAGE =================
  return (
    <img
      src={media.url}
      alt={title}
      className={className}
    />
  );
}