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
  Layers,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [eventsMenuOpen, setEventsMenuOpen] = useState(false);
  const [hardwareMenuOpen, setHardwareMenuOpen] = useState(false);
  const [certsMenuOpen, setCertsMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [topBannerVisible, setTopBannerVisible] = useState(true);

  const profileRef = useRef(null);
  const eventsMenuRef = useRef(null);
  const hardwareMenuRef = useRef(null);
  const certsMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();

  const isActive = (path) => location.pathname === path;

  // Global Ctrl+K / Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (eventsMenuRef.current && !eventsMenuRef.current.contains(event.target)) {
        setEventsMenuOpen(false);
      }
      if (hardwareMenuRef.current && !hardwareMenuRef.current.contains(event.target)) {
        setHardwareMenuOpen(false);
      }
      if (certsMenuRef.current && !certsMenuRef.current.contains(event.target)) {
        setCertsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileDropdownOpen(false);
    setEventsMenuOpen(false);
    setHardwareMenuOpen(false);
    setCertsMenuOpen(false);
  }, [location.pathname]);

  const getRoleConfig = (role) => {
    if (role === 'admin') {
      return {
        label: 'ADMIN',
        fullLabel: 'Super Administrator',
        badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-700',
        ringClass: 'ring-purple-500/60 bg-purple-950/90 text-purple-200'
      };
    }
    if (role === 'coordinator') {
      return {
        label: 'COORDINATOR',
        fullLabel: 'Faculty & Student Coordinator',
        badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-700',
        ringClass: 'ring-blue-500/60 bg-blue-950/90 text-blue-200'
      };
    }
    return {
      label: 'STUDENT',
      fullLabel: 'Student Member',
      badgeClass: 'bg-brand-cardHover text-brand-cyan border-brand-cyan/30',
      ringClass: 'ring-brand-cyan/40 bg-brand-card text-brand-cyan'
    };
  };

  const roleConfig = user ? getRoleConfig(user.role) : null;

  return (
    <>
      {/* =========================================================================
          1. TOP INSTITUTIONAL STATUS BANNER
      ========================================================================= */}
      {topBannerVisible && (
        <div className="bg-gradient-to-r from-[#050914] via-[#0A1226] to-[#050914] border-b border-brand-border/60 text-[11px] text-slate-300 py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="hidden sm:inline-flex items-center font-semibold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Hardware Lab Open: 09:00 AM – 08:00 PM
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan inline" />
                <span>
                  <strong>TechnoHacks 2026</strong> Registrations are live for all BIAS students!
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-4 flex-shrink-0 text-[10px] font-mono">
              <Link to="/events" className="text-brand-cyan hover:underline hidden md:inline">
                Explore Event Schedule →
              </Link>
              <button
                onClick={() => setTopBannerVisible(false)}
                className="text-slate-500 hover:text-slate-300 p-0.5"
                title="Dismiss announcement bar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. MASTER MAIN NAVIGATION BAR
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-xl border-b border-brand-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo & Institute Branding */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-blue-600 to-brand-cyan flex items-center justify-center shadow-lg glow-cyan group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-cyan font-sans">
                    TECHNOFORUM
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-brand-card border border-brand-border text-emerald-400">
                    BIAS
                  </span>
                </div>
                <span className="text-[10px] tracking-widest text-slate-400 font-mono font-semibold uppercase -mt-0.5">
                  Central Engineering Hub
                </span>
              </div>
            </Link>

            {/* Desktop Center Links with Mega-Menu Popovers */}
            <nav className="hidden lg:flex items-center space-x-1">

              {/* 1. Events Mega Menu */}
              <div className="relative" ref={eventsMenuRef}>
                <button
                  onClick={() => {
                    setEventsMenuOpen(!eventsMenuOpen);
                    setHardwareMenuOpen(false);
                    setCertsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive('/events') || eventsMenuOpen
                      ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-brand-card border border-transparent'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Events</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${eventsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {eventsMenuOpen && (
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-brand-card border border-brand-border shadow-2xl glow-card p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-wider px-2">
                      Upcoming Flagships & Workshops
                    </div>
                    <div className="space-y-1 text-xs">
                      <Link
                        to="/events"
                        onClick={() => setEventsMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-brand-bg flex items-start space-x-2.5 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-cyan-950/70 border border-cyan-800 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-brand-cyan transition-colors">
                            TechnoHacks 2026
                          </div>
                          <p className="text-[10px] text-slate-400">36-Hour Campus Hackathon • Dec 15</p>
                        </div>
                      </Link>

                      <Link
                        to="/events"
                        onClick={() => setEventsMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-brand-bg flex items-start space-x-2.5 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-950/70 border border-purple-800 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                            RoboQuest Obstacle Course
                          </div>
                          <p className="text-[10px] text-slate-400">Autonomous Line Follower Challenge</p>
                        </div>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-brand-border/60">
                      <Link
                        to="/events"
                        onClick={() => setEventsMenuOpen(false)}
                        className="text-xs font-semibold text-brand-cyan hover:underline flex items-center justify-between px-2"
                      >
                        <span>View All Events & Register</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Hardware Lab Mega Menu */}
              <div className="relative" ref={hardwareMenuRef}>
                <button
                  onClick={() => {
                    setHardwareMenuOpen(!hardwareMenuOpen);
                    setEventsMenuOpen(false);
                    setCertsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive('/inventory') || hardwareMenuOpen
                      ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-brand-card border border-transparent'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Hardware Lab</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${hardwareMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {hardwareMenuOpen && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-brand-card border border-brand-border shadow-2xl glow-card p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-wider px-2">
                      Laboratory Inventory & Tools
                    </div>
                    <div className="space-y-1 text-xs">
                      <Link
                        to="/inventory"
                        onClick={() => setHardwareMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-brand-bg flex items-start space-x-2.5 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-brand-blue/20 border border-brand-blue/40 text-brand-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Boxes className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-brand-cyan transition-colors">
                            Component Catalog
                          </div>
                          <p className="text-[10px] text-slate-400">Browse 180+ sensors, MCUs, cables & tools</p>
                        </div>
                      </Link>

                      <Link
                        to="/inventory"
                        onClick={() => setHardwareMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-brand-bg flex items-start space-x-2.5 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Scan className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                            AI Table Component Scanner
                          </div>
                          <p className="text-[10px] text-slate-400">Gemini Vision photo recognition for parts</p>
                        </div>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-brand-border/60">
                      <Link
                        to="/inventory"
                        onClick={() => setHardwareMenuOpen(false)}
                        className="text-xs font-semibold text-brand-cyan hover:underline flex items-center justify-between px-2"
                      >
                        <span>Open Hardware Catalog</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Notices Link */}
              <Link
                to="/announcements"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/announcements')
                    ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-brand-card border border-transparent'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Notices</span>
              </Link>

              {/* 4. Certificates Mega Menu */}
              <div className="relative" ref={certsMenuRef}>
                <button
                  onClick={() => {
                    setCertsMenuOpen(!certsMenuOpen);
                    setEventsMenuOpen(false);
                    setHardwareMenuOpen(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive('/certificates/verify') || isActive('/certificates/studio') || certsMenuOpen
                      ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-brand-card border border-transparent'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Certificates</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${certsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {certsMenuOpen && (
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-brand-card border border-brand-border shadow-2xl glow-card p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-wider px-2">
                      Digital Credential Engine
                    </div>
                    <div className="space-y-1 text-xs">
                      <Link
                        to="/certificates/verify"
                        onClick={() => setCertsMenuOpen(false)}
                        className="p-2.5 rounded-xl hover:bg-brand-bg flex items-start space-x-2.5 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-950/70 border border-amber-800 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                            Verify Credential (Public)
                          </div>
                          <p className="text-[10px] text-slate-400">Search by Certificate ID or Roll Number</p>
                        </div>
                      </Link>

                      {(user?.role === 'coordinator' || user?.role === 'admin') && (
                        <Link
                          to="/certificates/studio"
                          onClick={() => setCertsMenuOpen(false)}
                          className="p-2.5 rounded-xl hover:bg-brand-bg flex items-start space-x-2.5 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-purple-950/70 border border-purple-800 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Award className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                              Certificate Studio
                            </div>
                            <p className="text-[10px] text-slate-400">Upload CSV & Batch generate vector PDFs</p>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Special Admin Console Shortcut */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/users"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive('/admin/users')
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-600 shadow-sm'
                      : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 border border-purple-800/80'
                  }`}
                  title="Super Admin User & Role Management Console"
                >
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Manage Users</span>
                </Link>
              )}

            </nav>

            {/* Quick Spotlight Search Bar Trigger (`Ctrl + K`) */}
            <div className="hidden md:flex items-center ml-2">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-400 hover:text-slate-200 text-xs transition-colors"
                title="Search events, hardware components, roll numbers (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="hidden xl:inline text-[11px]">Quick Search...</span>
                <span className="xl:hidden text-[11px]">Search...</span>
                <kbd className="px-1.5 py-0.2 text-[10px] font-mono bg-brand-bg rounded border border-brand-border text-slate-400">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Right Controls: Notifications, Cart & User Profile */}
            <div className="hidden sm:flex items-center space-x-2.5">
              
              {/* Campus Notifications Popover */}
              <NotificationCenter />

              {/* Hardware Loan Cart Icon */}
              <Link
                to="/inventory"
                className="relative p-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 hover:text-brand-cyan transition-colors"
                title="Issued Components Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-cyan text-brand-bg font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center glow-cyan shadow-sm animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* LOGGED IN USER: Profile Pill with Rich Floating Dropdown */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-slate-700 transition-all text-left"
                  >
                    <div className={`w-7 h-7 rounded-lg ring-1 ${roleConfig.ringClass} flex items-center justify-center font-bold text-xs shadow-inner`}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white max-w-[110px] truncate leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-wider">
                        {roleConfig.label}
                      </span>
                    </div>

                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-brand-cyan' : ''}`} />
                  </button>

                  {/* Floating User Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-brand-card border border-brand-border shadow-2xl glow-card p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* User Header Details */}
                      <div className="p-3 rounded-xl bg-brand-bg/90 border border-brand-border/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate max-w-[150px]">{user.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${roleConfig.badgeClass}`}>
                            {roleConfig.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                        {user.rollNumber && (
                          <div className="text-[10px] font-mono text-brand-cyan flex items-center space-x-1">
                            <span>Roll:</span>
                            <span className="font-bold">{user.rollNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Navigation Actions */}
                      <div className="pt-1 space-y-0.5 text-xs">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-brand-bg transition-colors"
                        >
                          <User className="w-4 h-4 text-brand-cyan" />
                          <div className="flex flex-col">
                            <span className="font-semibold">My Dashboard</span>
                            <span className="text-[10px] text-slate-400">
                              {user.role === 'admin'
                                ? 'Root Admin Console'
                                : user.role === 'coordinator'
                                ? 'Hardware Audit & Active Loans'
                                : 'Borrowed Hardware & Registrations'}
                            </span>
                          </div>
                        </Link>

                        {/* Admin-only quick link */}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/users"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-950/50 transition-colors"
                          >
                            <Users className="w-4 h-4 text-purple-400" />
                            <div className="flex flex-col">
                              <span className="font-semibold">Manage Users & Roles</span>
                              <span className="text-[10px] text-purple-300/80">Promote coordinators & view users</span>
                            </div>
                          </Link>
                        )}

                        {/* Coordinator / Admin Cert Studio link */}
                        {(user.role === 'coordinator' || user.role === 'admin') && (
                          <Link
                            to="/certificates/studio"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-brand-bg transition-colors"
                          >
                            <Award className="w-4 h-4 text-indigo-400" />
                            <div className="flex flex-col">
                              <span className="font-semibold">Certificate Studio</span>
                              <span className="text-[10px] text-slate-400">Batch generate vector PDFs</span>
                            </div>
                          </Link>
                        )}

                        {/* External Supabase Cloud link for admin */}
                        {user.role === 'admin' && (
                          <a
                            href="https://supabase.com/dashboard"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-brand-bg transition-colors"
                          >
                            <span className="text-[11px] font-medium flex items-center space-x-2">
                              <span>Open Supabase Cloud</span>
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </a>
                        )}
                      </div>

                      {/* Sign Out Button */}
                      <div className="pt-1 border-t border-brand-border/60">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 text-xs font-semibold transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                /* GUEST / VISITOR: High-Contrast Cyber CTA Button */
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-cyan text-white text-xs font-bold shadow-md glow-blue transition-all"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

            </div>

            {/* Mobile Actions (Search + Cart + Hamburger) */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="p-2 rounded-xl bg-brand-card border border-brand-border text-slate-300"
                aria-label="Open Search"
              >
                <Search className="w-4 h-4 text-brand-cyan" />
              </button>

              <Link to="/inventory" className="relative p-2 rounded-xl text-slate-300">
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-cyan text-brand-bg font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
              
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl bg-brand-card border border-brand-border text-slate-300 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Accordion Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-brand-bg/98 border-b border-brand-border px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
            {user ? (
              <div className="p-3 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-lg ring-1 ${roleConfig.ringClass} flex items-center justify-center font-bold text-xs`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{user.name}</div>
                    <div className="text-[10px] text-slate-400">{user.email}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${roleConfig.badgeClass}`}>
                  {roleConfig.label}
                </span>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md glow-blue"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Student Registration</span>
              </Link>
            )}

            <div className="space-y-1">
              <Link
                to="/events"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-brand-card hover:text-white"
              >
                <Calendar className="w-4 h-4 text-brand-cyan" />
                <span>Events & Hackathons</span>
              </Link>

              <Link
                to="/inventory"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-brand-card hover:text-white"
              >
                <Boxes className="w-4 h-4 text-brand-blue" />
                <span>Hardware Lab & AI Scanner</span>
              </Link>

              <Link
                to="/announcements"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-brand-card hover:text-white"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Notices & Circulars</span>
              </Link>

              <Link
                to="/certificates/verify"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-brand-card hover:text-white"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verify Certificates</span>
              </Link>

              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-brand-card hover:text-white"
                >
                  <User className="w-4 h-4 text-brand-cyan" />
                  <span>My Profile & Active Loans</span>
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin/users"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 border border-purple-800"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Manage Users & Roles</span>
                </Link>
              )}
            </div>

            {user && (
              <div className="pt-2 border-t border-brand-border">
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Command Palette Spotlight Dialog */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
};

export default Navbar;