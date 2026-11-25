import React from 'react';
import { Barcode, Plus } from 'lucide-react';

/**
 * InventoryItemCard Component
 * Owned by: Group 2 (Intern 3)
 * Displays an individual hardware component card with serial badges and barcode actions.
 */
const InventoryItemCard = ({ item, onAddToCart, onViewBarcode }) => {
  return (
    <div className="rounded-2xl bg-brand-card border border-brand-border hover:border-brand-blue/40 transition-all flex flex-col justify-between p-6 glow-card">
      <div className="space-y-4">
        {/* Category & Available Quantity */}
        <div className="flex items-start justify-between">
          <span className="px-2.5 py-1 rounded-md bg-brand-blue/20 text-brand-cyan text-[11px] font-semibold">
            {item.category}
          </span>
          <div className="flex items-center space-x-1">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                item.quantityAvailable > 5
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950/60 text-amber-400 border border-amber-800'
              }`}
            >
              {item.quantityAvailable} {item.unit} left
            </span>
          </div>
        </div>

        {/* Item Title & Serial Prefix */}
        <div>
          <h3 className="text-lg font-bold text-white">{item.name}</h3>
          <div className="text-xs text-brand-muted font-mono mt-1">
            Prefix: <span className="text-slate-200">{item.serialPrefix}</span>
          </div>
        </div>

        {/* Tracked Individual Serials (e.g., Extension Boards BIAS-EXT-001) */}
        {item.trackedSerials && item.trackedSerials.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-brand-muted uppercase font-mono tracking-wider">
              Tracked Unique Serials:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.trackedSerials.slice(0, 4).map((serial) => (
                <button
                  key={serial}
                  onClick={() => onViewBarcode(serial)}
                  className="px-2 py-0.5 rounded bg-brand-bg border border-brand-border text-[11px] font-mono text-brand-cyan hover:border-brand-cyan flex items-center space-x-1 transition-colors"
                  title="Click to view & print barcode"
                >
                  <Barcode className="w-3 h-3" />
                  <span>{serial}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-brand-border/60 flex items-center justify-between mt-4">
        <button
          onClick={() =>
            onViewBarcode(item.trackedSerials ? item.trackedSerials[0] : `${item.serialPrefix}-001`)
          }
          className="text-xs text-brand-muted hover:text-brand-cyan flex items-center space-x-1 transition-colors"
        >
          <Barcode className="w-4 h-4" />
          <span>Barcode</span>
        </button>

        <button
          onClick={() => onAddToCart(item, 1)}
          disabled={item.quantityAvailable <= 0}
          className="px-4 py-1.5 rounded-xl bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 glow-blue transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add to Issue Cart</span>
        </button>
      </div>
    </div>
  );
};

export default InventoryItemCard;
