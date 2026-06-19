import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, ShieldAlert, Users, MessageSquare } from 'lucide-react';

export default function StaffChat() {
  const { currentUser, chatMessages, addChatMessage, setCustomRole } = useApp();
  const [activeChannel, setActiveChannel] = useState('Staff Chat');
  const [inputText, setInputText] = useState('');
  const [rolePromptTarget, setRolePromptTarget] = useState(null);
  const [newRoleInput, setNewRoleInput] = useState('');
  const messagesEndRef = useRef(null);

  const filteredMessages = chatMessages.filter(m => m.channel === activeChannel);

  // Start at the newest messages when opening a channel, then let readers scroll freely.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [activeChannel]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addChatMessage(activeChannel, inputText.trim());
    setInputText('');
  };

  const handleSetRole = (e) => {
    e.preventDefault();
    if (!rolePromptTarget) return;
    setCustomRole(rolePromptTarget.email, newRoleInput);
    setRolePromptTarget(null);
    setNewRoleInput('');
  };

  return (
    <div style={styles.container}>
      {/* Channels Sidebar */}
      <div style={styles.sidebar} className="glass-panel">
        <h3 style={styles.sidebarTitle}><MessageSquare size={16} /> Channels</h3>
        <button 
          onClick={() => setActiveChannel('Staff Chat')}
          style={{
            ...styles.channelBtn,
            background: activeChannel === 'Staff Chat' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            borderColor: activeChannel === 'Staff Chat' ? '#3b82f6' : 'transparent',
            color: activeChannel === 'Staff Chat' ? '#ffffff' : '#9ca3af'
          }}
        >
          <Users size={16} /> # staff-chat
        </button>
        <button 
          onClick={() => setActiveChannel('Security')}
          style={{
            ...styles.channelBtn,
            background: activeChannel === 'Security' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
            borderColor: activeChannel === 'Security' ? '#ef4444' : 'transparent',
            color: activeChannel === 'Security' ? '#ffffff' : '#9ca3af'
          }}
        >
          <ShieldAlert size={16} /> # security
        </button>
      </div>

      {/* Main Chat Area */}
      <div style={styles.chatArea} className="glass-panel">
        <div style={styles.chatHeader}>
          <h2 style={styles.channelName}># {activeChannel.toLowerCase().replace(' ', '-')}</h2>
          <span style={styles.channelDesc}>
            {activeChannel === 'Security' ? 'Restricted security operations channel.' : 'General staff communication channel.'}
          </span>
        </div>

        <div style={styles.messageList}>
          {filteredMessages.length === 0 ? (
            <div style={styles.emptyState}>No messages yet. Start the conversation!</div>
          ) : (
            filteredMessages.map((msg) => (
              <div key={msg.id} style={styles.messageRow}>
                <div 
                  style={{...styles.avatar, background: msg.senderPfp ? 'transparent' : '#3b82f6'}}
                  title={currentUser.isAdmin ? "Click to set role" : ""}
                  onClick={() => {
                    if (currentUser.isAdmin) {
                      setRolePromptTarget({ email: msg.senderEmail, name: msg.senderName, currentRole: msg.senderRole });
                      setNewRoleInput(msg.senderRole || '');
                    }
                  }}
                >
                  {msg.senderPfp ? (
                    <img src={msg.senderPfp} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                  ) : (
                    msg.senderName.charAt(0)
                  )}
                </div>
                <div style={styles.messageContent}>
                  <div style={styles.messageHeader}>
                    <span 
                      style={styles.senderName}
                      onClick={() => {
                        if (currentUser.isAdmin) {
                          setRolePromptTarget({ email: msg.senderEmail, name: msg.senderName, currentRole: msg.senderRole });
                          setNewRoleInput(msg.senderRole || '');
                        }
                      }}
                      title={currentUser.isAdmin ? "Click to set role" : ""}
                    >
                      {msg.senderName}
                    </span>
                    {msg.senderRole && <span style={styles.senderRole}>({msg.senderRole})</span>}
                    <span style={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div style={styles.messageText}>{msg.text}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={styles.inputArea}>
          <input 
            type="text" 
            value={inputText} 
            onChange={e => setInputText(e.target.value)} 
            placeholder={`Message #${activeChannel.toLowerCase().replace(' ', '-')}`}
            style={styles.input}
          />
          <button type="submit" className="btn-primary" style={styles.sendBtn} disabled={!inputText.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Role Prompt Modal (Admin Only) */}
      {rolePromptTarget && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            <h3>Set Role for {rolePromptTarget.name}</h3>
            <p style={{fontSize: '0.85rem', color: '#9ca3af', marginBottom: '16px'}}>This role will appear in brackets next to their name globally.</p>
            <form onSubmit={handleSetRole}>
              <input 
                autoFocus
                type="text" 
                value={newRoleInput} 
                onChange={e => setNewRoleInput(e.target.value)} 
                className="input-field" 
                placeholder="e.g. Head of Security"
                style={{marginBottom: '16px'}}
              />
              <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                <button type="button" onClick={() => setRolePromptTarget(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    height: 'calc(100vh - 120px)',
  },
  sidebar: {
    width: '240px',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sidebarTitle: {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    color: '#9ca3af',
    fontWeight: '700',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  channelBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'all 0.2s',
  },
  chatArea: {
    flex: 1,
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  channelName: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  channelDesc: {
    fontSize: '0.85rem',
    color: '#9ca3af',
  },
  messageList: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  emptyState: {
    margin: 'auto',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  messageRow: {
    display: 'flex',
    gap: '16px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '1.2rem',
    cursor: 'pointer',
    flexShrink: 0,
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  senderName: {
    fontWeight: '700',
    color: '#ffffff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  senderRole: {
    color: '#3b82f6',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  timestamp: {
    color: '#6b7280',
    fontSize: '0.75rem',
  },
  messageText: {
    color: '#d1d5db',
    fontSize: '0.95rem',
    lineHeight: '1.4',
  },
  inputArea: {
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    gap: '12px',
    background: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    outline: 'none',
  },
  sendBtn: {
    padding: '0 20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  modalContent: {
    width: '400px',
    padding: '24px',
    borderRadius: '16px',
  }
};
