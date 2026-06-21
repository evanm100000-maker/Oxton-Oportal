import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserCheck, Users, Plane, Calendar, 
  Plus, Check, X, ShieldAlert, Trash2, Settings, Activity, Key, Award, FileText
} from 'lucide-react';

export default function AdminPanel() {
  const { 
    users, 
    currentUser, 
    superAdminEmail, 
    approveUser, 
    rejectUser, 
    removeUser,
    addPoints,
    promoteToAdmin, 
    demoteFromAdmin,
    setCustomRole,
    suspendUser,
    unsuspendUser,
    infractions,
    addInfraction,
    deleteInfraction,
    addFlight, 
    flightLogs,
    approveFlightLog,
    rejectFlightLog,
    loaRequests, 
    updateLoaStatus,
    warningConfig,
    maintenanceConfig,
    setWarning,
    setMaintenance,
    auditLogs,
    passwordResets,
    approvePasswordReset,
    rejectPasswordReset
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('approvals');
  const [successMsg, setSuccessMsg] = useState('');

  // Flight Creator states
  const [flightCode, setFlightCode] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [serverLink, setServerLink] = useState('');

  // LOA Review comments
  const [loaComments, setLoaComments] = useState({});

  // Points state
  const [pointsAmounts, setPointsAmounts] = useState({});
  const [pointsReasons, setPointsReasons] = useState({});

  // Roles state
  const [roleInputs, setRoleInputs] = useState({});

  // Suspensions state
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [suspendModalHours, setSuspendModalHours] = useState('');
  const [suspendModalReason, setSuspendModalReason] = useState('');
  
  // Infractions state
  const [showInfractionModal, setShowInfractionModal] = useState(false);
  const [infStaffEmail, setInfStaffEmail] = useState('');
  const [infType, setInfType] = useState('Warning');
  const [infMainMessage, setInfMainMessage] = useState('');
  const [infConfidentialMessage, setInfConfidentialMessage] = useState('');
  const [expandedInfractions, setExpandedInfractions] = useState({});

  // Password reset state
  const [newPasswords, setNewPasswords] = useState({});

  // System Status state
  const [warnActive, setWarnActive] = useState(warningConfig?.isActive || false);
  const [warnTitle, setWarnTitle] = useState(warningConfig?.title || '');
  const [warnMessage, setWarnMessage] = useState(warningConfig?.message || '');
  const [warnType, setWarnType] = useState(warningConfig?.type || 'warning');
  const [warnCountdownEnabled, setWarnCountdownEnabled] = useState(warningConfig?.countdownEnabled || false);
  const [warnCountdownTarget, setWarnCountdownTarget] = useState(warningConfig?.countdownTarget || '');

  const [maintActive, setMaintActive] = useState(maintenanceConfig?.isActive || false);
  const [maintMessage, setMaintMessage] = useState(maintenanceConfig?.message || '');

  // Audit modal state
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);

  const displaySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateFlight = (e) => {
    e.preventDefault();
    if (!flightCode || !date || !time || !location || !serverLink) return;
    addFlight({ flightCode, date, time, location, serverLink });
    setFlightCode(''); setDate(''); setTime(''); setLocation(''); setServerLink('');
    displaySuccess(`Flight ${flightCode} successfully scheduled!`);
  };

  const handleLoaAction = (loaId, status) => {
    const comment = loaComments[loaId] || '';
    updateLoaStatus(loaId, status, comment);
    setLoaComments(prev => ({ ...prev, [loaId]: '' }));
    displaySuccess(`LOA request status updated to ${status}.`);
  };

  const handleAddPoints = (email) => {
    const amount = parseInt(pointsAmounts[email], 10);
    const reason = pointsReasons[email] || 'Manual admin addition';
    if (!amount) return;
    addPoints(email, amount, reason);
    setPointsAmounts(prev => ({...prev, [email]: ''}));
    setPointsReasons(prev => ({...prev, [email]: ''}));
    displaySuccess(`Added ${amount} points to ${email}.`);
  };

  const handleSetRole = (email) => {
    const role = roleInputs[email];
    if (role === undefined) return;
    setCustomRole(email, role);
    displaySuccess(`Role updated to ${role}`);
  };

  const handleSuspend = (e) => {
    e.preventDefault();
    const hours = parseFloat(suspendModalHours);
    if (!hours || hours <= 0 || !suspendModalReason.trim()) return alert('Please enter valid hours and a reason.');
    suspendUser(suspendModalUser.email, hours, suspendModalReason);
    setSuspendModalUser(null);
    setSuspendModalHours('');
    setSuspendModalReason('');
    displaySuccess(`User suspended for ${hours} hours.`);
  };

  const handleAddInfraction = (e) => {
    e.preventDefault();
    if (!infStaffEmail || !infMainMessage.trim()) return;

    const wasLogged = addInfraction({
      staffEmail: infStaffEmail,
      type: infType,
      mainMessage: infMainMessage,
      confidentialMessage: infConfidentialMessage
    });

    if (!wasLogged) {
      alert('The infraction could not be logged. Please check the staff member and message.');
      return;
    }

    setInfStaffEmail('');
    setInfType('Warning');
    setInfMainMessage('');
    setInfConfidentialMessage('');
    setShowInfractionModal(false);
    displaySuccess('Consequence successfully logged against staff member.');
  };

  const handleSaveSystemStatus = (e) => {
    e.preventDefault();
    setWarning(warnActive, warnTitle, warnMessage, warnType, warnCountdownEnabled, warnCountdownTarget);
    setMaintenance(maintActive, maintMessage);
    displaySuccess('System status configuration updated!');
  };

  const handleApprovePassword = (reqId, email) => {
    const pwd = newPasswords[reqId];
    if (!pwd) return alert('Please enter a new password to approve this request.');
    approvePasswordReset(reqId, email, pwd);
    setNewPasswords(prev => ({...prev, [reqId]: ''}));
    displaySuccess(`Password reset approved for ${email}.`);
  };

  // Derived lists
  const pendingUsers = users.filter(u => !u.approved);
  const approvedUsers = users.filter(u => u.approved);
  const pendingLoas = loaRequests.filter(req => req.status === 'Pending');
  const activeLoas = loaRequests.filter(req => req.status === 'Approved' || req.status === 'End Requested');
  const pendingFlightLogs = flightLogs.filter(log => log.status === 'Pending');
  const pendingPasswords = passwordResets.filter(r => r.status === 'Pending');

  const groupedInfractions = Object.values(infractions.reduce((acc, inf) => {
    if (!acc[inf.staffEmail]) acc[inf.staffEmail] = { name: inf.staffName, email: inf.staffEmail, items: [], suspensions: 0, regular: 0 };
    acc[inf.staffEmail].items.push(inf);
    if (inf.type === 'Suspension') acc[inf.staffEmail].suspensions++;
    else acc[inf.staffEmail].regular++;
    return acc;
  }, {}));

  const isSuperAdmin = currentUser.email === superAdminEmail;


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('section-', '');
          setActiveSubTab(id);
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    ['approvals', 'roles', 'staff', 'infractions', 'flights', 'flight_logs', 'loas', 'passwords', 'status', 'audit'].forEach(tab => {
      const el = document.getElementById('section-' + tab);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="admin-layout" style={styles.layoutContainer}>
      {/* Sub tabs navigation */}
      <div className="admin-sidebar" style={styles.sidebar}>
        <button type="button" onClick={() => setActiveSubTab('approvals')} style={getTabStyle(activeSubTab === 'approvals')}>
          <UserCheck size={16} /> Approvals ({pendingUsers.length})
        </button>
        <button type="button" onClick={() => setActiveSubTab('roles')} style={getTabStyle(activeSubTab === 'roles')}>
          <Users size={16} /> Roles
        </button>
        <button type="button" onClick={() => setActiveSubTab('staff')} style={getTabStyle(activeSubTab === 'staff')}>
          <UserCheck size={16} /> Staff Actions
        </button>
        <button type="button" onClick={() => setActiveSubTab('infractions')} style={getTabStyle(activeSubTab === 'infractions')}>
          <ShieldAlert size={16} /> Consequences ({infractions.length})
        </button>
        <button type="button" onClick={() => setActiveSubTab('flights')} style={getTabStyle(activeSubTab === 'flights')}>
          <Plane size={16} /> Schedule
        </button>
        <button type="button" onClick={() => setActiveSubTab('flight_logs')} style={getTabStyle(activeSubTab === 'flight_logs')}>
          <FileText size={16} /> Flight Logs ({pendingFlightLogs.length})
        </button>
        <button type="button" onClick={() => setActiveSubTab('loas')} style={getTabStyle(activeSubTab === 'loas')}>
          <Calendar size={16} /> LOAs ({pendingLoas.length})
        </button>
        <button type="button" onClick={() => setActiveSubTab('passwords')} style={getTabStyle(activeSubTab === 'passwords')}>
          <Key size={16} /> Passwords ({pendingPasswords.length})
        </button>
        <button type="button" onClick={() => setActiveSubTab('status')} style={getTabStyle(activeSubTab === 'status')}>
          <Settings size={16} /> System Status
        </button>
        <button type="button" onClick={() => setActiveSubTab('audit')} style={getTabStyle(activeSubTab === 'audit')}>
          <Activity size={16} /> Audit Log
        </button>
      </div>

      <div style={styles.mainContent}>
      {successMsg && (
        <div style={styles.successAlert}><span>{successMsg}</span></div>
      )}

      {/* Sub Tab: Approvals */}
      {activeSubTab === 'approvals' && (
<div id="section-approvals">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>Pending User Registrations</h3>
          {pendingUsers.length === 0 ? (
            <div style={styles.emptyGrid}><UserCheck size={36} color="rgba(255,255,255,0.15)" /><p style={styles.emptyText}>No pending user accounts.</p></div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map(user => (
                    <tr key={user.email} style={styles.trBody}>
                      <td style={styles.td}><strong>{user.firstName} {user.lastName}</strong><br/>@{user.robloxUsername}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button type="button" onClick={() => {approveUser(user.email); displaySuccess('User approved!');}} className="btn-success" style={styles.actionMiniBtn}><Check size={14} /> Approve</button>
                          <button type="button" onClick={() => {rejectUser(user.email); displaySuccess('User rejected.');}} className="btn-danger" style={styles.actionMiniBtn}><X size={14} /> Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      )}
      {/* Sub Tab: Infractions */}
      {activeSubTab === 'infractions' && (
<div id="section-infractions">
        <div style={styles.panelSection}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={styles.panelTitle}>Staff Consequences</h3>
            <button type="button" className="btn-danger" onClick={() => setShowInfractionModal(true)} style={{padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <ShieldAlert size={16} /> Log New Consequence
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {groupedInfractions.length === 0 ? (
              <p style={{padding: '20px', color: '#9ca3af', textAlign: 'center'}}>No consequences logged.</p>
            ) : (
              groupedInfractions.map(group => (
                <div key={group.email} className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <div 
                    style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}
                    onClick={() => setExpandedInfractions(prev => ({ ...prev, [group.email]: !prev[group.email] }))}
                  >
                    <div>
                      <h4 style={{ color: 'var(--color-text-main)', margin: 0 }}>{group.name}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{group.email}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ color: '#f87171', fontSize: '0.9rem' }}>{group.regular} Infractions</span>
                      <span style={{ color: '#fb923c', fontSize: '0.9rem' }}>{group.suspensions} Suspensions</span>
                    </div>
                  </div>
                  
                  {expandedInfractions[group.email] && (
                    <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                          <thead>
                            <tr style={styles.trHead}>
                              <th style={styles.th}>Type</th>
                              <th style={styles.th}>Message & Appeal</th>
                              <th style={styles.th}>Logged By</th>
                              <th style={styles.th}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.items.map(inf => (
                              <tr key={inf.id} style={styles.trBody}>
                                <td style={styles.td}><span style={styles.infractionBadge}>{inf.type}</span></td>
                                <td style={styles.td}>
                                  <div style={{ marginBottom: '8px' }}>{inf.mainMessage}</div>
                                  {inf.appeal && (
                                    <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderLeft: '3px solid #3b82f6', borderRadius: '4px', marginBottom: '8px' }}>
                                      <span style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 'bold' }}>STAFF APPEAL:</span>
                                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#bfdbfe' }}>{inf.appeal.text}</p>
                                    </div>
                                  )}
                                  {inf.confidentialMessage && <div style={styles.confidentialNote}>Admin note: {inf.confidentialMessage}</div>}
                                </td>
                                <td style={styles.td}>{inf.adminName}<br />{inf.date}</td>
                                <td style={styles.td}>
                                  <button type="button" onClick={() => deleteInfraction(inf.id)} className="btn-danger" style={styles.actionMiniBtn}>
                                    <Trash2 size={14} /> Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      )}
      {/* Sub Tab: Roles */}
      {activeSubTab === 'roles' && (
<div id="section-roles">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>Staff Role Management</h3>
          {!isSuperAdmin && (
            <div style={styles.securityAlert}><ShieldAlert size={18} /><span>RESTRICTED ACTION: Only the primary super admin can modify account roles.</span></div>
          )}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>Staff Member</th>
                  <th style={styles.th}>Permissions</th>
                  <th style={styles.th}>Custom Role Name</th>
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map(user => {
                  const isUserSuperAdmin = user.email === superAdminEmail;
                  return (
                    <tr key={user.email} style={styles.trBody}>
                      <td style={styles.td}><strong>{user.firstName} {user.lastName}</strong><br/>{user.email}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {user.isAdmin ? <span className="badge badge-admin">Admin</span> : <span className="badge">Staff</span>}
                          {!isUserSuperAdmin && (user.isAdmin ? (
                            <button type="button" disabled={!isSuperAdmin} onClick={() => {demoteFromAdmin(user.email); displaySuccess('Role updated');}} className="btn-danger" style={styles.roleBtn}>Demote</button>
                          ) : (
                            <button type="button" disabled={!isSuperAdmin} onClick={() => {promoteToAdmin(user.email); displaySuccess('Role updated');}} className="btn-success" style={styles.roleBtn}>Promote</button>
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <input type="text" placeholder={user.customRole || "e.g. Owner"} value={roleInputs[user.email] !== undefined ? roleInputs[user.email] : user.customRole} onChange={e => setRoleInputs({...roleInputs, [user.email]: e.target.value})} className="input-field" style={{width: '150px', padding: '6px'}} />
                          <button type="button" onClick={() => handleSetRole(user.email)} className="btn-primary" style={{padding: '6px 10px', borderRadius: '6px'}}>Save</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      )}
      {/* Sub Tab: Staff Actions (Remove, Points) */}
      {activeSubTab === 'staff' && (
<div id="section-staff">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>Staff Management & Points</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>Staff Member</th>
                  <th style={styles.th}>Points</th>
                  <th style={styles.th}>Add Points</th>
                  <th style={styles.th}>Suspension</th>
                  <th style={styles.th}>Remove Staff</th>
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map(user => {
                  const isSuspended = user.suspendedUntil && new Date(user.suspendedUntil).getTime() > Date.now();
                  return (
                  <tr key={user.email} style={styles.trBody}>
                    <td style={styles.td}>
                      <strong>{user.firstName} {user.lastName}</strong><br/>{user.email}
                      {isSuspended && <div style={{color: '#ef4444', fontSize: '0.8rem', marginTop: '4px'}}>Suspended until: {new Date(user.suspendedUntil).toLocaleString()}</div>}
                    </td>
                    <td style={styles.td}>{user.points || 0}</td>
                    <td style={styles.td}>
                      <div style={{display: 'flex', gap: '8px'}}>
                        <input type="number" placeholder="Amt" value={pointsAmounts[user.email] || ''} onChange={e => setPointsAmounts({...pointsAmounts, [user.email]: e.target.value})} className="input-field" style={{width: '70px', padding: '6px'}} />
                        <input type="text" placeholder="Reason" value={pointsReasons[user.email] || ''} onChange={e => setPointsReasons({...pointsReasons, [user.email]: e.target.value})} className="input-field" style={{width: '120px', padding: '6px'}} />
                        <button type="button" onClick={() => handleAddPoints(user.email)} className="btn-primary" style={{padding: '6px 10px', borderRadius: '6px'}}><Plus size={14}/></button>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {isSuspended ? (
                        <button type="button" disabled={user.isAdmin && currentUser.email !== superAdminEmail} onClick={() => {unsuspendUser(user.email); displaySuccess('User unsuspended.');}} className="btn-success" style={{...styles.actionMiniBtn, opacity: user.isAdmin && currentUser.email !== superAdminEmail ? 0.5 : 1}}>
                          Unsuspend
                        </button>
                      ) : (
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button type="button" disabled={user.isAdmin && currentUser.email !== superAdminEmail} onClick={() => setSuspendModalUser(user)} className="btn-danger" style={{padding: '6px 10px', borderRadius: '6px', opacity: user.isAdmin && currentUser.email !== superAdminEmail ? 0.5 : 1}}>Suspend User</button>
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>
                      {user.email !== currentUser.email && (
                        <button type="button" onClick={() => {removeUser(user.email); displaySuccess('Staff removed.');}} className="btn-danger" style={styles.actionMiniBtn}>
                          <Trash2 size={14} /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      )}
      {/* Sub Tab: Flight Logs Review */}
      {activeSubTab === 'flight_logs' && (
<div id="section-flight_logs">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>Pending Flight Logs</h3>
          {pendingFlightLogs.length === 0 ? (
            <div style={styles.emptyGrid}><FileText size={36} color="rgba(255,255,255,0.15)" /><p style={styles.emptyText}>No pending logs.</p></div>
          ) : (
             <div style={styles.loaList}>
               {pendingFlightLogs.map(log => (
                 <div key={log.id} style={styles.loaCard} className="glass-panel">
                   <div style={styles.loaCardHeader}>
                     <div><h4 style={{color: 'var(--color-text-main)'}}>{log.flightCode}</h4><span style={{color:'#9ca3af', fontSize:'0.8rem'}}>Pilot: {log.pilot} | CoPilot: {log.coPilot}</span></div>
                     <span style={styles.loaDateText}>{new Date(log.timestamp).toLocaleDateString()}</span>
                   </div>
                   <div style={styles.loaReasonBox}>
                     <span style={styles.loaReasonLabel}>Notes & Details:</span>
                     <p style={styles.loaReasonText}>{log.notes}</p>
                     <p style={{fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px'}}>Passengers: {log.passengers} | Submitted by: {log.submitterName}</p>
                   </div>
                   <div style={styles.loaActionButtons}>
                     <button type="button" onClick={() => {approveFlightLog(log.id); displaySuccess('Log approved and points added.');}} className="btn-success" style={styles.loaActionBtn}><Check size={14}/> Approve</button>
                     <button type="button" onClick={() => {rejectFlightLog(log.id); displaySuccess('Log rejected.');}} className="btn-danger" style={styles.loaActionBtn}><X size={14}/> Reject</button>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>

      )}
      {/* Sub Tab: Schedule Flight */}
      {activeSubTab === 'flights' && (
<div id="section-flights">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>Schedule New Flight</h3>
          <form onSubmit={handleCreateFlight} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.inputWrapper}><label style={styles.label}>Flight Code *</label><input type="text" required value={flightCode} onChange={e=>setFlightCode(e.target.value)} className="input-field" /></div>
              <div style={styles.inputWrapper}><label style={styles.label}>Location *</label><input type="text" required value={location} onChange={e=>setLocation(e.target.value)} className="input-field" /></div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.inputWrapper}><label style={styles.label}>Date *</label><input type="date" required value={date} onChange={e=>setDate(e.target.value)} className="input-field" /></div>
              <div style={styles.inputWrapper}><label style={styles.label}>Time (UTC) *</label><input type="time" required value={time} onChange={e=>setTime(e.target.value)} className="input-field" /></div>
            </div>
            <div style={styles.inputWrapper}><label style={styles.label}>Roblox Server Direct Link *</label><input type="url" required value={serverLink} onChange={e=>setServerLink(e.target.value)} className="input-field" /></div>
            <button type="submit" className="btn-primary" style={styles.submitBtn}><Plus size={16} /> Schedule Flight</button>
          </form>
        </div>
      </div>

      )}
      {/* Sub Tab: LOA Review */}
      {activeSubTab === 'loas' && (
<div id="section-loas">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>Pending LOAs</h3>
          {pendingLoas.length === 0 ? (
            <div style={styles.emptyGrid}><Calendar size={36} color="rgba(255,255,255,0.15)" /><p style={styles.emptyText}>No pending LOAs.</p></div>
          ) : (
            <div style={styles.loaList}>
              {pendingLoas.map(req => (
                <div key={req.id} style={styles.loaCard} className="glass-panel">
                  <div style={styles.loaCardHeader}>
                    <div><h4 style={{color: 'var(--color-text-main)'}}>{req.userName}</h4><span style={{color:'#9ca3af', fontSize:'0.8rem'}}>{req.userEmail}</span></div>
                    <div style={styles.loaDates}>
                      <span style={styles.loaDateText}>{req.startDate}</span> <span style={{color:'#9ca3af'}}>to</span> <span style={styles.loaDateText}>{req.endDate}</span>
                    </div>
                  </div>
                  <div style={styles.loaReasonBox}>
                    <span style={styles.loaReasonLabel}>Reason:</span>
                    <p style={styles.loaReasonText}>{req.reason}</p>
                  </div>
                  <div style={styles.loaActionPanel}>
                    <div style={styles.commentWrapper}>
                      <label style={styles.commentLabel}>Decision Note:</label>
                      <input type="text" value={loaComments[req.id] || ''} onChange={e => setLoaComments({...loaComments, [req.id]: e.target.value})} className="input-field" style={{padding: '8px 12px'}} />
                    </div>
                    <div style={styles.loaActionButtons}>
                      <button type="button" onClick={() => handleLoaAction(req.id, 'Approved')} className="btn-success" style={styles.loaActionBtn}><Check size={14}/> Approve</button>
                      <button type="button" onClick={() => handleLoaAction(req.id, 'Denied')} className="btn-danger" style={styles.loaActionBtn}><X size={14}/> Deny</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{...styles.panelSection, marginTop: '24px'}}>
          <h3 style={styles.panelTitle}>Active LOAs</h3>
          {activeLoas.length === 0 ? (
            <div style={styles.emptyGrid}><Calendar size={36} color="rgba(255,255,255,0.15)" /><p style={styles.emptyText}>No active LOAs.</p></div>
          ) : (
            <div style={styles.loaList}>
              {activeLoas.map(req => (
                <div key={req.id} style={styles.loaCard} className="glass-panel">
                  <div style={styles.loaCardHeader}>
                    <div><h4 style={{color: 'var(--color-text-main)'}}>{req.userName}</h4><span style={{color:'#9ca3af', fontSize:'0.8rem'}}>{req.userEmail}</span></div>
                    <div style={styles.loaDates}>
                      <span style={styles.loaDateText}>{req.startDate}</span> <span style={{color:'#9ca3af'}}>to</span> <span style={styles.loaDateText}>{req.endDate}</span>
                    </div>
                  </div>
                  <div style={styles.loaReasonBox}>
                     <span style={styles.loaReasonLabel}>Status:</span>
                     <p style={{color: req.status === 'End Requested' ? '#f59e0b' : '#10b981', fontWeight: 'bold'}}>{req.status === 'End Requested' ? 'End Requested' : 'Approved'}</p>
                  </div>
                  <div style={styles.loaActionPanel}>
                    <div style={styles.commentWrapper}>
                      <label style={styles.commentLabel}>End Early Note:</label>
                      <input type="text" value={loaComments[req.id] || ''} onChange={e => setLoaComments({...loaComments, [req.id]: e.target.value})} className="input-field" style={{padding: '8px 12px'}} />
                    </div>
                    <div style={styles.loaActionButtons}>
                      <button type="button" onClick={() => handleLoaAction(req.id, 'Ended Early')} className="btn-danger" style={styles.loaActionBtn}><X size={14}/> End LOA Early</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      )}
      {/* Sub Tab: Password Resets */}
      {activeSubTab === 'passwords' && (
<div id="section-passwords">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>Password Reset Requests</h3>
          {pendingPasswords.length === 0 ? (
            <div style={styles.emptyGrid}><Key size={36} color="rgba(255,255,255,0.15)" /><p style={styles.emptyText}>No reset requests.</p></div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>New Password</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPasswords.map(req => (
                    <tr key={req.id} style={styles.trBody}>
                      <td style={styles.td}>{req.email}</td>
                      <td style={styles.td}>{new Date(req.timestamp).toLocaleString()}</td>
                      <td style={styles.td}>
                        <input type="text" placeholder="Enter new password" value={newPasswords[req.id] || ''} onChange={e => setNewPasswords({...newPasswords, [req.id]: e.target.value})} className="input-field" style={{padding: '6px'}} />
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button type="button" onClick={() => handleApprovePassword(req.id, req.email)} className="btn-success" style={styles.actionMiniBtn}><Check size={14} /> Approve</button>
                          <button type="button" onClick={() => {rejectPasswordReset(req.id, req.email); displaySuccess('Request rejected');}} className="btn-danger" style={styles.actionMiniBtn}><X size={14} /> Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      )}
      {/* Sub Tab: System Status */}
      {activeSubTab === 'status' && (
<div id="section-status">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>System Status Configuration</h3>
          <p style={styles.panelSubtitle}>Configure warning banners and full site maintenance lockouts.</p>
          <form onSubmit={handleSaveSystemStatus} style={styles.form}>
            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <h4 style={{ color: '#f59e0b', marginBottom: '12px' }}>Warning Banner</h4>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                <input type="checkbox" id="warnActive" checked={warnActive} onChange={e => setWarnActive(e.target.checked)} style={{width: '20px', height: '20px'}} />
                <label htmlFor="warnActive" style={{fontSize: '1rem', color: 'var(--color-text-main)', fontWeight: '600'}}>Enable Global Warning Banner</label>
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Banner Title</label>
                <input type="text" value={warnTitle} onChange={e=>setWarnTitle(e.target.value)} placeholder="e.g. Goalbound Outfits Issue" className="input-field" disabled={!warnActive} />
              </div>
              <div style={{...styles.inputWrapper, marginTop: '12px'}}>
                <label style={styles.label}>Banner Message</label>
                <textarea value={warnMessage} onChange={e=>setWarnMessage(e.target.value)} className="input-field" rows="2" disabled={!warnActive} />
              </div>
              <div style={{...styles.inputWrapper, marginTop: '12px'}}>
                <label style={styles.label}>Banner Type</label>
                <select value={warnType} onChange={e=>setWarnType(e.target.value)} className="input-field" disabled={!warnActive}>
                  <option value="warning">Warning (Yellow)</option>
                  <option value="issue">Issue (Red)</option>
                  <option value="resolved">Resolved (Green)</option>
                </select>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', marginBottom: '12px'}}>
                <input type="checkbox" id="warnCountdown" checked={warnCountdownEnabled} onChange={e => setWarnCountdownEnabled(e.target.checked)} style={{width: '20px', height: '20px'}} disabled={!warnActive} />
                <label htmlFor="warnCountdown" style={{fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: '600'}}>Enable Countdown Timer</label>
              </div>
              {warnCountdownEnabled && (
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Countdown Target Date/Time</label>
                  <input type="datetime-local" value={warnCountdownTarget} onChange={e=>setWarnCountdownTarget(e.target.value)} className="input-field" disabled={!warnActive} />
                </div>
              )}
            </div>

            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h4 style={{ color: '#ef4444', marginBottom: '12px' }}>Site Maintenance Mode</h4>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                <input type="checkbox" id="maintActive" checked={maintActive} onChange={e => setMaintActive(e.target.checked)} style={{width: '20px', height: '20px'}} />
                <label htmlFor="maintActive" style={{fontSize: '1rem', color: 'var(--color-text-main)', fontWeight: '600'}}>Enable Full Site Lockout</label>
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Maintenance Message</label>
                <textarea value={maintMessage} onChange={e=>setMaintMessage(e.target.value)} className="input-field" rows="3" disabled={!maintActive} placeholder="The system is currently undergoing scheduled maintenance..." />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={styles.submitBtn}>Save System Status Settings</button>
          </form>
        </div>
      </div>

      )}
      {/* Sub Tab: Audit Log */}
      {activeSubTab === 'audit' && (
      <div id="section-audit">
        <div style={styles.panelSection}>
          <h3 style={styles.panelTitle}>System Audit Log</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>Date/Time</th>
                  <th style={styles.th}>Admin</th>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} style={styles.trBody}>
                    <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={styles.td}>{log.adminName}</td>
                    <td style={styles.td}>{log.description}</td>
                    <td style={styles.td}>
                      <button type="button" onClick={() => setSelectedAuditLog(log)} className="btn-secondary" style={{padding: '4px 8px', fontSize: '0.8rem'}}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {auditLogs.length === 0 && <p style={{padding: '20px', color: '#9ca3af', textAlign: 'center'}}>No audit logs found.</p>}
          </div>
        </div>
      </div>
      )}

      </div>
      {/* Audit Log Modal */}
      {selectedAuditLog && (
        <div style={styles.overlay}>
          <div className="glass-panel" style={{...styles.modal, width: '500px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
              <h3 style={{color: 'var(--color-text-main)', fontSize: '1.2rem'}}>Audit Log Details</h3>
              <button type="button" onClick={() => setSelectedAuditLog(null)} style={{background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer'}}><X size={20}/></button>
            </div>
            <div style={{background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', overflowX: 'auto'}}>
              <pre style={{color: '#a7f3d0', fontSize: '0.85rem', margin: 0}}>
                {JSON.stringify(selectedAuditLog, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      {suspendModalUser && (
        <div style={styles.overlay}>
          <div className="glass-panel" style={{...styles.modal, width: '400px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
               <h3 style={{color: 'var(--color-text-main)', fontSize: '1.2rem'}}>Suspend {suspendModalUser.firstName}</h3>
               <button type="button" onClick={() => setSuspendModalUser(null)} style={{background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer'}}><X size={20}/></button>
            </div>
            <form onSubmit={handleSuspend} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
               <div style={styles.inputWrapper}>
                 <label style={styles.label}>Duration (Hours) *</label>
                 <input type="number" required min="1" value={suspendModalHours} onChange={e => setSuspendModalHours(e.target.value)} className="input-field" />
               </div>
               <div style={styles.inputWrapper}>
                 <label style={styles.label}>Reason for Suspension *</label>
                 <textarea required value={suspendModalReason} onChange={e => setSuspendModalReason(e.target.value)} className="input-field" rows="3" placeholder="Explain the reason for this suspension..."></textarea>
               </div>
               <button type="submit" className="btn-danger" style={{padding: '10px', borderRadius: '8px', cursor: 'pointer'}}>Confirm Suspension</button>
            </form>
          </div>
        </div>
      )}

      {/* Infraction Modal */}
      {showInfractionModal && (
        <div style={styles.overlay}>
          <div className="glass-panel" style={{...styles.modal, width: '500px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
               <h3 style={{color: 'var(--color-text-main)', fontSize: '1.2rem'}}>Log New Consequence</h3>
               <button type="button" onClick={() => setShowInfractionModal(false)} style={{background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer'}}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddInfraction} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Staff Member *</label>
                <select required value={infStaffEmail} onChange={e => setInfStaffEmail(e.target.value)} className="input-field">
                  <option value="">Choose active staff...</option>
                  {approvedUsers.filter(user => user.email !== currentUser.email && (!user.isAdmin || currentUser.email === superAdminEmail)).map(user => (
                    <option key={user.email} value={user.email}>
                      {user.firstName} {user.lastName} (@{user.robloxUsername})
                      {user.suspendedUntil ? ' - Suspended' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Action Level</label>
                <select value={infType} onChange={e => setInfType(e.target.value)} className="input-field">
                  <option value="Warning">Official Warning</option>
                  <option value="Strike 1">Strike 1</option>
                  <option value="Strike 2">Strike 2</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Final Warning">Final Warning</option>
                </select>
              </div>

              <div style={styles.inputWrapper}>
                <label style={styles.label}>Main Message * (Visible to the staff member)</label>
                <textarea
                  required
                  value={infMainMessage}
                  onChange={e => setInfMainMessage(e.target.value)}
                  placeholder="e.g. Unexcused absence from flight shift on June 12."
                  className="input-field"
                  rows="3"
                  style={styles.textarea}
                />
              </div>

              <div style={styles.inputWrapper}>
                <label style={styles.label}>Confidential Message (Admins Only)</label>
                <textarea
                  value={infConfidentialMessage}
                  onChange={e => setInfConfidentialMessage(e.target.value)}
                  placeholder="Optional private admin note."
                  className="input-field"
                  rows="2"
                  style={styles.confidentialTextarea}
                />
              </div>

              <button type="submit" className="btn-danger" style={styles.submitBtn}>
                <ShieldAlert size={16} /> Publish Consequence
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const getTabStyle = (isActive) => ({
  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
  borderRadius: '8px', border: 'none', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
  background: isActive ? '#2563eb' : 'transparent',
  color: isActive ? 'var(--color-text-main)' : '#9ca3af',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap'
});

const styles = {
  layoutContainer: { display: 'flex', gap: '32px', alignItems: 'flex-start', paddingBottom: '40px' },
  sidebar: { width: '220px', position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0, height: 'max-content', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '64px', minWidth: 0, paddingBottom: '30vh' },
  subTabContainer: { display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.15)', padding: '6px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)', overflowX: 'auto' },
  successAlert: { background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px 16px', fontSize: '0.9rem', color: '#a7f3d0' },
  securityAlert: { background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '12px 16px', fontSize: '0.85rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  panelSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
  panelTitle: { fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-main)' },
  panelSubtitle: { fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '-8px' },
  emptyGrid: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '60px 0' },
  emptyText: { color: 'var(--color-text-muted)', fontSize: '0.95rem' },
  tableWrapper: { width: '100%', overflowX: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px solid var(--color-border)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' },
  trHead: { borderBottom: '1px solid var(--color-border)' },
  th: { padding: '12px 16px', fontWeight: '600', color: 'var(--color-primary)', fontSize: '0.8rem', textTransform: 'uppercase' },
  trBody: { borderBottom: '1px solid rgba(255,255,255,0.03)' },
  td: { padding: '12px 16px', color: 'var(--color-text-main)', verticalAlign: 'middle' },
  actionRow: { display: 'flex', gap: '8px' },
  actionMiniBtn: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' },
  roleBtn: { padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '16px' },
  formRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  inputWrapper: { flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', fontWeight: '500', color: 'var(--color-text-muted)' },
  textarea: { resize: 'vertical', minHeight: '110px' },
  confidentialTextarea: { resize: 'vertical', borderStyle: 'dashed', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.02)' },
  submitBtn: { padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' },
  infractionBadge: { background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  confidentialNote: { marginTop: '8px', color: '#67e8f9', fontSize: '0.8rem', fontStyle: 'italic' },
  loaList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  loaCard: { padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' },
  loaCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', flexWrap: 'wrap', gap: '10px' },
  loaDateText: { background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-text-main)', fontWeight: '600' },
  loaReasonBox: { display: 'flex', flexDirection: 'column', gap: '4px' },
  loaReasonLabel: { fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary)', textTransform: 'uppercase' },
  loaReasonText: { fontSize: '0.875rem', color: 'var(--color-text-main)', lineHeight: '1.4' },
  loaActionPanel: { borderTop: '1px dashed var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  loaActionButtons: { display: 'flex', gap: '10px' },
  loaActionBtn: { padding: '8px 16px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { padding: '24px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }
};
