import User from '../models/User.model.js';
import Profile from '../models/Profile.model.js';
import { generateToken } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { nom, prenom, email, password, telephone } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Un utilisateur avec cet email existe déjà');
  }

  // Create user
  const user = await User.create({
    nom,
    prenom,
    email,
    password,
    telephone
  });

  // Create default profile
  await Profile.create({
    user: user._id,
    devise: 'TND',
    preferences: {
      notifications: true,
      langue: 'fr',
      theme: 'light'
    }
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Données utilisateur invalides');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    if (!user.actif) {
      res.status(401);
      throw new Error('Compte désactivé');
    }

    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe incorrect');
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('profile');
  
  res.json(user);
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    res.status(401);
    throw new Error('Mot de passe actuel incorrect');
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json({
    message: 'Mot de passe mis à jour avec succès',
    token: generateToken(user._id)
  });
});
