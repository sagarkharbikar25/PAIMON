import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { ArrowLeft, Plus, FileText, Download, Eye, MoreVertical, Search, Grid, List, Loader2, Trash2 } from 'lucide-react';
import { BottomNav } from './Navigation';
import { cn } from '../lib/utils';
import apiFetch from '../services/api';

export const Vault = () => {
  const { activeTrip, setScreen } = useApp();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    apiFetch('/documents')
      .then((d: any) => setDocuments(d.documents || d || []))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      await apiFetch(`/documents/${id}`, { method: 'DELETE' });
      setDocuments(prev => prev.filter((d: any) => d._id !== id));
    } catch (e) { alert('Delete failed'); }
  };

  const categories = [
    { key: 'all',      name: 'All',      icon: '📂', color: 'bg-purple-50' },
    { key: 'flight',   name: 'Flights',  icon: '✈️', color: 'bg-blue-50' },
    { key: 'hotel',    name: 'Hotels',   icon: '🏨', color: 'bg-amber-50' },
    { key: 'passport', name: 'Identity', icon: '🪪', color: 'bg-emerald-50' },
  ];

  const filtered = documents.filter((d: any) => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    return matchSearch && matchCat;
  });

  const countFor = (key: string) => key === 'all' ? documents.length : documents.filter((d: any) => d.category === key).length;

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl px-6 py-6 border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setScreen('dashboard')} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-headline text-xl font-bold text-primary">Document Vault</h1>
          <button onClick={() => setScreen('upload-ticket')} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="relative flex-grow mr-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input type="text" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="w-full py-3 pl-10 pr-4 rounded-xl bg-surface-container-low border-none text-sm font-medium focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('grid')} className={cn("w-10 h-10 rounded-xl flex items-center justify-center", view === 'grid' ? "bg-primary text-white" : "bg-surface-container-low text-primary")}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={cn("w-10 h-10 rounded-xl flex items-center justify-center", view === 'list' ? "bg-primary text-white" : "bg-surface-container-low text-primary")}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-52 px-6 space-y-8">
        {/* Category filter */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat.key} onClick={() => setActiveCategory(cat.key)} className={cn("p-6 rounded-[2rem] border cursor-pointer transition-all", cat.color, activeCategory === cat.key ? "border-primary shadow-md" : "border-outline-variant/10 shadow-sm")}>
              <div className="text-3xl mb-4">{cat.icon}</div>
              <h3 className="font-headline font-bold text-primary">{cat.name}</h3>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{countFor(cat.key)} Files</p>
            </div>
          ))}
        </div>

        <section>
          <h3 className="font-headline text-2xl font-bold text-primary mb-6">Recent Uploads</h3>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No documents yet.</p>
              <button onClick={() => setScreen('upload-ticket')} className="mt-4 text-primary font-bold text-sm">Upload your first document</button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((doc: any) => (
                <div key={doc._id} className="bg-surface-container-lowest p-5 rounded-[1.5rem] shadow-sm border border-outline-variant/10 flex items-center justify-between group hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-primary truncate max-w-[180px]">{doc.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-0.5">
                        {doc.category} • {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.path && (
                      <a href={`http://localhost:5000/uploads/${doc.path.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors">
                        <Eye className="w-5 h-5" />
                      </a>
                    )}
                    <button onClick={() => handleDelete(doc._id)} className="w-10 h-10 rounded-full hover:bg-red-50 flex items-center justify-center text-on-surface-variant hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface-container-low rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-4">
            <span className="font-headline font-bold text-primary">Vault Storage</span>
            <span className="text-xs font-bold text-on-surface-variant">{documents.length} files</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden mb-4">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(documents.length * 5, 100)}%` }} />
          </div>
          <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">Your documents are stored securely. Only you can access your vault.</p>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};