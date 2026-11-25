import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

/**
 * CsvRosterUploader Component
 * Owned by: Group 3 (Intern 5)
 * Handles uploading participant CSV rosters and displays parsed preview rows.
 */
const CsvRosterUploader = ({
  csvFile,
  csvColumns,
  csvPreviewRows,
  onCsvUpload,
  onBack,
  onNext
}) => {
  return (
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
          onChange={onCsvUpload}
          className="hidden"
        />
        <label htmlFor="csv-upload" className="cursor-pointer space-y-3 block">
          <div className="w-14 h-14 rounded-full bg-brand-indigo/20 text-indigo-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="text-base font-semibold text-white">
            {csvFile ? csvFile.name : 'Click to select CSV File with Student Details'}
          </div>
          <div className="text-xs text-brand-muted">
            Columns will be mapped automatically to certificate placeholders
          </div>
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
                  {csvColumns.map((col) => (
                    <th key={col} className="p-2.5">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-slate-300">
                {csvPreviewRows.map((row, i) => (
                  <tr key={i} className="hover:bg-brand-bg">
                    {csvColumns.map((col) => (
                      <td key={col} className="p-2.5">
                        {row[col] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-brand-cardHover border border-brand-border text-slate-300 text-xs hover:text-white transition-colors"
        >
          Back to Template
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 glow-blue transition-colors"
        >
          <span>Next: Visual Canvas Designer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CsvRosterUploader;
