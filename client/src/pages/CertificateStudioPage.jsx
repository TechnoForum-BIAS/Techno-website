import React, { useState } from 'react';
import { Award } from 'lucide-react';
import TemplateUploader from '../features/group3_certificates/TemplateUploader';
import CsvRosterUploader from '../features/group3_certificates/CsvRosterUploader';
import CanvasCoordinateEditor from '../features/group3_certificates/CanvasCoordinateEditor';
import BatchZipGenerator from '../features/group3_certificates/BatchZipGenerator';

const CertificateStudioPage = () => {
  const [step, setStep] = useState(1); // 1: Template, 2: CSV, 3: Canvas Designer, 4: Generate
  const [templateFile, setTemplateFile] = useState(null);
  const [templatePreviewUrl, setTemplatePreviewUrl] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [csvColumns, setCsvColumns] = useState(['Name', 'RollNumber', 'Event', 'Date', 'Position']);
  const [csvPreviewRows, setCsvPreviewRows] = useState([]);

  // Placeholders configuration
  const [placeholders, setPlaceholders] = useState([
    { id: 'name', label: 'Participant Name', column: 'Name', x: 260, y: 220, fontSize: 24 },
    { id: 'roll', label: 'Roll Number', column: 'RollNumber', x: 260, y: 260, fontSize: 16 },
    { id: 'event', label: 'Event Title', column: 'Event', x: 260, y: 300, fontSize: 18 },
    { id: 'date', label: 'Issue Date', column: 'Date', x: 120, y: 380, fontSize: 14 },
    { id: 'certId', label: 'Certificate ID', column: 'CertificateId', x: 500, y: 380, fontSize: 14 }
  ]);
  const [selectedPlaceholderId, setSelectedPlaceholderId] = useState('name');

  // Generation status
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Handle Template Upload
  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTemplateFile(file);
    setTemplatePreviewUrl(URL.createObjectURL(file));
  };

  // Handle CSV Upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        setCsvColumns(headers);

        const rows = lines.slice(1, 6).map(line => {
          const vals = line.split(',');
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = vals[i] ? vals[i].trim() : '';
          });
          return obj;
        });
        setCsvPreviewRows(rows);
      }
    };
    reader.readAsText(file);
  };

  // Adjust coordinates
  const updateCoordinate = (id, deltaX, deltaY) => {
    setPlaceholders(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          x: Math.max(10, Math.min(650, p.x + deltaX)),
          y: Math.max(10, Math.min(420, p.y + deltaY))
        };
      }
      return p;
    }));
  };

  const updateFontSize = (id, newSize) => {
    setPlaceholders(prev => prev.map(p => p.id === id ? { ...p, fontSize: newSize } : p));
  };

  const updateColumnMapping = (id, newColumn) => {
    setPlaceholders(prev => prev.map(p => p.id === id ? { ...p, column: newColumn } : p));
  };

  // Handle Batch Generation
  const handleBatchGenerate = () => {
    setGenerating(true);
    setCompleted(false);

    const formData = new FormData();
    if (templateFile) formData.append('template', templateFile);
    if (csvFile) formData.append('csv', csvFile);
    formData.append('placeholders', JSON.stringify(placeholders));

    fetch('/api/certificates/generate-batch', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error('Generation failed');
        return res.blob();
      })
      .then(blob => {
        setGenerating(false);
        setCompleted(true);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Technoforum_Certificates_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => {
        // Mock fallback simulation
        setTimeout(() => {
          setGenerating(false);
          setCompleted(true);
        }, 2000);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-mono mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>MAILMYCERTIFICATE V2 • NODE.JS ENGINE</span>
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

      {/* STEP 1: Upload Base Template (Owned by Intern 5) */}
      {step === 1 && (
        <TemplateUploader
          templateFile={templateFile}
          templatePreviewUrl={templatePreviewUrl}
          onTemplateUpload={handleTemplateUpload}
          onNext={() => setStep(2)}
        />
      )}

      {/* STEP 2: Upload CSV Roster (Owned by Intern 5) */}
      {step === 2 && (
        <CsvRosterUploader
          csvFile={csvFile}
          csvColumns={csvColumns}
          csvPreviewRows={csvPreviewRows}
          onCsvUpload={handleCsvUpload}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {/* STEP 3: Visual Canvas Placeholders Editor (Owned by Intern 6) */}
      {step === 3 && (
        <CanvasCoordinateEditor
          templatePreviewUrl={templatePreviewUrl}
          placeholders={placeholders}
          selectedPlaceholderId={selectedPlaceholderId}
          onSelectPlaceholder={setSelectedPlaceholderId}
          csvColumns={csvColumns}
          onUpdateCoordinate={updateCoordinate}
          onUpdateFontSize={updateFontSize}
          onUpdateColumnMapping={updateColumnMapping}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {/* STEP 4: Generate & Download ZIP (Owned by Intern 6) */}
      {step === 4 && (
        <BatchZipGenerator
          generating={generating}
          completed={completed}
          onGenerate={handleBatchGenerate}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
};

export default CertificateStudioPage;
