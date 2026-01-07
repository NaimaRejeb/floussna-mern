# Rapport Projet MERN - Floussna (فلوسنا)

**Nom:** REJEB Naima  
**École:** École Polytechnique de Sousse  
**Année Universitaire:** 2025-2026  
**Date:** Janvier 2026

---

## 1. Présentation du Projet

### 1.1 Nom et Thème
**Floussna (فلوسنا)** - "Notre Argent" en tunisien

Application web de gestion de budget personnel adaptée au contexte tunisien.

### 1.2 Objectifs
- Permettre aux tunisiens de gérer leur budget efficacement
- Suivre les dépenses en dinars tunisiens (TND)
- Atteindre des objectifs financiers
- Bénéficier de conseils IA personnalisés

### 1.3 Particularités Tunisiennes
- Support du dinar tunisien (TND)
- Catégories adaptées au contexte local
- Interface bilingue (Français/Arabe)
- Villes tunisiennes prédéfinies
- Thème aux couleurs du drapeau tunisien

---

## 2. Architecture Technique

### 2.1 Stack MERN
- **MongoDB**: Base de données NoSQL
- **Express.js**: Framework backend Node.js
- **React**: Bibliothèque frontend
- **Node.js**: Environnement d'exécution JavaScript

### 2.2 Technologies Complémentaires

#### Backend
- JWT: Authentification sécurisée
- Bcrypt: Hashage des mots de passe
- Express-validator: Validation des données
- Google Gemini AI: Intelligence artificielle
- Helmet: Sécurité HTTP
- CORS: Gestion des origines croisées

#### Frontend
- React Router: Navigation
- Axios: Requêtes HTTP
- Tailwind CSS: Framework CSS
- Recharts: Visualisation de données
- React Toastify: Notifications

---

## 3. Modèle de Données

### 3.1 Entités (6 au total)

#### 1. User (Utilisateur)
- Informations personnelles
- Email et mot de passe hashé
- Rôle (user/admin)

#### 2. Profile (Profil) - Relation 1:1 avec User
- Photo de profil
- Ville tunisienne
- Profession
- Revenu mensuel
- Préférences (langue, thème, notifications)

#### 3. Budget - Relation 1:N avec User
- Nom et montant total
- Période (mensuel/annuel)
- Limites par catégorie
- Dates de début et fin

#### 4. Transaction - Relation 1:N avec Budget
- Type (dépense/revenu)
- Montant et devise
- Date et description
- Mode de paiement

#### 5. Category - Relation N:M avec Transaction
- Nom (FR et AR)
- Type (dépense/revenu)
- Icône et couleur
- Catégories système prédéfinies

#### 6. Goal (Objectif) - Relation 1:N avec User
- Titre et description
- Montant cible et actuel
- Date d'échéance
- Contributions historiques

### 3.2 Relations Implémentées

✅ **1-to-1**: User ↔ Profile  
✅ **1-to-Many**: User → Budget (2 exemples)  
✅ **1-to-Many**: User → Goal  
✅ **1-to-Many**: Budget → Transaction  
✅ **Many-to-Many**: Transaction ↔ Category  

---

## 4. Fonctionnalités Implémentées

### 4.1 Authentification & Sécurité
- ✅ Inscription avec validation des données
- ✅ Connexion JWT sécurisée
- ✅ Hashage bcrypt des mots de passe
- ✅ Protection des routes
- ✅ Middleware d'autorisation

### 4.2 CRUD Complet

#### Users
- ✅ CREATE: Inscription
- ✅ READ: Liste et détails
- ✅ UPDATE: Modification profil
- ✅ DELETE: Suppression compte

#### Budgets
- ✅ CREATE: Nouveau budget
- ✅ READ: Liste et détails
- ✅ UPDATE: Modification
- ✅ DELETE: Suppression

#### Transactions
- ✅ CREATE: Nouvelle transaction
- ✅ READ: Liste avec filtres
- ✅ UPDATE: Modification
- ✅ DELETE: Suppression

#### Goals
- ✅ CREATE: Nouvel objectif
- ✅ READ: Liste et détails
- ✅ UPDATE: Modification
- ✅ DELETE: Suppression

#### Categories
- ✅ CREATE: Nouvelle catégorie (Admin)
- ✅ READ: Liste
- ✅ UPDATE: Modification (Admin)
- ✅ DELETE: Suppression (Admin)

### 4.3 Fonctionnalités Avancées

