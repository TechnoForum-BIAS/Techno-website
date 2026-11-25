import React from 'react';
import { Sliders } from 'lucide-react';

/**
 * CanvasCoordinateEditor Component
 * Owned by: Group 3 (Intern 6)
 * Handles interactive visual drag-and-drop placeholder positioning and font tuning.
 */
const CanvasCoordinateEditor = ({
  templatePreviewUrl,
  placeholders,
  selectedPlaceholderId,
  onSelectPlaceholder,
  csvColumns,
  onUpdateCoordinate,
  onUpdateFontSize,
  onUpdateColumnMapping,
  onNext,
  onBack
}) => {
  const activePlaceholder = placeholders.find(p => p.id === selectedPlaceholderId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Canvas Preview */}
      <div className="lg:col-span-8 bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4 glow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Visual Certificate Canvas</h3>
            <p className="text-xs text-slate-400">Click and reposition text placeholders directly on your template.</p>
          </div>
          <span className="text-xs font-mono text-brand-cyan">Resolution: 700 x 480 px</span>
        </div>

        {/* Interactive Canvas Box */}
        <div className="relative w-full h-[460px] bg-slate-900 rounded-xl overflow-hidden border border-brand-border flex items-center justify-center select-none">
          {templatePreviewUrl ? (
            <img
              src={templatePreviewUrl}
              alt="Template"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border-4 border-double border-slate-700 bg-slate-800/80">
              <span className="text-slate-400 text-sm font-serif">Certificate Template Background</span>
            </div>
          )}

          {/* Render Drag & Position Placeholders */}
          {placeholders.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPlaceholder(p.id)}
              style={{ left: `${p.x}px`, top: `${p.y}px`, fontSize: `${p.fontSize}px` }}
              className={`absolute cursor-pointer px-2 py-0.5 rounded border transition-all ${
                selectedPlaceholderId === p.id
                  ? 'border-brand-cyan bg-brand-blue/60 text-white shadow-lg glow-cyan scale-105 z-20'
                  : 'border-dashed border-amber-400 bg-amber-950/40 text-amber-200 z-10'
              }`}
            >
              <span className="font-bold">[{p.label}]</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span>Use the control panel on the right to tune font size, coordinates (X, Y), and CSV mapping.</span>
        </div>
      </div>

      {/* Right Control Panel */}
      <div className="lg:col-span-4 bg-brand-card border border-brand-border rounded-2xl p-6 space-y-6 glow-card flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-brand-cyan" />
            <span>Placeholder Controls</span>
          </h3>

          {/* Placeholder Select list */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300">Select Field to Tune:</label>
            <div className="grid grid-cols-2 gap-2">
              {placeholders.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPlaceholder(p.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                    selectedPlaceholderId === p.id
                      ? 'border-brand-cyan bg-brand-blue/30 text-brand-cyan shadow-sm'
                      : 'border-brand-border bg-brand-bg text-slate-300 hover:border-brand-border/80'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {activePlaceholder && (
            <div className="space-y-4 p-4 rounded-xl bg-brand-bg border border-brand-border text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Maps to CSV Column:</label>
                <select
                  value={activePlaceholder.column}
                  onChange={(e) => onUpdateColumnMapping(activePlaceholder.id, e.target.value)}
                  className="w-full bg-brand-card border border-brand-border rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-cyan"
                >
                  {csvColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font size adjustment */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Font Size:</span>
                  <span className="font-mono text-brand-cyan">{activePlaceholder.fontSize} px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="48"
                  value={activePlaceholder.fontSize}
                  onChange={(e) => onUpdateFontSize(activePlaceholder.id, parseInt(e.target.value))}
                  className="w-full accent-brand-cyan"
                />
              </div>

              {/* Coordinate Nudge Buttons */}
              <div>
                <span className="block text-slate-300 mb-2">Adjust Position (Nudge):</span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div></div>
                  <button
                    onClick={() => onUpdateCoordinate(activePlaceholder.id, 0, -10)}
                    className="p-2 rounded-xl bg-brand-card hover:bg-slate-800 border border-brand-border text-white"
                  >
                    ▲
                  </button>
                  <div></div>
                  <button
                    onClick={() => onUpdateCoordinate(activePlaceholder.id, -10, 0)}
                    className="p-2 rounded-xl bg-brand-card hover:bg-slate-800 border border-brand-border text-white"
                  >
                    ◀
                  </button>
                  <div className="flex items-center justify-center text-[10px] text-slate-400">
                    X:{activePlaceholder.x}
                    <br />
                    Y:{activePlaceholder.y}
                  </div>
                  <button
                    onClick={() => onUpdateCoordinate(activePlaceholder.id, 10, 0)}
                    className="p-2 rounded-xl bg-brand-card hover:bg-slate-800 border border-brand-border text-white"
                  >
                    ▶
                  </button>
                  <div></div>
                  <button
                    onClick={() => onUpdateCoordinate(activePlaceholder.id, 0, 10)}
                    className="p-2 rounded-xl bg-brand-card hover:bg-slate-800 border border-brand-border text-white"
                  >
                    ▼
                  </button>
                  <div></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-4">
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs glow-blue transition-all"
          >
            Proceed to Batch Generation
          </button>
          <button
            onClick={onBack}
            className="w-full py-2 bg-brand-card hover:bg-slate-800 text-slate-300 rounded-xl text-xs transition-colors"
          >
            Back to CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasCoordinateEditor;
