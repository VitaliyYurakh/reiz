'use client';

import { useState, useRef } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { toastError } from '@/lib/toast';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X, ImagePlus, UploadCloud } from 'lucide-react';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];

export function UploadPhotoModal({
    rentalId,
    inspectionId,
    onClose,
    onUploaded,
}: {
    rentalId: number;
    inspectionId: number;
    onClose: () => void;
    onUploaded: () => void;
}) {
    const { t } = useAdminLocale();
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const addFiles = (incoming: FileList | File[]) => {
        const next = Array.from(incoming).filter((f) => ACCEPT.includes(f.type));
        if (next.length > 0) setFiles((prev) => [...prev, ...next]);
    };

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(e.target.files);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setLoading(true);
        setProgress(0);
        let done = 0;
        try {
            // Parallel uploads (3 at a time) — much faster than sequential.
            // Refresh once at the very end instead of after each photo.
            const concurrency = 3;
            const queue = [...files];
            const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
                while (queue.length > 0) {
                    const file = queue.shift();
                    if (!file) break;
                    const fd = new FormData();
                    fd.append('car', file);
                    await adminApiClient.post(
                        `/rental/${rentalId}/inspection/${inspectionId}/photo`,
                        fd,
                        { headers: { 'Content-Type': 'multipart/form-data' } },
                    );
                    done++;
                    setProgress(Math.round((done / files.length) * 100));
                }
            });
            await Promise.all(workers);
            onUploaded();
        } catch (err) {
            toastError(err, t('rentalDetail.photoUploadError'));
        } finally {
            setLoading(false);
        }
    };

    const removeFile = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.uploadPhoto')}</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4">
                    <label
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                            dragOver
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50 hover:bg-primary/[0.02]'
                        }`}
                    >
                        {dragOver ? (
                            <UploadCloud className="h-10 w-10 text-primary" />
                        ) : (
                            <ImagePlus className="h-10 w-10 text-muted-foreground" />
                        )}
                        <span className="mt-2 text-sm font-medium text-foreground">
                            {dragOver ? 'Відпустіть, щоб додати' : t('rentalDetail.dropPhotos')}
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground/60">
                            JPG, PNG, WebP · можна перетягнути кілька
                        </span>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleFiles}
                            className="hidden"
                        />
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                        {files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/50 px-3 py-2">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm text-foreground">{f.name}</p>
                                    <p className="text-[10px] text-muted-foreground tabular-nums">
                                        {(f.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                                <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-red-500" disabled={loading}>
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="mt-4">
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div
                                className="h-2 rounded-full bg-primary transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-1 text-center text-xs text-muted-foreground tabular-nums">{progress}%</p>
                    </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm" disabled={loading}>
                        {t('common.cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={loading || files.length === 0}
                        className="ios-btn ios-btn-primary text-sm"
                    >
                        {loading ? t('rentalDetail.uploading') : `${t('rentalDetail.upload')} (${files.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
