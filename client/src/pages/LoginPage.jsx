import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Hash,
  Cpu
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, verifyEmail, resendOtp, googleLogin, forgotPassword, resetPassword } = useAuth();

  // Active view: 'login' | 'signup' | 'verify' | 'forgot'
  const [activeTab, setActiveTab] = useState('login');

  // Shared state
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Form State
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    rollNumber: '',
    password: ''
  });

  // Verify Email Form State
  const [verifyEmailAddress, setVerifyEmailAddress] = useState('');
  const [verifyOtpCode, setVerifyOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot & Reset Password Form State
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

  // Google Identity Services (GSI) Auto-Render
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (window.google?.accounts?.id && googleClientId && !googleClientId.includes('your-google')) {
      try {
        // Initialize Google Identity Services for one-tap or OAuth response
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response.credential) {
              setGoogleLoading(true);
              const data = await googleLogin({
                credential: response.credential
              });
              setGoogleLoading(false);
              if (data.success) {
                navigate('/');
              } else {
                setErrorMessage(data.message || 'Google authentication failed.');
              }
            }
          }
        });
      } catch (err) {
        console.warn('Google GSI init notice:', err);
      }
    }
  }, [googleLogin, navigate]);

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

  // --- Handlers ---

  // 1. Handle Standard Sign In (Strict - Blocks unverified accounts)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword
        })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        if (data.notVerified) {
          setVerifyEmailAddress(data.email || loginIdentifier);
          setActiveTab('verify');
          setErrorMessage(data.message || 'Please verify your email before logging in. A 6-digit code was sent via Brevo.');
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

  // 2. Handle Sign Up (Strict - Triggers Brevo verification code)
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
      setSuccessMessage('Registration successful! Please enter the 6-digit verification code sent to your email.');
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
      }, 1000);
    } catch (err) {
      setLoading(false);
      setErrorMessage('Verification failed: ' + err.message);
    }
  };

  // 4. Handle Resend OTP via Brevo
  const handleResendOtp = async () => {
    if (!verifyEmailAddress) {
      setErrorMessage('Please enter your email address to resend the code.');
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
      setSuccessMessage('A fresh 6-digit verification code has been dispatched via Brevo SMTP.');
    } catch (err) {
      setLoading(false);
      setErrorMessage('Failed to resend: ' + err.message);
    }
  };

  // 5. Native 1-Click Google OAuth Popup Flow
  const handleGoogleClick = () => {
    clearAlerts();
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId || googleClientId.includes('your-google')) {
      setErrorMessage('Google Client ID is not configured yet. Please ensure VITE_GOOGLE_CLIENT_ID is set in client/.env');
      return;
    }

    if (!window.google) {
      setErrorMessage('Google authentication script is still loading. Please check your internet connection and retry.');
      return;
    }

    setGoogleLoading(true);

    // Primary: Google OAuth2 Token Client (Opens official Google Account Chooser popup directly)
    if (window.google.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setGoogleLoading(false);
              setErrorMessage('Google authentication was cancelled or failed.');
              return;
            }

            try {
              // Fetch authenticated profile from official Google userinfo endpoint
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const profile = await userInfoRes.json();

              if (!profile.email) {
                setGoogleLoading(false);
                setErrorMessage('Unable to retrieve email from Google.');
                return;
              }

              // Send verified profile to backend: auto-creates new account as student or logs in existing account
              const data = await googleLogin({
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
                accessToken: tokenResponse.access_token
              });

              setGoogleLoading(false);

              if (!data.success) {
                setErrorMessage(data.message || 'Google sign-in failed.');
                return;
              }

              setSuccessMessage('Google authentication successful! Redirecting...');
              setTimeout(() => {
                navigate('/');
              }, 400);
            } catch (fetchErr) {
              setGoogleLoading(false);
              setErrorMessage('Failed to fetch Google profile: ' + fetchErr.message);
            }
          }
        });

        client.requestAccessToken();
        return;
      } catch (oauthErr) {
        console.warn('Google oauth2 client initialization error:', oauthErr);
      }
    }

    // Secondary Fallback: Google One Tap prompt
    if (window.google.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setGoogleLoading(false);
          setErrorMessage('Google Sign-In prompt was closed or suppressed by browser settings.');
        }
      });
    } else {
      setGoogleLoading(false);
      setErrorMessage('Google authentication service is unavailable in this browser environment.');
    }
  };

  // 6. Handle Forgot Password Request (Step 1)
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
      setSuccessMessage('A 6-digit password reset code has been dispatched via Brevo.');
    } catch (err) {
      setLoading(false);
      setErrorMessage('Error: ' + err.message);
    }
  };

  // 7. Handle Reset Password (Step 2)
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

        {/* Global Notifications */}
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

        {/* Google OAuth Fast Access Button */}
        {(activeTab === 'login' || activeTab === 'signup') && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={googleLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2.5 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting Google...' : 'Continue with Google (Fast Access)'}</span>
            </button>

            <div className="flex items-center space-x-3 text-xs text-brand-muted">
              <div className="flex-1 h-px bg-brand-border"></div>
              <span>OR ENTER CREDENTIALS</span>
              <div className="flex-1 h-px bg-brand-border"></div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 1: SIGN IN (LOGIN)
        ========================================================================= */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {/* Email or Roll Number */}
            <div>
              <label className="block text-slate-300 mb-1">University Roll Number or Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. 230101 or techno_forum@birlainstitute.co.in"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            {/* Password */}
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
                Sign Up & Verify Email
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 2: SIGN UP (REGISTRATION)
        ========================================================================= */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
            {/* Full Name */}
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

            {/* Email Address */}
            <div>
              <label className="block text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="e.g. student@bias.ac.in"
                  className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
              <span className="text-[10px] text-brand-muted mt-0.5 block">
                A 6-digit verification code will be sent to this email via Brevo SMTP.
              </span>
            </div>

            {/* Password */}
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
              <span>{loading ? 'Dispatching Verification...' : 'Create Account & Send Verification'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 border-t border-brand-border/60 text-xs text-slate-400">
              Already registered?{' '}
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
          </form>
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
                  Check your inbox or spam folder. Code is valid for 15 minutes.
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
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Enter your registered email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={resetEmailAddress}
                      onChange={(e) => setResetEmailAddress(e.target.value)}
                      placeholder="e.g. student@bias.ac.in"
                      className="w-full bg-brand-bg border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                  <span className="text-[10px] text-brand-muted mt-1 block">
                    We'll dispatch a 6-digit password reset code via Brevo SMTP.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs glow-blue transition-all flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Dispatching Code...' : 'Send Password Reset Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
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
