import {Router} from 'express';
import {complaintController} from '../controllers';

const router = Router();

// Public — anyone can submit a complaint via the contact form / customer cabinet.
// We keep this on a SEPARATE router so it isn't accidentally protected by an
// `auth` middleware applied to the main /complaint admin router.
router.post('/', complaintController.create);

export default router;
