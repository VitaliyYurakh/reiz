'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[admin/error.tsx]', error);
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: '60vh',
        padding: 24,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
        color: '#0f172a',
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        Щось пішло не так в адмінці
      </h2>
      <p style={{ color: '#dc2626', marginBottom: 12 }}>
        {error?.name || 'Error'}: {error?.message || 'Unknown error'}
      </p>
      {error?.digest && (
        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>
          digest: {error.digest}
        </p>
      )}
      {error?.stack && (
        <pre
          style={{
            background: '#f1f5f9',
            padding: 12,
            borderRadius: 8,
            fontSize: 11,
            overflow: 'auto',
            maxHeight: 320,
            whiteSpace: 'pre-wrap',
          }}
        >
          {error.stack}
        </pre>
      )}
      <button
        type="button"
        onClick={() => reset()}
        style={{
          marginTop: 16,
          padding: '8px 16px',
          borderRadius: 8,
          background: '#0ea5e9',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Спробувати ще раз
      </button>
    </div>
  );
}
