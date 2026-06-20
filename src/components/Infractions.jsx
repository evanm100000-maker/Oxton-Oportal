import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, History, Lock, Trash2, ShieldCheck } from 'lucide-react';

export default function Infractions() {
  const { infractions, deleteInfraction, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState(currentUser.isAdmin ? 'all' : 'my');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this infraction?')) {
      deleteInfraction(id);
    }
  };

  // Filter infractions based on role
  const myInfractions = infractions.filter(inf => inf.staffEmail === currentUser.email);

  return (
    <div style={styles.container}>
      {currentUser.isAdmin && (
        <div style={styles.tabHeader}>
          <button
            onClick={() => setActiveTab('all')}
            className="btn-secondary"
            style={{
              ...styles.tabBtn,
              background: activeTab === 'all' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
              borderColor: activeTab === 'all' ? '#2563eb' : 'transparent',
              color: activeTab === 'all' ? 'var(--color-text-main)' : '#9ca3af',
            }}
          >
            <History size={16} />
            All Staff Infractions ({infractions.length})
          </button>
        </div>
      )}

      {/* Staff View: My Infractions */}
      {(!currentUser.isAdmin || activeTab === 'my') && (
        <div style={styles.listContainer}>
          <div style={styles.sectionNotice} className="glass-panel">
            <ShieldCheck size={18} color="#10b981" />
            <p style={styles.noticeText}>
              Below is your official file record. Infractions are logged by administrators and reviewable during evaluation.
            </p>
          </div>

          {myInfractions.length === 0 ? (
            <div style={styles.emptyState}>
              <ShieldCheck size={48} color="rgba(16, 185, 129, 0.15)" />
              <p style={{ ...styles.emptyText, color: '#10b981' }}>Your record is clean! No infractions logged.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {myInfractions.map(inf => (
                <div key={inf.id} style={styles.infractionCard} className="glass-panel">
                  <div style={styles.cardHeader}>
                    <div style={styles.typeBadgeContainer}>
                      <span style={styles.infractionType}>{inf.type}</span>
                    </div>
                    <span style={styles.infDate}>{inf.date}</span>
                  </div>
                  <div style={styles.messageBox}>
                    <h5 style={styles.boxLabel}>Log Details:</h5>
                    <p style={styles.messageText}>{inf.mainMessage}</p>
                  </div>
                  <div style={styles.cardFooter}>
                    <span>Logged by Administrator: <strong>{inf.adminName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin View: All Infractions */}
      {currentUser.isAdmin && activeTab === 'all' && (
        <div style={styles.listContainer}>
          {infractions.length === 0 ? (
            <div style={styles.emptyState}>
              <ShieldAlert size={48} color="rgba(255,255,255,0.15)" />
              <p style={styles.emptyText}>No infractions logged in the system.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {infractions.map(inf => (
                <div key={inf.id} style={styles.infractionCard} className="glass-panel">
                  <div style={styles.cardHeader}>
                    <div style={styles.typeBadgeContainer}>
                      <span style={styles.targetStaff}>{inf.staffName}</span>
                      <span style={styles.staffMail}>({inf.staffEmail})</span>
                      <span style={{
                        ...styles.infractionType,
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        marginLeft: '12px'
                      }}>
                        {inf.type}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={styles.infDate}>{inf.date}</span>
                      <button
                        onClick={() => handleDelete(inf.id)}
                        className="btn-danger"
                        style={styles.deleteBtn}
                        title="Remove Infraction"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={styles.messageBox}>
                    <h5 style={styles.boxLabel}>Public Record Message:</h5>
                    <p style={styles.messageText}>{inf.mainMessage}</p>
                  </div>

                  {/* Confidential message visible only to admins */}
                  {inf.confidentialMessage && (
                    <div style={styles.confidentialBox}>
                      <div style={styles.confHeader}>
                        <Lock size={12} color="#06b6d4" />
                        <h5 style={{ ...styles.boxLabel, color: '#06b6d4', margin: 0 }}>Confidential Note (Admin Only):</h5>
                      </div>
                      <p style={styles.confidentialText}>{inf.confidentialMessage}</p>
                    </div>
                  )}

                  <div style={styles.cardFooter}>
                    <span>Logged by Admin: <strong>{inf.adminName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  tabHeader: {
    display: 'flex',
    gap: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '12px',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  successAlert: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '0.9rem',
    color: '#a7f3d0',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  noticeText: {
    fontSize: '0.875rem',
    color: '#a7f3d0',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px 0',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: '1rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infractionCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '12px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  typeBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  targetStaff: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
  },
  staffMail: {
    fontSize: '0.85rem',
    color: '#9ca3af',
  },
  infractionType: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '3px 10px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infDate: {
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  deleteBtn: {
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  messageBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  boxLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  messageText: {
    fontSize: '0.9rem',
    color: '#d1d5db',
    lineHeight: '1.45',
  },
  confidentialBox: {
    background: 'rgba(6, 182, 212, 0.05)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderLeftWidth: '4px',
    borderRadius: '4px 8px 8px 4px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  confHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  confidentialText: {
    fontSize: '0.875rem',
    color: '#c5f2f7',
    fontStyle: 'italic',
    lineHeight: '1.4',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '0.75rem',
    color: '#9ca3af',
    borderTop: '1px solid rgba(255,255,255,0.03)',
    paddingTop: '12px',
  },
  form: {
    padding: '32px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    marginTop: '-12px',
    marginBottom: '8px',
  },
  row: {
    display: 'flex',
    gap: '20px',
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#d1d5db',
  },
  textarea: {
    resize: 'vertical',
  },
  textareaConf: {
    resize: 'vertical',
    borderStyle: 'dashed',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    background: 'rgba(6, 182, 212, 0.02)',
  },
  submitBtn: {
    padding: '12px 20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginTop: '10px',
  },
};
