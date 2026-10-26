'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, Trash2 } from 'lucide-react';
import { photoService } from '@/lib/photo';
import Avatar from '@/components/Avatar';
import ErrorMessage from '@/components/ErrorMessage';

interface PhotoUploaderProps {
  name: string;
  photo?: string | null;
  // "player" → photo, "club" → crest; only changes the wording
  kind: 'player' | 'club';
  onChange: (photoUrl: string | null) => void;
}

export default function PhotoUploader({ name, photo, kind, onChange }: PhotoUploaderProps) {
  const t = useTranslations('photo');
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      onChange(await photoService.upload(file));
    } catch (err: any) {
      setError(err?.message || t('uploadFailed'));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async () => {
    setError('');
    setBusy(true);
    try {
      await photoService.remove();
      onChange(null);
    } catch (err: any) {
      setError(err?.message || t('uploadFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className={busy ? 'opacity-50' : ''}><Avatar name={name} photo={photo} size="xl" /></div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-ink-900">{kind === 'club' ? t('crestTitle') : t('photoTitle')}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 shadow-sm transition hover:bg-ink-50 disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />{photo ? t('change') : t('upload')}
            </button>
            {photo && (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />{t('remove')}
              </button>
            )}
          </div>
          <p className="text-xs text-ink-500">{t('hint')}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => pick(e.target.files?.[0])}
          aria-label={kind === 'club' ? t('crestTitle') : t('photoTitle')}
        />
      </div>
      {error && <div className="mt-3"><ErrorMessage message={error} /></div>}
    </div>
  );
}
