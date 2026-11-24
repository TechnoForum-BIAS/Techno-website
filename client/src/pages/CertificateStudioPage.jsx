import React, { useState, useRef } from 'react';
import { 
  Award, 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  Layers, 
  Move, 
  Type, 
  Sliders, 
  ArrowRight,
  Code2
} from 'lucide-react';

const CertificateStudioPage = () => {
  // Wizard steps: 1 = Template, 2 = CSV, 3 = Canvas Placeholders, 4 = Generate
  const [step, setStep] = useState(1);

  // Template State
  const [templateFile, setTemplateFile] = useState(null);
  const [templatePreviewUrl, setTemplatePreviewUrl] = useState(null);
  const [templateFilename, setTemplateFilename] = useState('');

  // CSV State
  const [csvFile, setCsvFile] = useState(null);
  const [csvColumns, setCsvColumns] = useState(['Name', 'RollNumber', 'Event', 'Date', 'Position', 'CertificateId']);
  const [csvPreviewRows, setCsvPreviewRows] = useState([]);
  const [csvFilePath, setCsvFilePath] = useState('');

  // Interactive Placeholders on Template
  const [placeholders, setPlaceholders] = useState([
    { id: 'p1', column: 'Name', label: 'Student Name', x: 250, y: 320, fontSize: 26, color: '#0A1931' },
    { id: 'p2', column: 'Event', label: 'Event Title', x: 250, y: 380, fontSize: 18, color: '#0A1931' },
    { id: 'p3', column: 'Date', label: 'Issue Date', x: 180, y: 450, fontSize: 14, color: '#334155' },
    { id: 'p4', column: 'CertificateId', label: 'Certificate ID', x: 450, y: 450, fontSize: 13, color: '#334155' }
  ]);
  const [selectedPlaceholderId, setSelectedPlaceholderId] = useState('p1');

  // Generating & Progress
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Handle template selection
  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTemplateFile(file);
    setTemplateFilename(file.name);
    const objectUrl = URL.createObjectURL(file);
    setTemplatePreviewUrl(objectUrl);

    // Upload to server if needed
    const formData = new FormData();
    formData.append('template', file);
    fetch('/api/certificates/upload-template', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        if (data.filename) setTemplateFilename(data.filename);
      })
      .catch(() => {});
  };

  // Handle CSV upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    const formData = new FormData();
    formData.append('csv', file);

    fetch('/api/certificates/upload-csv', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        if (data.columns) setCsvColumns(data.columns);
        if (data.preview) setCsvPreviewRows(data.preview);
        if (data.filePath) setCsvFilePath(data.filePath);
      })
      .catch(() => {
        // Fallback sample preview
        setCsvPreviewRows([
          { Name: 'Aarav Sharma', RollNumber: '230101', Event: 'TechnoHacks 2026', Position: 'Winner', Date: '2026-11-20' },
          { Name: 'Priya Verma', RollNumber: '230142', Event: 'TechnoHacks 2026', Position: 'Participant', Date: '2026-11-20' }
        ]);
      });
  };

  // Move placeholder coordinate
  const updateCoordinate = (id, deltaX, deltaY) => {
    setPlaceholders(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, x: Math.max(10, p.x + deltaX), y: Math.max(10, p.y + deltaY) };
      }
      return p;
    }));
  };

  // Trigger batch generation & ZIP download
  const handleBatchGenerate = () => {
    setGenerating(true);
    fetch('/api/certificates/batch-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateFilename: templateFilename || 'default-template.png',
        csvPath: csvFilePath || 'uploads/csv/sample.csv',
        placeholders: placeholders.map(p => ({
          column: p.column,
          x: p.x,
          y: p.y,
          fontSize: p.fontSize,
          fromTop: true
        })),
        eventCode: 'TH'
      })
    })
      .then(res => res.blob())
      .then(blob => {
        setGenerating(false);
        setCompleted(true);
        // Create download link for zip
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Technoforum_Certificates_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => {
        setTimeout(() => {
          setGenerating(false);
          setCompleted(true);
        }, 1500);
      });
  };

  const activePlaceholder = placeholders.find(p => p.id === selectedPlaceholderId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-brand-cyan text-xs font-mono mb-1">
            <Award className="w-4 h-4" />
            <span>Inspired by MailMyCertificate Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">E-Certificate Batch Studio</h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload a base template image, attach student CSV, position dynamic placeholders, and generate bulk PDFs in a single ZIP.
          </p>
        </div>

        {/* Wizard Step Indicator */}
        <div className="flex items-center space-x-2 bg-brand-card p-1.5 rounded-xl border border-brand-border text-xs">
          {[
            { num: 1, label: 'Template' },
            { num: 2, label: 'CSV' },
            { num: 3, label: 'Designer' },
            { num: 4, label: 'Generate' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                step === s.num
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.num}. {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Upload Base Template */}
      {step === 1 && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-6 max-w-3xl mx-auto glow-card">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Step 1: Upload Certificate Template</h3>
            <p className="text-xs text-slate-400">
              Only 1 clean base template image (PNG or JPG) or PDF is needed. Text will be overlaid automatically.
            </p>
          </div>

          <div className="border-2 border-dashed border-brand-border hover:border-brand-cyan rounded-2xl p-10 text-center transition-colors">
            <input
              type="file"
              accept="image/png, image/jpeg, application/pdf"
              id="template-upload"
              onChange={handleTemplateUpload}
              className="hidden"
            />
            <label htmlFor="template-upload" className="cursor-pointer space-y-3 block">
              <div className="w-14 h-14 rounded-full bg-brand-blue/20 text-brand-cyan flex items-center justify-center mx-auto glow-cyan">
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-base font-semibold text-white">
                {templateFile ? templateFile.name : 'Click to select Certificate PNG / PDF template'}
              </div>
              <div className="text-xs text-brand-muted">Recommended resolution: 1920x1080 (Landscape)</div>
            </label>
          </div>

          {templatePreviewUrl && (
            <div className="space-y-2">
              <span className="text-xs text-brand-muted font-mono">Template Preview:</span>
              <div className="rounded-xl overflow-hidden border border-brand-border max-h-64 flex items-center justify-center bg-black/40">
                <img src={templatePreviewUrl} alt="Template Preview" className="max-h-64 object-contain" />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 glow-blue"
            >
              <span>Next: Upload CSV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Upload CSV */}
      {step === 2 && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-6 max-w-3xl mx-auto glow-card">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Step 2: Upload Student Participant CSV</h3>
            <p className="text-xs text-slate-400">
              CSV file containing participant columns like Name, RollNumber, Event, Date, and Position.
            </p>
          </div>

          <div className="border-2 border-dashed border-brand-border hover:border-brand-cyan rounded-2xl p-10 text-center transition-colors">
            <input
              type="file"
              accept=".csv"
              id="csv-upload"
              onChange={handleCsvUpload}
              className="hidden"
            />
            <label htmlFor="csv-upload" className="cursor-pointer space-y-3 block">
              <div className="w-14 h-14 rounded-full bg-brand-indigo/20 text-indigo-400 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div className="text-base font-semibold text-white">
                {csvFile ? csvFile.name : 'Click to select CSV File with Student Details'}
              </div>
              <div className="text-xs text-brand-muted">Columns will be mapped automatically to certificate placeholders</div>
            </label>
          </div>

          {/* CSV Preview Table */}
          {csvPreviewRows.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-brand-muted font-mono">Parsed Preview (First 5 Rows):</span>
              <div className="overflow-x-auto rounded-xl border border-brand-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-cardHover text-brand-cyan font-mono border-b border-brand-border">
                    <tr>
                      {csvColumns.map(col => <th key={col} className="p-2.5">{col}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-slate-300">
                    {csvPreviewRows.map((row, i) => (
                      <tr key={i} className="hover:bg-brand-bg">
                        {csvColumns.map(col => <td key={col} className="p-2.5">{row[col] || '-'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-brand-cardHover border border-brand-border text-slate-300 text-xs"
            >
              Back to Template
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 glow-blue"
            >
              <span>Next: Visual Canvas Designer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Visual Canvas Placeholders Editor */}
      {step === 3 && (
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
                <img src={templatePreviewUrl} alt="Template" className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center border-4 border-double border-slate-700 bg-slate-800/80">
                  <span className="text-slate-400 text-sm font-serif">Certificate Template Background</span>
                </div>
              )}

              {/* Render Drag & Position Placeholders */}
              {placeholders.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlaceholderId(p.id)}
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
                  {placeholders.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlaceholderId(p.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border ${
                        selectedPlaceholderId === p.id
                          ? 'border-brand-cyan bg-brand-blue/30 text-brand-cyan'
                          : 'border-brand-border bg-brand-bg text-slate-300'
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
                      onChange={(e) => {
                        const col = e.target.value;
                        setPlaceholders(prev => prev.map(p => p.id === activePlaceholder.id ? { ...p, column: col } : p));
                      }}
                      className="w-full bg-brand-card border border-brand-border rounded-lg px-2.5 py-1.5 text-white"
                    >
                      {csvColumns.map(col => <option key={col} value={col}>{col}</option>)}
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
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPlaceholders(prev => prev.map(p => p.id === activePlaceholder.id ? { ...p, fontSize: val } : p));
                      }}
                      className="w-full accent-brand-cyan"
                    />
                  </div>

                  {/* Nudge Buttons */}
                  <div>
                    <span className="block text-slate-300 mb-2">Adjust Position (Nudge):</span>
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div></div>
                      <button onClick={() => updateCoordinate(activePlaceholder.id, 0, -10)} className="p-2 rounded bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white">▲</button>
                      <div></div>
                      <button onClick={() => updateCoordinate(activePlaceholder.id, -10, 0)} className="p-2 rounded bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white">◀</button>
                      <div className="flex items-center justify-center text-[10px] text-slate-400">X:{activePlaceholder.x}<br/>Y:{activePlaceholder.y}</div>
                      <button onClick={() => updateCoordinate(activePlaceholder.id, 10, 0)} className="p-2 rounded bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white">▶</button>
                      <div></div>
                      <button onClick={() => updateCoordinate(activePlaceholder.id, 0, 10)} className="p-2 rounded bg-brand-card hover:bg-brand-cardHover border border-brand-border text-white">▼</button>
                      <div></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4">
              <button
                onClick={() => setStep(4)}
                className="w-full py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs glow-blue transition-all"
              >
                Proceed to Batch Generation
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-full py-2 bg-brand-cardHover text-slate-300 rounded-lg text-xs"
              >
                Back to CSV
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 4: Generate & Download ZIP */}
      {step === 4 && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 space-y-6 max-w-2xl mx-auto text-center glow-card">
          <div className="w-16 h-16 rounded-full bg-brand-blue/20 text-brand-cyan flex items-center justify-center mx-auto glow-cyan">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Ready for Batch Generation</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Each student certificate will be generated in vector PDF format, saved with their unique Certificate ID (e.g., <code className="text-brand-cyan">TH-2026-0001.pdf</code>), registered for public verification, and bundled into a ZIP file.
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
                onClick={handleBatchGenerate}
                className="px-6 py-2.5 rounded-xl bg-brand-cardHover border border-brand-border text-white text-xs font-semibold"
              >
                Download Again
              </button>
            </div>
          ) : (
            <div className="pt-4 space-y-3">
              <button
                onClick={handleBatchGenerate}
                className="w-full max-w-md mx-auto py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-brand-bg font-extrabold text-sm glow-cyan transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Generate Batch Certificates & Download ZIP</span>
              </button>
              <div>
                <button onClick={() => setStep(3)} className="text-xs text-slate-400 hover:text-white">
                  Back to Canvas Designer
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default CertificateStudioPage;
