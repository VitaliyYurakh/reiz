import auth from './auth.middleware';
import multer from './multer.middleware';
import {documentUpload, validateImageFile, validateDocFile} from './multer.middleware';
import requireRole from './role.middleware';
import {requirePermission} from './role.middleware';
import logAudit from './audit.middleware';
import parsePagination from './pagination.middleware';
import csrfProtection from './csrf.middleware';
import globalErrorHandler from './global-error.middleware';

export {auth, multer, documentUpload, validateImageFile, validateDocFile, requireRole, requirePermission, logAudit, parsePagination, csrfProtection, globalErrorHandler};
