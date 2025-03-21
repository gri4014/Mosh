import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { state: { user }, logout } = useAuth();
  const location = useLocation();

  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navContent}>
            <div className={styles.leftSection}>
              <Link to="/" className={styles.logo}>
                Mosh
              </Link>
              
              <div className={styles.navLinks}>
                <Link 
                  to="/dashboard" 
                  className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/settings" 
                  className={`${styles.navLink} ${location.pathname === '/settings' ? styles.active : ''}`}
                >
                  Settings
                </Link>
              </div>
            </div>

            <div>
              {user?.id && (
                <button
                  onClick={logout}
                  className="btn btn-danger"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
