import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CommandPalette from './CommandPalette';
import NotificationCenter from './NotificationCenter';
import {
  Cpu,
  Calendar,
  Boxes,
  Award,
  CheckCircle2,
  Bell,
  ShoppingCart,
  User,
  Menu,
  X,
  Shield,
  Users,
  LogOut,
  ChevronDown,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Search,
  Scan,
  FileText,
  Clock,
  MapPin,
  Layers,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');

  const accountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();

  const isActive = (path) => location.pathname === path;

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setAccountDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      setCommandPaletteOpen(true);
      return;
    }

    // Direct routing for roll numbers or certificate IDs
    if (/^\d{6}$/.test(q) || q.toUpperCase().startsWith('TF-')) {
      navigate(`/certificates/verify?query=${encodeURIComponent(q)}`);
      return;
    }

    // Otherwise open spotlight search with current typed query
    setCommandPaletteOpen(true);
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return {
        label: 'ADMIN',
        full: 'Super Admin',
        color: 'bg-purple-950/80 text-purple-300 border-purple-700',
        ring: 'ring-purple-500/70 text-purple-200'
      };
    }
    if (role === 'coordinator') {
      return {
        label: 'COORDINATOR',
        full: 'Coordinator',
        color: 'bg-blue-950/80 text-blue-300 border-blue-700',
        ring: 'ring-blue-500/70 text-blue-200'
      };
    }
    return {
      label: 'STUDENT',
      full: 'Student Member',
      color: 'bg-brand-cardHover text-brand-cyan border-brand-cyan/30',
      ring: 'ring-brand-cyan/40 text-brand-cyan'
    };
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  return (
    <header className="sticky top-0 z-40 bg-[#070B19] border-b border-brand-border shadow-lg">
      
      {/* =========================================================================
          ROW 1: PRIMARY AMAZON-STYLE UTILITY BAR
      ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">

          {/* 1. BRAND LOGO */}
          <Link to="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-blue-600 to-brand-cyan flex items-center justify-center shadow-lg glow-cyan group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-cyan font-sans leading-none">
                TECHNOFORUM
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-mono font-semibold uppercase mt-0.5">
                BIAS Bhimtal
              </span>
            </div>
          </Link>

          {/* 2. CAMPUS LOCATION & LAB STATUS (Amazon 'Deliver To' Style) */}
          <Link
            to="/announcements"
            className="hidden xl:flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-brand-card/80 border border-transparent hover:border-brand-border text-left transition-colors flex-shrink-0"
            title="Campus Status & Lab Timings"
          >
            <MapPin className="w-4 h-4 text-brand-cyan flex-shrink-0" />
            <div className="flex flex-col text-[11px] leading-tight">
              <span className="text-slate-400 font-medium">BIAS Campus</span>
              <span className="text-white font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Lab 9AM-8PM</span>
              </span>
            </div>
          </Link>

          {/* 3. CENTER SEARCH BAR (Amazon Full-Width Quick Search) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-grow max-w-2xl relative"
          >
            <div className="flex w-full rounded-xl bg-[#0A1224] border border-slate-700/80 hover:border-brand-cyan focus-within:border-brand-cyan focus-within:ring-1 focus-within:ring-brand-cyan transition-all overflow-hidden shadow-inner">
              
              {/* Category Pill */}
              <div className="hidden lg:flex items-center px-3 bg-[#0F1A33] border-r border-slate-700/70 text-slate-300 text-xs font-semibold cursor-pointer">
                <span>{searchCategory}</span>
              </div>

              {/* Main Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components, sensors, hackathons, roll number (e.g. 230101)..."
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
              />

              {/* Keyboard Shortcut Hint */}
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden xl:flex items-center px-2 text-[10px] font-mono text-slate-400 hover:text-white"
                title="Open Spotlight Search Dialog"
              >
                <kbd className="bg-brand-card px-1.5 py-0.5 rounded border border-brand-border">Ctrl K</kbd>
              </button>

              {/* Search Submit Action Button */}
              <button
                type="submit"
                className="px-4 bg-brand-blue hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm"
                title="Execute Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 4. RIGHT UTILITIES: NOTIFICATIONS, ACCOUNT & LISTS DROPDOWN, CART */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">

            {/* Campus Broadcast Bell */}
            <NotificationCenter />

            {/* AMAZON-STYLE "ACCOUNT & ACCESS" DROPDOWN */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl hover:bg-brand-card border border-transparent hover:border-brand-border text-left transition-all"
                title="Account, Orders & Access"
              >
                <div className="flex flex-col text-[11px] leading-tight">
                  <span className="text-slate-400">
                    {user ? `Hello, ${(user.name || 'Member').split(' ')[0]}` : 'Hello, Sign In'}
                  </span>
                  <div className="flex items-center space-x-1 font-bold text-white">
                    <span>{user ? (roleBadge ? roleBadge.full : 'Account') : 'Account & Access'}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${accountDropdownOpen ? 'rotate-180 text-brand-cyan' : ''}`} />
                  </div>
                </div>
              </button>

              {/* AMAZON-STYLE RICH POPUP CARD */}
              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0D1527] border border-brand-border shadow-2xl glow-card p-4 space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* --- CASE A: GUEST / VISITOR VIEW --- */}
                  {!user ? (
                    <div className="space-y-4">
                      <div className="text-center space-y-2 pb-3 border-b border-brand-border/80">
                        <Link
                          to="/login"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-cyan text-white text-xs font-bold rounded-xl shadow-md glow-blue transition-all"
                        >
                          <span>Sign In to Student Portal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <div className="text-[11px] text-slate-400">
                          New student or faculty?{' '}
                          <Link to="/login" onClick={() => setAccountDropdownOpen(false)} className="text-brand-cyan hover:underline font-semibold">
                            Start here (Sign Up)
                          </Link>
                        </div>
                      </div>

                      {/* Useful Quick Links for Visitors */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-wider block">
                          Instant Access Links
                        </span>

                        <Link
                          to="/certificates/verify"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                        >
                          <span className="flex items-center space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Verify Student Certificate</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Public</span>
                        </Link>

                        <Link
                          to="/events"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                        >
                          <span className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                            <span>Upcoming Hackathons & Contests</span>
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">Live</span>
                        </Link>

                        <Link
                          to="/inventory"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                        >
                          <span className="flex items-center space-x-2">
                            <Boxes className="w-3.5 h-3.5 text-blue-400" />
                            <span>Browse Laboratory Components</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">180+ Parts</span>
                        </Link>

                        <Link
                          to="/announcements"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                        >
                          <span className="flex items-center space-x-2">
                            <FileText className="w-3.5 h-3.5 text-purple-400" />
                            <span>Society Circulars & Lab Rules</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Notices</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* --- CASE B: LOGGED IN USER (AMAZON-STYLE 2-COLUMN VIEW) --- */
                    <div className="space-y-3">
                      {/* User Header */}
                      <div className="p-3 rounded-xl bg-brand-bg/90 border border-brand-border/80 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{user.name}</div>
                          <div className="text-[11px] text-slate-400">{user.email}</div>
                          {user.rollNumber && (
                            <div className="text-[10px] font-mono text-brand-cyan">Roll: {user.rollNumber}</div>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${roleBadge.color}`}>
                          {roleBadge.label}
                        </span>
                      </div>

                      {/* 2-Column Links Layout */}
                      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                        
                        {/* Column 1: Campus Activity */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block border-b border-brand-border pb-1">
                            Your Activity
                          </span>
                          <Link
                            to="/profile"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="block p-1.5 rounded hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                          >
                            Hardware Loans
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="block p-1.5 rounded hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                          >
                            Registered Events
                          </Link>
                          <Link
                            to="/certificates/verify"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="block p-1.5 rounded hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                          >
                            My Certificates
                          </Link>
                        </div>

                        {/* Column 2: Account & Tools */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block border-b border-brand-border pb-1">
                            Account & Tools
                          </span>
                          <Link
                            to="/profile"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="block p-1.5 rounded hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                          >
                            Your Dashboard
                          </Link>
                          
                          {/* Admin-only user management */}
                          {user.role === 'admin' && (
                            <Link
                              to="/admin/users"
                              onClick={() => setAccountDropdownOpen(false)}
                              className="block p-1.5 rounded hover:bg-purple-950/40 text-purple-300 font-bold transition-colors"
                            >
                              Manage Users 🛡️
                            </Link>
                          )}

                          {/* Coordinator/Admin cert studio */}
                          {(user.role === 'coordinator' || user.role === 'admin') && (
                            <Link
                              to="/certificates/studio"
                              onClick={() => setAccountDropdownOpen(false)}
                              className="block p-1.5 rounded hover:bg-brand-bg text-slate-300 hover:text-white transition-colors"
                            >
                              Cert Studio
                            </Link>
                          )}

                          {user.role === 'admin' && (
                            <a
                              href="https://supabase.com/dashboard"
                              target="_blank"
                              rel="noreferrer"
                              className="block p-1.5 rounded hover:bg-brand-bg text-slate-400 hover:text-white transition-colors"
                            >
                              Supabase ↗
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Sign Out Button */}
                      <div className="pt-2 border-t border-brand-border flex items-center justify-between">
                        <button
                          onClick={() => {
                            logout();
                            setAccountDropdownOpen(false);
                            navigate('/login');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                        <span className="text-[10px] text-slate-500 font-mono">Session Secured</span>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* AMAZON-STYLE ISSUE CART */}
            <Link
              to="/inventory"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-brand-card border border-transparent hover:border-brand-border text-slate-300 hover:text-white transition-all flex-shrink-0"
              title="Issued Hardware Components Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-brand-cyan" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-cyan text-brand-bg font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center glow-cyan shadow-sm animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-white">Cart</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center ml-1">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl bg-brand-card border border-brand-border text-slate-300 hover:text-white"
                aria-label="Toggle Mobile Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          ROW 2: SECONDARY SUB-NAVIGATION BAR (100% DIRECT SINGLE CLICKS)
          ZERO ANNOYING POPUPS! Clicking any link instantly navigates to the page!
      ========================================================================= */}
      <div className="bg-[#0A1020] border-t border-brand-border/70 px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold overflow-x-auto scrollbar-none">
          
          {/* Direct Single-Click Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            
            {/* 1. All Events (Single Click) */}
            <Link
              to="/events"
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-colors ${
                isActive('/events')
                  ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-brand-card'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
              <span>All Events</span>
            </Link>

            {/* 2. Hardware Lab (Single Click) */}
            <Link
              to="/inventory"
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-colors ${
                isActive('/inventory')
                  ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-brand-card'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-brand-blue" />
              <span>Hardware Lab</span>
            </Link>

            {/* 3. Campus Notices (Single Click) */}
            <Link
              to="/announcements"
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-colors ${
                isActive('/announcements')
                  ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-brand-card'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Notices</span>
            </Link>

            {/* 4. Verify Certificate (Single Click) */}
            <Link
              to="/certificates/verify"
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-colors ${
                isActive('/certificates/verify')
                  ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-brand-card'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Certificate</span>
            </Link>

            {/* 5. Certificate Studio (Coordinators & Admin) */}
            {(user?.role === 'coordinator' || user?.role === 'admin') && (
              <Link
                to="/certificates/studio"
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive('/certificates/studio')
                    ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-brand-card'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>Certificate Studio</span>
              </Link>
            )}

            {/* 6. Manage Users & Roles (Super Admin) */}
            {user?.role === 'admin' && (
              <Link
                to="/admin/users"
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive('/admin/users')
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-600 shadow-sm font-bold'
                    : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 border border-purple-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Manage Users & Roles</span>
              </Link>
            )}

          </div>

          {/* Right Highlight: Direct Link to AI Table Component Scanner */}
          <Link
            to="/inventory"
            className="hidden md:flex items-center space-x-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors flex-shrink-0"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>AI Component Scanner Online</span>
          </Link>

        </div>
      </div>

      {/* =========================================================================
          MOBILE ACCORDION DRAWER
      ========================================================================= */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-bg/98 border-t border-brand-border px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
          
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components, events, roll no..."
              className="w-full bg-[#0A1224] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-brand-blue text-white rounded-lg flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* User Status Bar */}
          {user ? (
            <div className="p-3 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[10px] text-slate-400">{user.email}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Student Register</span>
            </Link>
          )}

          {/* Quick Single-Click Links */}
          <div className="space-y-1 text-xs">
            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-brand-card hover:text-white"
            >
              <Calendar className="w-4 h-4 text-brand-cyan" />
              <span>All Events & Hackathons</span>
            </Link>

            <Link
              to="/inventory"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-brand-card hover:text-white"
            >
              <Boxes className="w-4 h-4 text-brand-blue" />
              <span>Hardware Lab Catalog</span>
            </Link>

            <Link
              to="/announcements"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-brand-card hover:text-white"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Campus Notices & Rules</span>
            </Link>

            <Link
              to="/certificates/verify"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-brand-card hover:text-white"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Verify Certificate</span>
            </Link>

            {user && (
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-300 hover:bg-brand-card hover:text-white"
              >
                <User className="w-4 h-4 text-brand-cyan" />
                <span>My Profile & Dashboard</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin/users"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl text-purple-300 bg-purple-950/40 border border-purple-800"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Manage Users & Roles</span>
              </Link>
            )}
          </div>

          {/* Sign Out for Mobile */}
          {user && (
            <div className="pt-2 border-t border-brand-border">
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* Global Spotlight Search Palette Dialog */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        initialQuery={searchQuery}
      />
    </header>
  );
};

export default Navbar;