import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { state: { user } } = useAuth();

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>
      <div className={styles.content}>
        {/* Welcome Message */}
        <div className={styles.welcomeCard}>
          <h2 className={styles.welcomeTitle}>
            Welcome back!
          </h2>
          <p className={styles.welcomeText}>
            You're connected with Instagram. Get started by creating your first AI-powered content strategy.
          </p>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          {/* Posts Scheduled */}
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInner}>
                <div className={styles.statIcon}>
                  <svg className={styles.statIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <dt className={styles.statLabel}>Posts Scheduled</dt>
                  <dd className={styles.statValue}>0</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Published */}
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInner}>
                <div className={styles.statIcon}>
                  <svg className={styles.statIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <dt className={styles.statLabel}>Posts Published</dt>
                  <dd className={styles.statValue}>0</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Content Strategy */}
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInner}>
                <div className={styles.statIcon}>
                  <svg className={styles.statIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <dt className={styles.statLabel}>Content Strategy</dt>
                  <dd className={styles.statValue}>Not Set</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className={styles.getStartedSection}>
          <h3 className={styles.getStartedTitle}>Get Started</h3>
          <div className={styles.actionsGrid}>
            <button
              className={styles.actionCard}
              onClick={() => {/* TODO: Implement */}}
            >
              <h4 className={styles.actionTitle}>Create Content Strategy</h4>
              <p className={styles.actionDescription}>
                Define your brand voice and content themes
              </p>
            </button>

            <button
              className={styles.actionCard}
              onClick={() => {/* TODO: Implement */}}
            >
              <h4 className={styles.actionTitle}>Schedule Posts</h4>
              <p className={styles.actionDescription}>
                Create and schedule your Instagram content
              </p>
            </button>

            <button
              className={styles.actionCard}
              onClick={() => {/* TODO: Implement */}}
            >
              <h4 className={styles.actionTitle}>View Analytics</h4>
              <p className={styles.actionDescription}>
                Track your content performance
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
