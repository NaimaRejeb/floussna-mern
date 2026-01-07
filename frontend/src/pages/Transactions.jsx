import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
import budgetService from '../services/budgetService';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiFilter,
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiTag
} from 'react-icons/fi';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    type: 'depense',
    montant: '',
    description: '',
    category: '',
    budget: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsData, categoriesData, budgetsData] = await Promise.all([
        transactionService.getAllTransactions(),
        categoryService.getAllCategories().catch(() => []),
        budgetService.getAllBudgets().catch(() => [])
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
      setBudgets(budgetsData);
    } catch {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };



  const handleOpenModal = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        montant: transaction.montant,
        description: transaction.description,
        category: transaction.category?._id || '',
        budget: transaction.budget?._id || '',
        date: transaction.date.split('T')[0]
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        type: 'depense',
        montant: '',
        description: '',
        category: '',
        budget: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.category) delete dataToSend.category;
      if (!dataToSend.budget) delete dataToSend.budget;

      if (editingTransaction) {
        const updatedTransaction = await transactionService.updateTransaction(editingTransaction._id, dataToSend);
        // Mise à jour optimiste de l'état local
        setTransactions(prev => prev.map(t => 
          t._id === editingTransaction._id ? updatedTransaction : t
        ));
        toast.success('Transaction modifiée avec succès');
      } else {
        const newTransaction = await transactionService.createTransaction(dataToSend);
        // Ajout optimiste à l'état local
        setTransactions(prev => [newTransaction, ...prev]);
        toast.success('Transaction créée avec succès');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await transactionService.deleteTransaction(id);
        // Suppression optimiste de l'état local
        setTransactions(prev => prev.filter(t => t._id !== id));
        toast.success('Transaction supprimée avec succès');
      } catch {
        toast.error('Erreur lors de la suppression');
        loadData();
      }
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalRevenus: transactions.filter(t => t.type === 'revenu').reduce((sum, t) => sum + t.montant, 0),
    totalDepenses: transactions.filter(t => t.type === 'depense').reduce((sum, t) => sum + t.montant, 0)
  };
  stats.solde = stats.totalRevenus - stats.totalDepenses;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 animate-pulse">Chargement des transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 arabic-text mt-1">المعاملات</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary"
        >
          <FiPlus /> Nouvelle Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card stat-card-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Revenus</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {stats.totalRevenus.toFixed(2)} <span className="text-base">TND</span>
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-xl shadow-lg shadow-green-500/30">
              <FiTrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-red">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">Dépenses</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {stats.totalDepenses.toFixed(2)} <span className="text-base">TND</span>
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-xl shadow-lg shadow-red-500/30">
              <FiTrendingDown className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Solde</p>
              <p className={`text-2xl font-bold mt-1 ${stats.solde >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {stats.solde.toFixed(2)} <span className="text-base">TND</span>
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
              <FiDollarSign className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              className="input pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilter('revenu')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'revenu' 
                    ? 'bg-green-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Revenus
              </button>
              <button
                onClick={() => setFilter('depense')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'depense' 
                    ? 'bg-red-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dépenses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card p-0 overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction._id} 
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors animate-fadeInUp"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${
                    transaction.type === 'revenu' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'revenu' ? <FiTrendingUp size={20} /> : <FiTrendingDown size={20} />}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(transaction.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      {transaction.category?.nom && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{
                            backgroundColor: `${transaction.category.couleur}20`,
                            color: transaction.category.couleur
                          }}
                        >
                          <FiTag size={10} />
                          {transaction.category.nom}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'revenu' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'revenu' ? '+' : '-'}{transaction.montant.toFixed(2)} TND
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(transaction)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FiDollarSign size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune transaction trouvée</h3>
            <p className="text-gray-400 mb-6">Commencez par ajouter votre première transaction</p>
            <button onClick={() => handleOpenModal()} className="btn btn-primary">
              <FiPlus /> Ajouter une transaction
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingTransaction ? 'Modifiez les détails de la transaction' : 'Ajoutez une nouvelle transaction'}
                </p>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body space-y-5">
              {/* Type Selection */}
              <div>
                <label className="label">Type de transaction *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'depense' })}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.type === 'depense'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <FiTrendingDown size={20} />
                    <span className="font-semibold">Dépense</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'revenu' })}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.type === 'revenu'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <FiTrendingUp size={20} />
                    <span className="font-semibold">Revenu</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="label">
                  <FiDollarSign className="inline mr-1" />
                  Montant (TND) *
                </label>
                <input
                  type="number"
                  name="montant"
                  required
                  min="0"
                  step="0.01"
                  className="input text-2xl font-bold text-center"
                  placeholder="0.00"
                  value={formData.montant}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div>
                <label className="label">Description *</label>
                <input
                  type="text"
                  name="description"
                  required
                  className="input"
                  placeholder="Ex: Achat supermarché"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Category */}
              <div>
                <label className="label">
                  <FiTag className="inline mr-1" />
                  Catégorie
                </label>
                <select
                  name="category"
                  className="input"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget (only for expenses) */}
              {formData.type === 'depense' && budgets.length > 0 && (
                <div>
                  <label className="label">Budget associé</label>
                  <select
                    name="budget"
                    className="input"
                    value={formData.budget}
                    onChange={handleChange}
                  >
                    <option value="">Aucun budget</option>
                    {budgets.map((budget) => (
                      <option key={budget._id} value={budget._id}>
                        {budget.nom}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="label">
                  <FiCalendar className="inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="input"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary flex-1">
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className={`btn flex-1 ${formData.type === 'revenu' ? 'btn-success' : 'btn-primary'}`}
                >
                  {editingTransaction ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
