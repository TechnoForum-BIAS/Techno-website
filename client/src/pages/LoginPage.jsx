import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Shield, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('230101');
  const [password, setPassword] = useState('student123');
  const [role, setRole] = useState('student'); // 'student' or 'coordinator'
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, role })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.token && data.user) {
          login(data.user, data.token);
          navigate('/');
        } else {
          // Fallback login for intern testing
          login({
            id: 'usr-002',
            name: identifier === '230101' ? 'Aarav Sharma' : 'Student User',
            email: `${identifier}@bias.ac.in`,
            rollNumber: identifier,
            role: role
          }, 'mock-dev-token');
          navigate('/');
        }
      })
      .catch(() => {
        // Fallback login
        login({
          id: 'usr-002',
          name: identifier === '230101' ? 'Aarav Sharma' : 'Student User',
          email: `${identifier}@bias.ac.in`,
          rollNumber: identifier,
          role: role
        }, 'mock-dev-token');
        navigate('/');
      });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-brand-card border border-brand-border rounded-2xl p-8 glow-card space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/20 text-brand-cyan flex items-center justify-center mx-auto glow-cyan">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Technoforum Login</h2>
          <p className="text-xs text-slate-400">
            Sign in with your University Roll Number or BIAS Email.
          </p>
        </div>

        {/* Role toggle for easy intern testing */}
        <div className="grid grid-cols-2 gap-2 bg-brand-bg p-1 rounded-xl border border-brand-border text-xs">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              setIdentifier('230101');
              setPassword('student123');
            }}
            className={`py-2 rounded-lg font-semibold transition-all ${
              role === 'student'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Student Account
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('coordinator');
              setIdentifier('coordinator@bias.ac.in');
              setPassword('admin123');
            }}
            className={`py-2 rounded-lg font-semibold transition-all ${
              role === 'coordinator'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Coordinator / Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">
              {role === 'student' ? 'University Roll Number or Email' : 'Coordinator College Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={role === 'student' ? 'e.g. 230101' : 'coordinator@bias.ac.in'}
                className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white font-bold text-xs glow-blue transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 font-mono">
          Pre-filled with test credentials for intern development.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
