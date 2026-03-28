import express from 'express';
import { getFileById } from '../controllers/fileControllers/getFileController.js';

const router = express.Router();

router.get('/all', getFiles);
router.get('/:id', getFileById);
router.put('/:id', updateFileContent)


export default router;