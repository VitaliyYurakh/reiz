import ExcelJS from 'exceljs';

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

const HEADER_BG = 'FF1F3864';      // dark blue (matches user's screenshot)
const ROW_BG = 'FFE8F0F8';         // light blue-grey
const TOTAL_BG = 'FFFFF2CC';       // pale yellow

export async function buildPartnerStatementXLSX(report: ReportPayload, currency = 'EUR'): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'Reiz';
    wb.created = new Date();

    const ws = wb.addWorksheet('Звіт', {views: [{state: 'frozen', ySplit: 10}]});

    ws.columns = [
        {key: 'date', width: 14},
        {key: 'car', width: 28},
        {key: 'days', width: 12},
        {key: 'basePrice', width: 16},
        {key: 'discount', width: 12},
        {key: 'afterDiscount', width: 22},
        {key: 'commissionPct', width: 18},
        {key: 'commissionAmount', width: 22},
        // UAH-equivalent of the commission, frozen at the NBU rate from the
        // pickup day. Operator pays the partner in UAH but the rentals are
        // priced in EUR, so this column is what they actually transfer.
        {key: 'commissionAmountUah', width: 22},
    ];

    /* ---- Title row ---- */
    ws.mergeCells('A1:I1');
    const title = ws.getCell('A1');
    title.value = `Reiz — звіт по клієнтах (${report.partner.companyName || report.partner.fullName})`;
    title.font = {bold: true, size: 14, color: {argb: 'FFFFFFFF'}};
    title.alignment = {horizontal: 'center', vertical: 'middle'};
    title.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: HEADER_BG}};
    ws.getRow(1).height = 28;

    /* ---- Cooperation terms section ---- */
    ws.mergeCells('A3:I3');
    const termsTitle = ws.getCell('A3');
    termsTitle.value = 'Умови співпраці / тарифи';
    termsTitle.font = {bold: true, size: 11, color: {argb: 'FFFFFFFF'}};
    termsTitle.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: HEADER_BG}};
    termsTitle.alignment = {horizontal: 'left', vertical: 'middle', indent: 1};

    ws.getRow(4).values = ['Позиція', 'Період оренди', 'Комісія', 'Примітка'];
    ws.getRow(4).eachCell((cell) => {
        cell.font = {bold: true, size: 10};
        cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFD9E2F3'}};
        cell.border = {bottom: {style: 'thin', color: {argb: 'FF8FAADC'}}};
    });

    report.tiers
        .sort((a, b) => a.minDays - b.minDays)
        .forEach((tier, idx) => {
            const rowIdx = 5 + idx;
            const period = tier.maxDays === 0
                ? `Оренда від ${tier.minDays} днів`
                : `Оренда ${tier.minDays === 1 ? `до ${tier.maxDays}` : `${tier.minDays}–${tier.maxDays}`} днів`;
            ws.getRow(rowIdx).values = [
                `Тариф ${idx + 1}`,
                period,
                tier.percent / 100,
                'від ціни на сайті',
            ];
            ws.getCell(`C${rowIdx}`).numFmt = '0.0%';
            ws.getCell(`C${rowIdx}`).font = {bold: true, color: {argb: 'FF1F3864'}};
        });

    /* ---- Report header ---- */
    const reportHeaderRow = 9;
    ws.mergeCells(`A${reportHeaderRow}:I${reportHeaderRow}`);
    const rh = ws.getCell(`A${reportHeaderRow}`);
    rh.value = 'Звіт';
    rh.font = {bold: true, size: 11, color: {argb: 'FFFFFFFF'}};
    rh.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: HEADER_BG}};
    rh.alignment = {horizontal: 'left', vertical: 'middle', indent: 1};

    const colsHeaderRow = 10;
    ws.getRow(colsHeaderRow).values = [
        'Дата',
        'Авто',
        'К-сть днів',
        `Базова ціна (${currency})`,
        'Знижка',
        `Ціна після знижки (${currency})`,
        'Ставка комісії',
        `Сума до оплати (${currency})`,
        'Сума до оплати (₴)',
    ];
    ws.getRow(colsHeaderRow).eachCell((cell) => {
        cell.font = {bold: true, size: 10};
        cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFD9E2F3'}};
        cell.alignment = {vertical: 'middle'};
        cell.border = {bottom: {style: 'thin', color: {argb: 'FF8FAADC'}}};
    });

    /* ---- Data rows ---- */
    let lastRow = colsHeaderRow;
    report.rows.forEach((row, i) => {
        const r = colsHeaderRow + 1 + i;
        lastRow = r;
        ws.getRow(r).values = [
            new Date(row.date),
            row.car,
            row.days,
            row.basePrice,
            row.discountPercent / 100,
            row.priceAfterDiscount,
            row.commissionPercent / 100,
            row.commissionAmount,
            row.commissionAmountUah ?? null,
        ];
        ws.getCell(`A${r}`).numFmt = 'dd.mm.yyyy';
        ws.getCell(`D${r}`).numFmt = `"${currencySymbol(currency)}" #,##0.00`;
        ws.getCell(`E${r}`).numFmt = '0%';
        ws.getCell(`F${r}`).numFmt = `"${currencySymbol(currency)}" #,##0.00`;
        ws.getCell(`G${r}`).numFmt = '0.0%';
        ws.getCell(`H${r}`).numFmt = `"${currencySymbol(currency)}" #,##0.00`;
        ws.getCell(`I${r}`).numFmt = '"₴" #,##0.00';
        ws.getRow(r).eachCell((cell) => {
            cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: ROW_BG}};
            cell.border = {bottom: {style: 'hair', color: {argb: 'FFB4C7E7'}}};
        });
    });

    /* ---- Total row ---- */
    if (report.rows.length > 0) {
        const totalRow = lastRow + 2;
        ws.getCell(`G${totalRow}`).value = 'Разом до оплати:';
        ws.getCell(`G${totalRow}`).font = {bold: true};
        ws.getCell(`G${totalRow}`).alignment = {horizontal: 'right'};
        ws.getCell(`H${totalRow}`).value = report.summary.totalCommission;
        ws.getCell(`H${totalRow}`).numFmt = `"${currencySymbol(currency)}" #,##0.00`;
        ws.getCell(`H${totalRow}`).font = {bold: true};
        ws.getCell(`H${totalRow}`).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: TOTAL_BG}};
        if (report.summary.totalCommissionUah != null) {
            ws.getCell(`I${totalRow}`).value = report.summary.totalCommissionUah;
            ws.getCell(`I${totalRow}`).numFmt = '"₴" #,##0.00';
            ws.getCell(`I${totalRow}`).font = {bold: true};
            ws.getCell(`I${totalRow}`).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: TOTAL_BG}};
        }
    }

    const buffer = await wb.xlsx.writeBuffer();
    return Buffer.from(buffer);
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
