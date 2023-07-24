import { Router } from 'express';
const router = Router();
import { createNote, getAllNotes, getNoteById, updateNote, deleteNote } from '../controllers/noteController';

router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/:noteId', getNoteById);
router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

export default router;