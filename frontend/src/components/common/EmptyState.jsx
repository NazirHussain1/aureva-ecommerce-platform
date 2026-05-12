import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  actionText, 
  actionLink,
  onAction,
  variant = 'default'
}) {
  const variants = {
    default: {
      bg: 'from-purple-50 to-pink-50',
      iconBg: 'from-purple-100 to-pink-100',
      iconColor: 'text-purple-400',
      buttonBg: 'from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
    },
    cart: {
      bg: 'from-blue-50 to-indigo-50',
      iconBg: 'from-blue-100 to-indigo-100',
      iconColor: 'text-blue-400',
      buttonBg: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
    },
    wishlist: {
      bg: 'from-red-50 to-pink-50',
      iconBg: 'from-red-100 to-pink-100',
      iconColor: 'text-red-400',
      buttonBg: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
    },
    orders: {
      bg: 'from-green-50 to-emerald-50',
      iconBg: 'from-green-100 to-emerald-100',
      iconColor: 'text-green-400',
      buttonBg: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
    },
    search: {
      bg: 'from-gray-50 to-slate-50',
      iconBg: 'from-gray-100 to-slate-100',
      iconColor: 'text-gray-400',
      buttonBg: 'from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`bg-gradient-to-br ${currentVariant.bg} rounded-3xl p-12 md:p-16 shadow-lg border border-white/50 backdrop-blur-sm`}>
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${currentVariant.iconBg} rounded-3xl shadow-xl mb-2 animate-bounce-slow`}>
          {Icon && <Icon className={`w-12 h-12 ${currentVariant.iconColor}`} />}
        </div>
        
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-gray-900">
            {title}
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {(actionText && (actionLink || onAction)) && (
          <div className="pt-4">
            {actionLink ? (
              <Link
                to={actionLink}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${currentVariant.buttonBg} text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300`}
              >
                {actionText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={onAction}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${currentVariant.buttonBg} text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300`}
              >
                {actionText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  actionLink: PropTypes.string,
  onAction: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'cart', 'wishlist', 'orders', 'search'])
};
