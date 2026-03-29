import React from 'react';
import { useApp } from '../AppContext';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Download, 
  Eye, 
  MoreVertical,
  Search,
  Grid,
  List
} from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';

export const Vault = () => {
  const { activeTrip, setScreen, documents } = useApp();

  if (!activeTrip) return null;

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setScreen('dashboard')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline text-xl font-bold text-primary">Document Vault</h1>
          <button 
            onClick={() => setScreen('upload-ticket')}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative flex-grow mr-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="w-full py-3 pl-10 pr-4 rounded-xl bg-surface-container-low border-none text-sm font-medium focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Grid className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-surface-container-low text-primary flex items-center justify-center">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-48 px-6 space-y-8">
        {/* Categories */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Flights', count: 2, icon: '✈️', color: 'bg-blue-50' },
            { name: 'Hotels', count: 1, icon: '🏨', color: 'bg-amber-50' },
            { name: 'Identity', count: 3, icon: '🪪', color: 'bg-emerald-50' },
            { name: 'Others', count: 5, icon: '📂', color: 'bg-purple-50' }
          ].map((cat) => (
            <div key={cat.name} className={cn("p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm", cat.color)}>
              <div className="text-3xl mb-4">{cat.icon}</div>
              <h3 className="font-headline font-bold text-primary">{cat.name}</h3>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{cat.count} Files</p>
            </div>
          ))}
        </div>

        {/* Recent Files */}
        <section>
          <h3 className="font-headline text-2xl font-bold text-primary mb-6">Recent Uploads</h3>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-sm border border-outline-variant/10 flex items-center justify-between group hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-primary truncate max-w-[180px]">{doc.name}</h4>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-0.5">{doc.size} • {doc.updatedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Storage Info */}
        <section className="bg-surface-container-low rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-4">
            <span className="font-headline font-bold text-primary">Vault Storage</span>
            <span className="text-xs font-bold text-on-surface-variant">1.2 GB / 5 GB</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mb-4">
            <div className="h-full bg-primary rounded-full" style={{ width: '24%' }} />
          </div>
          <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">Your documents are encrypted with military-grade AES-256 security. Only you can access your vault.</p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
