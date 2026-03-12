'use client';

import {
  X,
  User,
  MapPin,
  Clock,
  FileText,
  Shield,
  DollarSign,
  Wrench,
  ExternalLink,
  Phone,
  Mail,
  Hash,
  Gauge,
  Loader2,
  Car,
} from 'lucide-react';
import type { ThemeTokens } from '@/context/AdminThemeContext';
import { useAdminLocale } from '@/context/AdminLocaleContext';
import type { Interval } from './calendar-types';
import { TYPE_STYLES, fmtDate, fmtMoney } from './calendar-types';
import { fmtDateTime } from '@/app/admin/lib/format';
import { StatusBadge } from './StatusBadge';
import { DetailRow } from './DetailRow';
import { PriceSnapshotBlock } from './PriceSnapshotBlock';

export function IntervalDetailModal({
  interval,
  detail,
  loading,
  onClose,
  onNavigate,
  H,
}: {
  interval: Interval;
  detail: any;
  loading: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  H: ThemeTokens;
}) {
  const { t } = useAdminLocale();
  const style = TYPE_STYLES[interval.type] ?? TYPE_STYLES.rental;
  const navPath =
    interval.type === 'reservation'
      ? `/admin/reservations/${interval.id}`
      : interval.type === 'rental'
        ? `/admin/rentals/${interval.id}`
        : `/admin/service`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(43, 54, 116, 0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="cal-modal"
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 20,
          background: H.white,
          boxShadow: '0 20px 60px rgba(43, 54, 116, 0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: style.gradient,
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                fontFamily: H.font,
              }}
            >
              {t(style.labelKey)} #{interval.id}
            </span>
            {interval.status && <StatusBadge status={interval.status} H={H} />}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')
            }
          >
            <X style={{ width: 16, height: 16, color: '#fff' }} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '12px 24px',
            maxHeight: '55vh',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 0',
              }}
            >
              <Loader2
                style={{ width: 24, height: 24, color: H.purple }}
                className="animate-spin"
              />
            </div>
          ) : detail ? (
            <div>
              {/* Client */}
              {detail.client && (
                <>
                  <DetailRow icon={User} label={t('calendar.client')} H={H}>
                    {detail.client.firstName} {detail.client.lastName}
                  </DetailRow>
                  {detail.client.phone && (
                    <DetailRow icon={Phone} label={t('calendar.phone')} H={H}>
                      <a
                        href={`tel:${detail.client.phone}`}
                        style={{ color: H.blue, textDecoration: 'none' }}
                      >
                        {detail.client.phone}
                      </a>
                    </DetailRow>
                  )}
                  {detail.client.email && (
                    <DetailRow icon={Mail} label="Email" H={H}>
                      {detail.client.email}
                    </DetailRow>
                  )}
                </>
              )}

              {/* Car */}
              {detail.car && (
                <DetailRow icon={Car} label={t('calendar.car')} H={H}>
                  {detail.car.brand} {detail.car.model}
                  {detail.car.plateNumber && (
                    <span
                      style={{
                        marginLeft: 8,
                        padding: '2px 8px',
                        borderRadius: 8,
                        background: H.bg,
                        fontSize: 11,
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        color: H.navy,
                      }}
                    >
                      {detail.car.plateNumber}
                    </span>
                  )}
                </DetailRow>
              )}

              {/* Dates */}
              <DetailRow icon={Clock} label={t('calendar.period')} H={H}>
                {fmtDateTime(detail.pickupDate || detail.startDate)} —{' '}
                {fmtDateTime(detail.returnDate || detail.endDate)}
              </DetailRow>

              {/* Locations */}
              {detail.pickupLocation && (
                <DetailRow icon={MapPin} label={t('calendar.pickupLocation')} H={H}>
                  {detail.pickupLocation}
                </DetailRow>
              )}
              {detail.returnLocation && (
                <DetailRow icon={MapPin} label={t('calendar.returnLocation')} H={H}>
                  {detail.returnLocation}
                </DetailRow>
              )}

              {/* Contract */}
              {detail.contractNumber && (
                <DetailRow icon={FileText} label={t('calendar.contractNumber')} H={H}>
                  {detail.contractNumber}
                </DetailRow>
              )}

              {/* Odometer */}
              {detail.pickupOdometer && (
                <DetailRow icon={Gauge} label={t('calendar.odometerPickup')} H={H}>
                  {detail.pickupOdometer.toLocaleString()} {t('calendar.km')}
                </DetailRow>
              )}
              {detail.returnOdometer && (
                <DetailRow icon={Gauge} label={t('calendar.odometerReturn')} H={H}>
                  {detail.returnOdometer.toLocaleString()} {t('calendar.km')}
                </DetailRow>
              )}

              {/* Coverage */}
              {detail.coveragePackage && (
                <DetailRow icon={Shield} label={t('calendar.insurance')} H={H}>
                  {detail.coveragePackage.name}
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: 11,
                      color: H.gray,
                    }}
                  >
                    ({t('calendar.deposit')} {detail.coveragePackage.depositPercent}%)
                  </span>
                </DetailRow>
              )}

              {/* Deposit */}
              {detail.depositAmount > 0 && (
                <DetailRow icon={DollarSign} label={t('calendar.deposit')} H={H}>
                  {fmtMoney(detail.depositAmount, detail.depositCurrency)}
                  {detail.depositReturned && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        color: H.green,
                        fontWeight: 600,
                      }}
                    >
                      {t('calendar.depositReturned')}
                    </span>
                  )}
                </DetailRow>
              )}

              {/* Add-ons */}
              {(detail.reservationAddOns?.length > 0 ||
                detail.rentalAddOns?.length > 0) && (
                <div style={{ padding: '8px 0' }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: H.gray,
                      fontFamily: H.font,
                      fontWeight: 500,
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Hash style={{ width: 12, height: 12 }} /> {t('calendar.addOns')}
                  </div>
                  {(
                    detail.reservationAddOns ||
                    detail.rentalAddOns ||
                    []
                  ).map((a: any) => (
                    <div
                      key={a.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        padding: '3px 0',
                        fontFamily: H.font,
                      }}
                    >
                      <span style={{ color: H.navy }}>
                        {a.addOn?.name || t('calendar.addOns')} &times; {a.quantity}
                      </span>
                      <span style={{ fontWeight: 600, color: H.navy }}>
                        {fmtMoney(a.totalMinor, a.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Service-specific fields */}
              {interval.type === 'service' && (
                <>
                  {detail.type && (
                    <DetailRow icon={Wrench} label={t('calendar.serviceType')} H={H}>
                      {detail.type}
                    </DetailRow>
                  )}
                  {detail.description && (
                    <DetailRow icon={FileText} label={t('calendar.serviceDescription')} H={H}>
                      {detail.description}
                    </DetailRow>
                  )}
                  {detail.vendor && (
                    <DetailRow icon={User} label={t('calendar.serviceVendor')} H={H}>
                      {detail.vendor}
                    </DetailRow>
                  )}
                  {detail.costMinor != null && detail.costMinor > 0 && (
                    <DetailRow icon={DollarSign} label={t('calendar.serviceCost')} H={H}>
                      {fmtMoney(detail.costMinor, detail.currency)}
                    </DetailRow>
                  )}
                  {detail.odometer && (
                    <DetailRow icon={Gauge} label={t('calendar.serviceOdometer')} H={H}>
                      {detail.odometer.toLocaleString()} {t('calendar.km')}
                    </DetailRow>
                  )}
                  {detail.notes && (
                    <DetailRow icon={FileText} label={t('calendar.serviceNotes')} H={H}>
                      {detail.notes}
                    </DetailRow>
                  )}
                </>
              )}

              {/* Price snapshot */}
              {detail.priceSnapshot && (
                <PriceSnapshotBlock ps={detail.priceSnapshot} H={H} />
              )}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 0',
                fontSize: 13,
                color: H.gray,
                fontFamily: H.font,
              }}
            >
              {t('calendar.loadError')}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            borderTop: `1px solid ${H.grayLight}`,
            background: H.bg,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="cal-btn-secondary"
          >
            {t('calendar.close')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate(navPath)}
            className="cal-btn-primary"
          >
            <ExternalLink style={{ width: 14, height: 14 }} />
            {t('calendar.open')}
          </button>
        </div>
      </div>
    </div>
  );
}
