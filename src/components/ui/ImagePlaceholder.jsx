import { useState } from 'react';
import { Image, Video } from 'lucide-react';

export default function ImagePlaceholder({
  src,        // if provided, attempt to render as <img>
  filename,
  label,
  note,
  aspectRatio = '4 / 3',
  type = 'image', // 'image' | 'video'
}) {
  const [imgError, setImgError] = useState(false);
  const Icon = type === 'video' ? Video : Image;

  // Derive src from filename if not explicitly given
  const resolvedSrc = src ?? (filename ? `/${filename}` : null);
  const showImage = type === 'image' && resolvedSrc && !imgError;

  if (showImage) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-warm-200 bg-warm-50/30">
        <img
          src={resolvedSrc}
          alt={label ?? filename}
          onError={() => setImgError(true)}
          className="w-full object-contain"
          style={{ aspectRatio }}
        />
        {label && (
          <p className="text-xs text-center text-warm-400 py-2 px-3">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-dashed border-warm-300 bg-warm-50/60">
      <div style={{ aspectRatio }} className="w-full flex flex-col items-center justify-center gap-3 p-6">
        <Icon className="w-10 h-10 text-warm-300" strokeWidth={1.5} />
        {label && (
          <p className="text-sm font-semibold text-warm-500 text-center">{label}</p>
        )}
        {note && (
          <p className="text-xs text-warm-400 text-center leading-relaxed">{note}</p>
        )}
        {filename && (
          <div className="mt-1 px-3 py-1 rounded-lg bg-warm-100 border border-warm-200">
            <code className="text-xs text-warm-600 font-mono">{filename}</code>
          </div>
        )}
      </div>
    </div>
  );
}
