import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">Aureva Beauty</h1>
          <p className="text-gray-600">Your trusted beauty destination</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
