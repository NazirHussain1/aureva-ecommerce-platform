export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-2 border rounded-lg text-gray-700
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
          transition duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
