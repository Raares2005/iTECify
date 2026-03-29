import express from 'express'
import { generateInlineSuggestion } from '../controllers/aiController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/inline', protect, generateInlineSuggestion)

export default router