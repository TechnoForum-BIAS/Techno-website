import React from 'react';
import { X, Printer } from 'lucide-react';

/**
 * BarcodeModal Component
 * Owned by: Group 2 (Intern 3)
 * Displays Code-128 / QR barcode stickers for hardware units with print preview.
 */
const BarcodeModal = ({ isOpen, onClose, serialNumber, barcodeDataUrl }) => {
  if (!isOpen || !serialNumber) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-brand-card border border-brand-border rounded-2xl max-w-sm w-full p-6 space-y-4 glow-card relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] text-brand-muted uppercase font-mono">Technoforum Equipment Label</span>
          <h3 className="text-lg font-bold text-white font-mono mt-0.5">{serialNumber}</h3>
        </div>

        <div className="bg-white p-4 rounded-xl flex items-center justify-center min-h-[120px]">
          {barcodeDataUrl ? (
            <img src={barcodeDataUrl} alt="Barcode" className="max-w-full h-auto" />
          ) : (
            <div className="text-xs text-slate-500 font-mono">Generating barcode...</div>
          )}
        </div>

        <p className="text-[11px] text-slate-400">
          Print and paste onto physical equipment (e.g. extension board casing, dev kits) for automated lab tracking.
        </p>

        <button
          onClick={() => window.print()}
          className="w-full py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 glow-blue transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Sticker Label</span>
        </button>
      </div>
    </div>
  );
};

export default BarcodeModal;
