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
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Applications Closed</h2>
        <p className="text-slate-400 mb-6">We are not currently accepting new staff applications. Please check back later.</p>
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors">
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
        className="bg-slate-800 rounded-xl p-8 border border-green-500/30 shadow-xl shadow-green-500/10 text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Application Received!</h2>
        <p className="text-slate-400 mb-8">Thank you for applying. Our staff team will review your application soon. Keep an eye on your messages or our communications channels.</p>
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2. rounded-lg transition-colors font-medium">
          Return to Portal
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl">
        <div className="mb-8 border-b border-slate-700 pb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Staff Application</h2>
          <p className="text-slate-400">Please fill out the form below truthfully. All applications are manually reviewed by our management team.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">1</span> 
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.applicantName}
                  onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Roblox Username</label>
                <input 
                  type="text" 
                  required
                  value={formData.robloxUsername}
                  onChange={(e) => setFormData({...formData, robloxUsername: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Builderman123"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Questions */}
          <div className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">2</span> 
              Questionnaire
            </h3>
            
            {applicationConfig.questions.map((q, idx) => (
              <div key={q.id} className="space-y-2">
                <label className="block font-medium text-slate-200">
                  {idx + 1}. {q.text}
                </label>
                
                {q.type === 'text' ? (
                  <textarea 
                    required
                    rows={4}
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-y"
                    placeholder="Type your answer here..."
                  />
                ) : (
                  <div className="space-y-2 mt-2">
                    {q.options?.map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:bg-slate-800 cursor-pointer transition-colors bg-slate-800/50">
                        <input 
                          type="radio" 
                          name={q.id}
                          required
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                          className="w-4 h-4 text-purple-500 focus:ring-purple-500 bg-slate-900 border-slate-600"
                        />
                        <span className="text-slate-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center gap-2 text-lg"
            >
              <Send className="w-5 h-5" /> Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
