'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApiClient } from '@/lib/api/admin';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Edit,
  Save,
  X,
  FileText,
  Trash2,
  Upload,
  ImagePlus,
  ShieldBan,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import { fmtDate } from '@/app/admin/lib/format';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ClientDocument {
  id: number;
  fileName: string;
  type: string;
  url: string;
  uploadedAt: string;
}

interface RelatedCar {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
}

interface RentalRequest {
  id: number;
  status: string;
  pickupDate: string | null;
  returnDate: string | null;
  createdAt: string;
  car: RelatedCar | null;
}

interface Reservation {
  id: number;
  status: string;
  pickupDate: string;
  returnDate: string;
  createdAt: string;
  car: RelatedCar | null;
}

interface Rental {
  id: number;
  status: string;
  contractNumber: string | null;
  pickupDate: string;
  returnDate: string;
  actualReturnDate: string | null;
  createdAt: string;
  car: RelatedCar | null;
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  driverLicenseNo: string | null;
  driverLicenseExpiry: string | null;
  passportNo: string | null;
  nationalId: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  rating: number | null;
  ratingReason: string | null;
  source: string | null;
  isBlocked: boolean;
  blockReason: string | null;
  blockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  documents: ClientDocument[];
  rentalRequests: RentalRequest[];
  reservations: Reservation[];
  rentals: Rental[];
}

/* ------------------------------------------------------------------ */
/*  Status maps (matching list pages)                                  */
/* ------------------------------------------------------------------ */

const REQUEST_STATUS_CLASS: Record<string, string> = {
  new: 'h-badge h-badge-blue',
  in_review: 'h-badge h-badge-orange',
  approved: 'h-badge h-badge-green',
  rejected: 'h-badge h-badge-red',
  cancelled: 'h-badge h-badge-gray',
};

const RESERVATION_STATUS_CLASS: Record<string, string> = {
  confirmed: 'h-badge h-badge-green',
  picked_up: 'h-badge h-badge-blue',
  cancelled: 'h-badge h-badge-gray',
  no_show: 'h-badge h-badge-red',
};

const RENTAL_STATUS_CLASS: Record<string, string> = {
  active: 'h-badge h-badge-green',
  completed: 'h-badge h-badge-blue',
  cancelled: 'h-badge h-badge-gray',
};

