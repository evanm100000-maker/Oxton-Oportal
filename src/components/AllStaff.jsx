import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, User } from 'lucide-react';

export default function AllStaff() {
  const { activeUsers, onlineUsers } = useApp();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerText}>
          <h3 style={styles.title}>All Staff Members</h3>
          <p style={styles.subtitle}>View online status and roles of all active staff.</p>
        </div>
        <div style={styles.statsBadge}>
          <Users size={16} />
          <span>{activeUsers.length} Total Staff</span>
        </div>
      </div>

      <div style={styles.grid}>
        {activeUsers.map(user => {
          const isOnline = onlineUsers[user.email.replace(/\./g, ',')];
          
          return (
            <div key={user.email} style={styles.card} className="glass-panel interactive-card">
              <div style={styles.profileSection}>
                <div style={styles.avatarContainer}>
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.robloxUsername} 
                      style={styles.avatar} 
                    />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      <User size={24} color="#9ca3af" />
                    </div>
                  )}
                  {isOnline && <div style={styles.onlineDot} title="Online"></div>}
                </div>
                
                <div style={styles.userInfo}>
                  <strong style={styles.name}>{user.firstName} {user.lastName}</strong>
                  <span style={styles.username}>@{user.robloxUsername}</span>
                </div>
              </div>
              
              <div style={styles.roleSection}>
                {user.isAdmin && <span className="badge badge-admin" style={{ marginRight: '8px' }}>Admin</span>}
                {user.customRole ? (
                  <span style={styles.customRole}>{user.customRole}</span>
                ) : (
                  <span style={styles.defaultRole}>Staff</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '16px',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#9ca3af',
  },
  statsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(37, 99, 235, 0.1)',
    border: '1px solid rgba(37, 99, 235, 0.2)',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#93c5fd',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarContainer: {
    position: 'relative',
    width: '48px',
    height: '48px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255,255,255,0.1)',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '14px',
    height: '14px',
    background: '#10b981',
    border: '2px solid var(--color-bg-deep)',
    borderRadius: '50%',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  name: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: 'var(--color-text-main)',
  },
  username: {
    fontSize: '0.85rem',
    color: '#9ca3af',
  },
  roleSection: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.2)',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  customRole: {
    fontSize: '0.85rem',
    color: '#c4b5fd',
    fontWeight: '500',
  },
  defaultRole: {
    fontSize: '0.85rem',
    color: '#9ca3af',
  }
};
