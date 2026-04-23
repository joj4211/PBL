import { useEffect, useState } from 'react';
import { Image, UploadCloud, Video } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

function normalizeMedia(media) {
  if (!media) return {};
  if (typeof media === 'string') return { filename: media };
  return media;
}

function safeFileName(name) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'media-file';
}

export default function ImagePlaceholder({
  media,
  src,        // if provided, attempt to render as <img>
  url,
  poster,
  bucket,
  path,
  filename,
  label,
  note,
  aspectRatio = '4 / 3',
  type = 'image', // 'image' | 'video'
  caseId,
  lang = 'zh',
  assetKey,
  isAdmin = false,
  user,
}) {
  const [remoteMedia, setRemoteMedia] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [signedUrl, setSignedUrl] = useState(null);
  const [uploadState, setUploadState] = useState('idle');
  const [uploadError, setUploadError] = useState('');
  const item = normalizeMedia(remoteMedia ?? media);
  const resolvedType = item.type ?? type;
  const resolvedProvider = item.provider;
  const resolvedLabel = item.label ?? label;
  const resolvedNote = item.note ?? note;
  const resolvedFilename = item.filename ?? filename;
  const resolvedAspectRatio = item.aspectRatio ?? aspectRatio;
  const resolvedPoster = item.poster ?? poster;
  const resolvedBucket = item.bucket ?? bucket ?? 'case-media';
  const resolvedPath = item.path ?? path;
  const Icon = resolvedType === 'video' ? Video : Image;
  const resolvedSrc = item.src ?? item.url ?? src ?? url ?? signedUrl ?? (resolvedFilename ? `/${resolvedFilename}` : null);
  const showVideo = resolvedType === 'video' && resolvedSrc && !loadError;
  const showImage = resolvedType === 'image' && resolvedSrc && !loadError;
  const codeValue = resolvedFilename ?? resolvedPath ?? resolvedSrc;
  const canUpload = isAdmin && caseId && assetKey && user?.id;

  useEffect(() => {
    setLoadError(false);
  }, [resolvedSrc, resolvedPath]);

  useEffect(() => {
    if (!caseId || !assetKey) return;

    let cancelled = false;

    async function loadAssetOverride() {
      const { data, error } = await supabase
        .from('case_media_assets')
        .select('bucket,path,type,label,note,aspect_ratio')
        .eq('case_id', caseId)
        .eq('language', lang)
        .eq('asset_key', assetKey)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) return;

      setRemoteMedia({
        type: data.type,
        provider: 'supabase',
        bucket: data.bucket,
        path: data.path,
        label: data.label,
        note: data.note,
        aspectRatio: data.aspect_ratio,
      });
    }

    loadAssetOverride();

    return () => {
      cancelled = true;
    };
  }, [assetKey, caseId, lang]);

  useEffect(() => {
    if (resolvedProvider !== 'supabase' || !resolvedPath) {
      setSignedUrl(null);
      return;
    }

    let cancelled = false;

    async function loadSignedUrl() {
      const { data, error } = await supabase.storage
        .from(resolvedBucket)
        .createSignedUrl(resolvedPath, 3600);

      if (cancelled) return;

      if (error) {
        setSignedUrl(null);
        setLoadError(true);
        return;
      }

      setSignedUrl(data.signedUrl);
    }

    loadSignedUrl();

    return () => {
      cancelled = true;
    };
  }, [resolvedBucket, resolvedPath, resolvedProvider]);

  const handleUpload = async (file) => {
    if (!file || !canUpload) return;

    setUploadState('uploading');
    setUploadError('');

    const nextType = file.type.startsWith('video/') ? 'video' : 'image';
    const nextBucket = 'case-media';
    const nextPath = `${caseId}/${lang}/${assetKey}/${Date.now()}-${safeFileName(file.name)}`;

    const { error: uploadStorageError } = await supabase.storage
      .from(nextBucket)
      .upload(nextPath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadStorageError) {
      setUploadError(uploadStorageError.message);
      setUploadState('error');
      return;
    }

    const nextMedia = {
      type: nextType,
      provider: 'supabase',
      bucket: nextBucket,
      path: nextPath,
      label: resolvedLabel,
      note: resolvedNote,
      aspectRatio: resolvedAspectRatio,
    };

    const { error: saveError } = await supabase
      .from('case_media_assets')
      .upsert({
        case_id: caseId,
        language: lang,
        asset_key: assetKey,
        bucket: nextBucket,
        path: nextPath,
        type: nextType,
        label: resolvedLabel,
        note: resolvedNote,
        aspect_ratio: resolvedAspectRatio,
        uploaded_by: user.id,
      }, {
        onConflict: 'case_id,language,asset_key',
      });

    if (saveError) {
      await supabase.storage.from(nextBucket).remove([nextPath]);
      setUploadError(saveError.message);
      setUploadState('error');
      return;
    }

    setRemoteMedia(nextMedia);
    setUploadState('uploaded');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleUpload(event.dataTransfer.files?.[0]);
  };

  const uploadControl = canUpload ? (
    <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-sage-200 bg-sage-50 px-3 py-1.5 text-xs font-semibold text-sage-700 hover:bg-sage-100">
      <UploadCloud className="h-3.5 w-3.5" />
      {uploadState === 'uploading' ? '上傳中...' : '上傳媒體'}
      <input
        type="file"
        accept="image/*,video/*"
        className="hidden"
        disabled={uploadState === 'uploading'}
        onChange={(event) => handleUpload(event.target.files?.[0])}
      />
    </label>
  ) : null;

  const uploadFeedback = uploadError ? (
    <p className="px-3 pb-2 text-center text-xs text-red-500">{uploadError}</p>
  ) : uploadState === 'uploaded' ? (
    <p className="px-3 pb-2 text-center text-xs text-sage-600">已上傳</p>
  ) : null;

  if (showImage) {
    return (
      <div
        className="w-full rounded-xl overflow-hidden border border-warm-200 bg-warm-50/30"
        onDragOver={(event) => canUpload && event.preventDefault()}
        onDrop={handleDrop}
      >
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
        <div className="text-center">{uploadControl}</div>
        {uploadFeedback}
      </div>
    );
  }

  if (showVideo) {
    return (
      <div
        className="w-full rounded-xl overflow-hidden border border-warm-200 bg-black"
        onDragOver={(event) => canUpload && event.preventDefault()}
        onDrop={handleDrop}
      >
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
        <div className="text-center bg-warm-50">{uploadControl}</div>
        {uploadFeedback}
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-xl overflow-hidden border-2 border-dashed border-warm-300 bg-warm-50/60"
      onDragOver={(event) => canUpload && event.preventDefault()}
      onDrop={handleDrop}
    >
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
        {uploadControl}
      </div>
      {uploadFeedback}
    </div>
  );
}
