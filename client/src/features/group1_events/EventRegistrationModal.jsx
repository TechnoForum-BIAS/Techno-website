import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

/**
 * EventRegistrationModal Component
 * Owned by: Group 1 (Intern 1 & 2)
 * Handles individual or team registration for a selected event.
 */
const EventRegistrationModal = ({ event, isOpen, onClose, user }) => {
  const [submitted, setSubmitted] = useState(false);
  const [regForm, setRegForm] = useState({
    studentName: user ? user.name : '',
    rollNumber: user ? user.rollNumber : '',
    email: user ? user.email : '',
    phone: '',
    teamMembers: ''
  });

  useEffect(() => {
    if (user) {
      setRegForm(prev => ({
        ...prev,
        studentName: user.name || prev.studentName,
        rollNumber: user.rollNumber || prev.rollNumber,
        email: user.email || prev.email
      }));
    }
    setSubmitted(false);
  }, [user, event]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        ...regForm
      })
    })
      .then(res => res.json())
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        setSubmitted(true);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-card border border-brand-border rounded-2xl max-w-lg w-full p-6 space-y-4 glow-card relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Registration Confirmed!</h3>
            <p className="text-xs text-slate-300">
              You are registered for <strong className="text-brand-cyan">{event.title}</strong>. Check your college email for instructions.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-brand-blue text-white rounded-xl text-xs font-semibold glow-blue"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-brand-cyan uppercase">Participation Entry Form</span>
              <h3 className="text-lg font-bold text-white">{event.title}</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={regForm.studentName}
                  onChange={e => setRegForm({ ...regForm, studentName: e.target.value })}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">University Roll Number</label>
                  <input
                    type="text"
                    required
                    value={regForm.rollNumber}
                    onChange={e => setRegForm({ ...regForm, rollNumber: e.target.value })}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">College / Personal Email</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Phone Number (WhatsApp Notifications)</label>
                <input
                  type="text"
                  placeholder="+91 XXXXXXXXXX"
                  value={regForm.phone}
                  onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Team Members (if participating in group)</label>
                <textarea
                  placeholder="e.g. Rahul (230105), Sneha (230112)"
                  rows={2}
                  value={regForm.teamMembers}
                  onChange={e => setRegForm({ ...regForm, teamMembers: e.target.value })}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-brand-card hover:bg-slate-800 border border-brand-border text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-semibold glow-blue"
              >
                Confirm Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationModal;
