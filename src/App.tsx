import React, { useState, useRef } from 'react';
import { 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Shield, 
  ShieldCheck, 
  Globe,
  ExternalLink,
  Lock,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isProxyEnabled, setIsProxyEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }
    
    setIsLoading(true);
    const finalUrl = isProxyEnabled 
      ? `/api/proxy?url=${encodeURIComponent(targetUrl)}` 
      : targetUrl;
    
    setCurrentUrl(finalUrl);
    setUrl(targetUrl);
  };

  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white font-sans overflow-hidden">
      {/* Browser Toolbar */}
      <header className="bg-[#2d2d2d] p-3 flex items-center gap-4 border-b border-white/5 shadow-lg z-10">
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full text-white/40"><ArrowLeft className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-white/5 rounded-full text-white/40"><ArrowRight className="w-4 h-4" /></button>
          <button onClick={reload} className="p-2 hover:bg-white/5 rounded-full"><RotateCcw className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-[#1a1a1a] rounded-full px-4 py-1.5 border border-white/10 focus-within:border-emerald-500/50 transition-all">
          <Lock className="w-3 h-3 text-emerald-500 mr-3" />
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Search or enter website address"
            className="bg-transparent flex-1 outline-none text-sm placeholder:text-white/20"
          />
          <button type="submit" className="p-1 hover:text-emerald-500 transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsProxyEnabled(!isProxyEnabled)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              isProxyEnabled 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-white/5 text-white/40 border border-transparent'
            }`}
          >
            {isProxyEnabled ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {isProxyEnabled ? 'VPN ACTIVE' : 'VPN OFF'}
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full"><Menu className="w-5 h-5" /></button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 bg-white relative">
        <AnimatePresence>
          {!currentUrl && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1e1e1e] flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6">
                <Globe className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Nexus Browser</h2>
              <p className="text-white/40 max-w-sm mb-8">
                Surf the web securely with our built-in proxy system. Your traffic is routed through our secure servers.
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {['google.com', 'wikipedia.org', 'github.com', 'reddit.com'].map(site => (
                  <button 
                    key={site}
                    onClick={() => { setUrl(site); handleNavigate(); }}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-left flex items-center justify-between group"
                  >
                    <span className="text-sm font-medium">{site}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {currentUrl && (
          <iframe 
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            title="Browser Viewport"
          />
        )}

        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-1/3 h-full bg-emerald-500"
            />
          </div>
        )}
      </main>

      {/* Status Bar */}
      <footer className="bg-[#1a1a1a] px-4 py-1.5 flex justify-between items-center border-t border-white/5 text-[10px] font-mono uppercase tracking-widest text-white/30">
        <div className="flex items-center gap-4">
          <span>Status: {isLoading ? 'Loading...' : 'Ready'}</span>
          <span className="text-emerald-500/50">Encrypted Connection</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Server: Global-Edge-01</span>
          <span>IP: 192.168.1.1 (Masked)</span>
        </div>
      </footer>
    </div>
  );
}
