export default function Spinner({ size = 'md', color = 'pink' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colors = {
    pink: 'border-pink-200 border-t-pink-600',
    gray: 'border-gray-200 border-t-gray-600',
    blue: 'border-blue-200 border-t-blue-600',
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`${sizes[size]} ${colors[color]} border-4 rounded-full animate-spin`}
      ></div>
    </div>
  );
}
