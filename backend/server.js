import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profile.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import categoryRoutes from './routes/category.routes.js';
import goalRoutes from './routes/goal.routes.js';
import aiRoutes from './routes/ai.routes.js';

// Import error handler
import { errorHandler } from './middleware/error.middleware.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS Configuration - doit être avant les routes
const corsOptions = {
  origin: function (origin, callback) {
    // Permettre les requêtes sans origin (comme les applis mobiles ou Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permettre temporairement tous les origins en dev
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ai', aiRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: '🌙 Bienvenue sur Floussna API - Gestion de Budget Tunisienne',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      profiles: '/api/profiles',
      budgets: '/api/budgets',
      transactions: '/api/transactions',
      categories: '/api/categories',
      goals: '/api/goals',
      ai: '/api/ai'
    }
  });
});

// Error Handler (must be after routes)
app.use(errorHandler);

// Database Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté avec succès');
    const server = app.listen(PORT, () => {
      console.log(`🚀 Serveur Floussna démarré sur le port ${PORT}`);
      console.log(`📍 Environnement: ${process.env.NODE_ENV}`);
    });

    // Gestion d'erreur pour le port déjà utilisé
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Erreur: Le port ${PORT} est déjà utilisé.`);
        console.error(`💡 Solutions:`);
        console.error(`   1. Arrêtez le processus qui utilise le port ${PORT}`);
        console.error(`   2. Sur Windows: netstat -ano | findstr :${PORT} puis taskkill /PID <PID> /F`);
        console.error(`   3. Changez le port dans votre fichier .env (PORT=5001)`);
        process.exit(1);
      } else {
        console.error('❌ Erreur serveur:', error.message);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Erreur non gérée:', err.message);
  process.exit(1);
});
