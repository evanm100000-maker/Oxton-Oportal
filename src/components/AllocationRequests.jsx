import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plane, Calendar, Clock, MapPin, ExternalLink, Users, UserPlus, UserMinus, Trash2 } from 'lucide-react';

const escapeEmail = (email) => email ? email.replace(/\./g, ',') : '';
const unescapeEmail = (email) => email ? email.replace(/,/g, '.') : '';

export default function AllocationRequests() {
  const { 
    flights, 
    currentUser, 
    setAllocationStatus, 
    allocateStaffDirectly, 
    deallocateStaffDirectly,
    removeFlight,
    users,
    activeUsers
  } = useApp();

  const [directAssignEmail, setDirectAssignEmail] = useState({});
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const getMyStatus = (flight, email) => {
    const safeEmail = escapeEmail(email);
    if (flight.staffStatus) {
      if (flight.staffStatus[safeEmail]) return flight.staffStatus[safeEmail];
      if (flight.staffStatus[email]) return flight.staffStatus[email];
    }
    if ((flight.allocatedStaff || []).includes(email)) return 'Attending';
    return 'Undecided';
  };

  const getStaffList = (flight, targetStatus) => {
    let list = [];
    if (targetStatus === 'Attending') {
      (flight.allocatedStaff || []).forEach(e => {
        if (!list.includes(e)) {
          const safeEmail = escapeEmail(e);
          const status = flight.staffStatus 
            ? (flight.staffStatus[safeEmail] || flight.staffStatus[e]) 
            : null;
          if (status === 'Attending' || !status) {
            list.push(e);
          }
        }
      });
    }
    if (flight.staffStatus) {
      Object.keys(flight.staffStatus).forEach(k => {
        const email = unescapeEmail(k);
        const status = flight.staffStatus[k];
        if (status === targetStatus && !list.includes(email)) {
          list.push(email);
        }
      });
    }
    return list;
  };

  const getStaffNameByEmail = (email) => {
    const user = users.find(u => u.email === email);
    if (!user) return email;
    const rolePart = user.customRole ? ` (${user.customRole})` : '';
    return `${user.firstName} ${user.lastName} (@${user.robloxUsername})${rolePart}`;
  };

  const handleDirectAssign = (flightId) => {
    const email = directAssignEmail[flightId];
    if (!email) return;
    allocateStaffDirectly(flightId, email);
    setDirectAssignEmail(prev => ({ ...prev, [flightId]: '' }));
  };

  const eligibleStaff = activeUsers;

  return (
    <div style={styles.container}>
      <div style={styles.introHeader}>
        <p style={styles.introText}>
          Review scheduled flights, request crew allocation, or launch server instances.
        </p>
      </div>

      {flights.length === 0 ? (
        <div style={styles.emptyState}>
          <Plane size={48} color="rgba(255,255,255,0.15)" />
          <p style={styles.emptyText}>No flights currently scheduled.</p>
        </div>
      ) : (
        <div style={styles.flightGrid}>
          {flights.map((flight) => {
            const myStatus = getMyStatus(flight, currentUser.email);
            const currentSelected = selectedStatuses[flight.id] !== undefined
              ? selectedStatuses[flight.id]
              : myStatus;
            const hasChanged = currentSelected !== myStatus;
            return (
              <div key={flight.id} style={styles.flightCard} className="glass-panel">
                <div style={styles.flightHeader}>
                  <div style={styles.badgeContainer}>
                    <span style={styles.flightCode}>{flight.flightCode}</span>
                    <span style={styles.locationBadge}>
                      <MapPin size={12} /> {flight.location}
                    </span>
                  </div>
                  {currentUser.isAdmin && (
                    <button
                      type="button"
                      onClick={() => removeFlight(flight.id)}
                      className="btn-danger"
                      style={styles.deleteBtn}
                      title="Cancel Flight"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div style={styles.detailsSection}>
                  <div style={styles.detailRow}>
                    <Calendar size={16} color="#3b82f6" />
                    <span>{flight.date}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <Clock size={16} color="#3b82f6" />
                    <span>{flight.time} UTC</span>
                  </div>
                </div>

                <div style={styles.crewSection}>
                  <div style={styles.crewHeader}>
                    <Users size={16} color="#06b6d4" />
                    <span style={styles.crewTitle}>Crew Allocation</span>
                  </div>
                  
                  {(() => {
                    const attending = getStaffList(flight, 'Attending').filter(email => activeUsers.some(user => user.email === email));
                    const absent = getStaffList(flight, 'Absent').filter(email => activeUsers.some(user => user.email === email));

                    if (attending.length === 0 && absent.length === 0) {
                      return <p style={styles.emptyCrewText}>No crew responses yet.</p>;
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {attending.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                              Attending ({attending.length})
                            </div>
                            <div style={styles.crewList}>
                              {attending.map((email) => (
                                <div key={`att-${email}`} style={styles.crewBadge}>
                                  <span style={styles.crewBadgeText}>{getStaffNameByEmail(email)}</span>
                                  {currentUser.isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => deallocateStaffDirectly(flight.id, email)}
                                      style={styles.removeCrewBtn}
                                      title="Deallocate Staff"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {absent.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span>
                              Absent ({absent.length})
                            </div>
                            <div style={styles.crewList}>
                              {absent.map((email) => (
                                <div key={`abs-${email}`} style={{...styles.crewBadge, background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)'}}>
                                  <span style={{...styles.crewBadgeText, color: '#fca5a5'}}>{getStaffNameByEmail(email)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div style={styles.actionContainer}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1.3 }}>
                    <div style={styles.statusButtonsContainer}>
                      <button
                        type="button"
                        onClick={() => setSelectedStatuses(prev => ({ ...prev, [flight.id]: 'Attending' }))}
                        style={{
                          ...styles.statusBtn,
                          background: currentSelected === 'Attending' ? '#10b981' : 'rgba(255,255,255,0.05)',
                          color: currentSelected === 'Attending' ? '#fff' : '#e5e7eb',
                          border: currentSelected === 'Attending' ? '1px solid #059669' : '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        Attending
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedStatuses(prev => ({ ...prev, [flight.id]: 'Undecided' }))}
                        style={{
                          ...styles.statusBtn,
                          background: currentSelected === 'Undecided' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                          color: currentSelected === 'Undecided' ? '#fff' : '#e5e7eb',
                          border: currentSelected === 'Undecided' ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        Not yet decided
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedStatuses(prev => ({ ...prev, [flight.id]: 'Absent' }))}
                        style={{
                          ...styles.statusBtn,
                          background: currentSelected === 'Absent' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                          color: currentSelected === 'Absent' ? '#fff' : '#e5e7eb',
                          border: currentSelected === 'Absent' ? '1px solid #dc2626' : '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        Absent
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={!hasChanged}
                      onClick={() => {
                        setAllocationStatus(flight.id, currentUser.email, currentSelected);
                        setSelectedStatuses(prev => {
                          const updated = { ...prev };
                          delete updated[flight.id];
                          return updated;
                        });
                      }}
                      style={{
                        ...styles.acceptBtn,
                        opacity: hasChanged ? 1 : 0.5,
                        cursor: hasChanged ? 'pointer' : 'not-allowed',
                        background: hasChanged ? '#10b981' : 'rgba(255,255,255,0.03)',
                        color: hasChanged ? '#fff' : '#9ca3af',
                        border: hasChanged ? '1px solid #059669' : '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      Accept Selection
                    </button>
                  </div>

                  <a
                    href={flight.serverLink}
                    rel="noreferrer"
                    style={styles.linkBtn}
                    className="btn-secondary"
                  >
                    <span>Launch Server</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                {currentUser.isAdmin && (
                  <div style={styles.adminAssignPanel}>
                    <label style={styles.adminLabel}>Directly Assign Staff:</label>
                    <div style={styles.assignRow}>
                      <select
                        value={directAssignEmail[flight.id] || ''}
                        onChange={(e) => setDirectAssignEmail(prev => ({ ...prev, [flight.id]: e.target.value }))}
                        className="input-field"
                        style={styles.assignSelect}
                      >
                        <option value="">Select Staff...</option>
                        {eligibleStaff.map(staff => (
                          <option key={staff.email} value={staff.email}>
                            {staff.firstName} {staff.lastName} (@{staff.robloxUsername})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDirectAssign(flight.id)}
                        className="btn-success"
                        style={styles.assignBtn}
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  introHeader: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '16px',
  },
  introText: {
    color: '#9ca3af',
    fontSize: '0.95rem',
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
  flightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '24px',
  },
  flightCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  flightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  flightCode: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    letterSpacing: '0.5px',
  },
  locationBadge: {
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    color: '#d1d5db',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  deleteBtn: {
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  detailsSection: {
    display: 'flex',
    gap: '16px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#e5e7eb',
  },
  crewSection: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  crewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  crewTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#e5e7eb',
  },
  emptyCrewText: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  crewList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  crewBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(37, 99, 235, 0.1)',
    border: '1px solid rgba(37, 99, 235, 0.2)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  crewBadgeText: {
    fontSize: '0.8rem',
    color: '#93c5fd',
  },
  removeCrewBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  actionContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
    alignItems: 'flex-end',
  },
  statusButtonsContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  statusBtn: {
    flex: '1 1 calc(33.333% - 6px)',
    padding: '10px 8px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  acceptBtn: {
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textAlign: 'center',
    transition: 'all 0.2s',
    width: '100%',
  },
  linkBtn: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textDecoration: 'none',
    cursor: 'pointer',
    height: '42px',
  },
  adminAssignPanel: {
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  adminLabel: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    fontWeight: '500',
  },
  assignRow: {
    display: 'flex',
    gap: '8px',
  },
  assignSelect: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '0.85rem',
  },
  assignBtn: {
    padding: '0 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};