#### Intelligence Artificielle (Gemini)
- ✅ Conseils financiers personnalisés
- ✅ Analyse des habitudes de dépenses
- ✅ Recommandations de budget
- ✅ Conseils d'épargne contextualisés

#### Statistiques
- ✅ Dashboard avec métriques clés
- ✅ Graphiques de dépenses par catégorie
- ✅ Suivi de progression des objectifs
- ✅ Analyse de budget

---

## 5. Structure du Projet

```
projet_mern_Naima_REJEB/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── profile.controller.js
│   │   ├── budget.controller.js
│   │   ├── transaction.controller.js
│   │   ├── category.controller.js
│   │   ├── goal.controller.js
│   │   └── ai.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Profile.model.js
│   │   ├── Budget.model.js
│   │   ├── Transaction.model.js
│   │   ├── Category.model.js
│   │   └── Goal.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── profile.routes.js
│   │   ├── budget.routes.js
│   │   ├── transaction.routes.js
│   │   ├── category.routes.js
│   │   ├── goal.routes.js
│   │   └── ai.routes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AIAssistant.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── budgetService.js
│   │   │   ├── transactionService.js
│   │   │   ├── goalService.js
│   │   │   ├── categoryService.js
│   │   │   ├── profileService.js
│   │   │   └── aiService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 6. Points Forts du Projet

### 6.1 Conformité au Cahier des Charges
- ✅ 6 entités MongoDB (minimum 5 requis)
- ✅ Relations 1-to-1, 1-to-Many, Many-to-Many
- ✅ API REST complète pour toutes les entités
- ✅ CRUD complet
- ✅ Authentification JWT
- ✅ Validation des données
- ✅ Sécurité (bcrypt, CORS, helmet)
- ✅ Intégration IA (Gemini)

### 6.2 Originalité
- 🇹🇳 Thème 100% tunisien
- 🌙 Support bilingue FR/AR
- 💱 Gestion multi-devises avec TND
- 🤖 Assistant IA contextualisé
- 🎨 Design professionnel avec Tailwind

### 6.3 Qualité du Code
- 📁 Architecture MVC claire
- 🔒 Sécurité renforcée
- ✨ Code propre et documenté
- 🎯 Séparation des responsabilités
- 📊 Gestion d'erreurs robuste

---

## 7. Instructions d'Installation

### 7.1 Prérequis
- Node.js v18+
- MongoDB v6+
- npm ou yarn

### 7.2 Installation Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run dev
```

### 7.3 Installation Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 7.4 Configuration MongoDB
```javascript
// Option 1: Local
MONGODB_URI=mongodb://localhost:27017/floussna

// Option 2: Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/floussna
```

---

## 8. API Endpoints Principaux

### 8.1 Authentification
```
POST /api/auth/register    - Inscription nouvel utilisateur
POST /api/auth/login       - Connexion (retourne token JWT)
GET  /api/auth/me          - Récupérer profil utilisateur connecté
```

### 8.2 Budgets (CRUD Complet)
```
GET    /api/budgets        - Liste tous les budgets
POST   /api/budgets        - Créer nouveau budget
GET    /api/budgets/:id    - Détails d'un budget
PUT    /api/budgets/:id    - Modifier un budget
DELETE /api/budgets/:id    - Supprimer un budget
```

### 8.3 Transactions (CRUD Complet)
```
GET    /api/transactions           - Liste toutes les transactions (avec filtres)
POST   /api/transactions           - Créer nouvelle transaction
GET    /api/transactions/:id       - Détails d'une transaction
PUT    /api/transactions/:id       - Modifier une transaction
DELETE /api/transactions/:id       - Supprimer une transaction
GET    /api/transactions/stats     - Statistiques transactions
```

### 8.4 Catégories (CRUD Complet)
```
GET    /api/categories        - Liste toutes les catégories
POST   /api/categories        - Créer nouvelle catégorie
GET    /api/categories/:id    - Détails d'une catégorie
PUT    /api/categories/:id    - Modifier une catégorie
DELETE /api/categories/:id    - Supprimer une catégorie
```

### 8.5 Objectifs (CRUD Complet)
```
GET    /api/goals             - Liste tous les objectifs
POST   /api/goals             - Créer nouvel objectif
GET    /api/goals/:id         - Détails d'un objectif
PUT    /api/goals/:id         - Modifier un objectif
DELETE /api/goals/:id         - Supprimer un objectif
POST   /api/goals/:id/contribute - Ajouter contribution
```

