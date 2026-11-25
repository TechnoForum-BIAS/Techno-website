import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  UserCheck,
  Calendar,
  Mail,
  Hash,
  Database,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

const AdminUsersPage = () => {
  const { user, token } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'user' | 'coordinator' | 'admin'
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoading(true);
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/auth/users', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users || []);
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to load user directory.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user, token]);

  // Handle Role Change
  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser.role === newRole) return;
    setUpdatingUserId(targetUser.id);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await fetch(`/api/auth/users/${targetUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();

      if (data.success) {
        // Update local state immediately
        setUsersList(prev => prev.map(u => (u.id === targetUser.id ? { ...u, role: newRole } : u)));
        setStatusMessage({
          type: 'success',
          text: `Role for ${targetUser.name} (${targetUser.email}) successfully changed to "${newRole.toUpperCase()}".`
        });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to update role.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error updating role: ' + err.message });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // If user is not Super Admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Administrator Access Required</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            User directory and role management are strictly restricted to Society Administrators. Please sign in with an authorized admin account.
          </p>
        </div>
        <div>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white font-semibold text-xs glow-blue hover:bg-blue-600 transition-colors"
          >
            <span>Go to Admin Login</span>
          </Link>
        </div>
      </div>
    );
  }

  // Filtered users calculation
  const filteredUsers = usersList.filter(u => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.roll_number && u.roll_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Role Counts
  const totalCount = usersList.length;
  const studentCount = usersList.filter(u => u.role === 'user').length;
  const coordinatorCount = usersList.filter(u => u.role === 'coordinator').length;
  const adminCount = usersList.filter(u => u.role === 'admin').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            User Directory & Role Management
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            View all authenticated students, event coordinators, and assign elevated society permissions.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-card border border-brand-border hover:border-brand-cyan/50 text-slate-300 hover:text-white text-xs font-semibold transition-all self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-cyan' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glow-card p-5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Total Directory</div>
            <div className="text-2xl font-black text-white mt-1">{totalCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glow-card p-5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Student Members</div>
            <div className="text-2xl font-black text-slate-200 mt-1">{studentCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-300">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glow-card p-5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Coordinators</div>
            <div className="text-2xl font-black text-blue-400 mt-1">{coordinatorCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="glow-card p-5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Administrators</div>
            <div className="text-2xl font-black text-brand-cyan mt-1">{adminCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage.text && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center space-x-2.5 transition-all ${
            statusMessage.type === 'error'
              ? 'bg-rose-950/40 border border-rose-800 text-rose-300'
              : 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
          }`}
        >
          {statusMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-brand-card p-3 rounded-2xl border border-brand-border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, email, or roll number..."
            className="w-full bg-brand-bg border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'user', label: `Students (${studentCount})` },
            { id: 'coordinator', label: `Coordinators (${coordinatorCount})` },
            { id: 'admin', label: `Admins (${adminCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                roleFilter === tab.id
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-brand-bg/50 border border-transparent hover:border-brand-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glow-card rounded-2xl bg-brand-card border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-brand-border/80 bg-brand-bg/40 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Auth Method</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4 text-right">Change Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-cyan" />
                    <div>Loading users from Supabase directory...</div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No users found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isPrimaryAdmin = u.email?.toLowerCase() === 'techno_forum@birlainstitute.co.in';
                  const isUpdating = updatingUserId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-brand-border flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center text-brand-bg font-bold text-xs flex-shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate flex items-center space-x-1.5">
                              <span>{u.name || 'Unnamed Student'}</span>
                              {isPrimaryAdmin && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                  Primary Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {u.roll_number || '—'}
                      </td>

                      {/* Auth Method */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-mono ${
                            u.auth_provider === 'google'
                              ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                              : 'bg-slate-700/40 text-slate-300 border border-slate-600/30'
                          }`}
                        >
                          <span>{u.auth_provider === 'google' ? 'Google OAuth' : 'Email/Password'}</span>
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {u.is_verified ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-amber-400 text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Pending OTP</span>
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>

                      {/* Current Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg font-mono text-[10px] font-semibold uppercase ${
                            u.role === 'admin'
                              ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30'
                              : u.role === 'coordinator'
                              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {u.role === 'admin' ? 'Administrator' : u.role === 'coordinator' ? 'Coordinator' : 'Student'}
                        </span>
                      </td>

                      {/* Role Change Action Dropdown */}
                      <td className="py-3.5 px-4 text-right">
                        {isPrimaryAdmin ? (
                          <span className="text-[11px] text-slate-500 font-mono italic">
                            Protected Super Admin
                          </span>
                        ) : (
                          <div className="inline-flex items-center space-x-2">
                            {isUpdating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-cyan" />}
                            <select
                              disabled={isUpdating}
                              value={u.role || 'user'}
                              onChange={(e) => handleRoleChange(u, e.target.value)}
                              className="bg-brand-bg border border-brand-border hover:border-brand-cyan/50 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono cursor-pointer transition-colors"
                            >
                              <option value="user">Student Member</option>
                              <option value="coordinator">Coordinator</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
