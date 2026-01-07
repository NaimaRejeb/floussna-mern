import User from '../models/User.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').populate('profile');
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('profile');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Only allow user to update their own profile (unless admin)
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Non autorisé à modifier cet utilisateur');
    }

    user.nom = req.body.nom || user.nom;
    user.prenom = req.body.prenom || user.prenom;
    user.email = req.body.email || user.email;
    user.telephone = req.body.telephone || user.telephone;

    // Only admin can change role
    if (req.user.role === 'admin') {
      user.role = req.body.role || user.role;
      user.actif = req.body.actif !== undefined ? req.body.actif : user.actif;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      nom: updatedUser.nom,
      prenom: updatedUser.prenom,
      email: updatedUser.email,
      telephone: updatedUser.telephone,
      role: updatedUser.role,
      actif: updatedUser.actif
    });
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'Utilisateur supprimé' });
  } else {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  // Verify user access
  if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Non autorisé');
  }

  const Budget = (await import('../models/Budget.model.js')).default;
  const Transaction = (await import('../models/Transaction.model.js')).default;
  const Goal = (await import('../models/Goal.model.js')).default;

  const [budgetCount, transactionCount, goalCount] = await Promise.all([
    Budget.countDocuments({ user: req.params.id }),
    Transaction.countDocuments({ user: req.params.id }),
    Goal.countDocuments({ user: req.params.id })
  ]);

  res.json({
    budgets: budgetCount,
    transactions: transactionCount,
    goals: goalCount
  });
});
