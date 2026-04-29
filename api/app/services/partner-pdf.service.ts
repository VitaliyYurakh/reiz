import PDFDocument from 'pdfkit';
import path from 'path';

interface ReportRow {
    date: Date;
    car: string;
    days: number;
    basePrice: number;
    discountPercent: number;
    priceAfterDiscount: number;
    commissionPercent: number;
    commissionAmount: number;
    currency: string;
    fxRateToUah?: number | null;
    commissionAmountUah?: number | null;
}

interface ReportPayload {
    partner: {fullName: string; companyName: string | null};
    tiers: Array<{minDays: number; maxDays: number; percent: number}>;
    period: {from: Date; to: Date};
    rows: ReportRow[];
    summary: {totalCommission: number; totalCommissionUah?: number | null};
}

const FONTS_DIR = path.join(__dirname, '..', '..', 'assets', 'fonts');
const FONT_REGULAR = path.join(FONTS_DIR, 'DejaVuSans.ttf');
const FONT_BOLD = path.join(FONTS_DIR, 'DejaVuSans-Bold.ttf');

const PAGE_BG = '#EEF2F8';
const BAND_BG = '#1F3864';
const BAND_FG = '#FFFFFF';
const ACCENT = '#1F3864';
const TABLE_HEAD_BG = '#DCE3EF';
const ROW_LINE = '#B4C7E7';

export async function buildPartnerStatementPDF(report: ReportPayload, currency = 'EUR'): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({size: 'A4', layout: 'landscape', margin: 0});
            doc.registerFont('Body', FONT_REGULAR);
            doc.registerFont('BodyBold', FONT_BOLD);

            const chunks: Buffer[] = [];
            doc.on('data', (c) => chunks.push(c));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            renderPage(doc, report, currency);
            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

