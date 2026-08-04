import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, ShieldAlert, Award, ChevronLeft, Plane } from 'lucide-react';

const DISCORD_CLIENT_ID = '1534277658584813669';
const REDIRECT_URI = window.location.origin; 

export default function LoginScreen({ onBack }) {
  const { loginWithDiscord, submitAccessRequest } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [deniedUsername, setDeniedUsername] = useState('');
  const [accessReason, setAccessReason] = useState('');

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

    if (accessToken) {
      window.history.replaceState(null, null, window.location.pathname);
      
      setLoading(true);
      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      })
        .then(result => result.json())
        .then(async (response) => {
          const { username } = response;
          if (!username) throw new Error("Failed to get Discord username.");
          
          try {
            await loginWithDiscord(username);
          } catch (err) {
            if (err.message === 'ACCESS_NOT_GIVEN') {
              setIsAccessDenied(true);
              setDeniedUsername(username);
            } else {
              setError(err.message);
            }
          }
        })
        .catch(err => {
          console.error(err);
          setError("Failed to authenticate with Discord.");
        })
        .finally(() => setLoading(false));
    }
  }, [loginWithDiscord]);

  const handleDiscordLogin = () => {
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
    window.location.href = oauthUrl;
  };

  const handleRequestAccess = (e) => {
    e.preventDefault();
    if (!accessReason) {
      setError("Please provide a reason for access.");
      return;
    }
    try {
      submitAccessRequest(deniedUsername, accessReason);
      setSuccess("Your access request has been sent to the administrators.");
      setIsAccessDenied(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        {onBack && (
          <button onClick={onBack} style={styles.backButton} type="button">
            <ChevronLeft size={20} />
            Back to Portal
          </button>
        )}
        
        <div style={styles.logoSection}>
          <div style={styles.logoIconContainer}>
            <img src="./make_the_wing_symbol.png" alt="Luma Logo" style={styles.logoIcon} />
          </div>
          <h1 style={styles.brandTitle}>Luma Staff Portal <span style={{ fontFamily: 'monospace', fontSize: '0.4em', color: '#5bc2e7', verticalAlign: 'super', fontWeight: 'bold' }}>BETA</span></h1>
          <p style={styles.brandSubtitle}>Staff Portal & Command Center</p>
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
             <Plane size={32} color="#5bc2e7" className="animate-pulse" style={{ margin: '0 auto' }} />
             <p style={{ marginTop: '16px', color: 'var(--color-text-main)' }}>Authenticating with Discord...</p>
          </div>
        ) : isAccessDenied ? (
          <div style={styles.form}>
            <h2 style={{ textAlign: 'center', color: 'var(--color-text-main)', marginBottom: '8px' }}>Access Not Given</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your Discord account (<strong>{deniedUsername}</strong>) is not registered in the system.
            </p>
            
            <form onSubmit={handleRequestAccess} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Reason for Access</label>
                <div style={styles.inputInnerWrapper}>
                  <input
                    type="text"
                    required
                    value={accessReason}
                    onChange={(e) => setAccessReason(e.target.value)}
                    placeholder="E.g., I'm a new hire for GOPS"
                    className="input-field"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-primary" style={{ ...styles.submitButton, marginTop: '8px' }}>
                Request Access
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                onClick={() => { setIsAccessDenied(false); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#5bc2e7', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.form}>
            <button 
              onClick={handleDiscordLogin}
              className="btn-primary"
              style={{ ...styles.submitButton, background: '#5865F2', borderColor: '#5865F2' }}
            >
              <LogIn size={20} style={{ marginRight: '8px' }} />
              Login with Discord
            </button>
          </div>
        )}
      </div>
      <div style={styles.versionText}>V1.3 (Discord Auth)</div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' },
  backButton: { display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '20px', padding: '0', transition: 'color 0.2s ease' },
  card: { width: '100%', maxWidth: '480px', padding: '40px 32px', transition: 'all 0.3s ease' },
  logoSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' },
  logoIconContainer: { width: '100px', height: '100px', borderRadius: '24px', background: '#5bc2e7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(91, 194, 231, 0.4)', marginBottom: '20px' },
  logoIcon: { width: '72px', height: '72px', objectFit: 'contain' },
  brandTitle: { fontSize: '2rem', fontWeight: '900', letterSpacing: '3px', color: 'var(--color-text-main)' },
  brandSubtitle: { fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputWrapper: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  label: { fontSize: '0.85rem', fontWeight: '500', color: 'var(--color-text-main)' },
  inputInnerWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  submitButton: { padding: '14px', borderRadius: '8px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '52px', width: '100%' },
  errorBanner: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', lineHeight: '1.4' },
  successBanner: { background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', lineHeight: '1.4' },
  versionText: { position: 'absolute', bottom: '20px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '1px' },
};
