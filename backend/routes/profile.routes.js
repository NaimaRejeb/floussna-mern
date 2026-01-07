import express from 'express';
import { 
  getMyProfile, 
  getProfileByUserId, 
  updateProfile, 
  deleteProfile,
  uploadPhoto 
} from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { mongoIdValidation, validate } from '../middleware/validation.middleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images seulement (jpeg, jpg, png, gif)'));
    }
  }
});

router.get('/me', protect, getMyProfile);
router.get('/user/:userId', protect, mongoIdValidation, validate, getProfileByUserId);
router.put('/me', protect, updateProfile);
router.delete('/me', protect, deleteProfile);
router.post('/photo', protect, upload.single('photo'), uploadPhoto);

export default router;
