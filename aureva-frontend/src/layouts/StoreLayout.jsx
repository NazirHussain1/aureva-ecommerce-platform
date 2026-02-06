import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

            <Footer />
    </div>
  );
}
