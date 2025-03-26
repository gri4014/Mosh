import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            <span>Welcome to</span>
            <span className={styles.titleHighlight}>Mosh</span>
          </h1>
          <p className={styles.description}>
            Automate your Instagram content creation with AI-powered tools. Sign up to get started.
          </p>
          <div className={styles.actions}>
            <button
              onClick={() => navigate('/register')}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            &copy; 2025 Mosh. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
