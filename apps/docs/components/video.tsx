"use client";

interface VideoProps {
  src: string;
  title?: string;
  poster?: string;
  className?: string;
}

export function Video({ src, title, poster, className = "" }: VideoProps) {
  // YouTube
  if (src.includes("youtube.com") || src.includes("youtu.be")) {
    const videoId = src.includes("youtu.be")
      ? src.split("/").pop()
      : new URL(src).searchParams.get("v");

    return (
      <div
        className={`relative w-full aspect-video rounded-lg overflow-hidden border ${className}`}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Vimeo
  if (src.includes("vimeo.com")) {
    const videoId = src.split("/").pop();

    return (
      <div
        className={`relative w-full aspect-video rounded-lg overflow-hidden border ${className}`}
      >
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title={title || "Vimeo video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Loom
  if (src.includes("loom.com")) {
    const videoId = src.split("/").pop();

    return (
      <div
        className={`relative w-full aspect-video rounded-lg overflow-hidden border ${className}`}
      >
        <iframe
          src={`https://www.loom.com/embed/${videoId}`}
          title={title || "Loom video"}
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Local/Direct video file
  return (
    <video
      controls
      poster={poster}
      className={`w-full rounded-lg border bg-black ${className}`}
      preload="metadata"
    >
      <source src={src} type={getVideoType(src)} />
      Your browser does not support the video tag.
    </video>
  );
}

function getVideoType(src: string): string {
  if (src.endsWith(".webm")) return "video/webm";
  if (src.endsWith(".ogg")) return "video/ogg";
  return "video/mp4";
}
