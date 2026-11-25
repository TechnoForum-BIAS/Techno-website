import React from 'react';
import { X, Sparkles, Camera } from 'lucide-react';

/**
 * AiTableScannerModal Component
 * Owned by: Group 2 (Intern 4)
 * Allows students to upload workbench photos for automatic component recognition & counting.
 */
const AiTableScannerModal = ({
  isOpen,
  onClose,
  onFileSelect,
  aiScanning,
  detectedAiItems,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-brand-card border border-brand-border rounded-2xl max-w-lg w-full p-6 space-y-6 glow-card relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-brand-cyan font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Vision Batch Recognition</span>
          </div>
          <h3 className="text-xl font-bold text-white">Capture / Upload Components on Table</h3>
          <p className="text-xs text-slate-400 mt-1">
            Take a phone photo of all resistors, capacitors, and sensor boards laid out on your work table. AI will detect and count them automatically!
          </p>
        </div>

        {/* Upload dropzone */}
        <div className="border-2 border-dashed border-brand-border hover:border-brand-cyan rounded-xl p-8 text-center transition-colors">
          <input
            type="file"
            accept="image/*"
            id="ai-component-input"
            onChange={onFileSelect}
            className="hidden"
          />
          <label htmlFor="ai-component-input" className="cursor-pointer space-y-3 block">
            <div className="w-12 h-12 rounded-full bg-brand-blue/20 text-brand-cyan flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-white">Click to Upload Table Photo or Snap Camera</div>
            <div className="text-xs text-brand-muted">Supports PNG, JPG, WebP from phone or webcam</div>
          </label>
        </div>

        {/* Scanning Indicator */}
        {aiScanning && (
          <div className="text-center py-4 space-y-2">
            <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-xs text-brand-cyan font-mono">Analyzing circuit elements & counting items...</div>
          </div>
        )}

        {/* Detected Items Card List */}
        {detectedAiItems && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Detected {detectedAiItems.length} Components:</span>
              <span className="text-brand-cyan font-mono">Auto Matched</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {detectedAiItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-brand-bg border border-brand-border text-xs">
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Confidence: {(item.confidence * 100).toFixed(0)}%</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan font-bold font-mono">
                    Qty: {item.detectedQuantity}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onAddToCart}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-brand-bg font-bold text-xs glow-cyan transition-all"
            >
              Add All Detected Components to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTableScannerModal;
