import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parseCSV } from '../utils/parser';
import { ParsedData } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: ParsedData) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error("Empty file");
        const parsed = parseCSV(text);
        if (parsed.allStores.length === 0) {
          throw new Error("No valid store data found. Please check the CSV format.");
        }
        onDataLoaded(parsed);
      } catch (err) {
        setError("Failed to parse CSV. Please ensure it matches the required format.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-xl w-full text-center space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Retail Dashboard</h2>
          <p className="text-slate-500 mt-2">Upload your weekly CSV report to visualize store performance.</p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-slate-400'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center pointer-events-none">
            <div className={`p-4 rounded-full mb-4 ${error ? 'bg-red-100' : 'bg-slate-100'}`}>
              {error ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <Upload className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <p className="text-lg font-medium text-slate-700">
              {error ? 'Upload Failed' : 'Click or drag file here'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Supports .csv files
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex justify-center gap-4 text-sm text-slate-400">
           <div className="flex items-center gap-1"><FileText className="w-4 h-4" /> PPP</div>
           <div className="flex items-center gap-1"><FileText className="w-4 h-4" /> 3PP</div>
           <div className="flex items-center gap-1"><FileText className="w-4 h-4" /> Vetri</div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;