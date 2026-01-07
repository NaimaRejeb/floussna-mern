import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/Transaction.model.js';
import Budget from '../models/Budget.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Nom du modèle Gemini à utiliser
const GEMINI_MODEL = 'gemini-2.0-flash';

// Initialiser Gemini de façon lazy pour s'assurer que .env est chargé
let genAI = null;
const getGenAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// Mode démo pour les conseils financiers
const getDemoAdvice = (question) => {
  const adviceTemplates = {
    'économiser': `Pour économiser efficacement en Tunisie:
    
1. **Règle des 50/30/20**: Allouez 50% de vos revenus aux besoins essentiels, 30% aux envies, et 20% à l'épargne.

2. **Réduire les dépenses courantes**:
   - Comparez les prix avant d'acheter
   - Cuisinez à la maison plutôt que de manger dehors
   - Utilisez les transports en commun quand c'est possible

3. **Créer un fonds d'urgence**: Visez 3 à 6 mois de dépenses

4. **Automatiser l'épargne**: Mettez de côté un montant fixe chaque mois

5. **Profiter des promotions**: Achetez en gros pour les articles non périssables`,

    'budget': `Conseils pour un budget équilibré en Tunisie:

1. **Suivez vos dépenses**: Notez toutes vos transactions pendant un mois
2. **Catégorisez**: Alimentation, transport, loisirs, etc.
3. **Fixez des limites**: Pour chaque catégorie selon vos priorités
4. **Révisez mensuellement**: Ajustez selon vos besoins
5. **Prévoyez l'imprévu**: Gardez une marge de sécurité

💡 Utilisez Floussna pour automatiser ce suivi!`,

    'investir': `Options d'investissement en Tunisie:

1. **Compte épargne**: Sûr mais rendement faible
2. **Certificats de dépôt**: Meilleur taux d'intérêt
3. **Actions (Bourse de Tunis)**: Plus risqué, potentiel de rendement élevé
4. **Immobilier**: Investissement à long terme stable
5. **Or**: Protection contre l'inflation

⚠️ Consultez toujours un conseiller financier professionnel avant d'investir.`,

    'default': `Merci pour votre question sur les finances personnelles!

En tant qu'assistant IA, je peux vous aider avec:
- Conseils d'épargne et de budget
- Analyse de vos dépenses
- Planification financière
- Objectifs d'épargne

💡 **Conseil général**: Commencez par suivre vos dépenses pendant un mois pour comprendre où va votre argent. Utilisez l'application Floussna pour faciliter ce suivi!

N'hésitez pas à poser une question plus spécifique sur:
- Comment économiser de l'argent?
- Comment faire un budget?
- Où investir en Tunisie?
- Comment atteindre mes objectifs financiers?`
  };

  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('économiser') || lowerQuestion.includes('épargne') || lowerQuestion.includes('économie')) {
    return adviceTemplates['économiser'];
  } else if (lowerQuestion.includes('budget')) {
    return adviceTemplates['budget'];
  } else if (lowerQuestion.includes('investir') || lowerQuestion.includes('investissement')) {
    return adviceTemplates['investir'];
  } else {
    return adviceTemplates['default'];
  }
};

