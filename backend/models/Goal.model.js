import mongoose from 'mongoose';

// Relation 1-to-Many avec User
const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titre: {
    type: String,
    required: [true, 'Le titre de l\'objectif est obligatoire'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  montantCible: {
    type: Number,
    required: [true, 'Le montant cible est obligatoire'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  montantActuel: {
    type: Number,
    default: 0,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  devise: {
    type: String,
    enum: ['TND', 'EUR', 'USD'],
    default: 'TND'
  },
  dateDebut: {
    type: Date,
    default: Date.now
  },
  dateEcheance: {
    type: Date,
    required: [true, 'La date d\'échéance est obligatoire']
  },
  categorie: {
    type: String,
    enum: ['epargne', 'achat', 'voyage', 'education', 'maison', 'voiture', 'mariage', 'autre'],
    default: 'autre'
  },
  icone: {
    type: String,
    default: '🎯'
  },
  couleur: {
    type: String,
    default: '#10B981'
  },
  priorite: {
    type: String,
    enum: ['basse', 'moyenne', 'haute'],
    default: 'moyenne'
  },
  statut: {
    type: String,
    enum: ['en_cours', 'atteint', 'abandonne', 'en_retard'],
    default: 'en_cours'
  },
  contributions: [{
    montant: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour calculer le pourcentage de progression
goalSchema.virtual('progression').get(function() {
  if (this.montantCible === 0) return 0;
  return Math.min(Math.round((this.montantActuel / this.montantCible) * 100), 100);
});

// Virtual pour calculer le montant restant
goalSchema.virtual('montantRestant').get(function() {
  return Math.max(this.montantCible - this.montantActuel, 0);
});

// Méthode pour ajouter une contribution
goalSchema.methods.ajouterContribution = function(montant, note = '') {
  this.contributions.push({ montant, note, date: new Date() });
  this.montantActuel += montant;
  
  // Mettre à jour le statut si l'objectif est atteint
  if (this.montantActuel >= this.montantCible) {
    this.statut = 'atteint';
  }
  
  return this.save();
};

// Index
goalSchema.index({ user: 1, statut: 1 });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
