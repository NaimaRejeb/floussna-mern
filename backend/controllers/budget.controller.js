import Budget from '../models/Budget.model.js';
import Transaction from '../models/Transaction.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id })
    .populate('categoriesLimites.category')
    .sort('-dateDebut');

  res.json(budgets);
});

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
export const getBudgetById = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id)
    .populate('categoriesLimites.category')
    .populate('user', 'nom prenom email');

  if (!budget) {
    res.status(404);
    throw new Error('Budget non trouvé');
  }

  // Check ownership
  if (budget.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à accéder à ce budget');
  }

  // Calculate spent amount
  const transactions = await Transaction.find({ 
    budget: req.params.id,
    type: 'depense'
  });

  const montantDepense = transactions.reduce((sum, t) => sum + t.montant, 0);

  res.json({
    ...budget.toObject(),
    montantDepense,
    montantRestant: budget.montantTotal - montantDepense,
    pourcentageUtilise: (montantDepense / budget.montantTotal) * 100
  });
});

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json(budget);
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = asyncHandler(async (req, res) => {
  let budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget non trouvé');
  }

  // Check ownership
  if (budget.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à modifier ce budget');
  }

  budget = await Budget.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('categoriesLimites.category');

  res.json(budget);
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget non trouvé');
  }

  // Check ownership
  if (budget.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à supprimer ce budget');
  }

  await budget.deleteOne();
  res.json({ message: 'Budget supprimé' });
});

// @desc    Get budget statistics
// @route   GET /api/budgets/:id/stats
// @access  Private
export const getBudgetStats = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget non trouvé');
  }

  // Check ownership
  if (budget.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé');
  }

  const stats = await Transaction.aggregate([
    { $match: { budget: budget._id } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$montant' },
        count: { $sum: 1 }
      }
    }
  ]);

  const depenses = stats.find(s => s._id === 'depense') || { total: 0, count: 0 };
  const revenus = stats.find(s => s._id === 'revenu') || { total: 0, count: 0 };

  res.json({
    budget: budget.montantTotal,
    depenses: depenses.total,
    revenus: revenus.total,
    solde: budget.montantTotal + revenus.total - depenses.total,
    nombreTransactions: depenses.count + revenus.count,
    nombreDepenses: depenses.count,
    nombreRevenus: revenus.count
  });
});
