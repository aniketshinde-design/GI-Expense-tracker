import React from 'react';
import { X, Download, ZoomIn, Receipt } from 'lucide-react';

interface ReceiptViewerModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose,
}) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `Receipt_${Date.now()}`;
    link.click();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="relative max-w-lg w-full rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl p-4 sm:p-5 text-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-slate-200 truncate max-w-xs">
              {title || 'Voucher / Receipt Preview'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-3 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Receipt attachment"
            className="max-h-[65vh] w-auto object-contain rounded-lg border border-slate-800 shadow-md"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center">
          Official Audit Verification Record · Verified for Ground Intelligence Unit
        </div>
      </div>
    </div>
  );
};
