import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffApplication({ onBack }) {
  const { applicationConfig, submitApplication } = useApp();
  const [formData, setFormData] = useState({ applicantName: '', robloxUsername: '' });
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!applicationConfig?.isActive) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#9ca3af' }}>
          <AlertCircle size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Applications Closed</h2>
        <p style={{ color: '#9ca3af', marginBottom: '24px' }}>We are not currently accepting new staff applications. Please check back later.</p>
        <button onClick={onBack} className="btn-secondary" style={{ padding: '10px 24px', borderRadius: '8px' }}>
          Return to Portal
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure all required fields are filled
    if (!formData.applicantName || !formData.robloxUsername) return;
    
    const formattedAnswers = applicationConfig.questions.map(q => ({
      questionId: q.id,
      questionText: q.text,
      answer: answers[q.id] || ''
    }));

    submitApplication({
      applicantName: formData.applicantName,
      robloxUsername: formData.robloxUsername,
      answers: formattedAnswers
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{ padding: '32px', textAlign: 'center', maxWidth: '700px', margin: '0 auto', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}
      >
        <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: '#34d399' }}>
          <CheckCircle2 size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Application Received!</h2>
        <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Thank you for applying. Our staff team will review your application soon. Keep an eye on your messages or our communications channels.</p>
        <button onClick={onBack} className="btn-secondary" style={{ padding: '10px 24px', borderRadius: '8px' }}>
          Return to Portal
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Staff Application</h2>
          <p style={{ color: '#9ca3af' }}>Please fill out the form below truthfully. All applications are manually reviewed by our management team.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Basic Info */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>1</span> 
              Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1' }}>Preferred Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.applicantName}
                  onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                  className="input-field"
                  placeholder="e.g. John"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1' }}>Roblox Username</label>
                <input 
                  type="text" 
                  required
                  value={formData.robloxUsername}
                  onChange={(e) => setFormData({...formData, robloxUsername: e.target.value})}
                  className="input-field"
                  placeholder="e.g. Builderman123"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Questions */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>2</span> 
              Questionnaire
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {applicationConfig.questions.map((q, idx) => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: '500', color: '#cbd5e1' }}>
                    {idx + 1}. {q.text}
                  </label>
                  
                  {q.type === 'text' ? (
                    <textarea 
                      required
                      rows={4}
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                      className="input-field"
                      style={{ resize: 'vertical' }}
                      placeholder="Type your answer here..."
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      {q.options?.map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>
                          <input 
                            type="radio" 
                            name={q.id}
                            required
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              type="submit" 
              className="btn-primary"
              style={{ padding: '14px 32px', borderRadius: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Send size={20} /> Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