### 8.6 Profil Utilisateur
```
GET    /api/profile           - Récupérer profil
PUT    /api/profile           - Mettre à jour profil
PUT    /api/profile/password  - Changer mot de passe
```

### 8.7 Assistant IA
```
POST /api/ai/advice           - Obtenir conseils financiers IA
POST /api/ai/analyze-spending - Analyser les dépenses
GET  /api/ai/savings-tips     - Conseils d'économie
```

**Note**: Toutes les routes (sauf auth) sont protégées par middleware JWT

---

## 9. Détails d'Implémentation Technique

### 9.1 Système d'Authentification JWT

**Flow d'inscription**:
1. Frontend envoie POST /api/auth/register avec email, password, nom
2. Backend valide les données avec express-validator
3. Hash du password avec bcrypt (10 rounds)
4. Création User + Profile associé
5. Génération token JWT (expire 7 jours)
6. Retour token + données utilisateur

**Code Backend (auth.controller.js)**:
```javascript
// Hashing sécurisé
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Génération token JWT
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**Protection des routes**:
```javascript
// Middleware auth.middleware.js
const token = req.header('Authorization')?.replace('Bearer ', '');
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.userId);
```

### 9.2 Implémentation CRUD Budgets

**Interface Frontend (Budgets.jsx)**:
- Modal form pour création/édition
- Grid responsive avec cards visuelles
- Barres de progression colorées (rouge/orange/vert)
- Calcul automatique pourcentage dépensé
- Confirmation avant suppression

**Logique Clé**:
```javascript
// Calcul progression
const percentage = (budget.spent / budget.montant) * 100;

// Couleurs adaptatives
const getProgressColor = (percentage) => {
  if (percentage >= 90) return 'bg-red-600';
  if (percentage >= 70) return 'bg-orange-500';
  return 'bg-green-600';
};
```

### 9.3 Implémentation CRUD Transactions

**Fonctionnalités Avancées**:
- Filtrage par type (revenus/dépenses/tous)
- Statistiques temps réel (total revenus, dépenses, solde)
- Association catégorie + budget
- Validation montants positifs
- Format date tunisien

**Statistiques Dynamiques**:
```javascript
const stats = {
  totalRevenus: transactions
    .filter(t => t.type === 'revenu')
    .reduce((sum, t) => sum + t.montant, 0),
  totalDepenses: transactions
    .filter(t => t.type === 'depense')
    .reduce((sum, t) => sum + t.montant, 0)
};
stats.solde = stats.totalRevenus - stats.totalDepenses;
```

### 9.4 Implémentation CRUD Objectifs

**Système de Contributions**:
- Progress bar visuelle avec pourcentage
- Calcul jours restants avant deadline
- Modal séparée pour contributions
- Mise à jour automatique montantActuel
- Badges de statut (En cours/Atteint/Expiré)

**Code Contribution**:
```javascript
// Ajout contribution
const updatedGoal = await goalService.addContribution(goalId, {
  montant: parseFloat(contributionAmount),
  date: new Date()
});

// Calcul progression
const progressPercentage = 
  (goal.montantActuel / goal.montantCible) * 100;
```

### 9.5 Implémentation Profil Utilisateur

**Sections du Profil**:
1. **Informations personnelles**: nom, email, téléphone
2. **Préférences**: devise (TND), langue (fr), timezone (Africa/Tunis)
3. **Sécurité**: changement mot de passe

**Validation Téléphone Tunisien**:
```javascript
const phoneRegex = /^[2-9]\d{7}$/; // 8 chiffres, commence par 2-9
```

### 9.6 Assistant IA - Mode Demo

**Implémentation Intelligente**:
- Détection absence clé API Gemini
- Fallback vers conseils prédéfinis
- Analyse contexte utilisateur (budgets, transactions)
- Templates de réponses adaptés

**Templates de Conseils**:
```javascript
const demoAdvice = {
  budget: "Créez un budget mensuel...",
  economies: "Réduisez dépenses superflues...",
  investissement: "Constituez épargne sécurité..."
};
```

---

## 10. Tests et Validation

### 10.1 Tests Manuels Effectués

**Authentification**:
- ✅ Inscription avec validation email unique
- ✅ Login avec credentials corrects/incorrects
- ✅ Protection routes privées sans token
- ✅ Déconnexion et suppression token

**CRUD Budgets**:
- ✅ Création budget avec catégorie
- ✅ Modification montant et période
- ✅ Suppression avec confirmation
- ✅ Affichage progression colorée

**CRUD Transactions**:
- ✅ Ajout revenus/dépenses
- ✅ Filtrage par type
- ✅ Calcul statistiques temps réel
- ✅ Association catégorie + budget

**CRUD Objectifs**:
- ✅ Création objectif avec deadline
- ✅ Ajout contributions
- ✅ Calcul progression automatique
- ✅ Badges statut (atteint/en cours)

**Profil**:
- ✅ Mise à jour infos personnelles
- ✅ Modification préférences
- ✅ Changement mot de passe sécurisé

**Assistant IA**:
- ✅ Mode demo sans clé API
- ✅ Suggestions prédéfinies
- ✅ Analyse contexte utilisateur

### 10.2 Validation des Données

**Backend (express-validator)**:
```javascript
// Exemple validation transaction
body('montant')
  .isNumeric()
  .withMessage('Montant doit être numérique')
  .isFloat({ min: 0.01 })
  .withMessage('Montant doit être positif')
