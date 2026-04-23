import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  hotspotTask = false,
  hotspotTargets = [],
  userHotspots = [],
  onHotspotsLoaded,
  onUserHotspotsChange,
}) {
  const [remoteMedia, setRemoteMedia] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [signedUrl, setSignedUrl] = useState(null);
  const [uploadState, setUploadState] = useState('idle');
  const [uploadError, setUploadError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [adminHotspots, setAdminHotspots] = useState([]);
  const [hotspotSaveState, setHotspotSaveState] = useState('idle');
  const [hotspotError, setHotspotError] = useState('');
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
  const hasVisibleMedia = showImage || showVideo;
  const codeValue = resolvedFilename ?? resolvedPath ?? resolvedSrc;
  const canUpload = isAdmin && caseId && assetKey && user?.id;

  useEffect(() => {
    setLoadError(false);
  }, [resolvedSrc, resolvedPath]);

  useEffect(() => {
    if (!previewOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPreviewOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewOpen]);

  useEffect(() => {
    if (!caseId || !assetKey) return;

    let cancelled = false;

    async function loadAssetOverride() {
      const { data, error } = await supabase
        .from('case_media_assets')
        .select('*')
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
        hotspots: data.hotspots ?? [],
      });
      setAdminHotspots(data.hotspots ?? []);
      if (onHotspotsLoaded) {
        onHotspotsLoaded(data.hotspots ?? []);
      }
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
        hotspots: adminHotspots,
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

  const getPointFromEvent = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      r: 6,
    };
  };

  const saveHotspots = async (nextHotspots) => {
    if (!canUpload || !resolvedPath) return;

    setHotspotSaveState('saving');
    setHotspotError('');

    const { error } = await supabase
      .from('case_media_assets')
      .update({ hotspots: nextHotspots })
      .eq('case_id', caseId)
      .eq('language', lang)
      .eq('asset_key', assetKey);

    if (error) {
      setHotspotSaveState('error');
      setHotspotError(error.message);
      return;
    }

    setHotspotSaveState('saved');
  };

  const handleHotspotImageClick = (event) => {
    if (!hotspotTask || !showImage) return;

    const point = getPointFromEvent(event);

    if (isAdmin) {
      const nextHotspots = [...adminHotspots, point].slice(-2);
      setAdminHotspots(nextHotspots);
      if (onHotspotsLoaded) {
        onHotspotsLoaded(nextHotspots);
      }
      saveHotspots(nextHotspots);
      return;
    }

    const nextHotspots = [...userHotspots, point].slice(-2);
    if (onUserHotspotsChange) {
      onUserHotspotsChange(nextHotspots);
    }
  };

  const resetAdminHotspots = () => {
    setAdminHotspots([]);
    if (onHotspotsLoaded) {
      onHotspotsLoaded([]);
    }
    saveHotspots([]);
  };

  const activeTargets = isAdmin ? adminHotspots : [];
  const activeUserHotspots = isAdmin ? [] : userHotspots;
  const canInteractWithHotspots = hotspotTask && showImage;

  const handleDrop = (event) => {
    event.preventDefault();
    handleUpload(event.dataTransfer.files?.[0]);
  };

  const uploadControl = canUpload ? (
    <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-sage-200 bg-sage-50 px-3 py-1.5 text-xs font-semibold text-sage-700 hover:bg-sage-100">
      <UploadCloud className="h-3.5 w-3.5" />
      {uploadState === 'uploading' ? '上傳中...' : hasVisibleMedia ? '重新上傳媒體' : '上傳媒體'}
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
      <>
        <div
          className="w-full"
          onDragOver={(event) => canUpload && event.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="mx-auto inline-block max-w-full overflow-hidden rounded-xl border border-warm-200 bg-warm-50/30 align-top">
            <button
              type="button"
              onClick={canInteractWithHotspots ? handleHotspotImageClick : () => setPreviewOpen(true)}
              className={`relative block max-w-full ${canInteractWithHotspots ? 'cursor-crosshair' : 'cursor-zoom-in'}`}
            >
              <img
                src={resolvedSrc}
                alt={resolvedLabel ?? resolvedFilename ?? ''}
                onError={() => setLoadError(true)}
                className="block max-h-[70vh] max-w-full object-contain"
              />
              {canInteractWithHotspots && activeTargets.map((point, index) => (
                <span
                  key={`target-${index}`}
                  className="pointer-events-none absolute rounded-full border-2 border-sage-600 bg-sage-400/20"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    width: `${point.r * 2}%`,
                    height: `${point.r * 2}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
              {canInteractWithHotspots && activeUserHotspots.map((point, index) => (
                <span
                  key={`user-${index}`}
                  className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white bg-red-400 shadow"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </button>
          </div>
          {hotspotTask && (
            <div className="mt-2 text-center text-xs text-warm-500">
              {isAdmin ? '點圖片標記 2 個正確答案範圍。' : '請在圖片上點選 2 個答案位置。'}
            </div>
          )}
          {isAdmin && hotspotTask && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={resetAdminHotspots}
                className="rounded-lg border border-warm-200 bg-white/70 px-3 py-1.5 font-semibold text-warm-600 hover:bg-warm-50"
              >
                重設標記
              </button>
              <span className="text-warm-500">{adminHotspots.length} / 2</span>
              {hotspotSaveState === 'saving' && <span className="text-warm-400">儲存中...</span>}
              {hotspotSaveState === 'saved' && <span className="text-sage-600">已儲存</span>}
              {hotspotError && <span className="text-red-500">{hotspotError}</span>}
            </div>
          )}
          <div className="text-center">{uploadControl}</div>
          {uploadFeedback}
        </div>

        {previewOpen && createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-3 sm:p-6"
            onClick={() => setPreviewOpen(false)}
          >
            <div className="pointer-events-none absolute inset-0 backdrop-blur-sm" />
            <div
              className="relative flex max-h-[94vh] max-w-[96vw] items-center justify-center overflow-hidden rounded-xl bg-black/20 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={resolvedSrc}
                alt={resolvedLabel ?? resolvedFilename ?? ''}
                className="block max-h-[94vh] max-w-[96vw] object-contain"
              />
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  if (showVideo) {
    return (
      <div
        className="w-full"
        onDragOver={(event) => canUpload && event.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="mx-auto inline-block max-w-full overflow-hidden rounded-xl border border-warm-200 bg-black align-top">
          <video
            src={resolvedSrc}
            poster={resolvedPoster}
            controls
            preload="metadata"
            onError={() => setLoadError(true)}
            className="block max-h-[70vh] max-w-full object-contain"
          />
        </div>
        <div className="text-center">{uploadControl}</div>
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
