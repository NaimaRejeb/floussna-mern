import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import budgetService from '../services/budgetService';
import transactionService from '../services/transactionService';
import goalService from '../services/goalService';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiTarget, 
  FiPlus,
  FiArrowRight,
  FiPieChart,
  FiCalendar,
  FiCpu
} from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionStatsData, budgetsData, goalsData, transactionsData] = await Promise.all([
        transactionService.getTransactionStats(),
        budgetService.getAllBudgets(),
        goalService.getGoalStats(),
        transactionService.getAllTransactions(),
      ]);

      setStats({
        transactions: transactionStatsData,
        goals: goalsData,
      });
      setBudgets(budgetsData.slice(0, 3));
      setRecentTransactions(transactionsData.slice(0, 5));
    } catch {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Bonjour', emoji: '☀️' };
    if (hour < 18) return { text: 'Bon après-midi', emoji: '🌤️' };
    return { text: 'Bonsoir', emoji: '🌙' };
  };

  const greeting = getGreeting();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 animate-pulse">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  // Sample data for area chart
  const monthlyData = [
    { name: 'Jan', revenus: 4000, depenses: 2400 },
    { name: 'Fév', revenus: 3000, depenses: 1398 },
    { name: 'Mar', revenus: 2000, depenses: 9800 },
    { name: 'Avr', revenus: 2780, depenses: 3908 },
    { name: 'Mai', revenus: 1890, depenses: 4800 },
    { name: 'Juin', revenus: 2390, depenses: 3800 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card-premium bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white overflow-hidden animate-fadeIn">
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{greeting.emoji}</span>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {greeting.text}, {user?.prenom}!
                </h1>
              </div>
              <p className="text-white/80">Voici un aperçu de vos finances pour aujourd'hui</p>
              <p className="text-white/60 text-sm mt-1 arabic-text">نظرة عامة على أموالك اليوم</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/transactions')}
                className="px-5 py-2.5 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
              >
                <FiPlus /> Nouvelle Transaction
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="card stat-card-green animate-fadeInUp delay-100 group cursor-pointer" onClick={() => navigate('/transactions')}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Revenus</p>
              <p className="text-2xl md:text-3xl font-bold text-green-700 mt-2">
                {stats?.transactions?.totalRevenus?.toFixed(2) || '0.00'}
                <span className="text-lg ml-1">TND</span>
              </p>
              <p className="text-xs text-green-600/70 mt-1 arabic-text">الإيرادات</p>
            </div>
            <div className="p-3 bg-green-500 rounded-xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <FiTrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-red animate-fadeInUp delay-200 group cursor-pointer" onClick={() => navigate('/transactions')}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">Dépenses</p>
              <p className="text-2xl md:text-3xl font-bold text-red-700 mt-2">
                {stats?.transactions?.totalDepenses?.toFixed(2) || '0.00'}
                <span className="text-lg ml-1">TND</span>
              </p>
              <p className="text-xs text-red-600/70 mt-1 arabic-text">المصروفات</p>
            </div>
            <div className="p-3 bg-red-500 rounded-xl shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
              <FiTrendingDown className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-blue animate-fadeInUp delay-300 group cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Solde</p>
              <p className={`text-2xl md:text-3xl font-bold mt-2 ${(stats?.transactions?.solde || 0) >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {stats?.transactions?.solde?.toFixed(2) || '0.00'}
                <span className="text-lg ml-1">TND</span>
              </p>
              <p className="text-xs text-blue-600/70 mt-1 arabic-text">الرصيد</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <FiDollarSign className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-purple animate-fadeInUp delay-400 group cursor-pointer" onClick={() => navigate('/goals')}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Objectifs</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-700 mt-2">
                {stats?.goals?.enCours || 0}
                <span className="text-lg ml-1">en cours</span>
              </p>
              <p className="text-xs text-purple-600/70 mt-1 arabic-text">الأهداف</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <FiTarget className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card animate-fadeInUp delay-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Aperçu Mensuel</h3>
              <p className="text-sm text-gray-500">Revenus vs Dépenses</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiCalendar className="text-gray-500" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenus" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenus)" strokeWidth={2} />
              <Area type="monotone" dataKey="depenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorDepenses)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card animate-fadeInUp delay-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top Catégories</h3>
              <p className="text-sm text-gray-500">Répartition des dépenses</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiPieChart className="text-gray-500" />
            </div>
          </div>
          {stats?.transactions?.topCategories?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stats.transactions.topCategories} dataKey="total" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5}>
                    {stats.transactions.topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} TND`} contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {stats.transactions.topCategories.map((cat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs text-gray-600">{cat.category}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FiPieChart size={48} className="mx-auto mb-3 opacity-30" />
                <p>Aucune donnée disponible</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card animate-fadeInUp delay-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Transactions Récentes</h3>
              <p className="text-sm text-gray-500">Vos dernières activités</p>
            </div>
            <button onClick={() => navigate('/transactions')} className="text-sm text-red-600 font-semibold hover:text-red-700 flex items-center gap-1">
              Voir tout <FiArrowRight />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${transaction.type === 'revenu' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {transaction.type === 'revenu' ? <FiTrendingUp /> : <FiTrendingDown />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${transaction.type === 'revenu' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'revenu' ? '+' : '-'}{transaction.montant.toFixed(2)} TND
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FiDollarSign size={48} className="mx-auto mb-3 opacity-30" />
                <p>Aucune transaction récente</p>
                <button onClick={() => navigate('/transactions')} className="btn btn-primary mt-4">Ajouter une transaction</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card animate-fadeInUp delay-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Budgets Actifs</h3>
              <button onClick={() => navigate('/budgets')} className="text-sm text-red-600 font-semibold hover:text-red-700">Voir tout</button>
            </div>
            <div className="space-y-4">
              {budgets.length > 0 ? (
                budgets.map((budget) => (
                  <div key={budget._id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{budget.nom}</h4>
                      <span className="text-sm font-bold text-red-600">{budget.montantTotal} TND</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill progress-blue" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{new Date(budget.dateDebut).toLocaleDateString('fr-FR')} - {new Date(budget.dateFin).toLocaleDateString('fr-FR')}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400"><p className="text-sm">Aucun budget actif</p></div>
              )}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-600 to-indigo-700 text-white animate-fadeInUp delay-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl"><FiCpu size={24} /></div>
              <div>
                <h3 className="font-bold">Assistant IA</h3>
                <p className="text-sm text-white/70">Conseils personnalisés</p>
              </div>
            </div>
            <p className="text-sm text-white/80 mb-4">Obtenez des conseils financiers intelligents adaptés à votre situation.</p>
            <button onClick={() => navigate('/ai-assistant')} className="w-full py-2.5 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <FiCpu /> Demander un conseil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
