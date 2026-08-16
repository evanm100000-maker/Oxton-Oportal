import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MeetingsAndEvents() {
  const { events, meetings } = useApp();

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Events Column */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <div style={{ ...styles.iconWrapper, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Calendar size={20} />
            </div>
            <h3 style={styles.columnTitle}>Upcoming Events</h3>
          </div>

          <div style={styles.list}>
            {(!events || events.length === 0) ? (
              <div style={styles.emptyState}>
                <Calendar size={36} color="#94a3b8" style={{ marginBottom: '12px' }} />
                <p>No upcoming events scheduled.</p>
              </div>
            ) : (
              events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel"
                  style={{
                    ...styles.card,
                    borderLeft: '4px solid #10b981',
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.dateBadge}>
                      <span style={styles.dateDay}>{new Date(event.date).getDate()}</span>
                      <span style={styles.dateMonth}>
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div style={styles.cardInfo}>
                      <h4 style={styles.cardTitle}>{event.title}</h4>
                      <p style={styles.cardDesc}>{event.description}</p>
                      <div style={styles.cardMeta}>
                        <div style={styles.metaItem}>
                          <Clock size={12} />
                          <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} BST</span>
                        </div>
                        {event.location && (
                          <div style={styles.metaItem}>
                            <MapPin size={12} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Meetings Column */}
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <div style={{ ...styles.iconWrapper, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <Video size={20} />
            </div>
            <h3 style={styles.columnTitle}>Upcoming Meetings</h3>
          </div>

          <div style={styles.list}>
            {(!meetings || meetings.length === 0) ? (
              <div style={styles.emptyState}>
                <Video size={36} color="#94a3b8" style={{ marginBottom: '12px' }} />
                <p>No upcoming meetings scheduled.</p>
              </div>
            ) : (
              meetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel"
                  style={{
                    ...styles.card,
                    borderLeft: '4px solid #3b82f6',
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.dateBadge}>
                      <span style={styles.dateDay}>{new Date(meeting.date).getDate()}</span>
                      <span style={styles.dateMonth}>
                        {new Date(meeting.date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div style={styles.cardInfo}>
                      <h4 style={styles.cardTitle}>{meeting.title}</h4>
                      <p style={styles.cardDesc}>{meeting.description}</p>
                      <div style={styles.cardMeta}>
                        <div style={styles.metaItem}>
                          <Clock size={12} />
                          <span>{new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} BST</span>
                        </div>
                        {meeting.location && (
                          <div style={styles.metaItem}>
                            <MapPin size={12} />
                            <span>{meeting.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '8px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--color-border)',
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 16px',
    color: 'var(--color-text-muted)',
    background: 'var(--color-bg-card)',
    borderRadius: '12px',
    border: '1px dashed var(--color-border)',
  },
  card: {
    padding: '16px',
    borderRadius: '12px',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  dateBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
    minWidth: '54px',
    border: '1px solid var(--color-border)',
  },
  dateDay: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    lineHeight: '1',
  },
  dateMonth: {
    fontSize: '0.7rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: '2px',
  },
  cardInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0,
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
    margin: 0,
  },
  cardMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '8px',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};
