import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, UserPlus, Key, Mail, User, ShieldAlert, Award } from 'lucide-react';

export default function LoginScreen() {
  const { login, signup, requestPasswordReset } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [robloxUsername, setRobloxUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        if (!email) throw new Error('Please enter your email address.');
        await requestPasswordReset(email);
        setSuccess('Password reset request sent. Please message vortex23575 (Jamie) on Discord.');
        setIsForgotPassword(false);
      } else if (isLogin) {
        await login(email, password);
      } else {
        if (!firstName || !robloxUsername || !email || !password) {
          throw new Error('Please fill in all fields.');
        }
        await signup({ email, password, firstName, lastName, robloxUsername });
        setSuccess('Registration successful! Your account is pending admin approval.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel-glow" style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logoIconContainer}>
            <img src="/logo.png" alt="Oxton Logo" style={styles.logoIcon} />
          </div>
          <h1 style={styles.brandTitle}>OXTON</h1>
          <p style={styles.brandSubtitle}>Staff Portal & Command Center</p>
        </div>

        <div style={styles.tabContainer}>
          <button
            onClick={() => { setIsLogin(true); setIsForgotPassword(false); setError(''); setSuccess(''); }}
            style={{
              ...styles.tabButton,
              borderBottomColor: (isLogin && !isForgotPassword) ? '#2563eb' : 'transparent',
              color: (isLogin && !isForgotPassword) ? '#f3f4f6' : '#9ca3af',
            }}
          >
            <LogIn size={18} />
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setIsForgotPassword(false); setError(''); setSuccess(''); }}
            style={{
              ...styles.tabButton,
              borderBottomColor: (!isLogin && !isForgotPassword) ? '#2563eb' : 'transparent',
              color: (!isLogin && !isForgotPassword) ? '#f3f4f6' : '#9ca3af',
            }}
          >
            <UserPlus size={18} />
            Register
          </button>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successBanner}>
            <Award size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && !isForgotPassword && (
            <div style={styles.row}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>First Name</label>
                <div style={styles.inputInnerWrapper}>
                  <User size={16} style={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Evan"
                    className="input-field"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Last Name <span style={styles.optionalLabel}>Optional</span></label>
                <div style={styles.inputInnerWrapper}>
                  <User size={16} style={styles.inputIcon} />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Optional"
                    className="input-field"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {!isLogin && !isForgotPassword && (
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Roblox Username</label>
              <div style={styles.inputInnerWrapper}>
                <Award size={16} style={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={robloxUsername}
                  onChange={(e) => setRobloxUsername(e.target.value)}
                  placeholder="EvanOxton"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputInnerWrapper}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field"
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputInnerWrapper}>
                <Key size={16} style={styles.inputIcon} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={styles.submitBtn}
          >
            {loading ? (
              <div className="spinner-container" style={{ gap: '10px' }}>
                <span className="spinner-pulse"></span>
                <span className="spinner-ring"></span>
                <span>Authenticating...</span>
              </div>
            ) : (
              <span style={styles.btnContent}>
                {isForgotPassword ? 'Request Password Reset' : (isLogin ? 'Log In to System' : 'Create Staff Request')}
              </span>
            )}
          </button>

          {!isForgotPassword && isLogin && (
            <button 
              type="button" 
              onClick={() => { setIsForgotPassword(true); setError(''); setSuccess(''); }} 
              style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '0.85rem', cursor: 'pointer', marginTop: '8px' }}
            >
              Forgot Password?
            </button>
          )}
          {isForgotPassword && (
            <button 
              type="button" 
              onClick={() => { setIsForgotPassword(false); setError(''); setSuccess(''); }} 
              style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '0.85rem', cursor: 'pointer', marginTop: '8px' }}
            >
              Back to Login
            </button>
          )}
        </form>
      </div>
      <div style={styles.versionText}>V1.1.1</div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    padding: '40px 32px',
    transition: 'all 0.3s ease',
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
    marginBottom: '16px',
  },
  logoIcon: {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))',
  },
  brandTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    letterSpacing: '3px',
    color: 'var(--color-text-main)',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
  },
  brandSubtitle: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    marginTop: '4px',
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '24px',
  },
  tabButton: {
    flex: 1,
    padding: '12px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#d1d5db',
  },
  optionalLabel: {
    color: '#9ca3af',
    fontSize: '0.75rem',
    fontWeight: '400',
    marginLeft: '4px',
  },
  inputInnerWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'rgba(255, 255, 255, 0.35)',
    pointerEvents: 'none',
  },
  submitBtn: {
    padding: '14px',
    borderRadius: '8px',
    marginTop: '10px',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '52px',
  },
  btnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  errorBanner: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '0.85rem',
    color: '#fca5a5',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    lineHeight: '1.4',
  },
  successBanner: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '0.85rem',
    color: '#a7f3d0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    lineHeight: '1.4',
  },
  versionText: {
    position: 'absolute',
    bottom: '20px',
    color: '#6b7280',
    fontSize: '0.85rem',
    fontWeight: '500',
    letterSpacing: '1px',
  },
};
