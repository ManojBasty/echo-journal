import {Router} from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createJournal, getJournals } from '../controllers/journal.controller';
import { updateJournal, deleteJournal } from '../controllers/journal.controller';
import { analyzeJournal } from '../controllers/journal.controller';
const router = Router();

router.post('/journals/:id/analyze', authenticate, analyzeJournal);
router.post('/journals', authenticate, createJournal);
router.get('/journals', authenticate, getJournals); 
router.put('/journals/:id', authenticate, updateJournal);
router.delete('/journals/:id', authenticate, deleteJournal);
router.post('/journals/:id/analyze', authenticate, analyzeJournal);


export default router;