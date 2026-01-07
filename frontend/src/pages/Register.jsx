import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
      toast.success('Compte créé avec succès! Bienvenue sur Floussna ');
      navigate('/');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      // Gérer les erreurs de connexion réseau
      if (!error.response) {
        toast.error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
        return;
      }
      
      // Gérer les erreurs de validation du backend
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const validationErrors = error.response.data.errors
          .map(err => err.msg || err.message)
          .join(', ');
        toast.error(`Erreurs de validation: ${validationErrors}`);
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Erreur lors de l\'inscription. Veuillez réessayer.';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 33, label: 'Faible', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 66, label: 'Moyen', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Fort', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm animate-float delay-200"></div>
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-yellow-400/20 rounded-full backdrop-blur-sm animate-float delay-400"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center">
            {/* Logo Icon Only */}
            <div className="mb-8 animate-fadeInDown">
              <svg width="100" height="100" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto drop-shadow-2xl">
                <circle cx="40" cy="40" r="38" fill="white" fillOpacity="0.2"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
                <path d="M40 15 C28 15 20 25 20 40 C20 55 28 65 40 65 C35 60 33 50 33 40 C33 30 35 20 40 15" fill="white" opacity="0.9"/>
                <text x="44" y="50" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white" textAnchor="middle">د</text>
                <path d="M50 28 L51.5 32 L56 32 L52.5 35 L54 39 L50 36.5 L46 39 L47.5 35 L44 32 L48.5 32 Z" fill="#FCD34D"/>
              </svg>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 animate-fadeInUp">Rejoignez Floussna</h2>
            <p className="text-xl text-white/80 mb-2 animate-fadeInUp delay-100">انضم إلى فلوسنا</p>
            <p className="text-white/60 animate-fadeInUp delay-200">
              Créez votre compte gratuitement et commencez à prendre le contrôle de vos finances dès aujourd'hui.
            </p>
            
            {/* Benefits */}
            <div className="mt-12 space-y-3 text-left animate-fadeInUp delay-300">
              {[
                'Suivi automatique des dépenses',
                'Budgets personnalisables',
                'Objectifs d\'épargne',
                'Conseils IA personnalisés',
                'Rapports détaillés',
                '100% gratuit'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="w-6 h-6 bg-green-500/30 rounded-full flex items-center justify-center">
                    <FiCheck size={14} className="text-green-300" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
        <div className="w-full max-w-lg py-8 animate-fadeIn">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Logo size="large" className="justify-center" />
          </div>

          {/* Form Card */}
          <div className="card-premium p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
              <p className="text-gray-500">Rejoignez des milliers d'utilisateurs</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="animate-fadeInUp delay-100">
                  <label className="label">
                    <FiUser className="inline mr-2 text-gray-400" />
                    Prénom
                  </label>
                  <input
                    name="prenom"
                    type="text"
                    required
                    className="input"
                    placeholder="Ahmed"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </div>

                <div className="animate-fadeInUp delay-100">
                  <label className="label">Nom</label>
                  <input
                    name="nom"
                    type="text"
                    required
                    className="input"
                    placeholder="Ben Ali"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="animate-fadeInUp delay-200">
                <label className="label">
                  <FiMail className="inline mr-2 text-gray-400" />
                  Adresse email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input"
                  placeholder="ahmed@exemple.tn"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone Field */}
              <div className="animate-fadeInUp delay-250">
                <label className="label">
                  <FiPhone className="inline mr-2 text-gray-400" />
                  Téléphone
                  <span className="text-xs text-gray-400 font-normal ml-2">(optionnel)</span>
                </label>
                <input
                  name="telephone"
                  type="tel"
                  pattern="[0-9]{8}"
                  className="input"
                  placeholder="12 345 678"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>

              {/* Password Field */}
              <div className="animate-fadeInUp delay-300">
                <label className="label">
                  <FiLock className="inline mr-2 text-gray-400" />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input pr-12"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="animate-fadeInUp delay-400">
                <label className="label">
                  <FiLock className="inline mr-2 text-gray-400" />
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className={`input pr-12 ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3.5 text-base animate-fadeInUp delay-500"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Création...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Créer mon compte
                    <FiArrowRight />
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider my-6">
              <span>ou</span>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Vous avez déjà un compte?{' '}
                <Link 
                  to="/login" 
                  className="text-red-600 font-semibold hover:text-red-700 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            En créant un compte, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
