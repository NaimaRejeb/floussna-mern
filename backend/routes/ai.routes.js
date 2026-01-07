import express from 'express';
import { 
  getFinancialAdvice,
  analyzeSpending,
  recommendBudget,
  getSavingsTips
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All AI routes require authentication
router.post('/advice', protect, getFinancialAdvice);
router.post('/analyze-spending', protect, analyzeSpending);
router.post('/recommend-budget', protect, recommendBudget);
router.get('/savings-tips', protect, getSavingsTips);

export default router;
