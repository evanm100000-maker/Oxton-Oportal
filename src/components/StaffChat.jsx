import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, ShieldAlert, Users, MessageSquare, Globe, Reply, Trash2, Flag, Smile, X } from 'lucide-react';

export default function StaffChat() {
  const { currentUser, chatMessages, addChatMessage, deleteChatMessage, addMessageReaction, submitReport, setCustomRole } = useApp();
  const [activeChannel, setActiveChannel] = useState('Staff Chat');
  const [inputText, setInputText] = useState('');
  const [rolePromptTarget, setRolePromptTarget] = useState(null);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const messagesEndRef = useRef(null);

  const filteredMessages = chatMessages.filter(m => m.channel === activeChannel);

  // Start at the newest messages when opening a channel, then let readers scroll freely.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [activeChannel]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    let replyData = null;
    if (replyingTo) {
      replyData = {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        text: replyingTo.text.length > 50 ? replyingTo.text.substring(0, 50) + '...' : replyingTo.text
      };
    }
    
    addChatMessage(activeChannel, inputText.trim(), replyData);
    setInputText('');
    setReplyingTo(null);
  };

  const handleReport = (msg) => {
    if (window.confirm(`Are you sure you want to report this message by ${msg.senderName}?`)) {
      submitReport({
        type: 'Chat Message Report',
        reportedPlayer: msg.senderName,
        description: `Reported Message ID: ${msg.id}\nMessage Content: "${msg.text}"\nChannel: ${msg.channel}`,
        evidenceLink: ''
      });
      alert('Message reported successfully. It has been sent to the admin panel.');
    }
  };

  const handleSetRole = (e) => {
    e.preventDefault();
    if (!rolePromptTarget) return;
    setCustomRole(rolePromptTarget.email, newRoleInput);
    setRolePromptTarget(null);
    setNewRoleInput('');
  };

  return (
    <div className="admin-layout" style={styles.container}>
      {/* Channels Sidebar */}
      <div style={styles.sidebar} className="glass-panel admin-sidebar">
        <h3 style={styles.sidebarTitle}><MessageSquare size={16} /> Channels</h3>
        <button 
          onClick={() => setActiveChannel('Staff Chat')}
          style={{
            ...styles.channelBtn,
            background: activeChannel === 'Staff Chat' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            borderColor: activeChannel === 'Staff Chat' ? '#3b82f6' : 'transparent',
            color: activeChannel === 'Staff Chat' ? 'var(--color-text-main)' : '#9ca3af'
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
            color: activeChannel === 'Security' ? 'var(--color-text-main)' : '#9ca3af'
          }}
        >
          <ShieldAlert size={16} /> # security
        </button>
        <button 
          onClick={() => setActiveChannel('Global')}
          style={{
            ...styles.channelBtn,
            background: activeChannel === 'Global' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            borderColor: activeChannel === 'Global' ? '#10b981' : 'transparent',
            color: activeChannel === 'Global' ? 'var(--color-text-main)' : '#9ca3af'
          }}
        >
          <Globe size={16} /> Global
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
              <div 
                key={msg.id} 
                style={{...styles.messageRow, position: 'relative'}}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => {
                  setHoveredMsgId(null);
                  if (activeReactionMsgId === msg.id) setActiveReactionMsgId(null);
                }}
              >
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
                    <img src={msg.senderPfp} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                  ) : (
                    msg.senderName.charAt(0)
                  )}
                </div>
                <div style={{...styles.messageContent, flex: 1, minWidth: 0}}>
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
                  
                  {msg.replyTo && (
                    <div style={styles.replyQuoteBlock}>
                      <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>
                        <Reply size={12} style={{marginRight: '4px', display: 'inline', verticalAlign: 'middle'}}/>
                        Replying to <strong>{msg.replyTo.senderName}</strong>
                      </span>
                      <div style={{color: '#d1d5db', fontSize: '0.85rem', marginTop: '2px', fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '8px'}}>{msg.replyTo.text}</div>
                    </div>
                  )}
                  
                  <div style={styles.messageText}>
                    {msg.text.split(/(@[a-zA-Z0-9_.-]+)/g).map((part, i) => 
                      part.startsWith('@') ? <span key={i} style={{ color: '#06b6d4', fontWeight: 'bold' }}>{part}</span> : part
                    )}
                  </div>

                  {msg.reactions && msg.reactions.length > 0 && (
                    <div style={styles.reactionsContainer}>
                      {msg.reactions.map(r => (
                        <button 
                          key={r.emoji} 
                          style={{
                            ...styles.reactionBadge, 
                            background: r.users.includes(currentUser.email) ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            borderColor: r.users.includes(currentUser.email) ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'
                          }}
                          onClick={() => addMessageReaction(msg.id, r.emoji)}
                          title={r.users.join(', ')}
                        >
                          {r.emoji} <span style={styles.reactionCount}>{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Actions */}
                <div style={{
                  ...styles.messageActions,
                  opacity: (hoveredMsgId === msg.id || activeReactionMsgId === msg.id) ? 1 : 0,
                  visibility: (hoveredMsgId === msg.id || activeReactionMsgId === msg.id) ? 'visible' : 'hidden'
                }}>
                  <button style={styles.actionBtn} onClick={() => setReplyingTo(msg)} title="Reply">
                    <Reply size={14} />
                  </button>
                  <div style={{ position: 'relative' }}>
                    <button style={styles.actionBtn} onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)} title="React">
                      <Smile size={14} />
                    </button>
                    {activeReactionMsgId === msg.id && (
                      <div style={styles.reactionPicker}>
                        {['👍', '❤️', '😂', '😮', '👀', '🔥'].map(emoji => (
                          <button 
                            key={emoji} 
                            style={styles.reactionOptionBtn} 
                            onClick={() => { addMessageReaction(msg.id, emoji); setActiveReactionMsgId(null); }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.senderEmail !== currentUser.email && (
                    <button style={styles.actionBtn} onClick={() => handleReport(msg)} title="Report">
                      <Flag size={14} />
                    </button>
                  )}
                  {(msg.senderEmail === currentUser.email || currentUser.isAdmin) && (
                    <button style={{...styles.actionBtn, color: '#ef4444'}} onClick={() => {
                      if(window.confirm('Delete this message?')) deleteChatMessage(msg.id);
                    }} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainerWrapper}>
          {replyingTo && (
            <div style={styles.replyingBanner}>
              <div style={styles.replyingBannerText}>
                <Reply size={12} style={{marginRight: '6px', display: 'inline', verticalAlign: 'middle'}}/>
                Replying to <strong>{replyingTo.senderName}</strong>: {replyingTo.text.length > 50 ? replyingTo.text.substring(0, 50) + '...' : replyingTo.text}
              </div>
              <button type="button" onClick={() => setReplyingTo(null)} style={styles.replyingBannerClose}>
                <X size={14} />
              </button>
            </div>
          )}
          <form onSubmit={handleSend} style={{...styles.inputArea, borderTopLeftRadius: replyingTo ? 0 : '16px', borderTopRightRadius: replyingTo ? 0 : '16px'}}>
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
    color: 'var(--color-text-main)',
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
    color: 'var(--color-text-main)',
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
    color: 'var(--color-text-main)',
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
    color: 'var(--color-text-main)',
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
  },
  inputContainerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginTop: 'auto',
  },
  replyingBanner: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderLeft: '4px solid #3b82f6',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  replyingBannerText: {
    fontSize: '0.85rem',
    color: '#d1d5db',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: '16px',
  },
  replyingBannerClose: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  replyQuoteBlock: {
    marginTop: '4px',
    marginBottom: '8px',
    padding: '6px 10px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '6px',
    borderLeft: '3px solid #3b82f6',
  },
  reactionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
  },
  reactionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 6px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  reactionCount: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  messageActions: {
    position: 'absolute',
    top: '-12px',
    right: '16px',
    display: 'flex',
    gap: '4px',
    background: '#1f2937',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'opacity 0.15s, visibility 0.15s',
    zIndex: 10,
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '6px',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  reactionPicker: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1f2937',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '4px 8px',
    display: 'flex',
    gap: '4px',
    marginTop: '4px',
    zIndex: 20,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  reactionOptionBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
  }
};
