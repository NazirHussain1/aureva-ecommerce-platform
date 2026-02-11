import { FiHeart, FiShoppingCart, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <h1 className="heading-1 mb-4">Aureva Design System</h1>
        <p className="body-large mb-16">
          A comprehensive showcase of all design system components and patterns.
        </p>

        <section className="mb-16">
          <h2 className="heading-2 mb-8">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-outline">Outline Button</button>
            <button className="btn-ghost">Ghost Button</button>
            <button className="btn-icon">
              <FiHeart className="w-5 h-5" />
            </button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="heading-2 mb-8">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="heading-4 mb-3">Standard Card</h3>
              <p className="body">This is a standard card with default styling.</p>
            </div>
            <div className="card-hover">
              <h3 className="heading-4 mb-3">Hover Card</h3>
              <p className="body">This card lifts on hover with shadow effect.</p>
            </div>
            <div className="card-gradient">
              <h3 className="heading-4 mb-3">Gradient Card</h3>
              <p className="body">This card has a gradient background.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="heading-2 mb-8">Form Elements</h2>
          <div className="max-w-md space-y-4">
            <input type="text" className="input" placeholder="Text input" />
            <textarea className="textarea" rows="4" placeholder="Textarea" />
            <select className="select">
              <option>Select option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="heading-2 mb-8">Typography</h2>
          <div className="space-y-4">
            <h1 className="heading-1">Heading 1</h1>
            <h2 className="heading-2">Heading 2</h2>
            <h3 className="heading-3">Heading 3</h3>
            <h4 className="heading-4">Heading 4</h4>
            <p className="body-large">Large body text for important content.</p>
            <p className="body">Regular body text for most content.</p>
            <p className="body-small">Small body text for secondary information.</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="heading-2 mb-8">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="badge-primary">Primary</span>
            <span className="badge-success">Success</span>
            <span className="badge-warning">Warning</span>
            <span className="badge-error">Error</span>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="heading-2 mb-8">Icons</h2>
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <HiSparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
              <FiX className="w-6 h-6 text-red-600" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <FiInfo className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="heading-2 mb-8">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="h-24 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl mb-2"></div>
              <p className="body-small font-semibold">Primary Gradient</p>
            </div>
            <div>
              <div className="h-24 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl mb-2"></div>
              <p className="body-small font-semibold">Secondary Gradient</p>
            </div>
            <div>
              <div className="h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-2"></div>
              <p className="body-small font-semibold">Success Gradient</p>
            </div>
            <div>
              <div className="h-24 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl mb-2"></div>
              <p className="body-small font-semibold">Error Gradient</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
