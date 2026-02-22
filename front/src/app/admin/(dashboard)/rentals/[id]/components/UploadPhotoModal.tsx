'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X, ImagePlus } from 'lucide-react';

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

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setLoading(true);
        let done = 0;
        try {
            for (const file of files) {
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
            onUploaded();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.photoUploadError'));
        } finally {
            setLoading(false);
        }
    };

    const removeFile = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.uploadPhoto')}</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-4">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-primary/[0.02]">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">{t('rentalDetail.dropPhotos')}</span>
                        <span className="mt-1 text-xs text-muted-foreground/60">JPG, PNG, WebP</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleFiles}
                            className="hidden"
                        />
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                                <span className="truncate text-sm text-foreground">{f.name}</span>
                                <button type="button" onClick={() => removeFile(i)} className="ml-2 text-muted-foreground hover:text-red-500">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="mt-4">
                        <div className="h-2 rounded-full bg-secondary">
                            <div
                                className="h-2 rounded-full bg-primary transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-1 text-center text-xs text-muted-foreground">{progress}%</p>
                    </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
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
