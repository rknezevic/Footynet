import { api } from './api';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
const SIZE = 256;

// The API returns photo paths relative to its base URL ("Users/{id}/photo?v=...")
export const photoSrc = (path?: string | null) => (path ? `${API_URL}/${path}` : undefined);

// Centre-crops and scales the picked image to 256x256 in the browser, so a 5 MB phone photo
// is uploaded as a ~20 KB WebP (JPEG where the browser can't encode WebP)
async function resizeToSquare(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  bitmap.close();

  const encode = (type: string) => new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, 0.85));
  const webp = await encode('image/webp');
  if (webp && webp.type === 'image/webp') return webp;
  const jpeg = await encode('image/jpeg');
  if (!jpeg) throw new Error('Image could not be processed');
  return jpeg;
}

export const photoService = {
  async upload(file: File): Promise<string> {
    const blob = await resizeToSquare(file);
    const form = new FormData();
    form.append('photo', blob, blob.type === 'image/webp' ? 'photo.webp' : 'photo.jpg');
    const response = await api.put<{ photoUrl: string }>('/Profile/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.photoUrl;
  },

  async remove(): Promise<void> {
    await api.delete('/Profile/photo');
  },
};
