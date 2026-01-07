import Category from '../models/Category.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  let query = {};
  if (type) query.type = type;

  const categories = await Category.find(query).sort('nom');
  res.json(categories);
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Catégorie non trouvée');
  }

  res.json(category);
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Catégorie non trouvée');
  }

  if (category.estSysteme) {
    res.status(403);
    throw new Error('Impossible de modifier une catégorie système');
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Catégorie non trouvée');
  }

  if (category.estSysteme) {
    res.status(403);
    throw new Error('Impossible de supprimer une catégorie système');
  }

  await category.deleteOne();
  res.json({ message: 'Catégorie supprimée' });
});

// @desc    Seed default categories
// @route   POST /api/categories/seed
// @access  Private/Admin
export const seedCategories = asyncHandler(async (req, res) => {
  const defaultCategories = [
    // Dépenses
    { nom: 'Alimentation', nomArabe: 'الأكل', type: 'depense', icone: '🍴', couleur: '#EF4444', estSysteme: true },
    { nom: 'Transport', nomArabe: 'النقل', type: 'depense', icone: '🚗', couleur: '#3B82F6', estSysteme: true },
    { nom: 'Logement', nomArabe: 'السكن', type: 'depense', icone: '🏠', couleur: '#8B5CF6', estSysteme: true },
    { nom: 'Santé', nomArabe: 'الصحة', type: 'depense', icone: '⚕️', couleur: '#10B981', estSysteme: true },
    { nom: 'Loisirs', nomArabe: 'الترفيه', type: 'depense', icone: '🎮', couleur: '#F59E0B', estSysteme: true },
    { nom: 'Education', nomArabe: 'التعليم', type: 'depense', icone: '📚', couleur: '#6366F1', estSysteme: true },
    { nom: 'Vêtements', nomArabe: 'الملابس', type: 'depense', icone: '👔', couleur: '#EC4899', estSysteme: true },
    { nom: 'Factures', nomArabe: 'الفواتير', type: 'depense', icone: '📄', couleur: '#EF4444', estSysteme: true },
    { nom: 'Abonnements', nomArabe: 'الاشتراكات', type: 'depense', icone: '📱', couleur: '#14B8A6', estSysteme: true },
    { nom: 'Café/Restaurant', nomArabe: 'المقاهي', type: 'depense', icone: '☕', couleur: '#F97316', estSysteme: true },
    
    // Revenus
    { nom: 'Salaire', nomArabe: 'الأجر', type: 'revenu', icone: '💰', couleur: '#10B981', estSysteme: true },
    { nom: 'Freelance', nomArabe: 'العمل الحر', type: 'revenu', icone: '💼', couleur: '#3B82F6', estSysteme: true },
    { nom: 'Investissement', nomArabe: 'الاستثمار', type: 'revenu', icone: '📈', couleur: '#8B5CF6', estSysteme: true },
    { nom: 'Cadeau', nomArabe: 'هدية', type: 'revenu', icone: '🎁', couleur: '#EC4899', estSysteme: true },
    { nom: 'Autre', nomArabe: 'أخرى', type: 'revenu', icone: '💵', couleur: '#6B7280', estSysteme: true }
  ];

  // Delete existing non-system categories and insert defaults
  await Category.deleteMany({ estSysteme: false });
  
  const existingCategories = await Category.find({ estSysteme: true });
  const newCategories = defaultCategories.filter(
    cat => !existingCategories.find(existing => existing.nom === cat.nom)
  );

  if (newCategories.length > 0) {
    await Category.insertMany(newCategories);
  }

  const allCategories = await Category.find({}).sort('type nom');
  
  res.json({
    message: 'Catégories initialisées avec succès',
    count: allCategories.length,
    categories: allCategories
  });
});