function renderPage(doc: PDFKit.PDFDocument, report: ReportPayload, currency: string) {
    const sym = currencySymbol(currency);
    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const margin = 30;
    const contentLeft = margin;
    const contentW = pageW - margin * 2;

    /* ---- Page background tint ---- */
    doc.save();
    doc.rect(0, 0, pageW, pageH).fill(PAGE_BG);
    doc.restore();

    let y = margin;

    /* ---- Title band ---- */
    const titleH = 30;
    fill(doc, contentLeft, y, contentW, titleH, BAND_BG);
    doc.font('BodyBold').fontSize(13).fillColor(BAND_FG);
    const partnerLabel = report.partner.companyName || report.partner.fullName;
    doc.text(`${partnerLabel} — звіт по клієнтах`, contentLeft, y + 9, {
        width: contentW, align: 'center', lineBreak: false,
    });
    y += titleH + 14;

    /* ---- Terms section ---- */
    const termsCols = [
        {w: 80, align: 'left' as const},
        {w: 200, align: 'left' as const},
        {w: 90, align: 'left' as const},
        {w: 200, align: 'left' as const},
    ];
    const termsW = termsCols.reduce((s, c) => s + c.w, 0);

    const termsBandH = 22;
    fill(doc, contentLeft, y, termsW, termsBandH, BAND_BG);
    doc.font('BodyBold').fontSize(10).fillColor(BAND_FG);
    doc.text('Умови співпраці / тарифи', contentLeft + 8, y + 6, {
        width: termsW - 16, lineBreak: false,
    });
    y += termsBandH;

    const termsHeadH = 22;
    fill(doc, contentLeft, y, termsW, termsHeadH, TABLE_HEAD_BG);
    drawCells(doc, contentLeft, y + 6, termsCols, ['Позиція', 'Період оренди', 'Комісія', 'Примітка'], {
        font: 'BodyBold', fontSize: 10, color: '#000',
    });
    y += termsHeadH;

    const sortedTiers = [...report.tiers].sort((a, b) => a.minDays - b.minDays);
    sortedTiers.forEach((tier, idx) => {
        const rowH = 20;
        const period = tier.maxDays === 0
            ? `Оренда від ${tier.minDays} днів`
            : `Оренда ${tier.minDays === 1 ? `до ${tier.maxDays}` : `${tier.minDays}–${tier.maxDays}`} днів`;
        const pct = `${tier.percent.toFixed(1)}%`;

        let cx = contentLeft;
        doc.font('Body').fontSize(10).fillColor('#000');
        doc.text(`Тариф ${idx + 1}`, cx + 8, y + 5, {width: termsCols[0].w - 16, lineBreak: false});
        cx += termsCols[0].w;
        doc.fillColor(ACCENT);
        doc.text(period, cx + 8, y + 5, {width: termsCols[1].w - 16, lineBreak: false});
        cx += termsCols[1].w;
        doc.text(pct, cx + 8, y + 5, {width: termsCols[2].w - 16, lineBreak: false});
        cx += termsCols[2].w;
        doc.fillColor('#000');
        doc.text('від ціни на сайті', cx + 8, y + 5, {width: termsCols[3].w - 16, lineBreak: false});

        line(doc, contentLeft, y + rowH, termsW, ROW_LINE);
        y += rowH;
    });
    y += 18;

    /* ---- Звіт section ---- */
    const reportBandH = 22;
    fill(doc, contentLeft, y, contentW, reportBandH, BAND_BG);
    doc.font('BodyBold').fontSize(10).fillColor(BAND_FG);
    doc.text('Звіт', contentLeft + 8, y + 6, {width: contentW - 16, lineBreak: false});
    y += reportBandH;

    /* ---- Data table ---- */
    const hasUah = report.summary.totalCommissionUah != null;
    const dataCols: Array<{label: string; w: number; align: 'left' | 'right'}> = hasUah ? [
        {label: 'Дата', w: 65, align: 'left'},
        {label: 'Авто', w: 90, align: 'left'},
        {label: 'К-сть днів', w: 60, align: 'right'},
        {label: `Базова ціна (${sym})`, w: 80, align: 'right'},
        {label: 'Знижка', w: 48, align: 'right'},
        {label: `Ціна після знижки (${sym})`, w: 110, align: 'right'},
        {label: 'Ставка комісії', w: 78, align: 'right'},
        {label: `Сума до оплати (${sym})`, w: 110, align: 'right'},
        {label: 'Сума до оплати (₴)', w: 0, align: 'right'},
    ] : [
        {label: 'Дата', w: 78, align: 'left'},
        {label: 'Авто', w: 125, align: 'left'},
        {label: 'К-сть днів', w: 65, align: 'right'},
        {label: `Базова ціна (${sym})`, w: 90, align: 'right'},
        {label: 'Знижка', w: 55, align: 'right'},
        {label: `Ціна після знижки (${sym})`, w: 125, align: 'right'},
        {label: 'Ставка комісії', w: 90, align: 'right'},
        {label: `Сума до оплати (${sym})`, w: 0, align: 'right'},
    ];
    const usedW = dataCols.reduce((s, c) => s + c.w, 0);
    dataCols[dataCols.length - 1].w = contentW - usedW;
    const dataW = dataCols.reduce((s, c) => s + c.w, 0);

    const headRowH = 22;
    fill(doc, contentLeft, y, dataW, headRowH, TABLE_HEAD_BG);
    drawCellsSingleLine(doc, contentLeft, y + 7, dataCols, dataCols.map((c) => c.label), {
        font: 'BodyBold', fontSize: hasUah ? 7.5 : 8.5, color: '#000',
    });
    line(doc, contentLeft, y + headRowH, dataW, ROW_LINE);
    y += headRowH;

    report.rows.forEach((row) => {
        const rowH = 22;
        const values = [
            ymd(row.date),
            row.car,
            String(row.days),
            `${row.basePrice.toFixed(2)} ${sym}`,
            `${row.discountPercent}%`,
            `${row.priceAfterDiscount.toFixed(2)} ${sym}`,
            `${row.commissionPercent.toFixed(1)}%`,
            `${row.commissionAmount.toFixed(2)} ${sym}`,
        ];
        if (hasUah) {
            values.push(row.commissionAmountUah != null ? `${row.commissionAmountUah.toFixed(2)} ₴` : '—');
        }

        let cx = contentLeft;
        doc.font('Body').fontSize(9);
        dataCols.forEach((c, idx) => {
            const isCarCol = idx === 1;
            doc.fillColor(isCarCol ? ACCENT : '#000');
            doc.text(values[idx] ?? '', cx + 6, y + 7, {
                width: c.w - 12, align: c.align, lineBreak: false, ellipsis: true, height: 12,
            });
            cx += c.w;
        });
        line(doc, contentLeft, y + rowH, dataW, ROW_LINE);
        y += rowH;
    });

    /* ---- Filler rows + total at bottom-right ---- */
    const totalRowH = 26;
    const bottomReserve = margin + totalRowH + 4;
    const fillerH = 14;
    while (y + fillerH <= pageH - bottomReserve) {
        line(doc, contentLeft, y + fillerH, dataW, ROW_LINE);
        y += fillerH;
    }

    if (report.rows.length > 0) {
        const totalY = pageH - margin - totalRowH;
        line(doc, contentLeft, totalY, dataW, ROW_LINE);
        doc.font('BodyBold').fontSize(11).fillColor(ACCENT);

        const labelW = 180;
        if (hasUah && report.summary.totalCommissionUah != null) {
            const uahCol = dataCols[dataCols.length - 1];
            const eurCol = dataCols[dataCols.length - 2];
            const labelX = contentLeft + dataW - uahCol.w - eurCol.w - labelW;
            doc.text('Разом до оплати:', labelX, totalY + 8, {
                width: labelW - 6, align: 'right', lineBreak: false,
            });
            doc.text(`${sym} ${report.summary.totalCommission.toFixed(2)}`, labelX + labelW + 6, totalY + 8, {
                width: eurCol.w - 12, align: 'right', lineBreak: false,
            });
            doc.text(`₴ ${report.summary.totalCommissionUah.toFixed(2)}`, labelX + labelW + eurCol.w + 6, totalY + 8, {
                width: uahCol.w - 12, align: 'right', lineBreak: false,
            });
        } else {
            const valCol = dataCols[dataCols.length - 1];
            const labelX = contentLeft + dataW - valCol.w - labelW;
            doc.text('Разом до оплати:', labelX, totalY + 8, {
                width: labelW - 6, align: 'right', lineBreak: false,
            });
            doc.text(`${sym} ${report.summary.totalCommission.toFixed(2)}`, labelX + labelW + 6, totalY + 8, {
                width: valCol.w - 12, align: 'right', lineBreak: false,
            });
        }
    }
}