// @desc    Get AI financial advice
// @route   POST /api/ai/advice
// @access  Private
export const getFinancialAdvice = asyncHandler(async (req, res) => {
  const { question, context } = req.body;

  // Validation de la question
  if (!question || typeof question !== 'string') {
    const demoAdvice = getDemoAdvice('default');
    return res.json({
      question: question || '',
      advice: demoAdvice,
      timestamp: new Date(),
      isDemoMode: true
    });
  }

  // Mode démo si pas de clé API - vérifier en premier
  if (!process.env.GEMINI_API_KEY) {
    const demoAdvice = getDemoAdvice(question);
    return res.json({
      question,
      advice: `🤖 **Mode Démo** (Pour activer l'IA réelle, ajoutez GEMINI_API_KEY dans .env)\n\n${demoAdvice}`,
      timestamp: new Date(),
      isDemoMode: true
    });
  }

  try {
    // Get user's financial context
    const budgets = await Budget.find({ user: req.user._id }).limit(3);
    const transactions = await Transaction.find({ user: req.user._id })
      .sort('-date')
      .limit(20)
      .populate('categories', 'nom');

    const userContext = `
      Contexte financier de l'utilisateur tunisien:
      - Nombre de budgets: ${budgets.length}
      - Dernières transactions: ${transactions.length}
      - Devise principale: TND (Dinar Tunisien)
      ${context ? `\nInformations supplémentaires: ${context}` : ''}
    `;

    const prompt = `Tu es un conseiller financier expert spécialisé dans le contexte tunisien. 
    ${userContext}
    
    Question de l'utilisateur: ${question}
    
    Fournis des conseils pratiques et personnalisés en tenant compte du contexte économique tunisien.
    Utilise un ton amical et professionnel. Réponds en français.`;

    const genAI = getGenAI();
    if (!genAI) {
      throw new Error('Gemini API non initialisé');
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const advice = response.text();

    res.json({
      question,
      advice,
      timestamp: new Date(),
      isDemoMode: false
    });
  } catch (error) {
    console.error('Erreur IA détaillée:', error.message, error.stack);
    
    // Fallback au mode démo en cas d'erreur
    const demoAdvice = getDemoAdvice(question);
    
    res.json({
      question,
      advice: `⚠️ **Mode Démo activé**\n\n${demoAdvice}`,
      timestamp: new Date(),
      isDemoMode: true
    });
  }
});

// @desc    Analyze spending patterns with AI
// @route   POST /api/ai/analyze-spending
// @access  Private
export const analyzeSpending = asyncHandler(async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    res.status(503);
    throw new Error('Service IA non configuré');
  }

  const { period = 30 } = req.body; // Default 30 days

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  const transactions = await Transaction.find({
    user: req.user._id,
    date: { $gte: startDate },
    type: 'depense'
  }).populate('categories', 'nom');

  if (transactions.length === 0) {
    return res.json({
      message: 'Pas assez de données pour une analyse',
      analysis: null
    });
  }

  // Calculate statistics
  const totalDepense = transactions.reduce((sum, t) => sum + t.montant, 0);
  const depenseMoyenne = totalDepense / transactions.length;
  
  const categoriesStats = {};
  transactions.forEach(t => {
    t.categories.forEach(cat => {
      if (!categoriesStats[cat.nom]) {
        categoriesStats[cat.nom] = 0;
      }
      categoriesStats[cat.nom] += t.montant;
    });
  });

  const topCategories = Object.entries(categoriesStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const prompt = `Analyse ces données de dépenses sur ${period} jours pour un utilisateur tunisien:
  
  - Total dépensé: ${totalDepense.toFixed(2)} TND
  - Dépense moyenne par transaction: ${depenseMoyenne.toFixed(2)} TND
  - Nombre de transactions: ${transactions.length}
  - Top 5 catégories: ${topCategories.map(([cat, montant]) => `${cat}: ${montant.toFixed(2)} TND`).join(', ')}
  
  Fournis une analyse détaillée avec:
  1. Observation des habitudes de dépenses
  2. Points d'attention ou dépenses excessives
  3. Recommandations concrètes pour économiser
  4. Conseils adaptés au contexte tunisien
  
  Réponds en français, de manière structurée et actionnable.`;

  try {
    const model = getGenAI().getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.json({
      period,
      statistics: {
        totalDepense,
        depenseMoyenne,
        nombreTransactions: transactions.length,
        topCategories: topCategories.map(([cat, montant]) => ({ 
          categorie: cat, 
          montant 
        }))
      },
      analysis,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erreur IA:', error);
    res.status(500);
    throw new Error('Erreur lors de l\'analyse IA');
  }
});

// @desc    Get AI budget recommendations
// @route   POST /api/ai/recommend-budget
// @access  Private
export const recommendBudget = asyncHandler(async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    res.status(503);
    throw new Error('Service IA non configuré');
  }

  const { revenuMensuel, objectifs } = req.body;

  if (!revenuMensuel || revenuMensuel <= 0) {
    res.status(400);
    throw new Error('Revenu mensuel requis');
  }

  const prompt = `En tant que conseiller financier pour la Tunisie, crée un budget mensuel optimal pour:
  
  - Revenu mensuel: ${revenuMensuel} TND
  - Objectifs: ${objectifs || 'Épargne générale et gestion saine'}
  
  Considère:
  - Le coût de la vie en Tunisie
  - Les dépenses typiques tunisiennes (alimentation, transport, logement, etc.)
  - La règle 50/30/20 adaptée au contexte local
  - Les catégories de dépenses courantes
  
  Fournis un budget détaillé par catégorie avec:
  1. Montant recommandé pour chaque catégorie
  2. Pourcentage du revenu
  3. Justification brève
  4. Conseils d'optimisation
  
  Réponds en français avec un format clair et structuré.`;

  try {
    const model = getGenAI().getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendation = response.text();

    res.json({
      revenuMensuel,
      objectifs,
      recommendation,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erreur IA:', error);
    res.status(500);
    throw new Error('Erreur lors de la génération des recommandations IA');
  }
});

// @desc    Generate savings tips
// @route   GET /api/ai/savings-tips
// @access  Private
export const getSavingsTips = asyncHandler(async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    res.status(503);
    throw new Error('Service IA non configuré');
  }

  const prompt = `Génère 5 conseils d'épargne pratiques et actionnables pour un utilisateur tunisien.
  
  Les conseils doivent être:
  - Adaptés au contexte économique tunisien
  - Concrets et faciles à appliquer
  - Variés (alimentation, transport, énergie, loisirs, etc.)
  - Réalistes et motivants
  
  Format: Liste numérotée avec un titre accrocheur et une explication courte pour chaque conseil.
  Réponds en français.`;

  try {
    const model = getGenAI().getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const tips = response.text();

    res.json({
      tips,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erreur IA:', error);
    res.status(500);
    throw new Error('Erreur lors de la génération des conseils IA');
  }
});
