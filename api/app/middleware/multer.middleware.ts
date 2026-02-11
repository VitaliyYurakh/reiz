import multer, {FileFilterCallback} from 'multer';
import fs from 'fs';
import path from 'path';
import {Request} from 'express';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/** Strip dangerous characters from filenames to prevent path traversal */
const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.{2,}/g, '.');
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

export default carUpload;
