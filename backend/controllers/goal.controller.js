import Goal from '../models/Goal.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
  const { statut } = req.query;
  
  let query = { user: req.user._id };
  if (statut) query.statut = statut;

  const goals = await Goal.find(query).sort('-dateDebut');
  res.json(goals);
});

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id).populate('user', 'nom prenom email');

  if (!goal) {
    res.status(404);
    throw new Error('Objectif non trouvé');
  }

  // Check ownership
  if (goal.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à accéder à cet objectif');
  }

  res.json(goal);
});

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json(goal);
});

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  let goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Objectif non trouvé');
  }

  // Check ownership
  if (goal.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à modifier cet objectif');
  }

  goal = await Goal.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(goal);
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Objectif non trouvé');
  }

  // Check ownership
  if (goal.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé à supprimer cet objectif');
  }

  await goal.deleteOne();
  res.json({ message: 'Objectif supprimé' });
});

// @desc    Add contribution to goal
// @route   POST /api/goals/:id/contribute
// @access  Private
export const addContribution = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Objectif non trouvé');
  }

  // Check ownership
  if (goal.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Non autorisé à contribuer à cet objectif');
  }

  const { montant, note } = req.body;

  if (!montant || montant <= 0) {
    res.status(400);
    throw new Error('Montant invalide');
  }

  await goal.ajouterContribution(montant, note);

  res.json(goal);
});

// @desc    Get goal statistics for user
// @route   GET /api/goals/stats/summary
// @access  Private
export const getGoalStats = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });

  const stats = {
    total: goals.length,
    enCours: goals.filter(g => g.statut === 'en_cours').length,
    atteints: goals.filter(g => g.statut === 'atteint').length,
    abandonnes: goals.filter(g => g.statut === 'abandonne').length,
    enRetard: goals.filter(g => g.statut === 'en_retard').length,
    montantTotalCible: goals.reduce((sum, g) => sum + g.montantCible, 0),
    montantTotalActuel: goals.reduce((sum, g) => sum + g.montantActuel, 0),
    progressionMoyenne: goals.length > 0 
      ? goals.reduce((sum, g) => sum + (g.montantActuel / g.montantCible * 100), 0) / goals.length 
      : 0
  };

  res.json(stats);
});
