import PropTypes from 'prop-types';

const Logo = ({ size = 'default', showText = true, className = '' }) => {
  const sizes = {
    small: { icon: 32, text: 'text-xl' },
    default: { icon: 40, text: 'text-2xl' },
    large: { icon: 56, text: 'text-4xl' },
    xlarge: { icon: 80, text: 'text-5xl' }
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo SVG - Symbole Floussna */}
      <div className="relative">
        <svg 
          width={currentSize.icon} 
          height={currentSize.icon} 
          viewBox="0 0 80 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Cercle extérieur avec gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Cercle principal avec motif tunisien */}
          <circle cx="40" cy="40" r="38" fill="url(#logoGradient)" filter="url(#shadow)"/>
          
          {/* Cercle intérieur */}
          <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
          
          {/* Étoile et croissant stylisés (inspiration drapeau tunisien) */}
          <path 
            d="M40 15 C28 15 20 25 20 40 C20 55 28 65 40 65 C35 60 33 50 33 40 C33 30 35 20 40 15"
            fill="white"
            opacity="0.9"
          />
          
          {/* Symbole Dinar stylisé au centre */}
          <text 
            x="44" 
            y="50" 
            fontFamily="Arial, sans-serif" 
            fontSize="28" 
            fontWeight="bold" 
            fill="white"
            textAnchor="middle"
          >
            د
          </text>
          
          {/* Petite étoile */}
          <path 
            d="M50 28 L51.5 32 L56 32 L52.5 35 L54 39 L50 36.5 L46 39 L47.5 35 L44 32 L48.5 32 Z"
            fill="url(#goldGradient)"
          />
          
          {/* Cercle décoratif */}
          <circle cx="40" cy="40" r="36" fill="none" stroke="white" strokeWidth="1" opacity="0.2"/>
        </svg>
        
        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 rounded-full" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${currentSize.text} font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent tracking-tight`}>
            Floussna
          </span>
          <span className="text-xs text-gray-500 arabic-text font-medium tracking-wide">
            فلوسنا
          </span>
        </div>
      )}
    </div>
  );
};

Logo.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large', 'xlarge']),
  showText: PropTypes.bool,
  className: PropTypes.string
};

export default Logo;
