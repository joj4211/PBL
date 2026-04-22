import { useEffect, useState } from 'react';
import { Image, Video } from 'lucide-react';

function normalizeMedia(media) {
  if (!media) return {};
  if (typeof media === 'string') return { filename: media };
  return media;
}

function buildCloudinaryUrl({ cloudName, resourceType, publicId, transformation }) {
  if (!cloudName || !publicId) return null;

  const transformPath = transformation ? `${transformation}/` : '';
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformPath}${publicId}`;
}

export default function ImagePlaceholder({
  media,
  src,        // if provided, attempt to render as <img>
  url,
  provider,
  publicId,
  cloudName,
  transformation,
  youtubeId,
  videoId,
  poster,
  filename,
  label,
  note,
  aspectRatio = '4 / 3',
  type = 'image', // 'image' | 'video'
}) {
  const item = normalizeMedia(media);
  const resolvedType = item.type ?? type;
  const resolvedProvider = item.provider ?? provider;
  const resolvedLabel = item.label ?? label;
  const resolvedNote = item.note ?? note;
  const resolvedFilename = item.filename ?? filename;
  const resolvedPublicId = item.publicId ?? publicId;
  const resolvedCloudName =
    item.cloudName ?? cloudName ?? import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const resolvedTransformation =
    item.transformation ??
    transformation ??
    (resolvedType === 'video' ? 'q_auto' : 'f_auto,q_auto,c_limit,w_1200');
  const resolvedAspectRatio = item.aspectRatio ?? aspectRatio;
  const resolvedYoutubeId = item.youtubeId ?? item.videoId ?? youtubeId ?? videoId;
  const resolvedPoster = item.poster ?? poster;
  const resourceType = resolvedType === 'video' ? 'video' : 'image';
  const Icon = resolvedType === 'video' ? Video : Image;
  const [loadError, setLoadError] = useState(false);

  const cloudinarySrc =
    resolvedProvider === 'cloudinary'
      ? buildCloudinaryUrl({
          cloudName: resolvedCloudName,
          resourceType,
          publicId: resolvedPublicId,
          transformation: resolvedTransformation,
        })
      : null;
  const resolvedSrc = item.src ?? item.url ?? src ?? url ?? cloudinarySrc ?? (resolvedFilename ? `/${resolvedFilename}` : null);
  const showYoutube = resolvedProvider === 'youtube' && resolvedYoutubeId && !loadError;
  const showVideo = resolvedType === 'video' && resolvedSrc && !showYoutube && !loadError;
  const showImage = resolvedType === 'image' && resolvedSrc && !loadError;
  const codeValue = resolvedFilename ?? resolvedPublicId ?? resolvedYoutubeId ?? resolvedSrc;

  useEffect(() => {
    setLoadError(false);
  }, [resolvedSrc, resolvedYoutubeId]);

  if (showImage) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-warm-200 bg-warm-50/30">
        <img
          src={resolvedSrc}
          alt={resolvedLabel ?? resolvedFilename ?? ''}
          onError={() => setLoadError(true)}
          className="w-full object-contain"
          style={{ aspectRatio: resolvedAspectRatio }}
        />
        {resolvedLabel && (
          <p className="text-xs text-center text-warm-400 py-2 px-3">{resolvedLabel}</p>
        )}
      </div>
    );
  }

  if (showVideo) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-warm-200 bg-black">
        <video
          src={resolvedSrc}
          poster={resolvedPoster}
          controls
          preload="metadata"
          onError={() => setLoadError(true)}
          className="w-full object-contain"
          style={{ aspectRatio: resolvedAspectRatio }}
        />
        {resolvedLabel && (
          <p className="text-xs text-center text-warm-400 py-2 px-3 bg-warm-50">{resolvedLabel}</p>
        )}
      </div>
    );
  }

  if (showYoutube) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-warm-200 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${resolvedYoutubeId}`}
          title={resolvedLabel ?? 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full"
          style={{ aspectRatio: resolvedAspectRatio }}
        />
        {resolvedLabel && (
          <p className="text-xs text-center text-warm-400 py-2 px-3 bg-warm-50">{resolvedLabel}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-dashed border-warm-300 bg-warm-50/60">
      <div style={{ aspectRatio: resolvedAspectRatio }} className="w-full flex flex-col items-center justify-center gap-3 p-6">
        <Icon className="w-10 h-10 text-warm-300" strokeWidth={1.5} />
        {resolvedLabel && (
          <p className="text-sm font-semibold text-warm-500 text-center">{resolvedLabel}</p>
        )}
        {resolvedNote && (
          <p className="text-xs text-warm-400 text-center leading-relaxed">{resolvedNote}</p>
        )}
        {codeValue && (
          <div className="mt-1 px-3 py-1 rounded-lg bg-warm-100 border border-warm-200">
            <code className="text-xs text-warm-600 font-mono">{codeValue}</code>
          </div>
        )}
      </div>
    </div>
  );
}
