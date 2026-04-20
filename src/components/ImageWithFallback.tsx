type Props = {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
};

export function ImageWithFallback({ src, fallback, alt, className }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (img.src !== fallback) img.src = fallback;
      }}
    />
  );
}
