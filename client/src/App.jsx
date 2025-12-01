import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import PublicPage from './pages/PublicPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import ScannerLogin from './pages/ScannerLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ScannerPage from './pages/ScannerPage.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav>
          <Link to="/" className="brand" style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ◆ ONE Life ◆
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              💎 Billetterie
            </Link>
            <Link to="/admin" className="nav-link">
              🔐 Admin
            </Link>
            <Link to="/scanner" className="nav-button">
              📱 Scanner QR
            </Link>
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<PublicPage />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/scanner-login" element={<ScannerLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/scanner" element={<ScannerPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
