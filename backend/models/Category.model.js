import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la catégorie est obligatoire'],
    unique: true,
    trim: true
  },
  nomArabe: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['depense', 'revenu'],
    required: true
  },
  icone: {
    type: String,
    default: '💰'
  },
  couleur: {
    type: String,
    default: '#3B82F6'
  },
  description: {
    type: String
  },
  estSysteme: {
    type: Boolean,
    default: false // Les catégories système ne peuvent pas être supprimées
  }
}, {
  timestamps: true
});

// Relation Many-to-Many avec Transaction (via le modèle Transaction)
categorySchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'categories'
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
