import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiDollarSign, 
  FiCalendar,
  FiTrendingUp,
  FiPieChart
} from 'react-icons/fi';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    montantTotal: '',
    dateDebut: '',
    dateFin: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [budgetsData, categoriesData] = await Promise.all([
        budgetService.getAllBudgets(),
        categoryService.getAllCategories().catch(() => [])
      ]);
      setBudgets(budgetsData);
      setCategories(categoriesData);
    } catch {
      toast.error('Erreur lors du chargement des budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        nom: budget.nom,
        montantTotal: budget.montantTotal,
        dateDebut: budget.dateDebut.split('T')[0],
        dateFin: budget.dateFin.split('T')[0],
        description: budget.description || ''
      });
    } else {
      setEditingBudget(null);
      setFormData({
        nom: '',
        montantTotal: '',
        dateDebut: '',
        dateFin: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBudget(null);
    setFormData({
      nom: '',
      montantTotal: '',
      dateDebut: '',
      dateFin: '',
      description: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBudget) {
        const updatedBudget = await budgetService.updateBudget(editingBudget._id, formData);
        setBudgets(prev => prev.map(b => 
          b._id === editingBudget._id ? updatedBudget : b
        ));
        toast.success('Budget modifié avec succès');
      } else {
        const newBudget = await budgetService.createBudget(formData);
        setBudgets(prev => [newBudget, ...prev]);
        toast.success('Budget créé avec succès');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      try {
        await budgetService.deleteBudget(id);
        setBudgets(prev => prev.filter(b => b._id !== id));
        toast.success('Budget supprimé avec succès');
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getDaysRemaining = (endDate) => {
    const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusColor = (endDate) => {
    const days = getDaysRemaining(endDate);
    if (days < 0) return { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'Terminé' };
    if (days <= 7) return { bg: 'bg-red-100', text: 'text-red-600', badge: 'Urgent' };
    if (days <= 14) return { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'Bientôt' };
    return { bg: 'bg-green-100', text: 'text-green-600', badge: 'En cours' };
  };

  // Calculate total budget
  const totalBudget = budgets.reduce((sum, b) => sum + b.montantTotal, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 animate-pulse">Chargement des budgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-500 arabic-text mt-1">الميزانيات</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary"
        >
          <FiPlus /> Nouveau Budget
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card stat-card-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Budget Total</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {totalBudget.toFixed(2)} <span className="text-base">TND</span>
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
              <FiDollarSign className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Budgets Actifs</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {budgets.filter(b => getDaysRemaining(b.dateFin) >= 0).length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-xl shadow-lg shadow-green-500/30">
              <FiTrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Total Budgets</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {budgets.length}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg shadow-purple-500/30">
              <FiPieChart className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length > 0 ? (
          budgets.map((budget, index) => {
            const status = getStatusColor(budget.dateFin);
            const daysLeft = getDaysRemaining(budget.dateFin);
            
            return (
              <div 
                key={budget._id} 
                className="card group hover:shadow-2xl animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{budget.nom}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>
                        {status.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FiCalendar size={12} />
                      {new Date(budget.dateDebut).toLocaleDateString('fr-FR')} - {new Date(budget.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(budget)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4">
                  <p className="text-sm text-gray-500 mb-1">Montant total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {budget.montantTotal.toFixed(2)}
                    <span className="text-lg text-gray-500 ml-1">TND</span>
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-semibold text-gray-900">45%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill progress-blue" style={{ width: '45%' }}></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    {daysLeft >= 0 ? (
                      <span className="text-gray-600">
                        <span className="font-semibold text-gray-900">{daysLeft}</span> jours restants
                      </span>
                    ) : (
                      <span className="text-gray-400">Terminé</span>
                    )}
                  </div>
                  {budget.description && (
                    <p className="text-xs text-gray-400 italic truncate max-w-[150px]">
                      {budget.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <div className="card text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiDollarSign size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun budget créé</h3>
              <p className="text-gray-400 mb-6">Commencez par créer votre premier budget</p>
              <button
                onClick={() => handleOpenModal()}
                className="btn btn-primary"
              >
                <FiPlus /> Créer votre premier budget
              </button>
            </div>
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
                  {editingBudget ? 'Modifier le budget' : 'Nouveau budget'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingBudget ? 'Modifiez les détails du budget' : 'Créez un nouveau budget'}
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
              <div>
                <label className="label">Nom du budget *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  className="input"
                  placeholder="Ex: Budget Janvier 2026"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">
                  <FiDollarSign className="inline mr-1" />
                  Montant total (TND) *
                </label>
                <input
                  type="number"
                  name="montantTotal"
                  required
                  min="0"
                  step="0.01"
                  className="input text-2xl font-bold text-center"
                  placeholder="1000.00"
                  value={formData.montantTotal}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <FiCalendar className="inline mr-1" />
                    Date début *
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    required
                    className="input"
                    value={formData.dateDebut}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">
                    <FiCalendar className="inline mr-1" />
                    Date fin *
                  </label>
                  <input
                    type="date"
                    name="dateFin"
                    required
                    className="input"
                    value={formData.dateFin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="input"
                  placeholder="Description du budget..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingBudget ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
