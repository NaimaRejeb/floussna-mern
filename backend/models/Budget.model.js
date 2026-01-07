import mongoose from 'mongoose';

// Relation 1-to-Many avec User
const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nom: {
    type: String,
    required: [true, 'Le nom du budget est obligatoire'],
    trim: true
  },
  montantTotal: {
    type: Number,
    required: [true, 'Le montant total est obligatoire'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  devise: {
    type: String,
    enum: ['TND', 'EUR', 'USD'],
    default: 'TND'
  },
  periode: {
    type: String,
    enum: ['mensuel', 'hebdomadaire', 'annuel', 'personnalise'],
    default: 'mensuel'
  },
  dateDebut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateFin: {
    type: Date,
    required: true
  },
  categoriesLimites: [{
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    limite: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  description: {
    type: String
  },
  statut: {
    type: String,
    enum: ['actif', 'termine', 'archive'],
    default: 'actif'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Relation 1-to-Many avec Transaction
budgetSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'budget'
});

// Calculer le montant dépensé
budgetSchema.virtual('montantDepense').get(function() {
  // Ce calcul sera fait dans le controller avec aggregation
  return this._montantDepense || 0;
});

// Validation: dateFin doit être après dateDebut
budgetSchema.pre('validate', function(next) {
  if (this.dateFin <= this.dateDebut) {
    next(new Error('La date de fin doit être après la date de début'));
  }
  next();
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
