'use client';

import { ReactNode, useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

interface ConfirmOptions {
  title: string;
  message: ReactNode;
  confirmLabel: string;
}

// "Are you sure?" before a destructive action:
//   const { confirm, dialog } = useConfirm();
//   if (!(await confirm({ title, message, confirmLabel }))) return;
// and render {dialog} somewhere in the component.
export function useConfirm() {
  const t = useTranslations('common');
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = useCallback((o: ConfirmOptions) => new Promise<boolean>(resolve => {
    resolver.current = resolve;
    setOptions(o);
  }), []);

  const close = useCallback((confirmed: boolean) => {
    resolver.current?.(confirmed);
    resolver.current = null;
    setOptions(null);
  }, []);

  const dialog = options && (
    <Modal
      title={options.title}
      onClose={() => close(false)}
      footer={
        <>
          <Button variant="secondary" onClick={() => close(false)}>{t('cancel')}</Button>
          <Button variant="danger" onClick={() => close(true)}>{options.confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-ink-600">{options.message}</p>
    </Modal>
  );

  return { confirm, dialog };
}
