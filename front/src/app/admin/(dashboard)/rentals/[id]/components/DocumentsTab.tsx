'use client';

import { useState } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { BASE_URL } from '@/config/environment';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import {
    Plus,
    Trash2,
    FileText,
} from 'lucide-react';
import type { RentalDocument } from './rental-detail-types';
import { DOC_TYPE_KEYS } from './rental-detail-constants';
import { fmtDateTime } from './rental-detail-helpers';

export function DocumentsTab({
    rentalId,
    documents,
    onRefresh,
}: {
    rentalId: number;
    documents: RentalDocument[];
    onRefresh: () => void;
}) {
    const { t } = useAdminLocale();
    const [generating, setGenerating] = useState(false);
    const [genType, setGenType] = useState('RENTAL_CONTRACT');
    const [showGenerate, setShowGenerate] = useState(false);

    const DOC_TYPE_LABEL: Record<string, string> = {
        RENTAL_CONTRACT: t('rentalDetail.docRentalContract'),
        PICKUP_ACT: t('rentalDetail.docPickupAct'),
        RETURN_ACT: t('rentalDetail.docReturnAct'),
        INVOICE: t('rentalDetail.docInvoice'),
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            await adminApiClient.post('/document/generate', {
                type: genType,
                rentalId,
            });
            setShowGenerate(false);
            onRefresh();
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.msg || t('rentalDetail.docGenerateError'));
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (docId: number) => {
        if (!confirm(t('rentalDetail.confirmDeleteDoc'))) return;
        try {
            await adminApiClient.delete(`/document/${docId}`);
            onRefresh();
        } catch (err) {
            console.error(err);
            alert(t('rentalDetail.docDeleteError'));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                    {documents.length} {t('rentalDetail.documentsCount')}
                </span>
                <button
                    type="button"
                    onClick={() => setShowGenerate(!showGenerate)}
                    className="ios-btn ios-btn-primary text-sm"
                >
                    <Plus className="h-4 w-4" />
                    {t('rentalDetail.generate')}
                </button>
            </div>

            {showGenerate && (
                <div className="mb-4 rounded-xl border border-border bg-card p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3">{t('rentalDetail.generateDoc')}</h4>
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                                {t('rentalDetail.docType')}
                            </label>
                            <select
                                value={genType}
                                onChange={(e) => setGenType(e.target.value)}
                                className="w-full ios-select text-sm"
                            >
                                {DOC_TYPE_KEYS.map((val) => (
                                    <option key={val} value={val}>{DOC_TYPE_LABEL[val] || val}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowGenerate(false)}
                                className="ios-btn ios-btn-ghost text-sm"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={generating}
                                className="ios-btn ios-btn-primary text-sm"
                            >
                                <FileText className="h-4 w-4" />
                                {generating ? t('rentalDetail.generating') : t('common.create')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {documents.length === 0 ? (
                <div className="ios-card p-8 text-center text-muted-foreground">
                    {t('rentalDetail.noDocs')}
                </div>
            ) : (
                <div className="ios-table-wrap">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border bg-muted/50">
                            <tr>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('common.type')}</th>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('rentalDetail.file')}</th>
                                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{t('rentalDetail.generatedDate')}</th>
                                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5 text-foreground">
                                        {DOC_TYPE_LABEL[doc.type] || doc.type}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <a
                                            href={`${BASE_URL}static/${doc.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {doc.fileName}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                                        {fmtDateTime(doc.generatedAt)}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(doc.id)}
                                            className="ios-btn ios-btn-destructive text-xs"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
