/**
 * Prepares a part photo in the browser before upload:
 * - applies the camera's EXIF rotation (so phone photos are upright)
 * - scales down to at most MAX_EDGE px on the long side (no cropping)
 * - re-encodes as JPEG on a white background (handles PNG transparency)
 */

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.85;

/** Below this width/height (long side) a photo will look blurry on the part page. */
export const MIN_RECOMMENDED_EDGE = 800;

export interface PreparedImage {
  file: File;
  /** Long edge of the original image in pixels. */
  originalLongEdge: number;
}

export class UnsupportedImageError extends Error {}

export async function prepareImage(file: File): Promise<PreparedImage> {
  let bitmap: ImageBitmap;
  try {
    // Browsers apply EXIF orientation by default ("from-image").
    bitmap = await createImageBitmap(file);
  } catch {
    // Typically HEIC/HEIF from iPhones in browsers that can't decode it.
    throw new UnsupportedImageError(file.type || file.name);
  }

  const longEdge = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, MAX_EDGE / longEdge);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Encoding failed'))), 'image/jpeg', JPEG_QUALITY)
  );

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'bild';
  return {
    file: new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }),
    originalLongEdge: longEdge,
  };
}
