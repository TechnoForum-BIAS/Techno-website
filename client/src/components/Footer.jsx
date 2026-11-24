import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Github, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-card border-t border-brand-border text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Society Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center glow-blue">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">TECHNOFORUM</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier technical student society of Birla Institute of Applied Sciences (BIAS), fostering innovation, hardware building, hackathons, and open source engineering.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/events" className="hover:text-brand-cyan transition-colors">Upcoming Events & Hackathons</Link></li>
              <li><Link to="/inventory" className="hover:text-brand-cyan transition-colors">Smart Hardware Inventory</Link></li>
              <li><Link to="/certificates/studio" className="hover:text-brand-cyan transition-colors">E-Certificate Batch Studio</Link></li>
              <li><Link to="/certificates/verify" className="hover:text-brand-cyan transition-colors">Instant Certificate Verification</Link></li>
              <li><Link to="/announcements" className="hover:text-brand-cyan transition-colors">Notices & Circular Flyers</Link></li>
            </ul>
          </div>

          {/* Column 3: College Campus */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Campus</h4>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                <span>Birla Institute of Applied Sciences, Bhimtal, Nainital, Uttarakhand - 263136</span>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Mail className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                <span>technoforum@bias.ac.in</span>
              </div>
            </div>
          </div>

          {/* Column 4: Interns & Open Source */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Developer Repo</h4>
            <p className="text-xs leading-relaxed mb-3">
              Built with modular architecture by the Technoforum Student Engineering Team.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-xs text-brand-cyan">
              <Github className="w-4 h-4" />
              <span>Modular Monorepo v1.0</span>
            </div>
          </div>

        </div>

        <div className="border-t border-brand-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Technoforum, BIAS. All rights reserved.</div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Designed & Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by BIAS Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
