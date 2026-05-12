import PropTypes from 'prop-types';

export default function SkeletonLoader({ variant = 'default', count = 1, className = '' }) {
  const variants = {
    // Text skeletons
    text: 'h-4 bg-gray-200 rounded',
    'text-lg': 'h-6 bg-gray-200 rounded',
    'text-xl': 'h-8 bg-gray-200 rounded',
    
    // Card skeletons
    card: 'h-64 bg-gray-200 rounded-2xl',
    'card-sm': 'h-48 bg-gray-200 rounded-xl',
    'card-lg': 'h-96 bg-gray-200 rounded-2xl',
    
    // Product card skeleton
    product: (
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gray-200 animate-shimmer"></div>
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-shimmer"></div>
          <div className="h-10 bg-gray-200 rounded-xl animate-shimmer"></div>
        </div>
      </div>
    ),
    
    // Avatar skeleton
    avatar: 'w-12 h-12 bg-gray-200 rounded-full',
    'avatar-lg': 'w-16 h-16 bg-gray-200 rounded-full',
    
    // Button skeleton
    button: 'h-12 bg-gray-200 rounded-xl',
    'button-sm': 'h-10 bg-gray-200 rounded-lg',
    
    // Image skeleton
    image: 'w-full h-full bg-gray-200 rounded-xl',
    
    // Circle skeleton
    circle: 'w-12 h-12 bg-gray-200 rounded-full',
    
    // Default
    default: 'h-4 bg-gray-200 rounded',
  };

  const skeletonClass = typeof variants[variant] === 'string' 
    ? variants[variant] 
    : '';

  if (variant === 'product') {
    return (
      <div className={className}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{variants.product}</div>
        ))}
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${skeletonClass} animate-shimmer ${className}`}
        />
      ))}
    </>
  );
}

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf([
    'text',
    'text-lg',
    'text-xl',
    'card',
    'card-sm',
    'card-lg',
    'product',
    'avatar',
    'avatar-lg',
    'button',
    'button-sm',
    'image',
    'circle',
    'default',
  ]),
  count: PropTypes.number,
  className: PropTypes.string,
};

// Specialized skeleton components
export function ProductCardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="h-56 bg-gray-200 animate-shimmer"></div>
          <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/4 animate-shimmer"></div>
            <div className="h-5 bg-gray-200 rounded animate-shimmer"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
            <div className="flex items-center justify-between mt-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-shimmer"></div>
              <div className="h-6 bg-gray-200 rounded-full w-1/4 animate-shimmer"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl animate-shimmer mt-4"></div>
          </div>
        </div>
      ))}
    </>
  );
}

ProductCardSkeleton.propTypes = {
  count: PropTypes.number,
};

export function CategoryCardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
          <div className="w-20 h-20 bg-gray-200 rounded-2xl animate-shimmer mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
        </div>
      ))}
    </>
  );
}

CategoryCardSkeleton.propTypes = {
  count: PropTypes.number,
};

export function ReviewSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-shimmer flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 animate-shimmer"></div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

ReviewSkeleton.propTypes = {
  count: PropTypes.number,
};
