export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden transition-transform transform
        hover:scale-[1.02] hover:shadow-xl duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
