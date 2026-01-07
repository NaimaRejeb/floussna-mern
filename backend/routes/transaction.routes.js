import express from 'express';
import { 
  getTransactions, 
  getTransactionById, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getTransactionStats 
} from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { transactionValidation, mongoIdValidation, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTransactions)
  .post(protect, transactionValidation, validate, createTransaction);

router.get('/stats/summary', protect, getTransactionStats);

router.route('/:id')
  .get(protect, mongoIdValidation, validate, getTransactionById)
  .put(protect, mongoIdValidation, transactionValidation, validate, updateTransaction)
  .delete(protect, mongoIdValidation, validate, deleteTransaction);

export default router;
