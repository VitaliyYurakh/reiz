import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import partnerService from '../services/partner.service';
import {buildPartnerStatementXLSX} from '../services/partner-xlsx.service';
import {buildPartnerStatementPDF} from '../services/partner-pdf.service';
import {parseId, BadRequestError, logger} from '../utils';
import logAudit from '../middleware/audit.middleware';
import {validate, createPartnerSchema, updatePartnerSchema} from '../validators';

class PartnerController {
    async list(req: Request, res: Response) {
        const result = await partnerService.list({
            search: req.query.search as string | undefined,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        });
        res.status(StatusCodes.OK).json(result);
    }

    async getOne(req: Request, res: Response) {
        const partner = await partnerService.getOne(parseId(req.params.id));
        if (!partner) return res.status(StatusCodes.NOT_FOUND).json({msg: 'Partner not found'});
        res.status(StatusCodes.OK).json({partner});
    }

    async create(req: Request, res: Response) {
        const data = validate(createPartnerSchema, req.body);
        const partner = await partnerService.create(data);
        logAudit({actorId: res.locals.user?.id, entityType: 'Partner', entityId: partner.id, action: 'CREATE', after: partner, req});
        res.status(StatusCodes.CREATED).json({partner});
    }

    async update(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const data = validate(updatePartnerSchema, req.body);
        const partner = await partnerService.update(id, data);
        logAudit({actorId: res.locals.user?.id, entityType: 'Partner', entityId: id, action: 'UPDATE', after: partner, req});
        res.status(StatusCodes.OK).json({partner});
    }

    async delete(req: Request, res: Response) {
        const id = parseId(req.params.id);
        await partnerService.delete(id);
        logAudit({actorId: res.locals.user?.id, entityType: 'Partner', entityId: id, action: 'DELETE', req});
        res.status(StatusCodes.OK).json({msg: 'Partner deactivated'});
    }

    async getReport(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const from = parseDateOrThrow(req.query.from as string, 'from');
        const to = parseDateOrThrow(req.query.to as string, 'to');
        const report = await partnerService.getReport(id, from, to);
        res.status(StatusCodes.OK).json(report);
    }

    async exportReportXLSX(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const from = parseDateOrThrow(req.query.from as string, 'from');
        const to = parseDateOrThrow(req.query.to as string, 'to');
        logger.info({id, from, to}, '[partner-xlsx] export start');
        let report: Awaited<ReturnType<typeof partnerService.getReport>>;
        try {
            report = await partnerService.getReport(id, from, to);
            logger.info({rows: report.rows.length}, '[partner-xlsx] report built');
        } catch (err) {
            logger.error({err}, '[partner-xlsx] getReport failed');
            throw err;
        }
        const currency = (req.query.currency as string) || 'EUR';
        let buffer: Buffer;
        try {
            buffer = await buildPartnerStatementXLSX(report, currency);
            logger.info({bytes: buffer.length}, '[partner-xlsx] xlsx built');
        } catch (err) {
            logger.error({err}, '[partner-xlsx] buildPartnerStatementXLSX failed');
            throw err;
        }
        const partnerLabel = report.partner.companyName || report.partner.fullName;
        const fnameUtf8 = `reiz-statement-${slugify(partnerLabel)}-${ymd(from)}_${ymd(to)}.xlsx`;
        // ASCII-only fallback for the `filename` parameter (RFC 2616). Browsers
        // that understand `filename*` (all modern ones) prefer the UTF-8 version.
        const asciiFallback = `reiz-statement-partner-${report.partner.id}-${ymd(from)}_${ymd(to)}.xlsx`;
        const contentDisposition = `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(fnameUtf8)}`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', contentDisposition);
        res.send(buffer);
    }

    async exportReportPDF(req: Request, res: Response) {
        const id = parseId(req.params.id);
        const from = parseDateOrThrow(req.query.from as string, 'from');
        const to = parseDateOrThrow(req.query.to as string, 'to');
        logger.info({id, from, to}, '[partner-pdf] export start');
        let report: Awaited<ReturnType<typeof partnerService.getReport>>;
        try {
            report = await partnerService.getReport(id, from, to);
            logger.info({rows: report.rows.length}, '[partner-pdf] report built');
        } catch (err) {
            logger.error({err}, '[partner-pdf] getReport failed');
            throw err;
        }
        const currency = (req.query.currency as string) || 'EUR';
        let buffer: Buffer;
        try {
            buffer = await buildPartnerStatementPDF(report, currency);
            logger.info({bytes: buffer.length}, '[partner-pdf] pdf built');
        } catch (err) {
            logger.error({err}, '[partner-pdf] buildPartnerStatementPDF failed');
            throw err;
        }
        const partnerLabel = report.partner.companyName || report.partner.fullName;
        const fnameUtf8 = `reiz-statement-${slugify(partnerLabel)}-${ymd(from)}_${ymd(to)}.pdf`;
        const asciiFallback = `reiz-statement-partner-${report.partner.id}-${ymd(from)}_${ymd(to)}.pdf`;
        const contentDisposition = `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(fnameUtf8)}`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', contentDisposition);
        res.send(buffer);
    }
}

function parseDateOrThrow(s: string | undefined, name: string): Date {
    if (!s) {
        throw new BadRequestError(`Query param "${name}" is required (YYYY-MM-DD)`);
    }
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) {
        throw new BadRequestError(`Invalid date for "${name}": ${s}`);
    }
    return d;
}

function ymd(d: Date) {
    return d.toISOString().slice(0, 10);
}

function slugify(s: string) {
    return s.toLowerCase().replace(/[^\wЀ-ӿ-]+/g, '-').replace(/-+/g, '-').slice(0, 60);
}

export default new PartnerController();
