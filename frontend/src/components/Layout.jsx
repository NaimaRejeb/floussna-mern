import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { 
  FiHome, 
  FiDollarSign, 
  FiList, 
  FiTarget, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX,
  FiCpu,
  FiChevronRight,
  FiBell
} from 'react-icons/fi';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: FiHome, label: 'Tableau de bord', labelAr: 'لوحة القيادة', color: 'blue' },
    { path: '/budgets', icon: FiDollarSign, label: 'Budgets', labelAr: 'الميزانيات', color: 'green' },
    { path: '/transactions', icon: FiList, label: 'Transactions', labelAr: 'المعاملات', color: 'purple' },
    { path: '/goals', icon: FiTarget, label: 'Objectifs', labelAr: 'الأهداف', color: 'orange' },
    { path: '/ai-assistant', icon: FiCpu, label: 'Assistant IA', labelAr: 'مساعد الذكاء', color: 'pink' },
    { path: '/profile', icon: FiUser, label: 'Profil', labelAr: 'الملف', color: 'gray' },
  ];

  const getInitials = () => {
    if (user?.prenom && user?.nom) {
      return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Tunisian Flag Accent */}
      <div className="tunisian-accent"></div>

      {/* Header */}
      <header className="glass sticky top-1 z-40 mx-2 mt-2 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <Logo size="default" />
            </div>

            {/* Right: Notifications + User */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                <FiBell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="avatar avatar-md">
                  {getInitials()}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Déconnexion"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky inset-y-0 left-0 z-30
            w-72 bg-white/80 backdrop-blur-xl transform transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            top-[85px] md:top-[85px] h-[calc(100vh-85px)]
            border-r border-gray-200/50
            shadow-xl md:shadow-none
          `}
        >
          {/* Navigation */}
          <nav className="px-4 py-6 space-y-1.5 overflow-y-auto h-full">
            {/* User Card - Mobile */}
            <div className="sm:hidden mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="avatar avatar-md">
                  {getInitials()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Menu Principal
            </p>

            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 relative
                    ${isActive
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`
                    p-2 rounded-lg mr-3 transition-all
                    ${isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                    }
                  `}>
                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-600'} />
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    <span className={`block text-xs arabic-text mt-0.5 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                      {item.labelAr}
                    </span>
                  </div>
                  {isActive && (
                    <FiChevronRight className="text-white/70" size={16} />
                  )}
                </Link>
              );
            })}

            {/* Bottom Card */}
            <div className="absolute bottom-6 left-4 right-4">
              <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FiCpu size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Assistant IA</p>
                    <p className="text-xs text-white/70">Gemini Powered</p>
                  </div>
                </div>
                <p className="text-xs text-white/80 mb-3">
                  Obtenez des conseils financiers personnalisés avec l'IA
                </p>
                <Link 
                  to="/ai-assistant"
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full py-2 text-center bg-white text-red-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Essayer maintenant
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-85px)]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