```

**Frontend (validation forms)**:
- Vérification champs requis
- Format email valide
- Montants positifs
- Dates cohérentes (deadline > aujourd'hui)

### 10.3 Gestion des Erreurs

**Middleware Centralisé**:
```javascript
// error.middleware.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur'
  });
});
```

**Messages Utilisateur**:
- Toast notifications (react-toastify)
- Messages d'erreur explicites
- Confirmation actions critiques

---

## 11. Défis Rencontrés et Solutions

### 11.1 Compatibilité React 19
**Défi**: Page d'inscription blanche au démarrage  
**Cause**: Incompatibilité react-toastify ancien avec React 19  
**Solution**: Mise à jour vers react-toastify@10+ et react-router-dom@6.21+

### 11.2 Relations Many-to-Many
**Défi**: Implémentation de la relation Transaction-Category  
**Solution**: Utilisation de références ObjectId dans le modèle Transaction avec populate()

### 11.3 Sécurité JWT
**Défi**: Protection des routes et gestion token  
**Solution**: 
- Middleware auth centralisé vérifiant token
- Intercepteurs Axios ajoutant token automatiquement
- Stockage sécurisé dans localStorage

### 11.4 Validation Tunisienne
**Défi**: Validation numéro téléphone tunisien (8 chiffres)  
**Solution**: Regex personnalisée `/^[2-9]\d{7}$/` dans validation backend

### 11.5 Gestion États Frontend
**Défi**: Synchronisation état entre composants  
**Solution**: Context API (AuthContext) pour état global utilisateur

### 11.6 Intégration IA sans Clé API
**Défi**: Assistant IA non fonctionnel sans clé Gemini  
**Solution**: Mode demo intelligent avec templates prédéfinis et analyse contexte

### 11.7 Performance Calculs
**Défi**: Statistiques en temps réel ralentissent UI  
**Solution**: useMemo pour mémoriser calculs coûteux

---

## 12. Captures d'Écran et Démonstration

### 12.1 Parcours Utilisateur Type

**1. Inscription/Connexion**
- Interface clean avec formulaires validés
- Messages erreur en français
- Redirection automatique après login

**2. Dashboard**
- Vue d'ensemble finances
- Graphiques revenus/dépenses (Recharts)
- Cartes rapides budgets/objectifs
- Boutons d'action directs

**3. Gestion Budgets**
- Grid responsive avec cards visuelles
- Barres progression colorées (vert/orange/rouge)
- Modal création/édition intuitive
- Confirmation suppression

**4. Transactions**
- Tableau détaillé avec filtres
- Stats en temps réel (revenus, dépenses, solde)
- Couleurs par type (vert revenus, rouge dépenses)
- Association catégorie + budget

**5. Objectifs**
- Cards avec progress bars
- Système contributions
- Calcul jours restants
- Badges statut

**6. Assistant IA**
- Interface chat moderne
- Suggestions prédéfinies
- Analyse dépenses personnalisée
- Mode demo transparent

**7. Profil**
- Édition infos personnelles
- Préférences locales (TND, français, timezone Tunisie)
- Changement mot de passe sécurisé

### 12.2 Responsive Design

Toutes les pages sont testées et fonctionnelles sur:
- 📱 Mobile (320px - 768px)
- 📱 Tablette (768px - 1024px)
- 💻 Desktop (1024px+)

Grâce à Tailwind CSS avec classes responsive (sm:, md:, lg:)

---

## 13. Améliorations Futures

### 13.1 Court Terme (3-6 mois)
- 📱 Application mobile React Native
- 📊 Export PDF des rapports mensuels
- 🔔 Notifications push (alertes dépassement budget)
- 📈 Graphiques avancés (tendances, prévisions)

### 13.2 Moyen Terme (6-12 mois)
- 💳 Intégration paiements mobiles tunisiens (d17, Flouci)
- 🤖 IA prédictive (dépenses futures, recommandations)
- 👥 Budgets partagés (famille, colocation)
- 🏦 Synchronisation bancaire automatique

### 13.3 Long Terme (12+ mois)
- 🌍 Support multidevises Maghreb (MAD, DZD)
- 🧾 Scan tickets (OCR)
- 📊 Tableaux de bord personnalisables
- 🎯 Gamification (badges, défis économies)

---

## 14. Conclusion

**Floussna** est une application complète de gestion de budget qui respecte et dépasse les exigences du cahier des charges tout en apportant une vraie valeur ajoutée pour les utilisateurs tunisiens.

### 14.1 Objectifs Atteints

✅ **Stack MERN complet** avec architecture moderne  
✅ **6 modèles de données** avec relations bien définies  
✅ **Authentification sécurisée** JWT avec protection routes  
✅ **CRUD complet** pour toutes les entités (Budgets, Transactions, Catégories, Objectifs, Profil)  
✅ **Assistant IA fonctionnel** avec fallback intelligent  
✅ **Interface moderne** Tailwind CSS responsive  
✅ **Validation complète** backend et frontend  
✅ **Gestion erreurs robuste** avec messages utilisateur clairs  

### 14.2 Compétences Démontrées

Le projet démontre:
- ✅ **Maîtrise du stack MERN** (MongoDB, Express, React 19, Node.js)
- ✅ **Compréhension architectures REST** (séparation routes/controllers/models)
- ✅ **Capacité intégration services IA** (Google Gemini avec fallback)
- ✅ **Sens du design et UX** (interface intuitive, feedback utilisateur)
- ✅ **Adaptation contexte local** (devise TND, langue française, validation tunisienne)
- ✅ **Résolution problèmes techniques** (React 19, JWT, relations BD)
- ✅ **Code maintenable** (structure claire, commentaires, gestion erreurs)

### 14.3 Valeur Ajoutée

**Pour les utilisateurs tunisiens**:
- Devise locale (TND) par défaut
- Interface en français
- Validation téléphone tunisien
- Timezone Africa/Tunis
- Conseils IA adaptés au contexte local

**Pour le développement personnel**:
- Apprentissage complet stack moderne
- Gestion projet de A à Z
- Résolution bugs complexes
- Implémentation fonctionnalités avancées

### 14.4 Perspectives

Floussna pose les bases solides pour:
- Évolution vers application mobile
- Intégration services financiers tunisiens
- Expansion vers autres pays du Maghreb
- Ajout fonctionnalités IA avancées

Le projet est prêt pour:
- Déploiement production (avec variables environnement adaptées)
- Présentation académique
- Portfolio professionnel

---

**Naima REJEB**  
École Polytechnique de Sousse  
**5ème année Ingénierie Logicielle**  
Projet MERN - Janvier 2025

---

Made with ❤️ in Tunisia 🇹🇳

---

## Annexes

### Annexe A: Commandes Utiles

**Développement**:
```bash
# Backend
cd backend
npm install
npm run dev     # démarre avec nodemon sur port 5001

