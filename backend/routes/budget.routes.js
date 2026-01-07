import express from 'express';
import { 
  getBudgets, 
  getBudgetById, 
  createBudget, 
  updateBudget, 
  deleteBudget,
  getBudgetStats 
} from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { budgetValidation, mongoIdValidation, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getBudgets)
  .post(protect, budgetValidation, validate, createBudget);

// Route spécifique avant les routes avec paramètres génériques
router.get('/:id/stats', protect, mongoIdValidation, validate, getBudgetStats);

router.route('/:id')
  .get(protect, mongoIdValidation, validate, getBudgetById)
  .put(protect, mongoIdValidation, budgetValidation, validate, updateBudget)
  .delete(protect, mongoIdValidation, validate, deleteBudget);

export default router;
