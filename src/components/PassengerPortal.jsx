import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, Megaphone, Ticket, ChevronLeft, Send, Clock, AlertCircle, FileText } from 'lucide-react';
import StaffApplication from './StaffApplication';

export default function PassengerPortal({ onBack }) {
  const { flights, events, announcements, createTicket } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [ticketForm, setTicketForm] = useState({ title: '', description: '', robloxUsername: '' });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  
  // Filter announcements for passengers
  const passengerAnnouncements = announcements.filter(a => a.targetAudience === 'Passenger' || a.targetAudience === 'All' || !a.targetAudience);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.description || !ticketForm.robloxUsername) return;
    
    createTicket({
      title: ticketForm.title,
      description: ticketForm.description,
      authorName: ticketForm.robloxUsername,
      authorType: 'Passenger'
    });
    
    setTicketSubmitted(true);
    setTicketForm({ title: '', description: '', robloxUsername: '' });
    setTimeout(() => setTicketSubmitted(false), 5000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Plane },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'support', label: 'Support', icon: Ticket },
    { id: 'apply', label: 'Staff Application', icon: FileText }
  ];

  const renderContent = () => {
    if (activeTab === 'apply') {
      return <StaffApplication onBack={() => setActiveTab('overview')} />;
    }

    return (
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Flights */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Plane className="w-5 h-5" /></div>
                <h2 className="text-xl font-semibold text-white">Upcoming Flights</h2>
              </div>
              <div className="space-y-4">
                {flights.filter(f => f.status === 'Scheduled').length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No scheduled flights at this time.</div>
                ) : (
                  flights.filter(f => f.status === 'Scheduled').slice(0, 5).map(flight => (
                    <div key={flight.id} className="p-4 bg-slate-700/30 rounded-lg flex justify-between items-center border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                      <div>
                        <div className="font-semibold text-white">{flight.destination}</div>
                        <div className="text-sm text-slate-400">{flight.hostName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-400 font-medium">{new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="text-xs text-slate-500">{new Date(flight.departureTime).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Megaphone className="w-5 h-5" /></div>
                <h2 className="text-xl font-semibold text-white">Latest Announcements</h2>
              </div>
              <div className="space-y-4">
                {passengerAnnouncements.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No recent announcements.</div>
                ) : (
                  passengerAnnouncements.slice(0, 3).map(ann => (
                    <div key={ann.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                      <div className="font-semibold text-white mb-1">{ann.title}</div>
                      <div className="text-sm text-slate-300 line-clamp-2 mb-2">{ann.message}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ann.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {passengerAnnouncements.length > 3 && (
                <button onClick={() => setActiveTab('announcements')} className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                  View all announcements
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-400" /> All Announcements
            </h2>
            <div className="space-y-4">
              {passengerAnnouncements.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No announcements found.</div>
              ) : (
                passengerAnnouncements.map(ann => (
                  <div key={ann.id} className="p-5 bg-slate-700/30 rounded-lg border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-lg text-white">{ann.title}</div>
                      <div className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                        {new Date(ann.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    {ann.subtitle && <div className="text-sm font-medium text-slate-400 mb-2">{ann.subtitle}</div>}
                    <div className="text-slate-300 whitespace-pre-wrap">{ann.message}</div>
                    <div className="mt-4 text-xs text-slate-500 text-right">Posted by {ann.authorName}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" /> Upcoming Events
            </h2>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No events scheduled. Check back later!</div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="p-5 bg-slate-700/30 rounded-lg border border-slate-700/50 flex gap-4">
                    <div className="flex flex-col items-center justify-center p-3 bg-slate-800 rounded-lg min-w-20">
                      <div className="text-green-400 font-bold text-xl">{new Date(event.date).getDate()}</div>
                      <div className="text-xs text-slate-400 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-white">{event.title}</div>
                      <div className="text-slate-400 text-sm mt-1">{event.description}</div>
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-orange-400" /> Submit a Support Ticket
              </h2>
              <p className="text-slate-400 text-sm mb-6">Need help? Open a ticket and our staff team will assist you.</p>

              {ticketSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plane className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Ticket Submitted Successfully</h3>
                  <p className="text-sm opacity-80">Our staff team has received your ticket and will look into it.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Your Roblox Username</label>
                    <input 
                      type="text" 
                      required
                      value={ticketForm.robloxUsername}
                      onChange={(e) => setTicketForm({...ticketForm, robloxUsername: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. Builderman123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject / Title</label>
                    <input 
                      type="text" 
                      required
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Brief summary of your issue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <textarea 
                      required
                      rows={5}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Submit Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Top Navbar */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Oportal <span className="text-slate-500 font-normal">| Passenger</span></span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
