import PropTypes from 'prop-types';

export default function PageTransition({ children, className = '' }) {
  return (
    <div 
      className={`animate-fadeIn transition-opacity duration-500 opacity-100 ${className}`}
    >
      {children}
    </div>
  );
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
