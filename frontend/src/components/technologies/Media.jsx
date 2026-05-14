export default function Media({ item }) {
  if (!item?.mediaUrl) return null;

  // ================= VIDEO =================
  if (
    item.mediaType === "video" ||
    /\.(mp4|webm|ogg)(\?|#|$)/i.test(item.mediaUrl)
  ) {
    return (
      <video
        src={item.mediaUrl}
        className="h-56 w-full rounded-3xl object-cover opacity-90 transition duration-700 group-hover:scale-105"
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
      src={item.mediaUrl}
      alt={item.title}
      className="h-56 w-full rounded-3xl object-cover opacity-90 transition duration-700 group-hover:scale-105"
    />
  );
}