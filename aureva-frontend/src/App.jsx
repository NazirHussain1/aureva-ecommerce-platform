import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/store/Home';

function SimpleLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Aureva Beauty
          </h1>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 Aureva Beauty. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleLayout><Home /></SimpleLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
