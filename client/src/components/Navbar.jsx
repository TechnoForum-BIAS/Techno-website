import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Cpu,
  Calendar,
  Boxes,
  Award,
  Search,
  Bell,
  ShoppingCart,
  User,
  Menu,
  X,
  Shield,
  Activity,
  UserCheck,
  Database,
  LogOut
} from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();

  const isActive = (path) => location.pathname === path;

  // Dynamically configure navigation links based on user role
  const getNavLinks = () => {
    if (!user) {
      // 1. Guest Navigation
      return [
        { name: 'Home', path: '/', icon: Cpu },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Inventory', path: '/inventory', icon: Boxes },
        { name: 'Verify Cert', path: '/certificates/verify', icon: Search },
        { name: 'Notices', path: '/announcements', icon: Bell }
      ];
    }

    if (user.role === 'admin') {
      // 2. Super Admin Navigation
      return [
        { name: 'Home', path: '/', icon: Cpu },
        { name: 'All Events', path: '/events', icon: Calendar },
        { name: 'Inventory Audit', path: '/inventory', icon: Boxes },
        { name: 'Cert Studio', path: '/certificates/studio', icon: Award },
        { name: 'Circulars', path: '/announcements', icon: Bell },
        { name: 'Admin Console', path: '/profile', icon: Database, isHighlight: true }
      ];
    }

    if (user.role === 'coordinator') {
      // 3. Coordinator Navigation
      return [
        { name: 'Home', path: '/', icon: Cpu },
        { name: 'Manage Events', path: '/events', icon: Calendar },
        { name: 'Hardware & QR', path: '/inventory', icon: Boxes },
        { name: 'Batch Certs', path: '/certificates/studio', icon: Award },
        { name: 'Notices', path: '/announcements', icon: Bell },
        { name: 'Coordinator Hub', path: '/profile', icon: Shield, isHighlight: true }
      ];
    }

    // 4. Student (User) Navigation
    return [
      { name: 'Home', path: '/', icon: Cpu },
      { name: 'Events', path: '/events', icon: Calendar },
      { name: 'Hardware Hub', path: '/inventory', icon: Boxes },
      { name: 'Verify Cert', path: '/certificates/verify', icon: Search },
      { name: 'Notices', path: '/announcements', icon: Bell },
      { name: 'My Dashboard', path: '/profile', icon: UserCheck, isHighlight: true }
    ];
  };

  const navLinks = getNavLinks();

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return {
        label: 'ADMIN',
        style: 'bg-purple-950/80 text-purple-300 border-purple-700 shadow-sm'
      };
    }
    if (role === 'coordinator') {
      return {
        label: 'COORDINATOR',
        style: 'bg-blue-950/80 text-blue-300 border-blue-700 shadow-sm'
      };
    }
    return {
      label: 'STUDENT',
      style: 'bg-brand-cardHover text-brand-cyan border-brand-cyan/30'
    };
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Society Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center glow-cyan group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-cyan">
                TECHNOFORUM
              </span>
              <span className="block text-[10px] tracking-widest text-brand-cyan font-mono font-semibold uppercase">
                BIAS Bhimtal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${active
                    ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/30 shadow-sm'
                    : link.isHighlight
                      ? 'bg-brand-card hover:bg-brand-cardHover text-brand-cyan border border-brand-border font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-brand-card'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Auth Profile */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Inventory Cart Shortcut (shown for students & coordinators) */}
            {(!user || user.role === 'user') && (
              <Link
                to="/inventory"
                className="relative p-2 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 hover:text-brand-cyan transition-colors"
                title="Issued Components Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-cyan text-brand-bg font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center glow-cyan">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Logged In Profile Pill */}
            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-brand-border">
                {/* Role indicator linking to profile */}
                <Link
                  to="/profile"
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase border transition-transform hover:scale-105 ${roleBadge.style}`}
                  title="Click to view your role-based dashboard"
                >
                  {roleBadge.label}
                </Link>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="text-right hover:opacity-80 transition-opacity"
                  title="View Profile & Active Loans"
                >
                  <div className="text-xs font-semibold text-white truncate max-w-[120px]">{user.name}</div>
                  <div className="text-[10px] text-brand-muted font-mono">{user.rollNumber || user.email}</div>
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold glow-blue transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            {(!user || user.role === 'user') && (
              <Link to="/inventory" className="relative p-2 text-slate-300">
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-cyan text-brand-bg font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-brand-card border border-brand-border text-slate-300"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-bg border-b border-brand-border px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive(link.path)
                  ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/30'
                  : 'text-slate-300 hover:bg-brand-card'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {user ? (
            <div className="pt-4 border-t border-brand-border flex items-center justify-between text-xs">
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="space-y-0.5">
                <div className="font-semibold text-white">{user.name}</div>
                <div className="text-brand-muted font-mono">{user.email}</div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="px-3 py-1.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-brand-border">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2 bg-brand-blue text-white rounded-lg text-xs font-semibold"
              >
                Sign In / Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
