import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User, 
  Shield, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Hash, 
  Sparkles,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, verifyEmail, resendOtp, forgotPassword, resetPassword } = useAuth();

  // Active view: 'login' | 'signup' | 'verify' | 'forgot' | 'reset'
  const [activeTab, setActiveTab] = useState('login');

  // Shared state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('230101');
  const [loginPassword, setLoginPassword] = useState('user123');

  // Signup Form
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    rollNumber: '',
    password: '',
    role: 'user' // 'user' | 'coordinator' | 'admin'
  });

  // Verify Email Form
  const [verifyEmailAddress, setVerifyEmailAddress] = useState('');
  const [verifyOtpCode, setVerifyOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot & Reset Password Form
  const [resetEmailAddress, setResetEmailAddress] = useState('');
  const [resetOtpCode, setResetOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1 = enter email, 2 = enter code & new password

  // Parse URL query parameters if present
  useEffect(() => {
    const tab = searchParams.get('tab');
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    if (tab === 'verify') {
      setActiveTab('verify');
      if (email) setVerifyEmailAddress(email);
      if (code) setVerifyOtpCode(code);
    } else if (tab === 'reset') {
      setActiveTab('forgot');
      setResetStep(2);
      if (email) setResetEmailAddress(email);
      if (code) setResetOtpCode(code);
    }
  }, [searchParams]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const clearAlerts = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Quick switch role preset for demo / intern testing
  const applyPreset = (presetRole) => {
    clearAlerts();
    if (presetRole === 'admin') {
      setLoginIdentifier('admin@bias.ac.in');
      setLoginPassword('admin123');
    } else if (presetRole === 'coordinator') {
      setLoginIdentifier('coordinator@bias.ac.in');
      setLoginPassword('coord123');
    } else {
      setLoginIdentifier('aarav.2023@bias.ac.in');
      setLoginPassword('user123');
    }
  };

  // --- Handlers ---

  // 1. Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        if (data.notVerified) {
          setVerifyEmailAddress(data.email || loginIdentifier);
          setActiveTab('verify');
          setErrorMessage(data.message || 'Please verify your email before logging in.');
          return;
        }
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
        return;
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setErrorMessage('Network error while connecting to server. Please ensure server is running.');
    }
  };

  // 2. Handle Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    try {
      const data = await signup(signupForm);
      setLoading(false);

      if (!data.success) {
        setErrorMessage(data.message || 'Registration failed. Please check the entered fields.');
        return;
      }

      setVerifyEmailAddress(signupForm.email);
      setActiveTab('verify');
      setSuccessMessage(data.message || 'Registration successful! Enter the 6-digit code sent to your email.');
    } catch (err) {
      setLoading(false);
      setErrorMessage('Error communicating with server: ' + err.message);
    }
  };

  // 3. Handle Verify Email OTP
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    try {
      const data = await verifyEmail({
        email: verifyEmailAddress,
        code: verifyOtpCode
      });
      setLoading(false);

      if (!data.success) {
        setErrorMessage(data.message || 'Verification failed. Please check the code.');
        return;
      }

      setSuccessMessage('Email verified successfully! Entering platform...');
      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      setLoading(false);
      setErrorMessage('Verification failed: ' + err.message);
    }
  };

  // 4. Handle Resend OTP
  const handleResendOtp = async () => {
    if (!verifyEmailAddress) {
      setErrorMessage('Please enter your email address to resend OTP.');
      return;
    }
    clearAlerts();
    setLoading(true);

    try {
      const data = await resendOtp(verifyEmailAddress);
      setLoading(false);

      if (!data.success) {
        setErrorMessage(data.message || 'Failed to resend code.');
        return;
      }

      setResendCooldown(45);
      setSuccessMessage('A fresh 6-digit verification code has been dispatched to your email.');
    } catch (err) {
      setLoading(false);
      setErrorMessage('Failed to resend: ' + err.message);
    }
  };

  // 5. Handle Forgot Password Request (Step 1)
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    try {
      const data = await forgotPassword(resetEmailAddress);
      setLoading(false);

      if (!data.success) {
        setErrorMessage(data.message || 'Failed to send reset code.');
        return;
      }

      setResetStep(2);
      setSuccessMessage('If an account exists for this email, a 6-digit reset code has been sent.');
    } catch (err) {
      setLoading(false);
      setErrorMessage('Error: ' + err.message);
    }
  };

  // 6. Handle Reset Password (Step 2)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword({
        email: resetEmailAddress,
        code: resetOtpCode,
        newPassword
      });
      setLoading(false);

      if (!data.success) {
        setErrorMessage(data.message || 'Failed to reset password.');
        return;
      }

      setSuccessMessage('Password reset successfully! You can now sign in with your new password.');
      setTimeout(() => {
        setActiveTab('login');
        setLoginIdentifier(resetEmailAddress);
        setLoginPassword('');
        setResetStep(1);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setErrorMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="max-w-md w-full bg-brand-card border border-brand-border rounded-2xl p-8 glow-card space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center mx-auto glow-cyan">
            {activeTab === 'verify' ? (
              <Mail className="w-6 h-6 text-white" />
            ) : activeTab === 'forgot' ? (
              <KeyRound className="w-6 h-6 text-white" />
            ) : (
              <Cpu className="w-6 h-6 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide">
            {activeTab === 'login' && 'Sign In to Technoforum'}
            {activeTab === 'signup' && 'Create Your Account'}
            {activeTab === 'verify' && 'Verify Your Email'}
            {activeTab === 'forgot' && (resetStep === 1 ? 'Forgot Password' : 'Set New Password')}
          </h2>
          <p className="text-xs text-slate-400">
            Birla Institute of Applied Sciences • Central Student Portal
          </p>
        </div>

        {/* Global Notifications (Error / Success / Rate Limit) */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: SIGN IN (LOGIN)
        ========================================================================= */}
        {activeTab === 'login' && (
          <div className="space-y-5">
            {/* Quick Demo Preset Selector for Interns */}
            <div>
              <div className="text-[11px] text-brand-muted font-mono mb-1.5 flex items-center justify-between">
                <span>Quick Role Demo:</span>
                <span className="text-brand-cyan font-semibold">Click to Test Role</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 bg-brand-bg p-1 rounded-xl border border-brand-border text-xs">
                <button
                  type="button"
                  onClick={() => applyPreset('user')}
                  className="py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-brand-card font-semibold text-[11px]"
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('coordinator')}
                  className="py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-brand-card font-semibold text-[11px]"
                >
                  Coordinator
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('admin')}
                  className="py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-brand-card font-semibold text-[11px]"
                >
                  Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">University Roll Number or Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 230101 or user@bias.ac.in"
                    className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      clearAlerts();
                      setActiveTab('forgot');
                      setResetStep(1);
                    }}
                    className="text-[11px] text-brand-cyan hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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

            <div className="text-center pt-2 border-t border-brand-border/60 text-xs text-slate-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setActiveTab('signup');
                }}
                className="text-brand-cyan font-semibold hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: SIGN UP (REGISTRATION)
        ========================================================================= */}
        {activeTab === 'signup' && (
          <div className="space-y-4">
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Roll Number</label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={signupForm.rollNumber}
                      onChange={(e) => setSignupForm({ ...signupForm, rollNumber: e.target.value })}
                      placeholder="e.g. 230101"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Assign Role</label>
                  <select
                    value={signupForm.role}
                    onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan font-mono"
                  >
                    <option value="user">User (Student)</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="e.g. aarav@bias.ac.in"
                    className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>
                <span className="text-[10px] text-brand-muted mt-0.5 block">
                  A 6-digit verification code will be dispatched via Brevo SMTP.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Password (Min 6 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white font-bold text-xs glow-blue transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <span>{loading ? 'Registering Account...' : 'Sign Up & Send Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-brand-border/60 text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setActiveTab('login');
                }}
                className="text-brand-cyan font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: VERIFY EMAIL (6-DIGIT OTP)
        ========================================================================= */}
        {activeTab === 'verify' && (
          <div className="space-y-5">
            <div className="p-3 bg-brand-bg rounded-xl border border-brand-border text-center text-xs text-slate-300">
              Enter the 6-digit verification code sent to: <br />
              <strong className="text-brand-cyan font-mono">{verifyEmailAddress || 'your email'}</strong>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Confirm Email Address</label>
                <input
                  type="email"
                  required
                  value={verifyEmailAddress}
                  onChange={(e) => setVerifyEmailAddress(e.target.value)}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 text-center font-semibold">
                  6-Digit Verification Code (OTP)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verifyOtpCode}
                  onChange={(e) => setVerifyOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[12px] font-mono text-2xl font-bold bg-brand-bg border-2 border-brand-cyan/60 rounded-xl py-3 text-brand-cyan focus:outline-none focus:border-brand-cyan glow-cyan"
                />
                <span className="text-[10px] text-center text-brand-muted block mt-1">
                  Code expires in 15 minutes. Check spam or server logs if testing locally.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || verifyOtpCode.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-brand-bg font-extrabold text-xs glow-cyan transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Verifying...' : 'Verify Email & Enter Portal'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-xs">
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setActiveTab('login');
                }}
                className="text-slate-400 hover:text-white"
              >
                ← Back to Login
              </button>

              <button
                type="button"
                disabled={loading || resendCooldown > 0}
                onClick={handleResendOtp}
                className="text-brand-cyan hover:underline disabled:opacity-50 flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: FORGOT & RESET PASSWORD
        ========================================================================= */}
        {activeTab === 'forgot' && (
          <div className="space-y-5">
            {resetStep === 1 ? (
              // Step 1: Send Reset OTP
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Enter your registered email address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={resetEmailAddress}
                      onChange={(e) => setResetEmailAddress(e.target.value)}
                      placeholder="e.g. user@bias.ac.in"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                  <span className="text-[10px] text-brand-muted mt-1 block">
                    We'll dispatch a 6-digit password reset code through Brevo SMTP.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs glow-blue transition-all flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Dispatching OTP...' : 'Send Password Reset Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              // Step 2: Enter OTP & New Password
              <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Registered Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmailAddress}
                    onChange={(e) => setResetEmailAddress(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 text-center font-semibold">
                    6-Digit Reset Code (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtpCode}
                    onChange={(e) => setResetOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[10px] font-mono text-xl font-bold bg-brand-bg border border-rose-500 rounded-xl py-2 text-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">New Password (Min 6 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-brand-blue text-white font-bold text-xs glow-blue transition-all flex items-center justify-center space-x-2 mt-2"
                >
                  <span>{loading ? 'Updating Password...' : 'Save New Password & Sign In'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-xs">
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setActiveTab('login');
                  setResetStep(1);
                }}
                className="text-slate-400 hover:text-white"
              >
                ← Back to Login
              </button>
              {resetStep === 2 && (
                <button
                  type="button"
                  onClick={() => setResetStep(1)}
                  className="text-brand-cyan hover:underline"
                >
                  Resend Reset Code
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
