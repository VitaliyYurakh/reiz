import multer, {FileFilterCallback} from 'multer';
import fs from 'fs';
import path from 'path';
import {Request, Response, NextFunction} from 'express';
import {fromFile} from 'file-type';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/** Allowed MIME types for images */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
/** Allowed MIME types for documents (images + PDF) */
const ALLOWED_DOC_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];

/** Map validated MIME type → safe extension (discard original extension) */
const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
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
                return res.status(400).json({msg: 'File type not allowed. Actual content does not match declared type.'});
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

            next();
        } catch {
            next();
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
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

export const documentUpload = multer({storage: clientDocStorage, fileFilter: docFilter, limits: {fileSize: MAX_FILE_SIZE}}).single('document');

// Service event photo upload: field name 'photo', saved to main uploads dir
export const servicePhotoUpload = multer({storage, fileFilter, limits: {fileSize: MAX_FILE_SIZE}}).single('photo');

/** Magic-byte validation middlewares — use AFTER multer in the route chain */
export const validateImageFile = validateFileType(ALLOWED_IMAGE_TYPES);
export const validateDocFile = validateFileType(ALLOWED_DOC_TYPES);

export default carUpload;
