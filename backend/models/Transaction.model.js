import mongoose from 'mongoose';

// Relation 1-to-Many avec Budget et Many-to-Many avec Category
const transactionSchema = new mongoose.Schema({
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: false // Budget optionnel
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['depense', 'revenu'],
    required: [true, 'Le type de transaction est obligatoire']
  },
  montant: {
    type: Number,
    required: [true, 'Le montant est obligatoire'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  devise: {
    type: String,
    enum: ['TND', 'EUR', 'USD'],
    default: 'TND'
  },
  // Relation Many-to-Many avec Category
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  recurrente: {
    type: Boolean,
    default: false
  },
  frequenceRecurrence: {
    type: String,
    enum: ['quotidienne', 'hebdomadaire', 'mensuelle', 'annuelle', 'aucune'],
    default: 'aucune'
  },
  lieu: {
    type: String,
    trim: true
  },
  modePaiement: {
    type: String,
    enum: ['especes', 'carte', 'virement', 'cheque', 'mobile', 'autre'],
    default: 'especes'
  },
  recu: {
    type: String // URL ou chemin du fichier
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ budget: 1, type: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
