'use client';

import { useRef, useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { toastError } from '@/lib/toast';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { X, Paperclip, Trash2 } from 'lucide-react';
import { FINE_TYPE_KEYS } from './rental-detail-constants';

interface CreateFineModalProps {
    rentalId: number;
    onClose: () => void;
    onCreated: () => void;
    presetInspectionId?: number | null;
    presetType?: string;
}

export function CreateFineModal({
    rentalId,
    onClose,
    onCreated,
    presetInspectionId = null,
    presetType,
}: CreateFineModalProps) {
    const { t } = useAdminLocale();
    const [type, setType] = useState(presetType || 'DAMAGE');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('UAH');
    const [loading, setLoading] = useState(false);

    // Evidence fields
    const [externalCaseNumber, setExternalCaseNumber] = useState('');
    const [incidentAt, setIncidentAt] = useState('');
    const [location, setLocation] = useState('');
    const [authority, setAuthority] = useState('');
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const FINE_TYPE_LABEL: Record<string, string> = {
        OVERMILEAGE: t('rentalDetail.fineOvermileage'),
        DAMAGE: t('rentalDetail.fineDamage'),
        LATE_RETURN: t('rentalDetail.fineLateReturn'),
        FUEL: t('rentalDetail.fineFuel'),
        CLEANING: t('rentalDetail.fineCleaning'),
        TRAFFIC: t('rentalDetail.fineTraffic'),
        OTHER: t('rentalDetail.fineOther'),
    };

    const FINE_TYPES = FINE_TYPE_KEYS.map((val) => ({
        value: val,
        label: FINE_TYPE_LABEL[val] || val,
    }));

    const isTraffic = type === 'TRAFFIC';
    const trafficValid = !isTraffic || (externalCaseNumber.trim().length > 0 && pendingFiles.length > 0);

    const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setPendingFiles((prev) => [...prev, ...files]);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePendingFile = (idx: number) => {
        setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim() || !amount) return;
        if (!trafficValid) {
            toastError(
                new Error('TRAFFIC-штраф потребує номера постанови та хоча б одного скана.'),
                'TRAFFIC-штраф потребує номера постанови та хоча б одного скана.',
            );
            return;
        }
        setLoading(true);
        try {
            // Step 1 — create fine without attachments first.
            const createPayload: Record<string, unknown> = {
                type,
                description: description.trim(),
                amountMinor: Math.round(Number(amount) * 100),
                currency,
            };
            if (externalCaseNumber.trim()) createPayload.externalCaseNumber = externalCaseNumber.trim();
            if (incidentAt) createPayload.incidentAt = new Date(incidentAt).toISOString();
            if (location.trim()) createPayload.location = location.trim();
            if (authority.trim()) createPayload.authority = authority.trim();
            if (presetInspectionId) createPayload.inspectionId = presetInspectionId;
            // For TRAFFIC we MUST send at least one attachment placeholder so the
            // backend validation passes; we use a sentinel that's swapped right
            // after upload. For non-TRAFFIC the array can be empty.
            if (isTraffic && pendingFiles.length > 0) {
                createPayload.attachments = ['__pending__'];
            }

            const res = await adminApiClient.post(`/rental/${rentalId}/fine`, createPayload);
            const fineId = res.data.fine.id;

            // Step 2 — upload each pending file to the new fine.
            for (const file of pendingFiles) {
                const fd = new FormData();
                fd.append('car', file); // multer field name
                await adminApiClient.post(
                    `/rental/${rentalId}/fine/${fineId}/attachment`,
                    fd,
                    {headers: {'Content-Type': 'multipart/form-data'}},
                );
            }

            // Step 3 — clean up the placeholder attachment we may have inserted.
            if (isTraffic && pendingFiles.length > 0) {
                await adminApiClient.delete(`/rental/${rentalId}/fine/${fineId}/attachment`, {
                    data: {url: '__pending__'},
                });
            }

            onCreated();
        } catch (err) {
            toastError(err, t('rentalDetail.fineCreateError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8" onClick={onClose}>
            <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-[0_4px_24px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{t('rentalDetail.newFine')}</h3>
                    <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('common.type')}</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-1 w-full ios-select text-sm"
                        >
                            {FINE_TYPES.map((ft) => (
                                <option key={ft.value} value={ft.value}>{ft.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">{t('common.description')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            required
                            placeholder={t('rentalDetail.fineDescPlaceholder')}
                            className="mt-1 w-full ios-textarea text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{t('common.amount')}</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                placeholder="0.00"
                                className="mt-1 w-full ios-input text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground">{t('common.currency')}</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="mt-1 w-full ios-select text-sm"
                            >
                                <option value="UAH">UAH</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>

                    {/* Evidence section */}
                    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Докази {isTraffic && <span className="text-rose-600">(обов'язково для TRAFFIC)</span>}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-muted-foreground">№ постанови</label>
                                <input
                                    type="text"
                                    value={externalCaseNumber}
                                    onChange={(e) => setExternalCaseNumber(e.target.value)}
                                    placeholder={isTraffic ? "обов'язково" : "необов'язково"}
                                    className="mt-1 w-full ios-input text-sm"
                                    required={isTraffic}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground">Дата інциденту</label>
                                <input
                                    type="datetime-local"
                                    value={incidentAt}
                                    onChange={(e) => setIncidentAt(e.target.value)}
                                    className="mt-1 w-full ios-input text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground">Місце</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="напр. вул. Дерибасівська, Одеса"
                                    className="mt-1 w-full ios-input text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground">Орган</label>
                                <input
                                    type="text"
                                    value={authority}
                                    onChange={(e) => setAuthority(e.target.value)}
                                    placeholder="напр. Патрульна поліція"
                                    className="mt-1 w-full ios-input text-sm"
                                />
                            </div>
                        </div>

                        {/* Attachments */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-muted-foreground">
                                    Скани/фото {isTraffic && <span className="text-rose-600">*</span>}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="ios-btn ios-btn-secondary text-xs !h-7 !px-2"
                                >
                                    <Paperclip className="h-3 w-3" /> Додати
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,application/pdf"
                                    onChange={handlePickFiles}
                                    className="hidden"
                                />
                            </div>
                            {pendingFiles.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {pendingFiles.map((f, i) => (
                                        <li key={i} className="flex items-center justify-between rounded-md bg-card px-2 py-1 text-xs">
                                            <span className="truncate">{f.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removePendingFile(i)}
                                                className="text-rose-500 hover:text-rose-700"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {presetInspectionId != null && (
                        <p className="text-xs text-muted-foreground">
                            Цей штраф буде прив'язано до огляду #{presetInspectionId}.
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="ios-btn ios-btn-ghost text-sm">
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !description.trim() || !amount || !trafficValid}
                            className="ios-btn ios-btn-destructive text-sm"
                            title={!trafficValid ? 'TRAFFIC потребує № постанови + ≥1 скана' : undefined}
                        >
                            {loading ? t('rentalDetail.creating') : t('rentalDetail.createFine')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
