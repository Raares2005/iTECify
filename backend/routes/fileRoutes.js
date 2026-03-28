import express from 'express';
import { createFile } from "../controllers/fileControllers/createFileController.js";
import { getFiles } from "../controllers/fileControllers/getAllFilesController.js";
import { getFileById } from "../controllers/fileControllers/getFileController.js";
import { updateFileContent } from "../controllers/fileControllers/updateFileController.js";
const router = express.Router();

router.get('/all', getFiles);
router.get('/:id', getFileById);
router.put('/:id', updateFileContent)


export default router;