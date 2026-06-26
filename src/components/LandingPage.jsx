import React from 'react';
import { Plane, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage({ onSelectPortal }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center mb-12"
      >
        <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
          <Plane className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Oxton Oportal</h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">Please select your portal to continue</p>
      </motion.div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => onSelectPortal('passenger')}
          className="group relative p-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all duration-300 text-left overflow-hidden flex flex-col h-full"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">I am a Passenger</h2>
          <p className="text-slate-400 flex-grow">Access upcoming flights, announcements, submit support tickets, and apply for a staff position.</p>
          <div className="mt-6 flex items-center text-blue-400 font-medium">
            Enter Portal <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onSelectPortal('staff')}
          className="group relative p-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-2xl transition-all duration-300 text-left overflow-hidden flex flex-col h-full"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
            <Plane className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">I am a Staff Member</h2>
          <p className="text-slate-400 flex-grow">Access the staff dashboard, manage operations, moderate the community, and review applications.</p>
          <div className="mt-6 flex items-center text-purple-400 font-medium">
            Staff Login <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
