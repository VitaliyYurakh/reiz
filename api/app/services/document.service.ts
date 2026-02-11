import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import {prisma} from '../utils';

const DOC_TYPE_TITLES: Record<string, string> = {
    RENTAL_CONTRACT: 'ДОГОВІР ОРЕНДИ ТРАНСПОРТНОГО ЗАСОБУ',
    PICKUP_ACT: 'АКТ ПРИЙМАННЯ-ПЕРЕДАЧІ (ВИДАЧА)',
    RETURN_ACT: 'АКТ ПРИЙМАННЯ-ПЕРЕДАЧІ (ПОВЕРНЕННЯ)',
    INVOICE: 'РАХУНОК-ФАКТУРА',
};

function fmtDate(d: Date | string | null) {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleDateString('uk-UA', {day: '2-digit', month: '2-digit', year: 'numeric'});
}

function fmtMoney(minor: number | null | undefined, currency = 'UAH') {
    if (minor == null) return '—';
    return `${(minor / 100).toFixed(2)} ${currency}`;
}

class DocumentService {
    async download(id: number) {
        const doc = await prisma.document.findUnique({where: {id}});

        if (!doc) {
            throw new Error('Document not found');
        }

        const uploadsDir = path.resolve(__dirname, '../../../uploads');
        const filePath = path.resolve(uploadsDir, doc.fileUrl.replace('/static/', ''));

        // Path traversal protection: ensure resolved path stays within uploads
        if (!filePath.startsWith(uploadsDir)) {
            throw new Error('Invalid file path');
        }

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        return {
            filePath,
            fileName: doc.fileName,
            mimeType: 'application/pdf',
        };
    }

