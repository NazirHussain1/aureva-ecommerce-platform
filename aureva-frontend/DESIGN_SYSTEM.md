# Aureva Beauty Design System

A comprehensive design system for consistent, beautiful, and maintainable UI across the entire application.

---

## Table of Contents
1. [Brand Colors](#brand-colors)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Border Radius](#border-radius)
5. [Shadows](#shadows)
6. [Buttons](#buttons)
7. [Cards](#cards)
8. [Forms](#forms)
9. [Icons](#icons)
10. [Animations](#animations)

---

## Brand Colors

### Primary Colors
```css
/* Pink-Purple Gradient (Primary Brand) */
from-pink-600 to-purple-600
#DB2777 → #9333EA

/* Usage: Main CTAs, brand elements, primary actions */
```

### Secondary Colors
```css
/* Indigo-Blue (Secondary) */
from-indigo-600 to-blue-600
#4F46E5 → #2563EB

/* Usage: Secondary actions, informational elements */
```

### Accent Colors
```css
/* Success: Green */
from-green-500 to-emerald-600
#10B981 → #059669

/* Warning: Orange */
from-orange-500 to-amber-600
#F97316 → #D97706

/* Error: Red */
from-red-500 to-rose-600
#EF4444 → #E11D48

/* Info: Cyan */
from-cyan-500 to-teal-600
#06B6D4 → #0D9488
```

### Neutral Colors
```css
/* Text */
text-gray-900  /* Headings: #111827 */
text-gray-800  /* Body: #1F2937 */
text-gray-600  /* Secondary: #4B5563 */
text-gray-500  /* Muted: #6B7280 */
text-gray-400  /* Disabled: #9CA3AF */

/* Backgrounds */
bg-white       /* #FFFFFF */
bg-gray-50     /* Light background: #F9FAFB */
bg-gray-100    /* Subtle background: #F3F4F6 */
bg-gray-800    /* Dark background: #1F2937 */
bg-gray-900    /* Darkest: #111827 */
```

---

## Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Heading Scale
```jsx
/* H1 - Page Titles */
<h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
  Page Title
</h1>

/* H2 - Section Titles */
<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
  Section Title
</h2>

/* H3 - Subsection Titles */
<h3 className="text-2xl font-bold text-gray-900 mb-2">
  Subsection Title
</h3>

/* H4 - Card Titles */
<h4 className="text-xl font-bold text-gray-800">
  Card Title
</h4>

/* H5 - Small Headings */
<h5 className="text-lg font-semibold text-gray-800">
  Small Heading
</h5>

/* H6 - Tiny Headings */
<h6 className="text-base font-semibold text-gray-700">
  Tiny Heading
</h6>
```

### Body Text
```jsx
/* Large Body */
<p className="text-lg text-gray-600 leading-relaxed">
  Large body text for important content
</p>

/* Regular Body */
<p className="text-base text-gray-700 leading-relaxed">
  Regular body text for most content
</p>

/* Small Body */
<p className="text-sm text-gray-600">
  Small body text for secondary information
</p>

/* Extra Small */
<p className="text-xs text-gray-500">
  Extra small text for captions and labels
</p>
```

### Font Weights
```css
font-normal    /* 400 - Regular text */
font-medium    /* 500 - Slightly emphasized */
font-semibold  /* 600 - Emphasized text */
font-bold      /* 700 - Headings and important text */
font-extrabold /* 800 - Extra emphasis */
```

---

## Spacing System

### Consistent Spacing Scale
```css
/* Use multiples of 4 for consistency */
p-2   /* 0.5rem = 8px */
p-3   /* 0.75rem = 12px */
p-4   /* 1rem = 16px */
p-6   /* 1.5rem = 24px */
p-8   /* 2rem = 32px */
p-12  /* 3rem = 48px */
p-16  /* 4rem = 64px */

/* Same applies to margin (m-), gap (gap-), etc. */
```

### Component Spacing Patterns
```jsx
/* Card Padding */
<div className="p-6 md:p-8">
  Card content with responsive padding
</div>

/* Section Spacing */
<section className="py-16 px-4 sm:px-6 lg:px-8">
  Section with vertical and horizontal padding
</section>

/* Element Spacing */
<div className="space-y-6">
  {/* Children have 1.5rem vertical spacing */}
</div>

/* Grid Gaps */
<div className="grid grid-cols-3 gap-6">
  Grid with consistent gaps
</div>
```

---

## Border Radius

### Standard Radius Scale
```jsx
/* Small - Buttons, Inputs */
<button className="rounded-lg">
  8px radius
</button>

/* Medium - Cards, Containers */
<div className="rounded-xl">
  12px radius
</div>

/* Large - Featured Cards */
<div className="rounded-2xl">
  16px radius
</div>

/* Extra Large - Hero Sections */
<div className="rounded-3xl">
  24px radius
</div>

/* Full - Pills, Badges */
<span className="rounded-full">
  9999px radius
</span>
```

### Usage Guidelines
- **rounded-lg**: Buttons, form inputs, small cards
- **rounded-xl**: Standard cards, modals, dropdowns
- **rounded-2xl**: Large cards, product cards, sections
- **rounded-3xl**: Hero sections, featured content
- **rounded-full**: Badges, pills, avatars, icon buttons

---

## Shadows

### Shadow Scale
```jsx
/* Subtle - Hover states */
<div className="shadow-sm">
  Subtle shadow
</div>

/* Default - Cards */
<div className="shadow-md">
  Medium shadow
</div>

/* Elevated - Important cards */
<div className="shadow-lg">
  Large shadow
</div>

/* Prominent - Modals, popovers */
<div className="shadow-xl">
  Extra large shadow
</div>

/* Maximum - Floating elements */
<div className="shadow-2xl">
  Maximum shadow
</div>
```

### Hover Shadow Pattern
```jsx
<div className="shadow-md hover:shadow-xl transition-shadow duration-300">
  Card with hover shadow
</div>
```

---

## Buttons

### Primary Button
```jsx
<button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
  Primary Action
</button>
```

### Secondary Button
```jsx
<button className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 shadow-sm hover:shadow-md">
  Secondary Action
</button>
```

### Outline Button
```jsx
<button className="px-6 py-3 bg-transparent text-purple-600 font-semibold rounded-xl border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300">
  Outline Button
</button>
```

### Ghost Button
```jsx
<button className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300">
  Ghost Button
</button>
```

### Icon Button
```jsx
<button className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-all duration-300 hover:scale-110">
  <FiHeart className="w-5 h-5" />
</button>
```

### Button Sizes
```jsx
/* Small */
<button className="px-4 py-2 text-sm">Small</button>

/* Medium (Default) */
<button className="px-6 py-3 text-base">Medium</button>

/* Large */
<button className="px-8 py-4 text-lg">Large</button>
```

### Button States
```jsx
/* Loading */
<button disabled className="opacity-50 cursor-not-allowed">
  <BiLoaderAlt className="animate-spin" />
  Loading...
</button>

/* Disabled */
<button disabled className="opacity-50 cursor-not-allowed">
  Disabled
</button>
```

---

## Cards

### Standard Card
```jsx
<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
  <h3 className="text-xl font-bold text-gray-900 mb-3">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
</div>
```

### Product Card
```jsx
<div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
  <img src={image} alt={title} className="w-full h-48 object-cover" />
  <div className="p-5">
    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-2xl font-bold text-purple-600">${price}</p>
    <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl">
      Add to Cart
    </button>
  </div>
</div>
```

### Info Card
```jsx
<div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
  <div className="flex items-center gap-3 mb-3">
    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
      <FiInfo className="w-5 h-5 text-white" />
    </div>
    <h4 className="font-bold text-gray-900">Information</h4>
  </div>
  <p className="text-gray-700">Important information goes here</p>
</div>
```

---

## Forms

### Input Field
```jsx
<input
  type="text"
  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300"
  placeholder="Enter text"
/>
```

### Textarea
```jsx
<textarea
  rows="4"
  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 resize-none"
  placeholder="Enter message"
/>
```

### Select Dropdown
```jsx
<select className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300">
  <option>Select option</option>
</select>
```

### Checkbox
```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
  />
  <span className="text-gray-700">Checkbox label</span>
</label>
```

### Radio Button
```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="radio"
    className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500"
  />
  <span className="text-gray-700">Radio label</span>
</label>
```

---

## Icons

### Icon Sizes
```jsx
/* Small */
<FiHeart className="w-4 h-4" />

/* Medium (Default) */
<FiHeart className="w-5 h-5" />

/* Large */
<FiHeart className="w-6 h-6" />

/* Extra Large */
<FiHeart className="w-8 h-8" />
```

### Icon Colors
```jsx
/* Primary */
<FiHeart className="text-purple-600" />

/* Secondary */
<FiHeart className="text-gray-600" />

/* Success */
<FiCheck className="text-green-500" />

/* Warning */
<FiAlert className="text-orange-500" />

/* Error */
<FiX className="text-red-500" />
```

### Icon with Background
```jsx
<div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
  <FiHeart className="w-6 h-6 text-purple-600" />
</div>
```

---

## Animations

### Hover Animations
```jsx
/* Scale */
<div className="hover:scale-105 transition-transform duration-300">
  Scales on hover
</div>

/* Lift */
<div className="hover:-translate-y-2 transition-transform duration-300">
  Lifts on hover
</div>

/* Shadow */
<div className="shadow-md hover:shadow-xl transition-shadow duration-300">
  Shadow increases on hover
</div>
```

### Loading States
```jsx
<div className="animate-pulse bg-gray-200 rounded-xl h-48">
  Skeleton loader
</div>

<BiLoaderAlt className="animate-spin w-6 h-6 text-purple-600" />
```

### Page Transitions
```jsx
<div className="animate-fadeIn">
  Content fades in
</div>
```

---

## Component Examples

### Complete Button Set
```jsx
<div className="flex flex-wrap gap-4">
  {/* Primary */}
  <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
    Primary
  </button>
  
  {/* Secondary */}
  <button className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300">
    Secondary
  </button>
  
  {/* Outline */}
  <button className="px-6 py-3 bg-transparent text-purple-600 font-semibold rounded-xl border-2 border-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300">
    Outline
  </button>
  
  {/* Ghost */}
  <button className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300">
    Ghost
  </button>
</div>
```

### Complete Card Set
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Standard Card */}
  <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
    <h3 className="text-xl font-bold text-gray-900 mb-3">Standard Card</h3>
    <p className="text-gray-600">Card content</p>
  </div>
  
  {/* Gradient Card */}
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
    <h3 className="text-xl font-bold text-gray-900 mb-3">Gradient Card</h3>
    <p className="text-gray-700">Card content</p>
  </div>
  
  {/* Dark Card */}
  <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
    <h3 className="text-xl font-bold text-white mb-3">Dark Card</h3>
    <p className="text-gray-300">Card content</p>
  </div>
</div>
```

---

## Responsive Design

### Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Responsive Patterns
```jsx
/* Responsive Grid */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  Grid items
</div>

/* Responsive Text */
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive heading
</h1>

/* Responsive Padding */
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>

/* Responsive Visibility */
<div className="hidden md:block">
  Visible on medium screens and up
</div>
```

---

## Accessibility

### Focus States
```jsx
<button className="focus:ring-4 focus:ring-purple-200 focus:outline-none">
  Accessible button
</button>
```

### ARIA Labels
```jsx
<button aria-label="Add to cart">
  <FiShoppingCart />
</button>
```

### Semantic HTML
```jsx
<nav>Navigation</nav>
<main>Main content</main>
<aside>Sidebar</aside>
<footer>Footer</footer>
```

---

## Quick Reference

### Most Used Classes
```css
/* Containers */
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

/* Cards */
bg-white rounded-2xl shadow-md p-6 border border-gray-100

/* Buttons */
px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl

/* Inputs */
w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400

/* Headings */
text-4xl font-bold text-gray-900

/* Body Text */
text-base text-gray-700 leading-relaxed

/* Spacing */
space-y-6 gap-6 p-6 mb-6
```

---

Last Updated: February 11, 2026
Version: 1.0.0
