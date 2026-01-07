import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getUserStats 
} from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { mongoIdValidation, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);

// Route spécifique avant les routes avec paramètres
router.get('/:id/stats', protect, mongoIdValidation, validate, getUserStats);

router.get('/:id', protect, mongoIdValidation, validate, getUserById);
router.put('/:id', protect, mongoIdValidation, validate, updateUser);
router.delete('/:id', protect, admin, mongoIdValidation, validate, deleteUser);

export default router;