const DOC_TYPE_KEYS = [
  'DRIVER_LICENSE_FRONT',
  'DRIVER_LICENSE_BACK',
  'PASSPORT',
  'ID_CARD',
  'OTHER',
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function StatusBadge({
  status,
  classMap,
  labelMap,
}: {
  status: string;
  classMap: Record<string, string>;
  labelMap: Record<string, string>;
}) {
  const cls = classMap[status] || 'h-badge h-badge-gray';
  const label = labelMap[status] || status;
  return <span className={cls}>{label}</span>;
}

function carLabel(car: RelatedCar | null) {
  if (!car) return '—';
  return `${car.brand} ${car.model} (${car.plateNumber})`;
}

/* ------------------------------------------------------------------ */
/*  Editable fields definition                                         */
/* ------------------------------------------------------------------ */

type EditableFields = {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  driverLicenseNo: string;
  driverLicenseExpiry: string;
  passportNo: string;
  nationalId: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  source: string;
};

function clientToForm(c: Client): EditableFields {
  return {
    firstName: c.firstName ?? '',
    lastName: c.lastName ?? '',
    middleName: c.middleName ?? '',
    phone: c.phone ?? '',
    email: c.email ?? '',
    dateOfBirth: c.dateOfBirth ? c.dateOfBirth.slice(0, 10) : '',
    driverLicenseNo: c.driverLicenseNo ?? '',
    driverLicenseExpiry: c.driverLicenseExpiry ? c.driverLicenseExpiry.slice(0, 10) : '',
    passportNo: c.passportNo ?? '',
    nationalId: c.nationalId ?? '',
    address: c.address ?? '',
    city: c.city ?? '',
    country: c.country ?? '',
    notes: c.notes ?? '',
    source: c.source ?? '',
  };
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type Tab = 'profile' | 'documents' | 'history';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useAdminLocale();
  const id = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditableFields | null>(null);
  const [saving, setSaving] = useState(false);

  // Rating
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [ratingReason, setRatingReason] = useState('');
  const [ratingHover, setRatingHover] = useState<number>(0);
  const [savingRating, setSavingRating] = useState(false);

  // Block
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReasonInput, setBlockReasonInput] = useState('');
  const [blockLoading, setBlockLoading] = useState(false);

  /* ---- Fetch ---- */

  const fetchClient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApiClient.get(`/client/${id}`);
      const data: Client = res.data.client;
      setClient(data);
      setForm(clientToForm(data));
      setRatingValue(data.rating ?? 0);
      setRatingReason(data.ratingReason ?? '');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.status === 404 ? t('clientDetail.notFound') : t('clientDetail.loadError'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchClient();
  }, [id, fetchClient]);

  /* ---- Handlers ---- */

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await adminApiClient.patch(`/client/${id}`, form);
      await fetchClient();
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert(t('clientDetail.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (client) setForm(clientToForm(client));
    setEditing(false);
  };

  const handleUpdateRating = async () => {
    setSavingRating(true);
    try {
      await adminApiClient.patch(`/client/${id}/rating`, {
        rating: ratingValue,
        reason: ratingReason,
      });
      await fetchClient();
    } catch (err) {
      console.error(err);
      alert(t('clientDetail.ratingError'));
    } finally {
      setSavingRating(false);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm(t('clientDetail.deleteDocConfirm'))) return;
    try {
      await adminApiClient.delete(`/client/${id}/document/${docId}`);
      await fetchClient();
    } catch (err) {
      console.error(err);
      alert(t('clientDetail.deleteDocError'));
    }
  };

  const handleBlock = async () => {
    if (!blockReasonInput.trim()) return;
    setBlockLoading(true);
    try {
      await adminApiClient.post(`/client/${id}/block`, { reason: blockReasonInput.trim() });
      setShowBlockModal(false);
      setBlockReasonInput('');
      await fetchClient();
    } catch (err) {
      console.error(err);
      alert(t('clientDetail.blockError'));
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblock = async () => {
    if (!confirm(t('clientDetail.unblockConfirm'))) return;
    try {
      await adminApiClient.post(`/client/${id}/unblock`);
      await fetchClient();
    } catch (err) {
      console.error(err);
      alert(t('clientDetail.unblockError'));
    }
  };

  const updateField = (key: keyof EditableFields, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  /* ---- Loading / Error ---- */

  if (loading) {
    return (
      <div className="h-page flex flex-col gap-4">
        <div className="h-shimmer h-shimmer-lg" />
        <div className="h-card p-6">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-shimmer w-24" />
                <div className="h-shimmer w-full h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="h-page h-empty">
        <p className="h-subtitle text-lg mb-4">
          {error || t('clientDetail.notFound')}
        </p>
        <Link href="/admin/clients" className="h-btn h-btn-primary">
          <ArrowLeft className="h-4 w-4" />
          {t('clientDetail.backToList')}
        </Link>
      </div>
    );
  }

  const fullName = [client.lastName, client.firstName, client.middleName]
    .filter(Boolean)
    .join(' ');

  /* ================================================================== */
  /*  Render                                                             */
  /* ================================================================== */

  return (
    <div className="h-page flex flex-col gap-6">
      {/* ---------- Header ---------- */}
      <div className="h-header justify-between">
        <div className="flex items-center gap-3.5">
          <Link href="/admin/clients" className="h-action-btn">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-icon-box h-icon-box-purple">
            <User className="h-5 w-5" />
          </div>
          <h1 className="h-title">{fullName}</h1>
          {client.isBlocked && (
            <span className="h-badge h-badge-red">
              <ShieldBan className="w-3.5 h-3.5" />
              {t('clientDetail.blocked')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {client.isBlocked ? (
            <button
              type="button"
              onClick={handleUnblock}
              className="h-btn h-btn-primary h-btn-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              {t('clientDetail.unblock')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowBlockModal(true)}
              className="h-btn h-btn-danger h-btn-sm"
            >
              <ShieldBan className="h-4 w-4" />
              {t('clientDetail.block')}
            </button>
          )}

          {activeTab === 'profile' && (
            <button
              type="button"
              onClick={() => (editing ? handleCancelEdit() : setEditing(true))}
              className={
                editing
                  ? 'h-btn h-btn-outline h-btn-sm'
                  : 'h-btn h-btn-primary h-btn-sm'
              }
            >
              {editing ? (
                <>
                  <X className="h-4 w-4" />
                  {t('common.cancel')}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  {t('common.edit')}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Block reason banner */}
      {client.isBlocked && client.blockReason && (
        <div className="h-alert-error flex items-start gap-3 p-4">
          <ShieldBan className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">{t('clientDetail.blockedBanner')}</p>
            <p>{client.blockReason}</p>
            {client.blockedAt && (
              <p className="mt-1 opacity-70 text-xs">
                {t('clientDetail.blockedAt')}: {fmtDate(client.blockedAt)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---------- Tabs ---------- */}
      <div className="h-tabs">
        {(
          [
            { key: 'profile', label: t('clientDetail.tabProfile') },
            { key: 'documents', label: t('clientDetail.tabDocuments') },
            { key: 'history', label: t('clientDetail.tabHistory') },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={
              'h-tab' + (activeTab === tab.key ? ' h-tab-active' : '')
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------- Tab content ---------- */}
      {activeTab === 'profile' && (
        <ProfileTab
          client={client}
          form={form!}
          editing={editing}
          saving={saving}
          ratingValue={ratingValue}
          ratingReason={ratingReason}
          ratingHover={ratingHover}
          savingRating={savingRating}
          onFieldChange={updateField}
          onSave={handleSave}
          onRatingChange={setRatingValue}
          onRatingHover={setRatingHover}
          onRatingReasonChange={setRatingReason}
          onUpdateRating={handleUpdateRating}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentsTab
          clientId={client.id}
          documents={client.documents}
          onDelete={handleDeleteDocument}
          onRefresh={fetchClient}
        />
      )}

      {activeTab === 'history' && (
        <HistoryTab
          rentalRequests={client.rentalRequests}
          reservations={client.reservations}
          rentals={client.rentals}
        />
      )}

      {/* ---------- Block Modal ---------- */}
      {showBlockModal && (
        <div className="h-modal-overlay">
          <div className="h-modal">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-icon-box h-icon-box-red h-icon-box-sm w-10 h-10">
                <ShieldBan className="h-5 w-5" />
              </div>
              <div>
                <h3 className="h-modal-title">{t('clientDetail.blockModalTitle')}</h3>
                <p className="h-subtitle">
                  {client.lastName} {client.firstName}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="h-label">
                {t('clientDetail.blockReason')} <span className="h-required">*</span>
              </label>
              <textarea
                value={blockReasonInput}
                onChange={(e) => setBlockReasonInput(e.target.value)}
                placeholder={t('clientDetail.blockReasonPlaceholder')}
                rows={3}
                className="h-textarea resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockReasonInput('');
                }}
                className="h-btn h-btn-outline h-btn-sm"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleBlock}
                disabled={blockLoading || !blockReasonInput.trim()}
                className="h-btn h-btn-danger h-btn-sm"
              >
                {blockLoading ? t('clientDetail.blocking') : t('clientDetail.block')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Field (defined outside ProfileTab to avoid focus loss on re-render) */
/* ================================================================== */

function Field({
  label,
  fieldKey,
  type = 'text',
  editing,
  value,
  onChange,
  min,
}: {
  label: string;
  fieldKey: keyof EditableFields;
  type?: string;
  editing: boolean;
  value: string;
  onChange: (key: keyof EditableFields, value: string) => void;
  min?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="h-label">{label}</span>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          min={min}
          className="h-input"
        />
      ) : (
        <p className="text-sm m-0">
          <span className={value ? 'text-h-navy' : 'text-h-gray'}>
            {value || '—'}
          </span>
        </p>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Profile Tab                                                        */
/* ================================================================== */

function ProfileTab({
  client,
  form,
  editing,
  saving,
  ratingValue,
  ratingReason,
  ratingHover,
  savingRating,
  onFieldChange,
  onSave,
  onRatingChange,
  onRatingHover,
  onRatingReasonChange,
  onUpdateRating,
}: {
  client: Client;
  form: EditableFields;
  editing: boolean;
  saving: boolean;
  ratingValue: number;
  ratingReason: string;
  ratingHover: number;
  savingRating: boolean;
  onFieldChange: (key: keyof EditableFields, value: string) => void;
  onSave: () => void;
  onRatingChange: (v: number) => void;
  onRatingHover: (v: number) => void;
  onRatingReasonChange: (v: string) => void;
  onUpdateRating: () => void;
}) {
  const { t } = useAdminLocale();
  return (
    <div className="flex flex-col gap-6">
      {/* Personal */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.sectionPersonal')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('clientDetail.lastName')} fieldKey="lastName" editing={editing} value={form.lastName} onChange={onFieldChange} />
          <Field label={t('clientDetail.firstName')} fieldKey="firstName" editing={editing} value={form.firstName} onChange={onFieldChange} />
          <Field label={t('clientDetail.middleName')} fieldKey="middleName" editing={editing} value={form.middleName} onChange={onFieldChange} />
          <Field label={t('clientDetail.phone')} fieldKey="phone" type="tel" editing={editing} value={form.phone} onChange={onFieldChange} />
          <Field label={t('clientDetail.email')} fieldKey="email" type="email" editing={editing} value={form.email} onChange={onFieldChange} />
          <Field label={t('clientDetail.birthDate')} fieldKey="dateOfBirth" type="date" editing={editing} value={form.dateOfBirth} onChange={onFieldChange} />
        </div>
      </div>

      {/* Documents */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.sectionDocs')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('clientDetail.driverLicense')} fieldKey="driverLicenseNo" editing={editing} value={form.driverLicenseNo} onChange={onFieldChange} />
          <Field label={t('clientDetail.driverLicenseExpiry')} fieldKey="driverLicenseExpiry" type="date" editing={editing} value={form.driverLicenseExpiry} onChange={onFieldChange} min={new Date().toISOString().slice(0, 10)} />
          <Field label={t('clientDetail.passport')} fieldKey="passportNo" editing={editing} value={form.passportNo} onChange={onFieldChange} />
          <Field label={t('clientDetail.nationalId')} fieldKey="nationalId" editing={editing} value={form.nationalId} onChange={onFieldChange} />
        </div>
      </div>

      {/* Address */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.sectionAddress')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('clientDetail.address')} fieldKey="address" editing={editing} value={form.address} onChange={onFieldChange} />
          <Field label={t('clientDetail.city')} fieldKey="city" editing={editing} value={form.city} onChange={onFieldChange} />
          <Field label={t('clientDetail.country')} fieldKey="country" editing={editing} value={form.country} onChange={onFieldChange} />
        </div>
      </div>

      {/* Notes */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.notes')}</h3>
        {editing ? (
          <textarea
            value={form.notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            rows={4}
            className="h-textarea resize-none"
          />
        ) : (
          <p className={`whitespace-pre-wrap text-sm m-0 ${client.notes ? 'text-h-navy' : 'text-h-gray'}`}>
            {client.notes || '—'}
          </p>
        )}
      </div>

      {/* Save button */}
      {editing && (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="h-btn h-btn-primary"
          >
            <Save className="h-4 w-4" />
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      )}

      {/* Rating */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.rating')}</h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              onMouseEnter={() => onRatingHover(star)}
              onMouseLeave={() => onRatingHover(0)}
              className="p-0.5 bg-transparent border-none cursor-pointer transition-colors"
            >
              <Star
                className="h-6 w-6"
                style={{
                  fill: (ratingHover || ratingValue) >= star ? '#FFB547' : 'none',
                  color: (ratingHover || ratingValue) >= star ? '#FFB547' : 'var(--color-h-gray)',
                }}
              />
            </button>
          ))}
          <span className="h-subtitle ml-2">
            {ratingValue > 0 ? `${ratingValue} / 5` : t('common.notSpecified')}
          </span>
        </div>
        <input
          type="text"
          value={ratingReason}
          onChange={(e) => onRatingReasonChange(e.target.value)}
          placeholder={t('clientDetail.ratingReasonPlaceholder')}
          className="h-input mt-3"
        />
        <button
          type="button"
          disabled={savingRating}
          onClick={onUpdateRating}
          className="h-btn h-btn-primary h-btn-sm mt-3"
        >
          {savingRating ? t('common.saving') : t('clientDetail.updateRating')}
        </button>
      </div>

      {/* Meta */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.sectionMeta')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="h-label">{t('clientDetail.source')}</span>
            {editing ? (
              <input
                type="text"
                value={form.source}
                onChange={(e) => onFieldChange('source', e.target.value)}
                className="h-input"
              />
            ) : (
              <p className={`text-sm m-0 ${client.source ? 'text-h-navy' : 'text-h-gray'}`}>
                {client.source || '—'}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="h-label">{t('common.created')}</span>
            <p className="text-sm m-0 text-h-navy">{fmtDate(client.createdAt)}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="h-label">{t('common.updated')}</span>
            <p className="text-sm m-0 text-h-navy">{fmtDate(client.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Documents Tab                                                      */
/* ================================================================== */

function DocumentsTab({
  clientId,
  documents,
  onDelete,
  onRefresh,
}: {
  clientId: number;
  documents: ClientDocument[];
  onDelete: (id: number) => void;
  onRefresh: () => void;
}) {
  const { t } = useAdminLocale();

  const DOC_TYPE_LABEL: Record<string, string> = {
    DRIVER_LICENSE_FRONT: t('clientDetail.docDriverLicenseFront'),
    DRIVER_LICENSE_BACK: t('clientDetail.docDriverLicenseBack'),
    PASSPORT: t('clientDetail.docPassport'),
    ID_CARD: t('clientDetail.docIdCard'),
    OTHER: t('clientDetail.docOther'),
  };

  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState('OTHER');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('document', uploadFile);
      fd.append('type', uploadType);
      await adminApiClient.post(`/client/${clientId}/document`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowUpload(false);
      setUploadFile(null);
      setUploadType('OTHER');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert(t('clientDetail.uploadDocError'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowUpload(!showUpload)}
          className="h-btn h-btn-primary h-btn-sm"
        >
          <Upload className="h-4 w-4" />
          {t('clientDetail.uploadDoc')}
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="h-card p-5">
          <h4 className="h-section-label mb-3">{t('clientDetail.uploadDocTitle')}</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="h-label">{t('clientDetail.docType')}</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="h-select mt-1"
              >
                {DOC_TYPE_KEYS.map((val) => (
                  <option key={val} value={val}>{DOC_TYPE_LABEL[val] || val}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="h-label">{t('clientDetail.file')}</label>
              <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-h-border px-3.5 py-2.5 transition-colors hover:border-h-gray">
                <ImagePlus className="w-4 h-4 text-h-gray" />
                <span className="h-subtitle">
                  {uploadFile ? uploadFile.name : t('clientDetail.chooseFile')}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => { setShowUpload(false); setUploadFile(null); }}
              className="h-btn h-btn-outline h-btn-sm"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !uploadFile}
              className="h-btn h-btn-primary h-btn-sm"
            >
              {uploading ? t('clientDetail.uploading') : t('clientDetail.upload')}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {(!documents || documents.length === 0) ? (
        <div className="h-card h-empty">
          <p className="h-subtitle">{t('clientDetail.noDocs')}</p>
        </div>
      ) : (
        <div className="h-table-card">
          <table className="h-table">
            <thead>
              <tr>
                <th className="h-th">{t('clientDetail.thFile')}</th>
                <th className="h-th">{t('clientDetail.thType')}</th>
                <th className="h-th">{t('clientDetail.thUploadDate')}</th>
                <th className="h-th text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="h-tr">
                  <td className="h-td">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-h-gray" />
                      <span className="h-td-navy">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="h-td h-td-gray">
                    {DOC_TYPE_LABEL[doc.type] || doc.type}
                  </td>
                  <td className="h-td h-td-gray">
                    {fmtDate(doc.uploadedAt)}
                  </td>
                  <td className="h-td text-right">
                    <div className="flex items-center justify-end gap-2">
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-edit-btn"
                        >
                          <FileText className="w-3 h-3" />
                          {t('clientDetail.openDoc')}
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete(doc.id)}
                        className="h-btn h-btn-danger h-btn-sm px-3.5 py-1.5 text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                        {t('common.delete')}
                      </button>
                    </div>
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

/* ================================================================== */
/*  History Tab                                                        */
/* ================================================================== */

function HistoryTab({
  rentalRequests,
  reservations,
  rentals,
}: {
  rentalRequests: RentalRequest[];
  reservations: Reservation[];
  rentals: Rental[];
}) {
  const { t } = useAdminLocale();

  const REQUEST_STATUS_LABEL: Record<string, string> = {
    new: t('clientDetail.requestNew'),
    in_review: t('clientDetail.requestInReview'),
    approved: t('clientDetail.requestApproved'),
    rejected: t('clientDetail.requestRejected'),
    cancelled: t('clientDetail.requestCancelled'),
  };

  const RESERVATION_STATUS_LABEL: Record<string, string> = {
    confirmed: t('clientDetail.reservationConfirmed'),
    picked_up: t('clientDetail.reservationPickedUp'),
    cancelled: t('clientDetail.reservationCancelled'),
    no_show: t('clientDetail.reservationNoShow'),
  };

  const RENTAL_STATUS_LABEL: Record<string, string> = {
    active: t('clientDetail.rentalActive'),
    completed: t('clientDetail.rentalCompleted'),
    cancelled: t('clientDetail.rentalCancelled'),
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Requests */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.requests')}</h3>
        {(!rentalRequests || rentalRequests.length === 0) ? (
          <p className="h-subtitle">{t('clientDetail.noRequests')}</p>
        ) : (
          <div className="h-table-card">
            <table className="h-table">
              <thead>
                <tr>
                  <th className="h-th">#</th>
                  <th className="h-th">{t('common.status')}</th>
                  <th className="h-th">{t('clientDetail.thCar')}</th>
                  <th className="h-th">{t('clientDetail.thDates')}</th>
                  <th className="h-th">{t('common.created')}</th>
                </tr>
              </thead>
              <tbody>
                {rentalRequests.map((r) => (
                  <tr key={r.id} className="h-tr">
                    <td className="h-td h-td-id">{r.id}</td>
                    <td className="h-td">
                      <StatusBadge status={r.status} classMap={REQUEST_STATUS_CLASS} labelMap={REQUEST_STATUS_LABEL} />
                    </td>
                    <td className="h-td h-td-navy">{carLabel(r.car)}</td>
                    <td className="h-td h-td-gray">
                      {fmtDate(r.pickupDate)} — {fmtDate(r.returnDate)}
                    </td>
                    <td className="h-td h-td-gray">{fmtDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservations */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.reservations')}</h3>
        {(!reservations || reservations.length === 0) ? (
          <p className="h-subtitle">{t('clientDetail.noReservations')}</p>
        ) : (
          <div className="h-table-card">
            <table className="h-table">
              <thead>
                <tr>
                  <th className="h-th">#</th>
                  <th className="h-th">{t('common.status')}</th>
                  <th className="h-th">{t('clientDetail.thCar')}</th>
                  <th className="h-th">{t('clientDetail.thDates')}</th>
                  <th className="h-th">{t('common.created')}</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="h-tr">
                    <td className="h-td h-td-id">{r.id}</td>
                    <td className="h-td">
                      <StatusBadge status={r.status} classMap={RESERVATION_STATUS_CLASS} labelMap={RESERVATION_STATUS_LABEL} />
                    </td>
                    <td className="h-td h-td-navy">{carLabel(r.car)}</td>
                    <td className="h-td h-td-gray">
                      {fmtDate(r.pickupDate)} — {fmtDate(r.returnDate)}
                    </td>
                    <td className="h-td h-td-gray">{fmtDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rentals */}
      <div className="h-card p-6">
        <h3 className="h-section-label">{t('clientDetail.rentals')}</h3>
        {(!rentals || rentals.length === 0) ? (
          <p className="h-subtitle">{t('clientDetail.noRentals')}</p>
        ) : (
          <div className="h-table-card">
            <table className="h-table">
              <thead>
                <tr>
                  <th className="h-th">#</th>
                  <th className="h-th">{t('common.status')}</th>
                  <th className="h-th">{t('clientDetail.thCar')}</th>
                  <th className="h-th">{t('clientDetail.thDates')}</th>
                  <th className="h-th">{t('clientDetail.thActualReturn')}</th>
                  <th className="h-th">{t('common.created')}</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => (
                  <tr key={r.id} className="h-tr">
                    <td className="h-td h-td-id">{r.id}</td>
                    <td className="h-td">
                      <StatusBadge status={r.status} classMap={RENTAL_STATUS_CLASS} labelMap={RENTAL_STATUS_LABEL} />
                    </td>
                    <td className="h-td h-td-navy">{carLabel(r.car)}</td>
                    <td className="h-td h-td-gray">
                      {fmtDate(r.pickupDate)} — {fmtDate(r.returnDate)}
                    </td>
                    <td className="h-td h-td-gray">
                      {fmtDate(r.actualReturnDate)}
                    </td>
                    <td className="h-td h-td-gray">{fmtDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
