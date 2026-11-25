import React from 'react';
import { Award, Download, CheckCircle } from 'lucide-react';

/**
 * BatchZipGenerator Component
 * Owned by: Group 3 (Intern 6)
 * Handles triggering bulk PDF-lib generation and downloadable ZIP archive creation.
 */
const BatchZipGenerator = ({
  generating,
  completed,
  onGenerate,
  onBack
}) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-6 max-w-2xl mx-auto text-center glow-card">
      <div className="w-16 h-16 rounded-full bg-brand-blue/20 text-brand-cyan flex items-center justify-center mx-auto glow-cyan">
        <Award className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-extrabold text-white">Ready for Batch Generation</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Each student certificate will be generated in vector PDF format, saved with their unique Certificate ID (e.g.,{' '}
          <code className="text-brand-cyan">TH-2026-0001.pdf</code>), registered for public verification, and bundled into a ZIP file.
        </p>
      </div>

      {generating ? (
        <div className="py-8 space-y-4">
          <div className="w-8 h-8 border-3 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-sm font-mono text-brand-cyan">Rendering certificates and building ZIP archive...</div>
        </div>
      ) : completed ? (
        <div className="py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-white">Certificates Generated Successfully!</h4>
          <p className="text-xs text-slate-300">
            Your download has started. Check your browser downloads folder for the ZIP package.
          </p>
          <button
            onClick={onGenerate}
            className="px-6 py-2.5 rounded-xl bg-brand-card hover:bg-slate-800 border border-brand-border text-white text-xs font-semibold transition-colors"
          >
            Download Again
          </button>
        </div>
      ) : (
        <div className="pt-4 space-y-3">
          <button
            onClick={onGenerate}
            className="w-full max-w-md mx-auto py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-brand-bg font-extrabold text-sm glow-cyan transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Generate Batch Certificates & Download ZIP</span>
          </button>
          <div>
            <button onClick={onBack} className="text-xs text-slate-400 hover:text-white transition-colors">
              Back to Canvas Designer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchZipGenerator;
