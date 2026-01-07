import Profile from '../models/Profile.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// @desc    Get user profile
// @route   GET /api/profiles/me
// @access  Private
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate('user', '-password');

  if (profile) {
    res.json(profile);
  } else {
    res.status(404);
    throw new Error('Profil non trouvé');
  }
});

// @desc    Get profile by user ID
// @route   GET /api/profiles/user/:userId
// @access  Private
export const getProfileByUserId = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.userId }).populate('user', '-password');

  if (profile) {
    res.json(profile);
  } else {
    res.status(404);
    throw new Error('Profil non trouvé');
  }
});

// @desc    Update profile
// @route   PUT /api/profiles/me
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (profile) {
    profile.photo = req.body.photo || profile.photo;
    profile.dateNaissance = req.body.dateNaissance || profile.dateNaissance;
    profile.ville = req.body.ville || profile.ville;
    profile.adresse = req.body.adresse || profile.adresse;
    profile.profession = req.body.profession || profile.profession;
    profile.revenuMensuel = req.body.revenuMensuel !== undefined ? req.body.revenuMensuel : profile.revenuMensuel;
    profile.devise = req.body.devise || profile.devise;
    profile.biographie = req.body.biographie || profile.biographie;

    if (req.body.preferences) {
      profile.preferences = {
        ...profile.preferences,
        ...req.body.preferences
      };
    }

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } else {
    res.status(404);
    throw new Error('Profil non trouvé');
  }
});

// @desc    Delete profile
// @route   DELETE /api/profiles/me
// @access  Private
export const deleteProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (profile) {
    await profile.deleteOne();
    res.json({ message: 'Profil supprimé' });
  } else {
    res.status(404);
    throw new Error('Profil non trouvé');
  }
});

// @desc    Upload profile photo
// @route   POST /api/profiles/photo
// @access  Private
export const uploadPhoto = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error('Profil non trouvé');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Veuillez télécharger une image');
  }

  profile.photo = `/uploads/${req.file.filename}`;
  await profile.save();

  res.json({ 
    message: 'Photo mise à jour',
    photo: profile.photo 
  });
});
