import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  FileText, 
  ShieldCheck,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const UploadTicket = () => {
  const { setScreen } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setIsSuccess(true);
          setTimeout(() => {
            setScreen('vault');
          }, 2000);
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between border-b border-outline-variant/10 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <button 
          onClick={() => setScreen('vault')}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-headline text-lg font-bold text-primary">Add Your Journey</h1>
        <div className="w-10" />
      </header>

      <main className="flex-grow p-6 space-y-8 overflow-y-auto no-scrollbar">
        {/* Upload Area */}
        <section 
          onClick={handleUpload}
          className="relative group cursor-pointer"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/50 transition-colors">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-2">
              <Upload className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-headline text-xl font-bold text-primary">Drop your file here</h3>
              <p className="text-sm text-on-surface-variant mt-1">Supports PDF, JPG, PNG up to 10MB</p>
            </div>
            <button className="px-8 py-3 bg-primary text-white rounded-2xl font-headline font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              Select File
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Take Photo', icon: <Camera className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
            { name: 'Gallery', icon: <ImageIcon className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
            { name: 'Import PDF', icon: <FileText className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600' }
          ].map((action) => (
            <button key={action.name} className="flex flex-col items-center gap-3 p-4 rounded-[1.5rem] bg-surface-container-low hover:bg-surface-container-high transition-colors">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", action.color)}>
                {action.icon}
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{action.name}</span>
            </button>
          ))}
        </div>

        {/* Security Info */}
        <div className="bg-primary/5 rounded-[2rem] p-6 flex items-start gap-4 border border-primary/10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-primary text-sm">Encrypted Travel Vault</h4>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Your documents are processed locally and encrypted before storage. We never share your travel data.</p>
          </div>
        </div>

        {/* Recent Uploads Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-primary">Recent Uploads</h3>
            <Clock className="w-4 h-4 text-outline" />
          </div>
          <div className="space-y-3">
            {[
              { name: 'Flight_TK204.pdf', date: '2 hours ago', size: '1.2 MB' },
              { name: 'Hotel_Voucher.jpg', date: 'Yesterday', size: '840 KB' }
            ].map((file) => (
              <div key={file.name} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-primary">{file.name}</h5>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{file.size} • {file.date}</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-outline">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Uploading Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  className="text-surface-container-high"
                />
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * uploadProgress) / 100}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-headline font-bold text-xl text-primary">
                {uploadProgress}%
              </div>
            </div>
            <h2 className="font-headline text-2xl font-bold text-primary mb-2">Uploading Document</h2>
            <p className="text-on-surface-variant max-w-xs">Securing your journey details with military-grade encryption...</p>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="font-headline text-2xl font-bold text-primary mb-2">Upload Successful!</h2>
            <p className="text-on-surface-variant max-w-xs">Your ticket has been added to your vault and synced across your devices.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
