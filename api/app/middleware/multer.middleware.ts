import multer, {FileFilterCallback} from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import convert from 'heic-convert';
import {Request, Response, NextFunction} from 'express';
import {fromFile} from 'file-type';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/** Allowed MIME types for images — kept wide so admins can drop in photos straight off a phone/camera; convertToWebp normalizes them all afterwards. */
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/tiff',
    'image/avif',
    'image/heic',
    'image/heif',
];
/** Allowed MIME types for documents (images + PDF) */
const ALLOWED_DOC_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];

/** Map validated MIME type → safe extension (discard original extension) */
const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/tiff': '.tiff',
    'image/avif': '.avif',
    'image/heic': '.heic',
    'image/heif': '.heif',
    'application/pdf': '.pdf',
};

/** Strip dangerous characters from filenames to prevent path traversal */
const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.{2,}/g, '.');
};

/**
 * Middleware that validates uploaded file's actual content (magic bytes)
 * against allowed MIME types. Rejects and deletes spoofed files.
 */
export const validateFileType = (allowedTypes: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) return next();

        try {
            const result = await fromFile(req.file.path);
            const actualMime = result?.mime;

            if (!actualMime || !allowedTypes.includes(actualMime)) {
                // Delete the spoofed file
                fs.unlink(req.file.path, () => {});
                return res.status(400).json({
                    msg: 'File type not allowed. Actual content does not match declared type.',
                });
            }

            // Rename file to use safe extension derived from actual MIME
            const safeExt = MIME_TO_EXT[actualMime] || '';
            if (safeExt) {
                const dir = path.dirname(req.file.path);
                const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt}`;
                const newPath = path.join(dir, baseName);
                fs.renameSync(req.file.path, newPath);
                req.file.path = newPath;
                req.file.filename = baseName;
            }
            // Trust the sniffed content type from here on, not the client-declared one
            req.file.mimetype = actualMime;

            next();
        } catch (err) {
            // Do not silently pass through (audit H-11): an exception in file-type
            // detection previously left the uploaded file on disk AND treated it as
            // validated. Remove the file and forward the error to the global handler.
            fs.unlink(req.file.path, () => {});
            next(err);
        }
    };
};

const uploadDir = path.resolve('./uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${sanitizeFilename(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const carUpload = multer({storage, fileFilter, limits: {fileSize: MAX_FILE_SIZE}}).single('car');

// Document upload: images + PDF, field name 'document'
const docFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image and PDF files are allowed'));
    }
};

// Ensure client-documents subdirectory exists
const clientDocsDir = path.resolve('./uploads/client-documents');
if (!fs.existsSync(clientDocsDir)) {
    fs.mkdirSync(clientDocsDir, {recursive: true});
}

const clientDocStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, clientDocsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${sanitizeFilename(file.originalname)}`;
        cb(null, uniqueName);
    },
});

export const documentUpload = multer({
    storage: clientDocStorage,
    fileFilter: docFilter,
    limits: {fileSize: MAX_FILE_SIZE},
}).single('document');

// Service event photo upload: field name 'photo', saved to main uploads dir
export const servicePhotoUpload = multer({
    storage,
    fileFilter,
    limits: {fileSize: MAX_FILE_SIZE},
}).single('photo');

/** Magic-byte validation middlewares — use AFTER multer in the route chain */
export const validateImageFile = validateFileType(ALLOWED_IMAGE_TYPES);
export const validateDocFile = validateFileType(ALLOWED_DOC_TYPES);

const WEBP_QUALITY = 82;
const MAX_DIMENSION = 2000; // cap longest side in px — car photos never need to be larger

const HEIC_MIME_TYPES = ['image/heic', 'image/heif'];

/**
 * Converts an already-validated image on disk to WebP (auto-orients from EXIF,
 * caps dimensions, re-encodes), replacing req.file's path/filename/mimetype/size.
 * Use AFTER validateImageFile so the file's real content type is already confirmed.
 *
 * HEIC/HEIF go through heic-convert (WASM libheif) first: sharp's prebuilt binary
 * links libheif but not the HEVC decoder (licensing), so it fails on real
 * HEVC-encoded photos from iPhones even though it happily reads AVIF (same
 * container, AV1 codec, no license issue).
 */
export const convertToWebp = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    const originalPath = req.file.path;
    const dir = path.dirname(originalPath);
    const webpName = `${path.parse(req.file.filename).name}.webp`;
    const webpPath = path.join(dir, webpName);

    (async () => {
        let pipelineInput: string | Buffer = originalPath;

        if (HEIC_MIME_TYPES.includes(req.file!.mimetype)) {
            const heicBuffer = fs.readFileSync(originalPath);
            const jpegBuffer = await convert({buffer: heicBuffer, format: 'JPEG', quality: 1});
            pipelineInput = Buffer.from(jpegBuffer);
        }

        await sharp(pipelineInput)
            .rotate()
            .resize({
                width: MAX_DIMENSION,
                height: MAX_DIMENSION,
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({quality: WEBP_QUALITY})
            .toFile(webpPath);

        fs.unlink(originalPath, () => {});
        const stats = fs.statSync(webpPath);
        req.file!.path = webpPath;
        req.file!.filename = webpName;
        req.file!.mimetype = 'image/webp';
        req.file!.size = stats.size;
        next();
    })().catch(() => {
        fs.unlink(originalPath, () => {});
        res.status(400).json({
            msg: 'Could not process this image format. Please convert it to JPEG or PNG and try again.',
        });
    });
};

export default carUpload;
