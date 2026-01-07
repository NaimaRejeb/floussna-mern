import mongoose from 'mongoose';

// Relation 1-to-1 avec User
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Garantit la relation 1-to-1
  },
  photo: {
    type: String,
    default: 'default-avatar.png'
  },
  dateNaissance: {
    type: Date
  },
  ville: {
    type: String,
    enum: ['Tunis', 'Sfax', 'Sousse', 'Gabès', 'Bizerte', 'Ariana', 'Gafsa', 'Monastir', 'Ben Arous', 'Kasserine', 'Médenine', 'Nabeul', 'Tataouine', 'Kairouan', 'Jendouba', 'Mahdia', 'Siliana', 'Béja', 'Le Kef', 'Tozeur', 'Manouba', 'Zaghouan', 'Kebili', 'Sidi Bouzid', 'Autre']
  },
  adresse: {
    type: String
  },
  profession: {
    type: String
  },
  revenuMensuel: {
    type: Number,
    default: 0,
    min: [0, 'Le revenu ne peut pas être négatif']
  },
  devise: {
    type: String,
    enum: ['TND', 'EUR', 'USD'],
    default: 'TND'
  },
  biographie: {
    type: String,
    maxlength: [500, 'La biographie ne peut pas dépasser 500 caractères']
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    langue: {
      type: String,
      enum: ['fr', 'ar', 'en'],
      default: 'fr'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
