import express from 'express';
import { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  seedCategories 
} from '../controllers/category.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { categoryValidation, mongoIdValidation, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCategories)
  .post(protect, admin, categoryValidation, validate, createCategory);

router.post('/seed', protect, admin, seedCategories);

router.route('/:id')
  .get(protect, mongoIdValidation, validate, getCategoryById)
  .put(protect, admin, mongoIdValidation, categoryValidation, validate, updateCategory)
  .delete(protect, admin, mongoIdValidation, validate, deleteCategory);

export default router;
