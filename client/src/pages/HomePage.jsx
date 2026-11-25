import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D';
import { useAuth } from '../context/AuthContext';
import NoticeModal from '../components/NoticeModal';
import { 
  Boxes, 
  Award, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Scan, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  Users,
  Bell,
  Pin,
  Clock,
  Plus,
  FileText
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements) setNotices(data.announcements.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const canManageNotices = user?.role === 'coordinator' || user?.role === 'admin';

  return (
    <div className="space-y-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Birla Institute of Applied Sciences • Technical Society</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Where Campus <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-indigo">
                  Engineers & Innovators
                </span> <br />
                Build the Future.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong className="text-white">Technoforum</strong> — BIAS’s centralized hub for hackathons, automated hardware inventory with barcode & AI scanning, and instant e-certificate verification.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/events"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white font-semibold text-sm shadow-lg glow-blue transition-all flex items-center space-x-2"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/inventory"
                  className="px-6 py-3 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center space-x-2"
                >
                  <Boxes className="w-4 h-4 text-brand-cyan" />
                  <span>Issue Hardware</span>
                </Link>

                <Link
                  to="/certificates/verify"
                  className="px-6 py-3 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify Certificate</span>
                </Link>
              </div>

              {/* Quick stats pills */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-brand-border/60 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-extrabold text-white">500+</div>
                  <div className="text-xs text-brand-muted">Active Students</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-brand-cyan">150+</div>
                  <div className="text-xs text-brand-muted">Lab Hardware Units</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-brand-indigo">100%</div>
                  <div className="text-xs text-brand-muted">Verified Credentials</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Canvas */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full relative rounded-2xl bg-gradient-to-b from-brand-card/80 to-transparent border border-brand-border/80 backdrop-blur-sm glow-card p-4">
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-brand-bg/80 border border-brand-border text-[11px] font-mono text-brand-cyan">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>BIAS_CYBER_CORE_V1.0</span>
                </div>
                <Hero3D />
                <div className="text-center text-[11px] text-brand-muted font-mono pb-2">
                  Interactive 3D Viewport • Drag with cursor
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Pillars: 3 Intern Groups Domains */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Core Modules Built by Technoforum Interns
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Three specialized domains integrated seamlessly into a single platform for college students and faculty coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Group 1 Feature Card */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 hover:border-brand-cyan/40 transition-all hover:-translate-y-1 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/20 text-brand-cyan flex items-center justify-center border border-brand-cyan/20">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">1. Events & Registrations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centralized launchpad for BIAS tech fests, robotics challenges, and hackathons. Includes real-time seat tracking and team registrations.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  <span>Dynamic event creation with flyers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
                  <span>Team and individual entry forms</span>
                </li>
              </ul>
            </div>
            <Link to="/events" className="mt-6 inline-flex items-center text-xs font-semibold text-brand-cyan hover:underline">
              <span>View Events</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Group 2 Feature Card */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 hover:border-brand-blue/40 transition-all hover:-translate-y-1 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">2. Smart Inventory & AI Scan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hardware tracking with unique barcodes for extension boards, lab equipment, and AI vision identification for tiny components like resistors.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Code-128 & QR barcode generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>AI camera scan for table components</span>
                </li>
              </ul>
            </div>
            <Link to="/inventory" className="mt-6 inline-flex items-center text-xs font-semibold text-blue-400 hover:underline">
              <span>Open Inventory</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Group 3 Feature Card */}
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 hover:border-brand-indigo/40 transition-all hover:-translate-y-1 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-indigo/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">3. E-Certificate Studio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspired by <em>MailMyCertificate</em>. Upload a base image or PDF template, upload student CSV, position drag-and-drop placeholders, and batch download.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Visual placeholder coordinate placement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Public instant verification by ID/Name</span>
                </li>
              </ul>
            </div>
            <Link to="/certificates/studio" className="mt-6 inline-flex items-center text-xs font-semibold text-indigo-400 hover:underline">
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          LATEST CAMPUS NOTICES & CIRCULARS (VISIBLE TO EVERYONE WITH OR WITHOUT LOGIN)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-card/90 border border-brand-border p-6 sm:p-10 glow-card space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/80 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider">
                <Bell className="w-4 h-4" />
                <span>OFFICIAL BROADCAST BULLETIN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Latest Campus Notices & Circulars
              </h2>
              <p className="text-xs text-slate-400">
                Direct updates on lab timings, hardware return verification, and hackathon guidelines.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {canManageNotices && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-cyan text-white text-xs font-bold shadow-md glow-blue flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create Notice</span>
                </button>
              )}
              <Link
                to="/announcements"
                className="px-4 py-2 rounded-xl bg-brand-bg hover:bg-brand-cardHover border border-brand-border text-xs font-semibold text-brand-cyan flex items-center space-x-1.5 transition-colors"
              >
                <span>View All Notices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`rounded-2xl bg-brand-bg/90 border p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all ${
                  notice.isPinned ? 'border-brand-cyan/40 shadow-sm' : 'border-brand-border'
                }`}
              >
                <div className="space-y-3">
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

                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{notice.date}</span>
                  </div>
                  <Link to="/announcements" className="text-brand-cyan hover:underline font-semibold">
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Notice Creation Modal */}
      <NoticeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={(newNotice) => setNotices((prev) => [newNotice, ...prev.slice(0, 2)])}
      />

    </div>
  );
};

export default HomePage;
