import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import aiService from '../services/aiService';
import { 
  FiSend, 
  FiCpu, 
  FiUser, 
  FiInfo,
  FiZap,
  FiMessageCircle,
  FiDollarSign,
  FiTrendingUp,
  FiTarget,
  FiPieChart
} from 'react-icons/fi';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { type: 'user', content: question, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await aiService.getFinancialAdvice({ question: userMessage.content });
      const aiMessage = { 
        type: 'ai', 
        content: response.advice, 
        timestamp: new Date(response.timestamp),
        isDemoMode: response.isDemoMode
      };
      setMessages(prev => [...prev, aiMessage]);
      
      if (response.isDemoMode) {
        toast.info('Mode Démo activé - Ajoutez une clé Gemini API pour l\'IA réelle', {
          autoClose: 5000
        });
      }
    } catch (error) {
      const errorMessage = { 
        type: 'error', 
        content: error.response?.status === 503 
          ? 'Service IA non configuré. Veuillez ajouter GEMINI_API_KEY dans le backend.'
          : 'Erreur lors de la consultation de l\'IA',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuestion(suggestion);
  };

  const suggestions = [
    { icon: FiDollarSign, text: 'Comment réduire mes dépenses?', color: 'blue' },
    { icon: FiPieChart, text: 'Comment faire un budget mensuel?', color: 'purple' },
    { icon: FiTarget, text: 'Comment économiser 500 TND par mois?', color: 'green' },
    { icon: FiTrendingUp, text: 'Où investir mon argent en Tunisie?', color: 'orange' }
  ];

  return (
    <div className="animate-fadeIn h-[calc(100vh-180px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <FiCpu className="text-white" size={28} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assistant IA Financier</h1>
            <p className="text-gray-500 arabic-text text-sm">مساعد الذكاء الاصطناعي المالي</p>
          </div>
        </div>
        
        {/* Demo Badge */}
        <div className="hidden md:flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm">
          <FiInfo size={16} />
          <span className="font-medium">Mode Démo</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col card p-0 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-6">
                  <FiMessageCircle className="text-purple-500" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Bienvenue !</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  Je suis votre assistant financier personnel. Posez-moi vos questions sur la gestion de vos finances !
                </p>
                
                {/* Quick Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className={`p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all group animate-fadeInUp`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-${suggestion.color}-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <suggestion.icon className={`text-${suggestion.color}-600`} size={20} />
                      </div>
                      <p className="text-sm text-gray-700">{suggestion.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 animate-fadeInUp ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type !== 'user' && (
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                        message.type === 'error' 
                          ? 'bg-red-100' 
                          : 'bg-gradient-to-br from-purple-500 to-purple-700'
                      }`}>
                        {message.type === 'error' ? (
                          <FiInfo className="text-red-600" size={18} />
                        ) : (
                          <FiCpu className="text-white" size={18} />
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl rounded-tr-sm' 
                        : message.type === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-800 rounded-2xl rounded-tl-sm'
                        : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                    } px-5 py-3`}>
                      {message.isDemoMode && (
                        <div className="flex items-center gap-1 text-xs text-purple-600 mb-2 bg-purple-100 px-2 py-1 rounded-full w-fit">
                          <FiZap size={10} />
                          <span>Mode Démo</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-red-200' : 'text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
                        <FiUser className="text-white" size={18} />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-3 justify-start animate-fadeIn">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
                      <FiCpu className="text-white" size={18} />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-5 py-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                className="input flex-1"
                placeholder="Posez votre question financière..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="btn btn-primary px-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSend />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col space-y-4">
          {/* Info Card */}
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <FiInfo className="text-blue-700" size={18} />
              </div>
              <h3 className="font-bold text-blue-900">Mode Démo</h3>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              L'assistant utilise des réponses prédéfinies. Pour activer l'IA réelle, ajoutez une clé GEMINI_API_KEY.
            </p>
            <a 
              href="https://ai.google.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              Obtenir une clé API →
            </a>
          </div>

          {/* Suggestions */}
          <div className="card flex-1">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiZap className="text-yellow-500" />
              Suggestions
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all text-sm text-gray-700 flex items-center gap-3 group"
                >
                  <suggestion.icon className="text-gray-400 group-hover:text-gray-600" size={16} />
                  <span className="flex-1 truncate">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💡</span>
              <h3 className="font-bold text-purple-900">Astuce</h3>
            </div>
            <p className="text-sm text-purple-800">
              Posez des questions spécifiques pour obtenir des conseils plus personnalisés !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
