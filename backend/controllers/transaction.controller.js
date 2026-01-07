import Transaction from '../models/Transaction.model.js';
import Budget from '../models/Budget.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
  const { budget, type, startDate, endDate, categories } = req.query;
  
  let query = { user: req.user._id };

  if (budget) query.budget = budget;
  if (type) query.type = type;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  if (categories) {
    query.categories = { $in: categories.split(',') };
  }

  const transactions = await Transaction.find(query)
    .populate('budget', 'nom')
    .populate('categories', 'nom icone couleur')
    .sort('-date');

  res.json(transactions);
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('budget', 'nom montantTotal')
    .populate('categories', 'nom icone couleur')
    .populate('user', 'nom prenom email');

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction non trouvée');
  }

  // Check ownership
  if (transaction.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à accéder à cette transaction');
  }

  res.json(transaction);
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req, res) => {
  // Si un budget est spécifié, vérifier qu'il existe et appartient à l'utilisateur
  if (req.body.budget) {
    const budget = await Budget.findById(req.body.budget);

    if (!budget) {
      res.status(404);
      throw new Error('Budget non trouvé');
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Non autorisé à ajouter des transactions à ce budget');
    }
  }

  const transaction = await Transaction.create({
    ...req.body,
    user: req.user._id
  });

  const populatedTransaction = await Transaction.findById(transaction._id)
    .populate('budget', 'nom')
    .populate('categories', 'nom icone couleur');

  res.status(201).json(populatedTransaction);
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req, res) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction non trouvée');
  }

  // Check ownership
  if (transaction.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à modifier cette transaction');
  }

  transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('budget', 'nom')
   .populate('categories', 'nom icone couleur');

  res.json(transaction);
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction non trouvée');
  }

  // Check ownership
  if (transaction.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à supprimer cette transaction');
  }

  await transaction.deleteOne();
  res.json({ message: 'Transaction supprimée' });
});

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats/summary
// @access  Private
export const getTransactionStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let matchQuery = { user: req.user._id };
  
  if (startDate || endDate) {
    matchQuery.date = {};
    if (startDate) matchQuery.date.$gte = new Date(startDate);
    if (endDate) matchQuery.date.$lte = new Date(endDate);
  }

  const stats = await Transaction.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$montant' },
        count: { $sum: 1 },
        moyenne: { $avg: '$montant' }
      }
    }
  ]);

  const depenses = stats.find(s => s._id === 'depense') || { total: 0, count: 0, moyenne: 0 };
  const revenus = stats.find(s => s._id === 'revenu') || { total: 0, count: 0, moyenne: 0 };

  // Stats by category
  const categoryStats = await Transaction.aggregate([
    { $match: { ...matchQuery, type: 'depense' } },
    { $unwind: '$categories' },
    {
      $group: {
        _id: '$categories',
        total: { $sum: '$montant' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    { $unwind: '$categoryInfo' }
  ]);

  res.json({
    totalDepenses: depenses.total,
    totalRevenus: revenus.total,
    solde: revenus.total - depenses.total,
    nombreDepenses: depenses.count,
    nombreRevenus: revenus.count,
    depenseMoyenne: depenses.moyenne,
    revenuMoyen: revenus.moyenne,
    topCategories: categoryStats.map(stat => ({
      category: stat.categoryInfo.nom,
      icone: stat.categoryInfo.icone,
      couleur: stat.categoryInfo.couleur,
      total: stat.total,
      count: stat.count
    }))
  });
});
