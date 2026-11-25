import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
  ArrowRight
} from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();

  const isActive = (path) => location.pathname === path;

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Primary navigation links tailored by role
  // Keeps the bar uncluttered: maximum 4-6 links
  const getNavLinks = () => {
    const baseLinks = [
      { name: 'Events', path: '/events', icon: Calendar },
      { name: 'Hardware Lab', path: '/inventory', icon: Boxes },
      { name: 'Notices', path: '/announcements', icon: Bell },
      { name: 'Verify Certificate', path: '/certificates/verify', icon: CheckCircle2 }
    ];

    if (!user) {
      return baseLinks;
    }

    if (user.role === 'admin') {
      return [
        ...baseLinks,
        { name: 'Cert Studio', path: '/certificates/studio', icon: Award },
        { name: 'Manage Users', path: '/admin/users', icon: Users, isHighlight: true }
      ];
    }

    if (user.role === 'coordinator') {
      return [
        ...baseLinks,
        { name: 'Cert Studio', path: '/certificates/studio', icon: Award }
      ];
    }

    // Student Member
    return baseLinks;
  };

  const navLinks = getNavLinks();

  const getRoleConfig = (role) => {
    if (role === 'admin') {
      return {
        label: 'ADMIN',
        badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-700',
        ringClass: 'ring-purple-500/60 bg-purple-950/90 text-purple-200'
      };
    }
    if (role === 'coordinator') {
      return {
        label: 'COORDINATOR',
        badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-700',
        ringClass: 'ring-blue-500/60 bg-blue-950/90 text-blue-200'
      };
    }
    return {
      label: 'STUDENT',
      badgeClass: 'bg-brand-cardHover text-brand-cyan border-brand-cyan/30',
      ringClass: 'ring-brand-cyan/40 bg-brand-card text-brand-cyan'
    };
  };

  const roleConfig = user ? getRoleConfig(user.role) : null;

  return (
    <header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* =========================================================================
              1. BRAND LOGO
          ========================================================================= */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center shadow-lg glow-cyan group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-cyan font-sans">
                  TECHNOFORUM
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-brand-card border border-brand-border text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  BIAS
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-slate-400 font-mono font-semibold uppercase -mt-0.5">
                Central Engineering Hub
              </span>
            </div>
          </Link>

          {/* =========================================================================
              2. DESKTOP CENTER NAVIGATION LINKS
          ========================================================================= */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40 shadow-sm'
                      : link.isHighlight
                      ? 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 border border-purple-800'
                      : 'text-slate-300 hover:text-white hover:bg-brand-card border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-brand-cyan' : link.isHighlight ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* =========================================================================
              3. RIGHT ACTION CONTROLS (CART & USER PROFILE / SIGN IN)
          ========================================================================= */}
          <div className="hidden sm:flex items-center space-x-3">

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

            {/* LOGGED IN USER: Sleek Dropdown Pill */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2.5 pl-2.5 pr-3 py-1.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-slate-700 transition-all text-left"
                >
                  {/* Avatar Circle */}
                  <div className={`w-7 h-7 rounded-lg ring-1 ${roleConfig.ringClass} flex items-center justify-center font-bold text-xs shadow-inner`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  {/* Name & Role */}
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

                {/* Floating Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-brand-card border border-brand-border shadow-2xl glow-card p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* User Profile Header Card */}
                    <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[140px]">{user.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${roleConfig.badgeClass}`}>
                          {roleConfig.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      {user.rollNumber && (
                        <div className="text-[10px] font-mono text-brand-cyan">Roll: {user.rollNumber}</div>
                      )}
                    </div>

                    {/* Navigation Items */}
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
                            {user.role === 'admin' ? 'Root Admin Console' : user.role === 'coordinator' ? 'Hardware Audit & Loans' : 'Borrowed Hardware & Events'}
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

                      {/* Supabase Cloud external link for admin */}
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

          {/* =========================================================================
              4. MOBILE TOGGLE & CART BUTTON
          ========================================================================= */}
          <div className="flex md:hidden items-center space-x-2">
            <Link to="/inventory" className="relative p-2 rounded-lg text-slate-300">
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-cyan text-brand-bg font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-brand-card border border-brand-border text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          5. MOBILE RESPONSIVE ACCORDION DRAWER
      ========================================================================= */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-bg/98 border-b border-brand-border px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
          
          {/* User Status Bar in Mobile */}
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

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    active
                      ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/40'
                      : link.isHighlight
                      ? 'bg-purple-950/40 text-purple-300 border border-purple-800'
                      : 'text-slate-300 hover:bg-brand-card hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Profile page shortcut in mobile */}
            {user && (
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-brand-card hover:text-white"
              >
                <User className="w-4 h-4 text-brand-cyan" />
                <span>My Profile & Dashboard</span>
              </Link>
            )}
          </div>

          {/* Mobile Sign Out */}
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
  );
};

export default Navbar;