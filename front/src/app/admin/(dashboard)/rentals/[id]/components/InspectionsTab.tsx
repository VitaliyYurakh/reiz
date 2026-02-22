'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { cn } from '@/lib/cn';
import { BASE_URL } from '@/config/environment';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
    Camera,
    X,
    ImagePlus,
    CheckCircle,
} from 'lucide-react';
import type { Inspection } from './rental-detail-types';
import { INSPECTION_TYPE_CLASS } from './rental-detail-constants';
import { fmtDateTime } from './rental-detail-helpers';
import { CreateInspectionModal } from './CreateInspectionModal';
import { UploadPhotoModal } from './UploadPhotoModal';

export function InspectionsTab({
    rentalId,
    inspections,
    onRefresh,
}: {
    rentalId: number;
    inspections: Inspection[];
    onRefresh: () => void;
}) {
    const { t } = useAdminLocale();
    const [showCreate, setShowCreate] = useState(false);
    const [uploadTarget, setUploadTarget] = useState<number | null>(null);
    const [completing, setCompleting] = useState<number | null>(null);
    const [deletingPhoto, setDeletingPhoto] = useState<number | null>(null);

    const INSPECTION_TYPE_LABEL: Record<string, string> = {
        PICKUP: t('rentalDetail.inspectionPickup'),
        RETURN: t('rentalDetail.inspectionReturn'),
    };

    const handleComplete = async (inspId: number) => {
        setCompleting(inspId);
        try {
            await adminApiClient.post(`/rental/${rentalId}/inspection/${inspId}/complete`);
            onRefresh();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.inspectionCompleteError'));
        } finally {
            setCompleting(null);
        }
    };

    const handleDeletePhoto = async (inspId: number, photoId: number) => {
        if (!confirm(t('rentalDetail.confirmDeletePhoto'))) return;
        setDeletingPhoto(photoId);
        try {
            await adminApiClient.delete(`/rental/${rentalId}/inspection/${inspId}/photo/${photoId}`);
            onRefresh();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.photoDeleteError'));
        } finally {
            setDeletingPhoto(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Create button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="ios-btn ios-btn-primary text-sm"
                >
                    <Camera className="h-4 w-4" />
                    {t('rentalDetail.newInspection')}
                </button>
            </div>

            {inspections.length === 0 ? (
                <div className="ios-card p-8 text-center text-muted-foreground">
                    {t('rentalDetail.noInspections')}
                </div>
            ) : (
                inspections.map((insp) => {
                    const typeClass = INSPECTION_TYPE_CLASS[insp.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-500/15 dark:text-gray-300';
                    const typeLabel = INSPECTION_TYPE_LABEL[insp.type] || insp.type;
                    const damagesCount = Array.isArray(insp.damages) ? insp.damages.length : 0;
                    const isCompleted = !!insp.completedAt;

                    return (
                        <div key={insp.id} className="ios-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            typeClass,
                                        )}
                                    >
                                        {typeLabel}
                                    </span>
                                    {isCompleted ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                                            <CheckCircle className="h-3 w-3" />
                                            {t('rentalDetail.inspCompleted')}
                                        </span>
                                    ) : (
                                        <span className="inline-block rounded-full bg-yellow-100 dark:bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-300">
                                            {t('rentalDetail.inspInProgress')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isCompleted && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setUploadTarget(insp.id)}
                                                className="ios-btn ios-btn-secondary text-xs !h-8 !px-3"
                                            >
                                                <ImagePlus className="h-3.5 w-3.5" />
                                                {t('rentalDetail.photo')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleComplete(insp.id)}
                                                disabled={completing === insp.id}
                                                className="ios-btn ios-btn-primary text-xs !h-8 !px-3"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                {completing === insp.id ? '...' : t('rentalDetail.complete')}
                                            </button>
                                        </>
                                    )}
                                    {isCompleted && (
                                        <span className="text-sm text-muted-foreground">
                                            {fmtDateTime(insp.completedAt)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.odometer')}</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {insp.odometer != null ? `${insp.odometer.toLocaleString()} км` : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.fuelLevel')}</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {insp.fuelLevel != null ? `${insp.fuelLevel}%` : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.cleanliness')}</p>
                                    <p className="text-sm font-medium">
                                        {insp.cleanlinessOk ? (
                                            <span className="text-green-700">OK</span>
                                        ) : (
                                            <span className="text-red-700">{t('common.no')}</span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.damages')}</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {damagesCount > 0 ? (
                                            <span className="text-red-700">{damagesCount}</span>
                                        ) : (
                                            <span className="text-green-700">{t('common.no')}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {insp.notes && (
                                <div className="mt-4">
                                    <p className="text-xs text-muted-foreground">{t('common.notes')}</p>
                                    <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">{insp.notes}</p>
                                </div>
                            )}

                            {insp.photos.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs text-muted-foreground">{t('rentalDetail.photo')} ({insp.photos.length})</p>
                                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                                        {insp.photos.map((photo) => (
                                            <div key={photo.id} className="group relative">
                                                <a
                                                    href={`${BASE_URL}static/${photo.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block overflow-hidden rounded-md border border-border"
                                                >
                                                    <img
                                                        src={`${BASE_URL}static/${photo.url}`}
                                                        alt="Inspection photo"
                                                        className="aspect-square w-full object-cover"
                                                    />
                                                </a>
                                                {!isCompleted && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePhoto(insp.id, photo.id)}
                                                        disabled={deletingPhoto === photo.id}
                                                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isCompleted && (
                                <div className="mt-3 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setUploadTarget(insp.id)}
                                        className="ios-btn ios-btn-secondary text-xs !h-8 !px-3"
                                    >
                                        <ImagePlus className="h-3.5 w-3.5" />
                                        {t('rentalDetail.addPhoto')}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}

            {showCreate && (
                <CreateInspectionModal
                    rentalId={rentalId}
                    onClose={() => setShowCreate(false)}
                    onCreated={() => {
                        setShowCreate(false);
                        onRefresh();
                    }}
                />
            )}
            {uploadTarget !== null && (
                <UploadPhotoModal
                    rentalId={rentalId}
                    inspectionId={uploadTarget}
                    onClose={() => setUploadTarget(null)}
                    onUploaded={() => {
                        setUploadTarget(null);
                        onRefresh();
                    }}
                />
            )}
        </div>
    );
}
