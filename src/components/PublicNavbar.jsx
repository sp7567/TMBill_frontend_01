import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="public-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FoodHub
        </Link>
        
        {/* Desktop / Mobile Menu */}
        <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
          <div className="navbar-links">
            <Link to="/" className="hover-link" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" className="hover-link" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" className="hover-link" onClick={() => setIsOpen(false)}>Contact</Link>
          </div>

          <div className="navbar-actions">
            <Link to="/login" className="hover-link login-link" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/register" className="register-btn" onClick={() => setIsOpen(false)}>Register</Link>
            <div className="theme-toggle-wrapper">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <style>{`
        .public-navbar {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .navbar-logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ef4444;
          text-decoration: none;
        }
        .navbar-menu {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          margin-left: 2.5rem;
        }
        .navbar-links {
          display: flex;
          gap: 1.5rem;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .hover-link {
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          transition: color 0.2s;
        }
        .hover-link:hover {
          color: var(--text-primary);
        }
        .register-btn {
          background: #ef4444;
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .register-btn:hover {
          background: #dc2626;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        @media screen and (max-width: 768px) {
          .navbar-container {
            padding: 1rem 1.25rem;
          }
          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .navbar-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-card);
            flex-direction: column;
            align-items: stretch;
            margin-left: 0;
            padding: 1.5rem;
            border-bottom: 1px solid var(--border);
            gap: 1.5rem;
            display: none;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .navbar-menu.open {
            display: flex;
          }
          .navbar-links {
            flex-direction: column;
            gap: 1.25rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.25rem;
          }
          .navbar-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 1.25rem;
          }
          .register-btn {
            text-align: center;
            padding: 0.75rem;
          }
          .login-link {
            text-align: center;
            padding: 0.5rem;
          }
          .theme-toggle-wrapper {
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
};

export default PublicNavbar;
