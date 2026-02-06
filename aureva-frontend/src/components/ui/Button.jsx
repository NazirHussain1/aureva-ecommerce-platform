export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = `
    px-4 py-2 rounded-lg font-semibold text-sm focus:outline-none 
    focus:ring-2 focus:ring-offset-2 transition-all duration-200
  `;

  const variants = {
    primary: `bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400`,
    outline: `border border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-gray-400`,
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
