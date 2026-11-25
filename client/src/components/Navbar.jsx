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
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, switchRole, logout } = useAuth();
  const { totalItemsCount } = useCart();

  const navLinks = [
    { name: 'Home', path: '/', icon: Cpu },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Inventory', path: '/inventory', icon: Boxes },
    { name: 'Cert Studio', path: '/certificates/studio', icon: Award },
    { name: 'Verify', path: '/certificates/verify', icon: Search },
    { name: 'Announcements', path: '/announcements', icon: Bell }
  ];

  const isActive = (path) => location.pathname === path;

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
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/30'
                      : 'text-slate-300 hover:text-white hover:bg-brand-card'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Inventory Cart Shortcut */}
            <Link
              to="/inventory"
              className="relative p-2 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 hover:text-brand-cyan transition-colors"
              title="Issued Components Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-cyan text-brand-bg font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center glow-cyan">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Quick 3-Role Switcher for Intern Testing */}
            {user && (
              <div className="flex items-center bg-brand-card border border-brand-border rounded-lg p-1 text-xs">
                <span className="px-2 text-brand-muted">Role:</span>
                <button
                  onClick={() => {
                    const roles = ['user', 'coordinator', 'admin'];
                    const currentIdx = roles.indexOf(user.role);
                    const nextRole = roles[(currentIdx + 1) % roles.length];
                    switchRole(nextRole);
                  }}
                  className={`px-2.5 py-1 rounded font-semibold font-mono text-[11px] transition-all ${
                    user.role === 'admin'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : user.role === 'coordinator'
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'bg-brand-cardHover text-brand-cyan border border-brand-cyan/20'
                  }`}
                  title="Click to cycle between User, Coordinator, and Admin"
                >
                  {user.role.toUpperCase()}
                </button>
              </div>
            )}

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-brand-border">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white truncate max-w-[120px]">{user.name}</div>
                  <div className="text-[10px] text-brand-muted font-mono">{user.rollNumber}</div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-sm font-semibold glow-blue transition-all"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link to="/inventory" className="relative p-2 text-slate-300">
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-cyan text-brand-bg font-bold text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>
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
        <div className="md:hidden bg-brand-bg border-b border-brand-border px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/30'
                    : 'text-slate-300 hover:bg-brand-card'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          {user && (
            <div className="pt-4 border-t border-brand-border flex items-center justify-between text-sm">
              <span className="text-slate-400">Logged in as {user.name}</span>
              <button
                onClick={() => {
                  const roles = ['user', 'coordinator', 'admin'];
                  const currentIdx = roles.indexOf(user.role);
                  const nextRole = roles[(currentIdx + 1) % roles.length];
                  switchRole(nextRole);
                }}
                className="px-2 py-1 bg-brand-blue text-xs rounded text-white font-mono"
              >
                Role: {user.role.toUpperCase()}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
