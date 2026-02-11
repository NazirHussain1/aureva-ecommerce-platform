import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function PageTransition({ children, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
