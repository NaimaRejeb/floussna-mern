import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Erreur de validation',
      errors: errors.array() 
    });
  }
  next();
};

// Validation rules for User/Auth
export const registerValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('telephone')
    .optional({ checkFalsy: true })
    .customSanitizer((value) => (typeof value === 'string' ? value.replace(/\s+/g, '') : value))
    .matches(/^[0-9]{8}$/)
    .withMessage('Numéro de téléphone tunisien invalide')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est obligatoire')
];

// Validation rules for Budget
export const budgetValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom du budget est obligatoire'),
  body('montantTotal').isFloat({ min: 0 }).withMessage('Le montant doit être positif'),
  body('dateDebut').isISO8601().withMessage('Date de début invalide'),
  body('dateFin').isISO8601().withMessage('Date de fin invalide')
];

// Validation rules for Transaction
export const transactionValidation = [
  body('budget').optional().isMongoId().withMessage('Budget ID invalide'),
  body('type').isIn(['depense', 'revenu']).withMessage('Type invalide'),
  body('montant').isFloat({ min: 0 }).withMessage('Le montant doit être positif'),
  body('description').trim().notEmpty().withMessage('La description est obligatoire'),
  body('categories').optional().isArray().withMessage('Categories doit être un tableau')
];

// Validation rules for Goal
export const goalValidation = [
  body('titre').trim().notEmpty().withMessage('Le titre est obligatoire'),
  body('montantCible').isFloat({ min: 0 }).withMessage('Le montant cible doit être positif'),
  body('dateEcheance').isISO8601().withMessage('Date d\'échéance invalide')
];

// Validation rules for Category
export const categoryValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom de la catégorie est obligatoire'),
  body('type').isIn(['depense', 'revenu']).withMessage('Type invalide (depense ou revenu)')
];

// Validation for MongoDB ObjectId
export const mongoIdValidation = [
  param('id').isMongoId().withMessage('ID invalide')
];