function fill(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, color: string) {
    doc.save();
    doc.rect(x, y, w, h).fill(color);
    doc.restore();
}

function line(doc: PDFKit.PDFDocument, x: number, y: number, w: number, color: string) {
    doc.save();
    doc.strokeColor(color).lineWidth(0.5);
    doc.moveTo(x, y).lineTo(x + w, y).stroke();
    doc.restore();
}

interface CellOpts {
    font: 'Body' | 'BodyBold';
    fontSize: number;
    color: string;
    height?: number;
}

function drawCells(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    cols: Array<{w: number; align: 'left' | 'right'}>,
    values: string[],
    opts: CellOpts,
) {
    doc.font(opts.font).fontSize(opts.fontSize).fillColor(opts.color);
    let cx = x;
    cols.forEach((c, i) => {
        doc.text(values[i] ?? '', cx + 8, y, {
            width: c.w - 16, align: c.align, lineBreak: false,
        });
        cx += c.w;
    });
}

function drawCellsWrap(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    cols: Array<{w: number; align: 'left' | 'right'}>,
    values: string[],
    opts: CellOpts,
) {
    doc.font(opts.font).fontSize(opts.fontSize).fillColor(opts.color);
    let cx = x;
    cols.forEach((c, i) => {
        doc.text(values[i] ?? '', cx + 6, y, {
            width: c.w - 12, align: c.align, lineBreak: true, height: opts.height,
        });
        cx += c.w;
    });
}

function drawCellsSingleLine(
    doc: PDFKit.PDFDocument,
    x: number,
    y: number,
    cols: Array<{w: number; align: 'left' | 'right'}>,
    values: string[],
    opts: CellOpts,
) {
    doc.font(opts.font).fontSize(opts.fontSize).fillColor(opts.color);
    let cx = x;
    cols.forEach((c, i) => {
        doc.text(values[i] ?? '', cx + 6, y, {
            width: c.w - 12, align: c.align, lineBreak: false, ellipsis: true, height: opts.fontSize + 2,
        });
        cx += c.w;
    });
}

function currencySymbol(code: string): string {
    switch (code.toUpperCase()) {
        case 'EUR': return '€';
        case 'USD': return '$';
        case 'UAH': return '₴';
        case 'PLN': return 'zł';
        default: return code;
    }
}

function ymd(d: Date | string): string {
    const date = d instanceof Date ? d : new Date(d);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
}
