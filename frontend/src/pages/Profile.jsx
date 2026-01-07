import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import authService from '../services/authService';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiSave, 
  FiLock, 
  FiX,
  FiSettings,
  FiBell,
  FiGlobe,
  FiSun,
  FiShield,
  FiCalendar,
  FiEye,
  FiEyeOff,
  FiCheck
} from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    devise: 'TND',
    preferences: {
      notifications: true,
      langue: 'fr',
      theme: 'light'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadData = async () => {
    try {
      const profileDataResponse = await profileService.getMyProfile();
      setProfileData({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        email: user?.email || '',
        telephone: user?.telephone || '',
        devise: profileDataResponse.devise || 'TND',
        preferences: profileDataResponse.preferences || {
          notifications: true,
          langue: 'fr',
          theme: 'light'
        }
      });
    } catch {
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefName = name.split('.')[1];
      setProfileData({
        ...profileData,
        preferences: {
          ...profileData.preferences,
          [prefName]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileService.updateProfile({
        devise: profileData.devise,
        preferences: profileData.preferences
      });

      const response = await authService.getCurrentUser();
      updateUser(response);
      
      toast.success('Profil mis à jour avec succès');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Mot de passe modifié avec succès');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 25, label: 'Faible', color: 'red' };
    if (password.length < 8) return { strength: 50, label: 'Moyen', color: 'orange' };
    if (/^(?=.*[A-Z])(?=.*[0-9])/.test(password)) return { strength: 100, label: 'Fort', color: 'green' };
    return { strength: 75, label: 'Bon', color: 'blue' };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  const getInitials = () => {
    const first = profileData.prenom?.charAt(0) || '';
    const last = profileData.nom?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 animate-pulse">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-500 arabic-text mt-1">ملفي الشخصي</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card text-center animate-fadeInUp">
          {/* Avatar with Gradient Border */}
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-red-700 p-1 mx-auto">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-red-600">
                {getInitials()}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-4 border-white">
              <FiCheck className="text-white" size={12} />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            {profileData.prenom} {profileData.nom}
          </h2>
          <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
            <FiMail size={14} />
            {profileData.email}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <FiCalendar className="mx-auto text-gray-400 mb-1" size={20} />
              <p className="text-xs text-gray-500">Membre depuis</p>
              <p className="font-semibold text-gray-900 text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <FiShield className="mx-auto text-green-500 mb-1" size={20} />
              <p className="text-xs text-gray-500">Statut</p>
              <p className="font-semibold text-green-600 text-sm">Vérifié</p>
            </div>
          </div>

          {/* Change Password Button */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full btn btn-outline mt-6"
          >
            <FiLock /> Changer le mot de passe
          </button>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="card animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FiUser className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Informations personnelles</h3>
                  <p className="text-sm text-gray-500">Vos informations de base</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    className="input"
                    value={profileData.prenom}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    className="input"
                    value={profileData.nom}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label flex items-center gap-1">
                    <FiMail size={14} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input bg-gray-100 cursor-not-allowed"
                    value={profileData.email}
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <label className="label flex items-center gap-1">
                    <FiPhone size={14} />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    className="input"
                    placeholder="+216 XX XXX XXX"
                    value={profileData.telephone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="card animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FiSettings className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Préférences</h3>
                  <p className="text-sm text-gray-500">Personnalisez votre expérience</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label flex items-center gap-1">
                    <span className="text-lg">د</span>
                    Devise
                  </label>
                  <select
                    name="devise"
                    className="input"
                    value={profileData.devise}
                    onChange={handleChange}
                  >
                    <option value="TND">🇹🇳 TND - Dinar Tunisien</option>
                    <option value="EUR">🇪🇺 EUR - Euro</option>
                    <option value="USD">🇺🇸 USD - Dollar américain</option>
                  </select>
                </div>

                <div>
                  <label className="label flex items-center gap-1">
                    <FiGlobe size={14} />
                    Langue
                  </label>
                  <select
                    name="preferences.langue"
                    className="input"
                    value={profileData.preferences.langue}
                    onChange={handleChange}
                  >
                    <option value="fr">🇫🇷 Français</option>
                    <option value="ar">🇹🇳 العربية</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>

                <div>
                  <label className="label flex items-center gap-1">
                    <FiSun size={14} />
                    Thème
                  </label>
                  <select
                    name="preferences.theme"
                    className="input"
                    value={profileData.preferences.theme}
                    onChange={handleChange}
                  >
                    <option value="light">☀️ Clair</option>
                    <option value="dark">🌙 Sombre</option>
                  </select>
                </div>
              </div>

              {/* Notifications Toggle */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <FiBell className="text-orange-600" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-500">Recevoir des alertes et rappels</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="preferences.notifications"
                      checked={profileData.preferences.notifications}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                <FiSave />
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-xl">
                  <FiLock className="text-red-600" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Changer le mot de passe</h2>
                  <p className="text-sm text-gray-500">Sécurisez votre compte</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="modal-body space-y-5">
              <div>
                <label className="label">Mot de passe actuel *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    required
                    className="input pr-12"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Nouveau mot de passe *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    required
                    minLength="6"
                    className="input pr-12"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Force du mot de passe</span>
                      <span className={`font-semibold text-${passwordStrength.color}-600`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.color === 'red' ? 'bg-red-500' :
                          passwordStrength.color === 'orange' ? 'bg-orange-500' :
                          passwordStrength.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="label">Confirmer le nouveau mot de passe *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    className={`input pr-12 ${
                      passwordData.confirmPassword && 
                      passwordData.confirmPassword !== passwordData.newPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword
                        ? 'border-green-300 focus:border-green-500'
                        : ''
                    }`}
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                  <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
                )}
                {passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword && (
                  <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                    <FiCheck size={12} /> Les mots de passe correspondent
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1"
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                >
                  <FiLock /> Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