# Frontend
cd frontend
npm install
npm run dev     # démarre Vite sur port 5173
```

**Production**:
```bash
# Backend
npm start

# Frontend
npm run build   # génère dossier dist/
npm run preview # preview build de production
```

### Annexe B: Variables d'Environnement

**backend/.env**:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/floussna
JWT_SECRET=votre_secret_jwt_tres_securise
GEMINI_API_KEY=votre_cle_api_gemini_optionnelle
NODE_ENV=development
```

**frontend/.env**:
```
VITE_API_URL=http://localhost:5001/api
```

### Annexe C: Technologies Détaillées

| Catégorie | Technologie | Version | Usage |
|-----------|-------------|---------|-------|
| **Backend** |
| Runtime | Node.js | 18+ | Exécution JavaScript serveur |
| Framework | Express.js | 4.18+ | API REST |
| Base de données | MongoDB | 6.0+ | Stockage NoSQL |
| ODM | Mongoose | 8.0+ | Modélisation données |
| Auth | jsonwebtoken | 9.0+ | Génération/vérification JWT |
| Sécurité | bcryptjs | 2.4+ | Hashing passwords |
| Validation | express-validator | 7.0+ | Validation requêtes |
| IA | @google/generative-ai | 0.1+ | Assistant IA Gemini |
| **Frontend** |
| Library | React | 19.0.0 | UI components |
| Build | Vite | 7.2.4 | Bundler rapide |
| Routing | react-router-dom | 6.21.1 | Navigation SPA |
| Styling | Tailwind CSS | 3.4.1 | Utility-first CSS |
| Notifications | react-toastify | 10.0+ | Toasts utilisateur |
| Charts | recharts | 2.10.3 | Graphiques données |
| Icons | react-icons | 5.0+ | Icônes vectorielles |
| HTTP | axios | 1.6+ | Requêtes API |
| **Dev Tools** |
| Linter | ESLint | 9+ | Qualité code |
| Format | Prettier | 3+ | Formatage auto |
| Dev Server | nodemon | 3.0+ | Auto-reload backend |

