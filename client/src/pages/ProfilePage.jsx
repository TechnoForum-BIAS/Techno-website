import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NoticeModal from '../components/NoticeModal';
import { 
  User, 
  Mail, 
  Hash, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  Boxes, 
  Award, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  FileText, 
  QrCode, 
  ExternalLink,
  LogOut,
  Database,
  Cpu,
  Layers,
  Activity,
  Users,
  Bell,
  Pin,
  Pencil,
  Trash2,
  ArrowRight
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  // Active section tab in profile
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data states for profile rendering
  const [myIssues, setMyIssues] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [events, setEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({ total: 183, available: 144, issued: 39 });

  // Campus Notices State & Modal
  const [notices, setNotices] = useState([]);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [deleteNoticeLoading, setDeleteNoticeLoading] = useState(null);

  const canManageNotices = user?.role === 'coordinator' || user?.role === 'admin';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch campus announcements
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.announcements) setNotices(data.announcements);
      })
      .catch(() => {});

    // Fetch active issues & transactions
    fetch('/api/inventory/items')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          const total = data.items.reduce((acc, curr) => acc + curr.quantityTotal, 0);
          const avail = data.items.reduce((acc, curr) => acc + curr.quantityAvailable, 0);
          setInventoryStats({ total, available: avail, issued: total - avail });
        }
      })
      .catch(() => {});

    // Sample active loans for student
    setMyIssues([
      {
        id: 'tx-001',
        itemName: 'Heavy Duty 4-Way Extension Cord (10m)',
        serialNumber: 'BIAS-EXT-002',
        quantity: 1,
        issuedAt: '2026-11-20',
        returnDeadline: '2026-11-27',
        status: 'active'
      },
      {
        id: 'tx-002',
        itemName: 'HC-SR04 Ultrasonic Distance Sensor',
        serialNumber: 'BIAS-SEN-US-014',
        quantity: 2,
        issuedAt: '2026-11-22',
        returnDeadline: '2026-11-29',
        status: 'active'
      }
    ]);

    // Sample coordinator/admin view of all loans
    setAllLoans([
      {
        id: 'tx-101',
        studentName: 'Aarav Sharma',
        rollNumber: '230101',
        itemName: 'Extension Cord 10m',
        serialNumber: 'BIAS-EXT-002',
        issuedAt: '2026-11-20',
        returnDeadline: '2026-11-27',
        status: 'active'
      },
      {
        id: 'tx-102',
        studentName: 'Priya Verma',
        rollNumber: '230142',
        itemName: 'Arduino Uno R3',
        serialNumber: 'BIAS-ARD-004',
        issuedAt: '2026-11-18',
        returnDeadline: '2026-11-25',
        status: 'overdue'
      },
      {
        id: 'tx-103',
        studentName: 'Rohan Bisht',
        rollNumber: '230115',
        itemName: 'Soldering Iron Station 60W',
        serialNumber: 'BIAS-SLD-001',
        issuedAt: '2026-11-21',
        returnDeadline: '2026-11-28',
        status: 'active'
      }
    ]);
  }, [user, navigate]);

  if (!user) return null;

  const handleCreateNotice = () => {
    setSelectedNotice(null);
    setNoticeModalOpen(true);
  };

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice);
    setNoticeModalOpen(true);
  };

  const handleDeleteNotice = async (id, title) => {
    if (!window.confirm(`Delete notice "${title}"?`)) return;
    setDeleteNoticeLoading(id);
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotices(prev => prev.filter(n => n.id !== id));
      } else {
        alert(data.message || 'Failed to delete notice');
      }
    } catch {
      alert('Network error deleting notice');
    } finally {
      setDeleteNoticeLoading(null);
    }
  };

  const handleNoticeSaved = (savedNotice) => {
    setNotices(prev => {
      const exists = prev.some(n => n.id === savedNotice.id);
      if (exists) {
        return prev.map(n => n.id === savedNotice.id ? savedNotice : n);
      }
      return [savedNotice, ...prev];
    });
  };

  const roleLabel = user.role === 'admin' 
    ? 'Super Administrator' 
    : user.role === 'coordinator' 
    ? 'Faculty & Student Coordinator' 
    : 'Student Member';

  const roleColor = user.role === 'admin'
    ? 'bg-purple-950/70 text-purple-300 border-purple-700'
    : user.role === 'coordinator'
    ? 'bg-blue-950/70 text-blue-300 border-blue-700'
    : 'bg-emerald-950/70 text-emerald-300 border-emerald-700';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-card via-brand-cardHover to-brand-card border border-brand-border p-6 sm:p-8 glow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-white shadow-lg ${
              user.role === 'admin' ? 'bg-purple-600' : user.role === 'coordinator' ? 'bg-brand-blue' : 'bg-gradient-to-tr from-brand-blue to-brand-cyan'
            }`}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${roleColor}`}>
                  {user.role}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{user.email}</span>
                </span>
                {user.rollNumber && (
                  <span className="flex items-center space-x-1 font-mono">
                    <Hash className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>Roll: {user.rollNumber}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Email Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>

      {/* Role-Specific Dashboard Content */}
      <div className="space-y-6">

        {/* =========================================================================
            1. USER (STUDENT) VIEW
        ========================================================================= */}
        {user.role === 'user' && (
          <div className="space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-brand-card border border-brand-border glow-card space-y-1">
                <div className="text-xs text-brand-muted font-mono flex items-center space-x-1.5">
                  <Boxes className="w-4 h-4 text-brand-cyan" />
                  <span>Hardware Borrowed</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{myIssues.length} Units</div>
                <div className="text-[11px] text-emerald-400">Logged to Roll: {user.rollNumber}</div>
              </div>

              <div className="p-5 rounded-2xl bg-brand-card border border-brand-border glow-card space-y-1">
                <div className="text-xs text-brand-muted font-mono flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                  <span>Registered Events</span>
                </div>
                <div className="text-2xl font-extrabold text-white">1 Event</div>
                <div className="text-[11px] text-slate-400">TechnoHacks 2026</div>
              </div>

              <div className="p-5 rounded-2xl bg-brand-card border border-brand-border glow-card space-y-1">
                <div className="text-xs text-brand-muted font-mono flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Certificates</span>
                </div>
                <div className="text-2xl font-extrabold text-white">1 Verified</div>
                <Link to="/certificates/verify" className="text-[11px] text-brand-cyan hover:underline block">
                  Verify credential →
                </Link>
              </div>
            </div>

            {/* My Active Hardware Issues */}
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 glow-card space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Boxes className="w-5 h-5 text-brand-cyan" />
                    <span>My Active Hardware Issues</span>
                  </h3>
                  <p className="text-xs text-slate-400">Hardware currently issued from the Technoforum lab under your account.</p>
                </div>
                <Link
                  to="/inventory"
                  className="px-3.5 py-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Borrow More Hardware</span>
                </Link>
              </div>

              {myIssues.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  You currently have no hardware items issued. Browse the inventory catalog to checkout components.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-bg text-brand-cyan font-mono border-b border-brand-border">
                      <tr>
                        <th className="p-3">Component Name</th>
                        <th className="p-3">Tracked Serial</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3">Issued Date</th>
                        <th className="p-3">Return Deadline</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-slate-300">
                      {myIssues.map(item => (
                        <tr key={item.id} className="hover:bg-brand-bg/50">
                          <td className="p-3 font-semibold text-white">{item.itemName}</td>
                          <td className="p-3 font-mono text-brand-cyan">{item.serialNumber}</td>
                          <td className="p-3 font-mono">{item.quantity}</td>
                          <td className="p-3 text-slate-400 font-mono">{item.issuedAt}</td>
                          <td className="p-3 font-mono text-amber-300 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.returnDeadline}</span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-mono text-[10px]">
                              ACTIVE
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            2. COORDINATOR VIEW
        ========================================================================= */}
        {user.role === 'coordinator' && (
          <div className="space-y-6">
            
            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/events"
                className="p-4 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-center space-y-2 group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-blue/20 text-brand-cyan flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-white">Create New Event</div>
                <div className="text-[10px] text-slate-400">Post flyer & details</div>
              </Link>

              <Link
                to="/inventory"
                className="p-4 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-center space-y-2 group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <Boxes className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-white">Manage Hardware</div>
                <div className="text-[10px] text-slate-400">Add items & print barcodes</div>
              </Link>

              <Link
                to="/certificates/studio"
                className="p-4 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-center space-y-2 group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-white">Certificate Studio</div>
                <div className="text-[10px] text-slate-400">Batch generate PDFs</div>
              </Link>

              <Link
                to="/announcements"
                className="p-4 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-center space-y-2 group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-white">Publish Notice</div>
                <div className="text-[10px] text-slate-400">Upload circular flyer</div>
              </Link>
            </div>

            {/* Active Student Hardware Checkouts Overview */}
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 glow-card space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-brand-blue" />
                    <span>Campus Hardware Loans Tracker</span>
                  </h3>
                  <p className="text-xs text-slate-400">Active student equipment loans requiring return verification.</p>
                </div>
                <span className="text-xs font-mono text-brand-cyan">{allLoans.length} Active Records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-bg text-brand-cyan font-mono border-b border-brand-border">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Roll Number</th>
                      <th className="p-3">Component & Serial</th>
                      <th className="p-3">Deadline</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-slate-300">
                    {allLoans.map(loan => (
                      <tr key={loan.id} className="hover:bg-brand-bg/50">
                        <td className="p-3 font-semibold text-white">{loan.studentName}</td>
                        <td className="p-3 font-mono">{loan.rollNumber}</td>
                        <td className="p-3">
                          <span className="font-semibold text-white">{loan.itemName}</span>
                          <span className="block font-mono text-[10px] text-brand-cyan">{loan.serialNumber}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-300">{loan.returnDeadline}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            loan.status === 'overdue' 
                              ? 'bg-rose-950/60 border border-rose-800 text-rose-400' 
                              : 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                          }`}>
                            {loan.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => alert(`Marking ${loan.serialNumber} as returned for student ${loan.studentName}.`)}
                            className="px-2.5 py-1 rounded bg-brand-cardHover hover:bg-brand-blue text-white text-[11px] font-semibold transition-colors"
                          >
                            Audit Return
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            3. SUPER ADMIN VIEW
        ========================================================================= */}
        {user.role === 'admin' && (
          <div className="space-y-6">
            
            {/* Super Admin Notice Card */}
            <div className="rounded-2xl bg-purple-950/40 border border-purple-800 p-6 glow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 text-xs text-purple-300 font-mono font-bold">
                  <Shield className="w-4 h-4" />
                  <span>OFFICIAL PLATFORM ROOT CONSOLE</span>
                </div>
                <h3 className="text-lg font-bold text-white">Signed in as Official Technoforum Admin</h3>
                <p className="text-xs text-purple-200">
                  Master permissions active for: <code className="text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded">techno_forum@birlainstitute.co.in</code>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/admin/users"
                  className="px-4 py-2 bg-brand-cyan hover:bg-cyan-400 text-brand-bg rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm glow-cyan"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Users & Roles</span>
                </Link>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>Open Supabase Cloud</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Overall System Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-brand-card border border-brand-border glow-card space-y-1">
                <div className="text-xs text-brand-muted font-mono flex items-center space-x-1.5">
                  <Boxes className="w-4 h-4 text-brand-cyan" />
                  <span>Hardware Inventory</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{inventoryStats.total} Total</div>
                <div className="text-[11px] text-slate-400">{inventoryStats.available} Available in Lab</div>
              </div>

              <div className="p-5 rounded-2xl bg-brand-card border border-brand-border glow-card space-y-1">
                <div className="text-xs text-brand-muted font-mono flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Active Loans</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-400">{inventoryStats.issued} Issued</div>
                <div className="text-[11px] text-slate-400">Tracked with Barcodes</div>
              </div>

              <div className="p-5 rounded-2xl bg-brand-card border border-brand-border glow-card space-y-1">
                <div className="text-xs text-brand-muted font-mono flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Flagship Events</span>
                </div>
                <div className="text-2xl font-extrabold text-white">3 Listed</div>
                <div className="text-[11px] text-emerald-400">120+ Registrations</div>
              </div>

              <div className="p-5 rounded-2xl bg-brand-card border border-brand-border glow-card space-y-1">
                <div className="text-xs text-brand-muted font-mono flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>E-Certificates</span>
                </div>
                <div className="text-2xl font-extrabold text-white">Verified 100%</div>
                <div className="text-[11px] text-slate-400">Public registry active</div>
              </div>
            </div>

            {/* Admin Management Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-brand-cyan" />
                  <span>Events & Hackathons</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review and publish upcoming college hackathons, robotics challenges, and workshops.
                </p>
                <Link to="/events" className="inline-flex items-center text-xs font-semibold text-brand-cyan hover:underline">
                  Manage Events Portal →
                </Link>
              </div>

              <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Boxes className="w-4 h-4 text-brand-blue" />
                  <span>Hardware & Equipment</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full inventory audit, print unique serial labels, and run the AI table component recognition scanner.
                </p>
                <Link to="/inventory" className="inline-flex items-center text-xs font-semibold text-brand-blue hover:underline">
                  Open Inventory Console →
                </Link>
              </div>

              <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>E-Certificate Studio</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload base certificate template, attach participant CSV, place coordinates on canvas, and download batch ZIP.
                </p>
                <Link to="/certificates/studio" className="inline-flex items-center text-xs font-semibold text-purple-400 hover:underline">
                  Launch Certificate Engine →
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            CAMPUS NOTICES & CIRCULARS (VISIBLE TO EVERY USER ROLE ON PROFILE)
        ========================================================================= */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-6 glow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Bell className="w-5 h-5 text-brand-cyan" />
                <span>Campus Circulars & Official Announcements</span>
              </h3>
              <p className="text-xs text-slate-400">
                Live bulletins on laboratory timings, hardware audits, and hackathon guidelines.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {canManageNotices && (
                <button
                  onClick={handleCreateNotice}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-cyan text-white text-xs font-bold shadow-md glow-blue flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create Notice</span>
                </button>
              )}
              <Link
                to="/announcements"
                className="text-xs font-semibold text-brand-cyan hover:underline flex items-center space-x-1"
              >
                <span>Full Notice Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notices.slice(0, 6).map((notice) => (
              <div
                key={notice.id}
                className={`p-4 rounded-xl bg-brand-bg/90 border flex flex-col justify-between space-y-3 transition-colors ${
                  notice.isPinned ? 'border-brand-cyan/40 shadow-sm' : 'border-brand-border hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-brand-card border border-brand-border text-slate-300">
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="flex items-center space-x-1 text-[10px] font-mono text-brand-cyan font-bold">
                        <Pin className="w-3 h-3" />
                        <span>PINNED</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-brand-cyan" />
                    <span>{notice.date}</span>
                  </div>

                  {canManageNotices ? (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleEditNotice(notice)}
                        className="p-1 rounded text-slate-400 hover:text-brand-cyan transition-colors"
                        title="Edit notice"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(notice.id, notice.title)}
                        disabled={deleteNoticeLoading === notice.id}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete notice"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <Link to="/announcements" className="text-brand-cyan hover:underline">
                      Details →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Notice Creation & Edit Modal */}
      <NoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        onSaved={handleNoticeSaved}
        initialNotice={selectedNotice}
      />

    </div>
  );
};

export default ProfilePage;
