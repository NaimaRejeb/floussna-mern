import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import goalService from '../services/goalService';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiTarget, 
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiAward
} from 'react-icons/fi';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    montantCible: '',
    dateEcheance: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await goalService.getAllGoals();
      setGoals(data);
    } catch {
      toast.error('Erreur lors du chargement des objectifs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        titre: goal.titre,
        montantCible: goal.montantCible,
        dateEcheance: goal.dateEcheance.split('T')[0],
        description: goal.description || ''
      });
    } else {
      setEditingGoal(null);
      setFormData({
        titre: '',
        montantCible: '',
        dateEcheance: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
  };

  const handleOpenContributionModal = (goal) => {
    setSelectedGoal(goal);
    setContributionAmount('');
    setShowContributionModal(true);
  };

  const handleCloseContributionModal = () => {
    setShowContributionModal(false);
    setSelectedGoal(null);
    setContributionAmount('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGoal) {
        const updatedGoal = await goalService.updateGoal(editingGoal._id, formData);
        setGoals(prev => prev.map(g => 
          g._id === editingGoal._id ? updatedGoal : g
        ));
        toast.success('Objectif modifié avec succès');
      } else {
        const newGoal = await goalService.createGoal(formData);
        setGoals(prev => [newGoal, ...prev]);
        toast.success('Objectif créé avec succès');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleAddContribution = async (e) => {
    e.preventDefault();
    
    try {
      const updatedGoal = await goalService.addContribution(selectedGoal._id, { montant: parseFloat(contributionAmount) });
      setGoals(prev => prev.map(g => 
        g._id === selectedGoal._id ? updatedGoal : g
      ));
      toast.success('Contribution ajoutée avec succès');
      handleCloseContributionModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout de la contribution');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      try {
        await goalService.deleteGoal(id);
        setGoals(prev => prev.filter(g => g._id !== id));
        toast.success('Objectif supprimé avec succès');
      } catch {
        toast.error('Erreur lors de la suppression');
        loadData();
      }
    }
  };

  const getProgressPercentage = (goal) => {
    return Math.min((goal.montantActuel / goal.montantCible) * 100, 100);
  };

  const getDaysRemaining = (dateEcheance) => {
    const days = Math.ceil((new Date(dateEcheance) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Calculate stats
  const completedGoals = goals.filter(g => g.statut === 'atteint' || getProgressPercentage(g) >= 100).length;
  const totalSaved = goals.reduce((sum, g) => sum + g.montantActuel, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.montantCible, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 animate-pulse">Chargement des objectifs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Objectifs Financiers</h1>
          <p className="text-gray-500 arabic-text mt-1">الأهداف المالية</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary"
        >
          <FiPlus /> Nouvel Objectif
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card stat-card-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Épargné</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {totalSaved.toFixed(2)} <span className="text-base">TND</span>
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
              <FiDollarSign className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Objectif Total</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {totalTarget.toFixed(2)} <span className="text-base">TND</span>
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg shadow-purple-500/30">
              <FiTarget className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Objectifs Atteints</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {completedGoals} <span className="text-base">/ {goals.length}</span>
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-xl shadow-lg shadow-green-500/30">
              <FiCheckCircle className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="card stat-card-orange">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">En Cours</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">
                {goals.length - completedGoals}
              </p>
            </div>
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/30">
              <FiTrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length > 0 ? (
          goals.map((goal, index) => {
            const progress = getProgressPercentage(goal);
            const daysLeft = getDaysRemaining(goal.dateEcheance);
            const isCompleted = goal.statut === 'atteint' || progress >= 100;
            
            return (
              <div 
                key={goal._id} 
                className={`card group hover:shadow-2xl animate-fadeInUp relative ${isCompleted ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg shadow-green-500/30">
                    <FiAward size={20} />
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{goal.titre}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <FiCalendar size={12} />
                      <span>Échéance: {new Date(goal.dateEcheance).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(goal)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress Circle */}
                <div className="flex justify-center py-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke={isCompleted ? '#22c55e' : '#dc2626'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${progress * 3.52} 352`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</span>
                      <span className="text-xs text-gray-500">atteint</span>
                    </div>
                  </div>
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Épargné</p>
                    <p className="text-lg font-bold text-gray-900">
                      {goal.montantActuel.toFixed(2)}
                      <span className="text-xs text-gray-500 ml-1">TND</span>
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                    <p className="text-xs text-red-600 mb-1">Objectif</p>
                    <p className="text-lg font-bold text-red-700">
                      {goal.montantCible.toFixed(2)}
                      <span className="text-xs text-red-500 ml-1">TND</span>
                    </p>
                  </div>
                </div>

                {/* Days Remaining */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FiClock className={daysLeft < 0 ? 'text-red-500' : daysLeft < 30 ? 'text-orange-500' : 'text-gray-400'} />
                    {daysLeft >= 0 ? (
                      <span className="text-gray-600">
                        <span className="font-semibold text-gray-900">{daysLeft}</span> jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">Délai dépassé</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    Reste: {(goal.montantCible - goal.montantActuel).toFixed(2)} TND
                  </span>
                </div>

                {goal.description && (
                  <p className="text-sm text-gray-500 italic mb-4 truncate">
                    {goal.description}
                  </p>
                )}

                {/* Add Contribution Button */}
                {!isCompleted && (
                  <button
                    onClick={() => handleOpenContributionModal(goal)}
                    className="w-full btn btn-success"
                  >
                    <FiDollarSign /> Ajouter une contribution
                  </button>
                )}

                {isCompleted && (
                  <div className="w-full py-3 bg-green-100 rounded-xl text-center">
                    <span className="text-green-700 font-semibold flex items-center justify-center gap-2">
                      <FiCheckCircle /> Objectif atteint !
                    </span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <div className="card text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiTarget size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun objectif créé</h3>
              <p className="text-gray-400 mb-6">Définissez vos objectifs d'épargne dès maintenant</p>
              <button
                onClick={() => handleOpenModal()}
                className="btn btn-primary"
              >
                <FiPlus /> Créer votre premier objectif
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingGoal ? 'Modifier l\'objectif' : 'Nouvel objectif'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingGoal ? 'Modifiez les détails de votre objectif' : 'Définissez un nouvel objectif d\'épargne'}
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
                <label className="label">
                  <FiTarget className="inline mr-1" />
                  Titre de l'objectif *
                </label>
                <input
                  type="text"
                  name="titre"
                  required
                  className="input"
                  placeholder="Ex: Vacances 2026, Nouvelle voiture..."
                  value={formData.titre}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">
                  <FiDollarSign className="inline mr-1" />
                  Montant cible (TND) *
                </label>
                <input
                  type="number"
                  name="montantCible"
                  required
                  min="0"
                  step="0.01"
                  className="input text-2xl font-bold text-center"
                  placeholder="5000.00"
                  value={formData.montantCible}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">
                  <FiCalendar className="inline mr-1" />
                  Date d'échéance *
                </label>
                <input
                  type="date"
                  name="dateEcheance"
                  required
                  className="input"
                  value={formData.dateEcheance}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="input"
                  placeholder="Description de votre objectif..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingGoal ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      {showContributionModal && selectedGoal && (
        <div className="modal-overlay" onClick={handleCloseContributionModal}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ajouter une contribution</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Vers: {selectedGoal.titre}
                </p>
              </div>
              <button 
                onClick={handleCloseContributionModal} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleAddContribution} className="modal-body space-y-5">
              {/* Current Progress */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Progression actuelle</span>
                  <span className="font-bold text-gray-900">{getProgressPercentage(selectedGoal).toFixed(1)}%</span>
                </div>
                <div className="progress-bar h-3">
                  <div 
                    className="progress-bar-fill progress-green" 
                    style={{ width: `${getProgressPercentage(selectedGoal)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">{selectedGoal.montantActuel.toFixed(2)} TND</span>
                  <span className="text-red-600 font-semibold">{selectedGoal.montantCible.toFixed(2)} TND</span>
                </div>
              </div>

              <div>
                <label className="label">
                  <FiDollarSign className="inline mr-1" />
                  Montant de la contribution (TND) *
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  className="input text-2xl font-bold text-center"
                  placeholder="100.00"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Reste à épargner: {(selectedGoal.montantCible - selectedGoal.montantActuel).toFixed(2)} TND
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 200, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setContributionAmount(amount.toString())}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      contributionAmount === amount.toString()
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {amount} TND
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseContributionModal} className="btn btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" className="btn btn-success flex-1">
                  <FiPlus /> Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
