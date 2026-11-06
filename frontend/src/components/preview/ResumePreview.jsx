import React, { useState } from 'react';
import TemplateRenderer from '../templates/TemplateRenderer';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function ResumePreview({
  resume,
  templateKey,
  themeColor,
  fontFamily,
  fontSize,
  lineSpacing,
  sectionVisibility,
  previewRef,
}) {
  const [zoom, setZoom] = useState(100);

  const zoomIn = () => setZoom(prev => Math.min(prev + 10, 140));
  const zoomOut = () => setZoom(prev => Math.max(prev - 10, 70));
  const resetZoom = () => setZoom(100);

  return (
    <div className="relative h-full flex flex-col bg-slate-100/80 dark:bg-slate-950/70 overflow-hidden">
      {/* Zoom Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={zoomOut}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 w-10 text-center select-none">
          {zoom}%
        </span>
        <button
          onClick={zoomIn}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetZoom}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 ml-1 transition"
          title="Reset Zoom"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sheet Container */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center items-start relative">
        {/* Ambient subtle backdrop radial glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-40 dark:opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 25%, ${themeColor || '#4F46E5'}40 0%, transparent 65%)`
          }}
        />

        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 z-10"
        >
          <div
            ref={previewRef}
            id="resume-pdf-container"
            className="resume-sheet bg-white text-slate-900 rounded-sm border border-slate-200/90 w-[210mm] min-h-[297mm] overflow-hidden transition-shadow duration-500"
            style={{
              boxShadow: `0 25px 60px -12px ${themeColor || '#4F46E5'}25, 0 10px 25px -5px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)`
            }}
          >
            <TemplateRenderer
              resume={resume}
              templateKey={templateKey}
              themeColor={themeColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              lineSpacing={lineSpacing}
              sectionVisibility={sectionVisibility}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

