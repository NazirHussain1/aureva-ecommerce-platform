import { Outlet } from "react-router-dom";

export default function StoreLayout() {
  return (
    <div>
      <header className="p-4 bg-black text-white">Aureva Store</header>
      <Outlet />
      <footer className="p-4 bg-gray-200">© 2026 Aureva</footer>
    </div>
  );
}
