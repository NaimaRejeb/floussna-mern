import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      if (!req.user.actif) {
        return res.status(401).json({ message: 'Compte désactivé' });
      }

      next();
    } catch (error) {
      // Gestion des erreurs JWT spécifiques
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token invalide, veuillez vous reconnecter' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expiré, veuillez vous reconnecter' });
      }
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, pas de token' });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé. Administrateur requis.' });
  }
};

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};
