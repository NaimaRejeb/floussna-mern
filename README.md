# 🌙 Floussna (فلوسنا) - Application Tunisienne de Gestion de Budget

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)](https://www.mongodb.com/mern-stack)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made in Tunisia](https://img.shields.io/badge/Made%20in-Tunisia-red)](https://www.tunisia.tn)

**Floussna** est une application web moderne de gestion de budget personnel développée spécifiquement pour le contexte tunisien. Elle permet aux utilisateurs de suivre leurs dépenses, gérer leurs budgets et atteindre leurs objectifs financiers avec l'aide de l'intelligence artificielle.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Modèle de données](#-modèle-de-données)
- [Captures d'écran](#-captures-décran)
- [Auteur](#-auteur)

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- Inscription et connexion sécurisées
- Authentification JWT avec tokens
- Hashage des mots de passe avec bcrypt
- Protection CORS
- Validation des données avec express-validator

### 💰 Gestion de Budget
- Création et gestion de budgets mensuels/annuels
- Définition de limites par catégorie
- Suivi en temps réel des dépenses
- Alertes de dépassement de budget
- Statistiques et graphiques

### 📊 Transactions
- Enregistrement des dépenses et revenus
- Catégorisation automatique
- Support multi-devises (TND, EUR, USD)
- Filtrage et recherche avancés
- Export des données

### 🎯 Objectifs Financiers
- Définition d'objectifs d'épargne
- Suivi de progression visuel
- Contributions régulières
- Notifications de rappel

### 🤖 Assistant IA (Gemini)
- Conseils financiers personnalisés
- Analyse des habitudes de dépenses
- Recommandations d'économies
- Suggestions de budget optimisé
- Contexte tunisien adapté

### 👤 Profil Utilisateur
- Profil personnalisable
- Support villes tunisiennes
- Préférences multilingues (FR/AR/EN)
- Gestion de photo de profil

## 🛠 Technologies

### Backend
- **Node.js** & **Express.js** - Serveur et API REST
- **MongoDB** & **Mongoose** - Base de données NoSQL
- **JWT** - Authentification sécurisée
- **Bcrypt.js** - Hashage de mots de passe
- **Express-validator** - Validation des données
- **Google Gemini AI** - Intelligence artificielle
- **Helmet** - Sécurité HTTP
- **Morgan** - Logging
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 19** - Bibliothèque UI
- **React Router v6** - Routing
- **Axios** - Client HTTP
- **Tailwind CSS** - Framework CSS
- **Recharts** - Graphiques et visualisations
- **React Icons** - Icônes
- **React Toastify** - Notifications
- **Formik & Yup** - Gestion de formulaires
- **Vite** - Build tool moderne

## 🏗 Architecture

### Modèle de Données (6 Entités)

```
┌─────────────────────────────────────────────────────────────┐
│                     BASE DE DONNÉES FLOUSSNA                │
└─────────────────────────────────────────────────────────────┘

╔═══════════╗      1:1      ╔═══════════╗
║   User    ║◄──────────────║  Profile  ║
╠═══════════╣               ╠═══════════╣
║ nom       ║               ║ photo     ║
║ prenom    ║               ║ ville     ║
║ email     ║               ║ devise    ║
║ password  ║               ║ profession║
║ telephone ║               ╚═══════════╝
╚═══════════╝
      │ 1:N
      │
      ├──────────────┬──────────────┐
      │              │              │
      ▼ N            ▼ N            ▼ N
╔═══════════╗  ╔═══════════╗  ╔═══════════╗
║  Budget   ║  ║Transaction║  ║   Goal    ║
╠═══════════╣  ╠═══════════╣  ╠═══════════╣
║ nom       ║  ║ montant   ║  ║ titre     ║
║ montant   ║  ║ type      ║  ║ montant   ║
║ periode   ║  ║ date      ║  ║ echeance  ║
╚═══════════╝  ╚═══════════╝  ╚═══════════╝
      │ 1:N             │ N:M
      │                 │
      ▼ N               ▼ N
╔═══════════╗     ╔═══════════╗
║Transaction║     ║ Category  ║
╚═══════════╝     ╠═══════════╣
                  ║ nom       ║
                  ║ type      ║
                  ║ icone     ║
                  ╚═══════════╝
```

### Relations détaillées

1. **User ↔ Profile** (1-to-1)
   - Un utilisateur a un seul profil
   - Un profil appartient à un seul utilisateur

2. **User → Budget** (1-to-Many)
   - Un utilisateur peut créer plusieurs budgets
   - Un budget appartient à un seul utilisateur

3. **User → Goal** (1-to-Many)
   - Un utilisateur peut définir plusieurs objectifs
   - Un objectif appartient à un seul utilisateur

4. **Budget → Transaction** (1-to-Many)
   - Un budget contient plusieurs transactions
   - Une transaction est liée à un budget

5. **Transaction ↔ Category** (Many-to-Many)
   - Une transaction peut avoir plusieurs catégories
   - Une catégorie peut être associée à plusieurs transactions

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (v6 ou supérieur) ou compte MongoDB Atlas
- npm ou yarn

### 1. Cloner le repository

```bash
git clone <repository-url>
cd projet_mern_Naima_REJEB
```

### 2. Installation Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

Configurer les variables d'environnement dans `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/floussna
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRE=7d
GEMINI_API_KEY=votre_cle_api_gemini
FRONTEND_URL=http://localhost:5173
```

### 3. Installation Frontend

```bash
cd ../frontend
npm install
```

Créer un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

Configurer:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Utilisation

### Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Démarrer le Frontend

```bash
cd frontend
npm run dev
```

L'application est accessible sur `http://localhost:5173`

### Initialiser les catégories par défaut

Une fois le backend démarré, vous pouvez initialiser les catégories tunisiennes:

**Méthode 1: Via l'API (nécessite un compte admin)**
```bash
POST http://localhost:5000/api/categories/seed
Authorization: Bearer <admin_token>
```

**Méthode 2: Créer un compte puis promouvoir en admin**
1. Créer un compte via l'interface
2. Dans MongoDB, modifier le rôle:
```javascript
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

## 📖 API Documentation

### Endpoints principaux

#### Authentification
```
POST   /api/auth/register      - Inscription
POST   /api/auth/login         - Connexion
GET    /api/auth/me            - Utilisateur connecté
PUT    /api/auth/updatepassword - Modifier mot de passe
```

#### Utilisateurs
```
GET    /api/users              - Liste utilisateurs (Admin)
GET    /api/users/:id          - Détails utilisateur
PUT    /api/users/:id          - Modifier utilisateur
DELETE /api/users/:id          - Supprimer utilisateur (Admin)
GET    /api/users/:id/stats    - Statistiques utilisateur
```

#### Profils
```
GET    /api/profiles/me        - Mon profil
GET    /api/profiles/user/:userId - Profil par user ID
PUT    /api/profiles/me        - Modifier profil
POST   /api/profiles/photo     - Upload photo
```

#### Budgets
```
GET    /api/budgets            - Liste budgets
POST   /api/budgets            - Créer budget
GET    /api/budgets/:id        - Détails budget
PUT    /api/budgets/:id        - Modifier budget
DELETE /api/budgets/:id        - Supprimer budget
GET    /api/budgets/:id/stats  - Statistiques budget
```

#### Transactions
```
GET    /api/transactions       - Liste transactions
POST   /api/transactions       - Créer transaction
GET    /api/transactions/:id   - Détails transaction
PUT    /api/transactions/:id   - Modifier transaction
DELETE /api/transactions/:id   - Supprimer transaction
GET    /api/transactions/stats/summary - Statistiques
```

#### Catégories
```
GET    /api/categories         - Liste catégories
POST   /api/categories         - Créer catégorie (Admin)
GET    /api/categories/:id     - Détails catégorie
PUT    /api/categories/:id     - Modifier catégorie (Admin)
DELETE /api/categories/:id     - Supprimer catégorie (Admin)
POST   /api/categories/seed    - Initialiser catégories (Admin)
```

#### Objectifs
```
GET    /api/goals              - Liste objectifs
POST   /api/goals              - Créer objectif
GET    /api/goals/:id          - Détails objectif
PUT    /api/goals/:id          - Modifier objectif
DELETE /api/goals/:id          - Supprimer objectif
POST   /api/goals/:id/contribute - Ajouter contribution
GET    /api/goals/stats/summary  - Statistiques
```

#### Assistant IA
```
POST   /api/ai/advice          - Conseil financier
POST   /api/ai/analyze-spending - Analyse dépenses
POST   /api/ai/recommend-budget - Recommandation budget
GET    /api/ai/savings-tips    - Conseils d'épargne
```

## 🎨 Thème Tunisien

L'application intègre des éléments culturels tunisiens:

- 🇹🇳 Couleurs du drapeau tunisien (rouge #E70013)
- 🏙️ Villes tunisiennes prédéfinies
- 💱 Devise TND (Dinar Tunisien) par défaut
- 🏪 Catégories de dépenses locales
- 🌙 Typographie arabe (Cairo font)
- 📱 Interface bilingue FR/AR

## 👨‍💻 Auteur

**Naima REJEB**
- École: École Polytechnique de Sousse
- Année: 2025-2026
- Projet: Examen Final - Stack MERN

## 📄 Licence

Ce projet est développé dans le cadre d'un examen académique.

---

<div align="center">
  <p>Made with ❤️ in Tunisia 🇹🇳</p>
  <p>فلوسنا - لإدارة أفضل لأموالك</p>
</div>