    async generate(type: string, rentalId: number) {
        const rental = await prisma.rental.findUnique({
            where: {id: rentalId},
            include: {
                client: true,
                car: true,
                rentalAddOns: {include: {addOn: true}},
                inspections: {orderBy: {createdAt: 'desc'}},
                fines: true,
            },
        });

        if (!rental) {
            throw new Error(`Rental with id ${rentalId} not found`);
        }

        const timestamp = Date.now();
        const fileName = `${type}_rental_${rentalId}_${timestamp}.pdf`;
        const fileUrl = `/static/documents/${fileName}`;

        // Ensure directory exists
        const uploadsDir = path.resolve(__dirname, '../../../uploads');
        const docsDir = path.join(uploadsDir, 'documents');
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, {recursive: true});
        }

        const filePath = path.join(docsDir, fileName);

        // Generate actual PDF
        await this.generatePdf(filePath, type, rental);

        const dataSnapshot = {
            rental: {
                id: rental.id,
                contractNumber: rental.contractNumber,
                pickupDate: rental.pickupDate,
                returnDate: rental.returnDate,
                pickupLocation: rental.pickupLocation,
                returnLocation: rental.returnLocation,
                priceSnapshot: rental.priceSnapshot,
            },
            client: {
                id: rental.client.id,
                firstName: rental.client.firstName,
                lastName: rental.client.lastName,
                phone: rental.client.phone,
                email: rental.client.email,
                driverLicenseNo: rental.client.driverLicenseNo,
                passportNo: rental.client.passportNo,
            },
            car: {
                id: rental.car.id,
                brand: rental.car.brand,
                model: rental.car.model,
                plateNumber: rental.car.plateNumber,
                VIN: rental.car.VIN,
            },
            generatedAt: new Date().toISOString(),
        };

        return await prisma.document.create({
            data: {
                type,
                rentalId,
                fileUrl,
                fileName,
                templateVersion: '1.0.0',
                dataSnapshot,
            },
        });
    }

    private async generatePdf(filePath: string, type: string, rental: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({size: 'A4', margin: 50});
            const stream = fs.createWriteStream(filePath);

            stream.on('finish', resolve);
            stream.on('error', reject);
            doc.pipe(stream);

            const title = DOC_TYPE_TITLES[type] || type;
            const client = rental.client;
            const car = rental.car;
            const ps = rental.priceSnapshot as any;

            // Title
            doc.fontSize(16).text(title, {align: 'center'});
            doc.moveDown(0.5);

            // Contract number & date
            const contractNum = rental.contractNumber || `R-${rental.id}`;
            doc.fontSize(10).text(`No: ${contractNum}    Дата: ${fmtDate(rental.createdAt)}`, {align: 'center'});
            doc.moveDown(1);

            // Client info
            doc.fontSize(12).text('ОРЕНДАР:', {underline: true});
            doc.fontSize(10);
            doc.text(`ПІБ: ${client.lastName || ''} ${client.firstName || ''} ${client.middleName || ''}`);
            doc.text(`Телефон: ${client.phone || '—'}`);
            if (client.email) doc.text(`Email: ${client.email}`);
            if (client.passportNo) doc.text(`Паспорт: ${client.passportNo}`);
            if (client.driverLicenseNo) doc.text(`Посвідчення водія: ${client.driverLicenseNo}`);
            doc.moveDown(1);

            // Car info
            doc.fontSize(12).text('ТРАНСПОРТНИЙ ЗАСІБ:', {underline: true});
            doc.fontSize(10);
            doc.text(`Марка/Модель: ${car.brand || ''} ${car.model || ''}`);
            doc.text(`Держ. номер: ${car.plateNumber || '—'}`);
            if (car.VIN) doc.text(`VIN: ${car.VIN}`);
            doc.moveDown(1);

            // Rental details
            doc.fontSize(12).text('УМОВИ ОРЕНДИ:', {underline: true});
            doc.fontSize(10);
            doc.text(`Дата видачі: ${fmtDate(rental.pickupDate)}`);
            doc.text(`Дата повернення: ${fmtDate(rental.returnDate)}`);
            if (rental.actualReturnDate) {
                doc.text(`Фактичне повернення: ${fmtDate(rental.actualReturnDate)}`);
            }
            doc.text(`Місце видачі: ${rental.pickupLocation || '—'}`);
            doc.text(`Місце повернення: ${rental.returnLocation || '—'}`);
            if (rental.allowedMileage) {
                doc.text(`Дозволений пробіг: ${rental.allowedMileage} км`);
            }
            doc.moveDown(1);

            // Odometer data (for acts)
            if (type === 'PICKUP_ACT' || type === 'RETURN_ACT') {
                doc.fontSize(12).text('ПОКАЗНИКИ ОДОМЕТРА:', {underline: true});
                doc.fontSize(10);
                if (rental.pickupOdometer != null) {
                    doc.text(`При видачі: ${rental.pickupOdometer} км`);
                }
                if (rental.returnOdometer != null) {
                    doc.text(`При поверненні: ${rental.returnOdometer} км`);
                }
                if (rental.pickupOdometer != null && rental.returnOdometer != null) {
                    doc.text(`Пройдено: ${rental.returnOdometer - rental.pickupOdometer} км`);
                }

                // Inspection notes
                const relevantType = type === 'PICKUP_ACT' ? 'PICKUP' : 'RETURN';
                const inspection = rental.inspections?.find((i: any) => i.type === relevantType);
                if (inspection) {
                    doc.moveDown(0.5);
                    doc.text(`Рівень палива: ${inspection.fuelLevel != null ? inspection.fuelLevel + '%' : '—'}`);
                    doc.text(`Чистота: ${inspection.cleanlinessOk ? 'Так' : 'Ні'}`);
                    if (inspection.notes) doc.text(`Примітки: ${inspection.notes}`);
                }
                doc.moveDown(1);
            }

            // Pricing (for contract and invoice)
            if (type === 'RENTAL_CONTRACT' || type === 'INVOICE') {
                doc.fontSize(12).text('ВАРТІСТЬ:', {underline: true});
                doc.fontSize(10);
                if (ps) {
                    if (ps.dailyRateMinor || ps.dailyRate) {
                        doc.text(`Добова ставка: ${fmtMoney(ps.dailyRateMinor || ps.dailyRate, ps.currency || 'UAH')}`);
                    }
                    if (ps.totalDays) {
                        doc.text(`Кількість діб: ${ps.totalDays}`);
                    }
                    if (ps.totalMinor || ps.total) {
                        doc.text(`Загальна вартість: ${fmtMoney(ps.totalMinor || ps.total, ps.currency || 'UAH')}`);
                    }
                }
                if (rental.depositAmount) {
                    doc.text(`Застава: ${fmtMoney(rental.depositAmount, rental.depositCurrency || 'UAH')}`);
                }

                // Add-ons
                if (rental.rentalAddOns?.length > 0) {
                    doc.moveDown(0.5);
                    doc.text('Додаткові послуги:');
                    for (const ra of rental.rentalAddOns) {
                        doc.text(`  - ${ra.addOn?.name || 'Послуга'}: ${ra.quantity} x ${fmtMoney(ra.unitPriceMinor, ra.currency)} = ${fmtMoney(ra.totalMinor, ra.currency)}`);
                    }
                }

                // Fines (for invoice)
                if (type === 'INVOICE' && rental.fines?.length > 0) {
                    doc.moveDown(0.5);
                    doc.text('Штрафи:');
                    for (const fine of rental.fines) {
                        const paid = fine.isPaid ? ' (сплачено)' : ' (не сплачено)';
                        doc.text(`  - ${fine.type}: ${fine.description} — ${fmtMoney(fine.amountMinor, fine.currency)}${paid}`);
                    }
                }
                doc.moveDown(1);
            }

            // Signatures
            doc.moveDown(2);
            doc.fontSize(10);
            doc.text('Орендодавець: ___________________ / ___________________ /', {align: 'left'});
            doc.moveDown(1.5);
            doc.text('Орендар: ___________________ / ___________________ /', {align: 'left'});

            doc.end();
        });
    }

    async getByRental(rentalId: number) {
        return await prisma.document.findMany({
            where: {rentalId},
            orderBy: {generatedAt: 'desc'},
        });
    }

    async delete(id: number) {
        // Also delete the physical file
        const docRecord = await prisma.document.findUnique({where: {id}});
        if (docRecord) {
            const uploadsDir = path.resolve(__dirname, '../../../uploads');
            const filePath = path.resolve(uploadsDir, docRecord.fileUrl.replace('/static/', ''));

            // Path traversal protection
            if (filePath.startsWith(uploadsDir) && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return await prisma.document.delete({
            where: {id},
        });
    }
}

export default new DocumentService();