### Annexe D: Structure Complète des Dossiers

```
projet_mern_Naima_REJEB/
├── backend/
│   ├── config/
│   │   └── database.js          # Connexion MongoDB
│   ├── controllers/
│   │   ├── ai.controller.js     # Logique IA
│   │   ├── auth.controller.js   # Inscription/Connexion
│   │   ├── budget.controller.js # CRUD Budgets
│   │   ├── category.controller.js
│   │   ├── goal.controller.js
│   │   ├── profile.controller.js
│   │   ├── transaction.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # Vérification JWT
│   │   ├── error.middleware.js     # Gestion erreurs
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── Budget.model.js      # Schéma Mongoose
│   │   ├── Category.model.js
│   │   ├── Goal.model.js
│   │   ├── Profile.model.js
│   │   ├── Transaction.model.js
│   │   └── User.model.js
│   ├── routes/
│   │   ├── ai.routes.js         # Endpoints IA
│   │   ├── auth.routes.js
│   │   ├── budget.routes.js
│   │   ├── category.routes.js
│   │   ├── goal.routes.js
│   │   ├── profile.routes.js
│   │   ├── transaction.routes.js
│   │   └── user.routes.js
│   ├── .env                     # Variables environnement
│   ├── package.json
│   └── server.js                # Point d'entrée
│
├── frontend/
│   ├── src/
│   │   ├── assets/              # Images, logos
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Navigation commune
│   │   │   ├── Loading.jsx      # Spinner chargement
│   │   │   └── PrivateRoute.jsx # Protection routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # État global auth
│   │   ├── pages/
│   │   │   ├── AIAssistant.jsx  # Assistant IA
│   │   │   ├── Budgets.jsx      # CRUD Budgets
│   │   │   ├── Dashboard.jsx    # Tableau de bord
│   │   │   ├── Goals.jsx        # CRUD Objectifs
│   │   │   ├── Login.jsx        # Connexion
│   │   │   ├── Profile.jsx      # Profil utilisateur
│   │   │   ├── Register.jsx     # Inscription
│   │   │   └── Transactions.jsx # CRUD Transactions
│   │   ├── services/
│   │   │   ├── ai.service.js        # API IA
│   │   │   ├── api.js               # Config Axios
│   │   │   ├── authService.js       # API Auth
│   │   │   ├── budgetService.js
│   │   │   ├── categoryService.js
│   │   │   ├── goalService.js
│   │   │   ├── profileService.js
│   │   │   └── transactionService.js
│   │   ├── App.jsx              # Composant racine
│   │   ├── main.jsx             # Point d'entrée
│   │   └── index.css            # Styles globaux
│   ├── .env                     # Config API URL
│   ├── package.json
│   ├── tailwind.config.js       # Config Tailwind
│   └── vite.config.js           # Config Vite
│
├── CONFORMITE.md                # Respect cahier des charges
├── QUICKSTART.md                # Guide démarrage rapide
├── RAPPORT.md                   # Ce fichier
├── EXPLICATION.md               # Guide implémentation détaillé
└── README.md                    # Documentation générale
```

---

**FIN DU RAPPORT**
