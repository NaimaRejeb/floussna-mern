import express from 'express';
import { 
  getGoals, 
  getGoalById, 
  createGoal, 
  updateGoal, 
  deleteGoal,
  addContribution,
  getGoalStats 
} from '../controllers/goal.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { goalValidation, mongoIdValidation, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getGoals)
  .post(protect, goalValidation, validate, createGoal);

router.get('/stats/summary', protect, getGoalStats);

router.route('/:id')
  .get(protect, mongoIdValidation, validate, getGoalById)
  .put(protect, mongoIdValidation, goalValidation, validate, updateGoal)
  .delete(protect, mongoIdValidation, validate, deleteGoal);

router.post('/:id/contribute', protect, mongoIdValidation, validate, addContribution);

export default router;
