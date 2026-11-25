import React from 'react';
import { Upload, ArrowRight } from 'lucide-react';

/**
 * TemplateUploader Component
 * Owned by: Group 3 (Intern 5)
 * Handles uploading and previewing base certificate PNG, JPG, or PDF templates.
 */
const TemplateUploader = ({
  templateFile,
  templatePreviewUrl,
  onTemplateUpload,
  onNext
}) => {
  return (
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
          onChange={onTemplateUpload}
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
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center space-x-2 glow-blue transition-colors"
        >
          <span>Next: Upload CSV</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TemplateUploader;
