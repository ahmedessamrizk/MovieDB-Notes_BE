import { Router } from 'express'
import { auth } from '../../middleware/auth.js';
import * as noteController from './controller/note.js' 

const router = Router();

router.post('/addNote', auth() ,noteController.addNote);
router.get('/getUserNotes', auth(), noteController.getUserNotes);
router.delete('/deleteNote', auth(), noteController.deleteNote);
router.put('/updateNote', auth(), noteController.updateNote);

export default router