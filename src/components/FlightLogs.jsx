import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, PlusCircle, History, User, Users, Clipboard, Info, Calendar } from 'lucide-react';

export default function FlightLogs() {
  const { flightLogs, submitFlightLog, flights, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('submit');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [flightCode, setFlightCode] = useState('');
  const [customFlightCode, setCustomFlightCode] = useState('');
  const [pilot, setPilot] = useState(currentUser.robloxUsername || '');
  const [coPilot, setCoPilot] = useState('');
  const [passengers, setPassengers] = useState('');
  const [status, setStatus] = useState('Completed');
  const [notes, setNotes] = useState('');
  const [photoProof, setPhotoProof] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFlightCode = flightCode === 'Custom' ? customFlightCode.trim() : flightCode;
    if (!finalFlightCode || !pilot.trim() || !photoProof.trim()) return;

    submitFlightLog({
      flightCode: finalFlightCode,
      pilot: pilot.trim(),
      coPilot,
      passengers,
      status,
      notes,
      photoProof: photoProof.trim()
    });

    // Reset Form
    setFlightCode('');
    setCustomFlightCode('');
    setCoPilot('');
    setPassengers('');
    setStatus('Completed');
    setNotes('');
    setPhotoProof('');
    setSuccessMsg('Flight log submitted successfully!');
    setActiveTab('history');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const formatDate = (isoStr) => {
    return new Date(isoStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabHeader}>
        <button
          onClick={() => setActiveTab('submit')}
          className="btn-secondary"
          style={{
            ...styles.tabBtn,
            background: activeTab === 'submit' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
            borderColor: activeTab === 'submit' ? '#2563eb' : 'transparent',
            color: activeTab === 'submit' ? 'var(--color-text-main)' : '#9ca3af',
          }}
        >
          <PlusCircle size={16} />
          Submit Flight Log
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className="btn-secondary"
          style={{
            ...styles.tabBtn,
            background: activeTab === 'history' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
            borderColor: activeTab === 'history' ? '#2563eb' : 'transparent',
            color: activeTab === 'history' ? 'var(--color-text-main)' : '#9ca3af',
          }}
        >
          <History size={16} />
          Log History ({flightLogs.length})
        </button>
      </div>

      {successMsg && (
        <div style={styles.successAlert}>
          <span>{successMsg}</span>
        </div>
      )}

      {activeTab === 'submit' ? (
        <form onSubmit={handleSubmit} style={styles.form} className="glass-panel">
          <h3 style={styles.sectionTitle}>New Flight Operations Log</h3>
          
          <div style={styles.row}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Flight Code *</label>
              <select
                required
                value={flightCode}
                onChange={(e) => setFlightCode(e.target.value)}
                className="input-field"
              >
                <option value="">Select Flight Code...</option>
                {flights.map(f => (
                  <option key={f.id} value={f.flightCode}>{f.flightCode} ({f.location})</option>
                ))}
                <option value="Custom">Other / Unscheduled Flight</option>
              </select>
            </div>

            {flightCode === 'Custom' && (
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Specify Flight Code *</label>
                <input
                  type="text"
                  required
                  value={customFlightCode}
                  placeholder="e.g. OX-990"
                  className="input-field"
                  onChange={(e) => setCustomFlightCode(e.target.value)}
                />
              </div>
            )}

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Flight Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
              >
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
                <option value="Diverted">Diverted</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Pilot Roblox Username *</label>
              <div style={styles.iconInput}>
                <User size={16} style={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={pilot}
                  onChange={(e) => setPilot(e.target.value)}
                  placeholder="e.g. PilotOxton"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Co-Pilot Username (Optional)</label>
              <div style={styles.iconInput}>
                <User size={16} style={styles.inputIcon} />
                <input
                  type="text"
                  value={coPilot}
                  onChange={(e) => setCoPilot(e.target.value)}
                  placeholder="e.g. CoPilotOxton"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Total Passengers *</label>
              <div style={styles.iconInput}>
                <Users size={16} style={styles.inputIcon} />
                <input
                  type="number"
                  required
                  min="0"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  placeholder="e.g. 15"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Photo Proof (Image URL) *</label>
            <input
              type="url"
              required
              value={photoProof}
              onChange={(e) => setPhotoProof(e.target.value)}
              placeholder="e.g. https://imgur.com/your-image.png"
              className="input-field"
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Comment (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide a summary of the flight. List any delays, technical issues, passenger disturbances, or general comments..."
              className="input-field"
              style={styles.textarea}
              rows={4}
            />
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn}>
            <ClipboardList size={18} />
            <span>Submit Flight Log Entry</span>
          </button>
        </form>
      ) : (
        <div style={styles.historyContainer}>
          {flightLogs.length === 0 ? (
            <div style={styles.emptyState}>
              <Clipboard size={48} color="rgba(255,255,255,0.15)" />
              <p style={styles.emptyText}>No flight logs recorded in history.</p>
            </div>
          ) : (
            <div style={styles.logsList}>
              {flightLogs.map((log) => (
                <div key={log.id} style={styles.logCard} className="glass-panel">
                  <div style={styles.logHeader}>
                    <div>
                      <span style={styles.logCode}>{log.flightCode}</span>
                      <span
                        className="badge"
                        style={{
                          marginLeft: '10px',
                          background: log.status === 'Completed' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: log.status === 'Completed' ? '#10b981' : '#ef4444',
                          border: log.status === 'Completed' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)'
                        }}
                      >
                        {log.status}
                      </span>
                    </div>
                    <span style={styles.logTime}>
                      <Calendar size={12} style={{ marginRight: '4px' }} />
                      {formatDate(log.timestamp)}
                    </span>
                  </div>

                  <div style={styles.logRolesGrid}>
                    <div style={styles.roleBox}>
                      <span style={styles.roleLabel}>PILOT</span>
                      <span style={styles.roleValue}>{log.pilot}</span>
                    </div>
                    {log.coPilot && (
                      <div style={styles.roleBox}>
                        <span style={styles.roleLabel}>CO-PILOT</span>
                        <span style={styles.roleValue}>{log.coPilot}</span>
                      </div>
                    )}
                    <div style={styles.roleBox}>
                      <span style={styles.roleLabel}>PASSENGERS</span>
                      <span style={styles.roleValue}>{log.passengers}</span>
                    </div>
                  </div>

                  {log.photoProof && (
                    <div style={styles.logRolesGrid}>
                      <div style={styles.roleBox}>
                        <span style={styles.roleLabel}>PHOTO PROOF</span>
                        <a href={log.photoProof} rel="noreferrer" style={{...styles.roleValue, color: '#3b82f6', textDecoration: 'underline', wordBreak: 'break-all'}}>
                          View Evidence Link
                        </a>
                      </div>
                    </div>
                  )}

                  {log.notes && (
                    <div style={styles.logNotes}>
                      <Info size={14} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <p style={styles.notesText}>{log.notes}</p>
                    </div>
                  )}

                  <div style={styles.logFooter}>
                    <span style={styles.submitterLabel}>
                      Logged by: <strong>{log.submitterName}</strong> ({log.submitterEmail})
                    </span>
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
    transition: 'all 0.2s ease',
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
    marginBottom: '8px',
  },
  row: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  inputWrapper: {
    flex: 1,
    minWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#d1d5db',
  },
  iconInput: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'rgba(255,255,255,0.3)',
  },
  textarea: {
    resize: 'vertical',
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
  successAlert: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '0.9rem',
    color: '#a7f3d0',
  },
  historyContainer: {
    display: 'flex',
    flexDirection: 'column',
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
  logsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  logCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px',
  },
  logCode: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
  },
  logTime: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
  },
  logRolesGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  roleBox: {
    flex: 1,
    minWidth: '140px',
    background: 'rgba(0,0,0,0.15)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  roleLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#3b82f6',
    letterSpacing: '0.5px',
  },
  roleValue: {
    fontSize: '0.95rem',
    color: '#f3f4f6',
    fontWeight: '500',
  },
  logNotes: {
    background: 'rgba(37, 99, 235, 0.05)',
    border: '1px solid rgba(37, 99, 235, 0.1)',
    borderRadius: '8px',
    padding: '14px 16px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  notesText: {
    fontSize: '0.85rem',
    color: '#d1d5db',
    lineHeight: '1.45',
  },
  logFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  submitterLabel: {
    fontWeight: '400',
  },
};
