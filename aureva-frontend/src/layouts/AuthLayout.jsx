import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">Aureva Beauty</h1>
          <p className="text-gray-600">Your trusted beauty destination</p>
        </div>

        {/* Form Outlet */}
        <Outlet />

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          &copy; 2026 Aureva Beauty. All rights reserved.
        </div>
      </div>
    </div>
  );
}
