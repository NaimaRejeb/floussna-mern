import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast.success('Connexion réussie! Bienvenue sur Floussna ');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

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
            
            <h2 className="text-4xl font-bold mb-4 animate-fadeInUp">Bienvenue sur Floussna</h2>
            <p className="text-xl text-white/80 mb-2 animate-fadeInUp delay-100">مرحبا بكم في فلوسنا</p>
            <p className="text-white/60 animate-fadeInUp delay-200">
              Gérez vos finances personnelles avec intelligence. Suivez vos dépenses, 
              planifiez vos budgets et atteignez vos objectifs financiers.
            </p>
            
            {/* Features */}
            <div className="mt-12 space-y-4 text-left animate-fadeInUp delay-300">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  💰
                </div>
                <div>
                  <p className="font-semibold">Suivi des dépenses</p>
                  <p className="text-sm text-white/70">Visualisez où va votre argent</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  🎯
                </div>
                <div>
                  <p className="font-semibold">Objectifs financiers</p>
                  <p className="text-sm text-white/70">Atteignez vos rêves</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <p className="font-semibold">Assistant IA</p>
                  <p className="text-sm text-white/70">Conseils personnalisés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Logo size="large" className="justify-center" />
          </div>

          {/* Form Card */}
          <div className="card-premium p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
              <p className="text-gray-500">Accédez à votre espace personnel</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="animate-fadeInUp delay-100">
                <label className="label">
                  <FiMail className="inline mr-2 text-gray-400" />
                  Adresse email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password Field */}
              <div className="animate-fadeInUp delay-200">
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3.5 text-base animate-fadeInUp delay-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Se connecter
                    <FiArrowRight />
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider my-8 animate-fadeInUp delay-400">
              <span>ou</span>
            </div>

            {/* Register Link */}
            <div className="text-center animate-fadeInUp delay-500">
              <p className="text-gray-600">
                Pas encore de compte?{' '}
                <Link 
                  to="/register" 
                  className="text-red-600 font-semibold hover:text-red-700 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-6">
            © 2026 Floussna - Gestion financière intelligente
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
