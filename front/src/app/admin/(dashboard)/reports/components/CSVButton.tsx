'use client';

import { Download } from 'lucide-react';
export function CSVButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-btn h-btn-primary h-btn-sm"
    >
      <Download style={{ width: 14, height: 14 }} />
      CSV
    </button>
  );
}
