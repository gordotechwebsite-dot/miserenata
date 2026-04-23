type Props = {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
};

export function ImageWithFallback({
  src,
  fallback,
  alt,
  className,
  loading = "lazy",
  decoding = "async",
}: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (img.src !== fallback) img.src = fallback;
      }}
    />
  );
}
