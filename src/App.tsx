import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Type, 
  Palette, 
  Layout, 
  Download, 
  Plus, 
  Trash2, 
  Layers,
  RotateCcw,
  Sparkles,
  Heart,
  Camera,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type FontOption = {
  name: string;
  family: string;
  class: string;
};

const FONTS: FontOption[] = [
  { name: 'Modern Sans', family: 'Inter', class: 'font-sans' },
  { name: 'Elegant Serif', family: 'Playfair Display', class: 'font-serif' },
  { name: 'Tech Display', family: 'Space Grotesk', class: 'font-display' },
  { name: 'Classic Serif', family: 'Cormorant Garamond', class: 'font-classic' },
  { name: 'Bold Brutal', family: 'Anton', class: 'font-brutal' },
  { name: 'Bookish', family: 'Libre Baskerville', class: 'font-book' },
];

type TextLayer = {
  id: string;
  text: string;
  font: FontOption;
  size: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
  weight: string;
  letterSpacing: string;
};

type CardConfig = {
  backgroundColor: string;
  gradientEnabled: boolean;
  gradientColor: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  padding: number;
  aspectRatio: '3/4' | '1/1' | '4/5' | '9/16';
  imageOpacity: number;
  imageBlur: number;
  imageScale: number;
  imageGrayscale: boolean;
};

// --- Main Component ---

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: '1',
      text: 'MOMENTS',
      font: FONTS[4],
      size: 48,
      color: '#FFFFFF',
      x: 50,
      y: 85,
      rotation: 0,
      weight: '900',
      letterSpacing: '0.1em'
    }
  ]);
  const [config, setConfig] = useState<CardConfig>({
    backgroundColor: '#000000',
    gradientEnabled: true,
    gradientColor: '#333333',
    borderRadius: 24,
    borderWidth: 0,
    borderColor: '#FFFFFF',
    padding: 0,
    aspectRatio: '3/4',
    imageOpacity: 1,
    imageBlur: 0,
    imageScale: 1,
    imageGrayscale: false
  });
  const [activeLayerId, setActiveLayerId] = useState<string | null>('1');
  const [activeTab, setActiveTab] = useState<'image' | 'text' | 'style' | 'layout'>('image');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: 'New Text',
      font: FONTS[0],
      size: 24,
      color: '#FFFFFF',
      x: 50,
      y: 50,
      rotation: 0,
      weight: '400',
      letterSpacing: '0'
    };
    setTextLayers([...textLayers, newLayer]);
    setActiveLayerId(newLayer.id);
  };

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(layers => layers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const removeLayer = (id: string) => {
    setTextLayers(layers => layers.filter(l => l.id !== id));
    if (activeLayerId === id) setActiveLayerId(null);
  };

  const activeLayer = textLayers.find(l => l.id === activeLayerId);

  const resetCard = () => {
    if (window.confirm('Reset all changes?')) {
      setImage(null);
      setTextLayers([{
        id: '1',
        text: 'MOMENTS',
        font: FONTS[4],
        size: 48,
        color: '#FFFFFF',
        x: 50,
        y: 85,
        rotation: 0,
        weight: '900',
        letterSpacing: '0.1em'
      }]);
      setConfig({
        backgroundColor: '#000000',
        gradientEnabled: true,
        gradientColor: '#333333',
        borderRadius: 24,
        borderWidth: 0,
        borderColor: '#FFFFFF',
        padding: 0,
        aspectRatio: '3/4',
        imageOpacity: 1,
        imageBlur: 0,
        imageScale: 1,
        imageGrayscale: false
      });
    }
  };

  // --- Render Helpers ---

  const renderControlTab = () => {
    switch (activeTab) {
      case 'image':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Photo Source</label>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-stone-400 hover:bg-stone-50 transition-all group"
              >
                <div className="p-3 bg-stone-100 rounded-full group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-stone-600" />
                </div>
                <span className="text-sm font-medium text-stone-600">Upload from device</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {image && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Scale</label>
                    <span className="text-xs font-mono text-stone-500">{Math.round(config.imageScale * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" max="2" step="0.01" 
                    value={config.imageScale} 
                    onChange={(e) => setConfig({ ...config, imageScale: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Blur</label>
                    <span className="text-xs font-mono text-stone-500">{config.imageBlur}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="20" step="1" 
                    value={config.imageBlur} 
                    onChange={(e) => setConfig({ ...config, imageBlur: parseInt(e.target.value) })}
                    className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                  <span className="text-sm font-medium text-stone-700">Grayscale Filter</span>
                  <button 
                    onClick={() => setConfig({ ...config, imageGrayscale: !config.imageGrayscale })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${config.imageGrayscale ? 'bg-stone-900' : 'bg-stone-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.imageGrayscale ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Layers</label>
              <button 
                onClick={addTextLayer}
                className="p-2 bg-stone-900 text-white rounded-full hover:scale-110 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {textLayers.map((layer, idx) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeLayerId === layer.id 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  Layer {idx + 1}
                </button>
              ))}
            </div>

            {activeLayer && (
              <div className="space-y-6 pt-4 border-t border-stone-100">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Content</label>
                  <textarea 
                    value={activeLayer.text}
                    onChange={(e) => updateLayer(activeLayer.id, { text: e.target.value })}
                    className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 resize-none h-24"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Typography</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONTS.map(font => (
                      <button
                        key={font.name}
                        onClick={() => updateLayer(activeLayer.id, { font })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          activeLayer.font.name === font.name 
                            ? 'border-stone-900 bg-stone-900 text-white' 
                            : 'border-stone-100 hover:border-stone-300'
                        }`}
                      >
                        <span className={`text-sm ${font.class}`}>{font.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Size</label>
                    <input 
                      type="number" 
                      value={activeLayer.size}
                      onChange={(e) => updateLayer(activeLayer.id, { size: parseInt(e.target.value) })}
                      className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={activeLayer.color}
                        onChange={(e) => updateLayer(activeLayer.id, { color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border-none"
                      />
                      <span className="text-xs font-mono text-stone-500">{activeLayer.color.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Position Y</label>
                    <span className="text-xs font-mono text-stone-500">{activeLayer.y}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={activeLayer.y} 
                    onChange={(e) => updateLayer(activeLayer.id, { y: parseInt(e.target.value) })}
                    className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                  />
                </div>

                <button 
                  onClick={() => removeLayer(activeLayer.id)}
                  className="w-full py-3 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-2xl transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Layer
                </button>
              </div>
            )}
          </div>
        );

      case 'style':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Background</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-stone-400 uppercase">Primary</span>
                  <input 
                    type="color" 
                    value={config.backgroundColor}
                    onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-stone-400 uppercase">Gradient</span>
                  <input 
                    type="color" 
                    value={config.gradientColor}
                    onChange={(e) => setConfig({ ...config, gradientColor: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                </div>
              </div>
              <button 
                onClick={() => setConfig({ ...config, gradientEnabled: !config.gradientEnabled })}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  config.gradientEnabled ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {config.gradientEnabled ? 'Gradient Enabled' : 'Enable Gradient'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Corners</label>
                <span className="text-xs font-mono text-stone-500">{config.borderRadius}px</span>
              </div>
              <input 
                type="range" 
                min="0" max="60" 
                value={config.borderRadius} 
                onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })}
                className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Padding</label>
                <span className="text-xs font-mono text-stone-500">{config.padding}px</span>
              </div>
              <input 
                type="range" 
                min="0" max="40" 
                value={config.padding} 
                onChange={(e) => setConfig({ ...config, padding: parseInt(e.target.value) })}
                className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Classic (3:4)', value: '3/4' },
                  { label: 'Square (1:1)', value: '1/1' },
                  { label: 'Portrait (4:5)', value: '4/5' },
                  { label: 'Story (9:16)', value: '9/16' },
                ].map(ratio => (
                  <button
                    key={ratio.value}
                    onClick={() => setConfig({ ...config, aspectRatio: ratio.value as any })}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      config.aspectRatio === ratio.value 
                        ? 'border-stone-900 bg-stone-900 text-white' 
                        : 'border-stone-100 hover:border-stone-300'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-stone-900 rounded-3xl text-white space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold">Pro Tip</h4>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Try using a high-contrast font like <span className="text-white font-bold italic">Anton</span> for a brutalist look, or <span className="text-white font-bold italic">Cormorant Garamond</span> for an editorial feel.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F4]">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[400px] h-screen bg-white border-r border-stone-200 flex flex-col z-20">
        <div className="p-8 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">VibeCard</h1>
          </div>
          <button 
            onClick={resetCard}
            className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
            title="Reset Card"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex border-b border-stone-100">
          {[
            { id: 'image', icon: ImageIcon, label: 'Photo' },
            { id: 'text', icon: Type, label: 'Text' },
            { id: 'style', icon: Palette, label: 'Style' },
            { id: 'layout', icon: Layout, label: 'Layout' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
                activeTab === tab.id ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" 
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {renderControlTab()}
        </div>

        <div className="p-8 border-t border-stone-100 bg-stone-50/50">
          <button 
            onClick={() => window.print()}
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10"
          >
            <Download className="w-5 h-5" />
            Export Photo Card
          </button>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 h-screen overflow-hidden flex items-center justify-center p-8 lg:p-20 relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stone-200/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stone-300/50 rounded-full blur-[120px]" />
        </div>

        <div className="card-preview-container w-full max-w-2xl flex flex-col items-center gap-8">
          {/* Card Preview */}
          <motion.div 
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            className="card-preview relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden"
            style={{
              aspectRatio: config.aspectRatio,
              width: '100%',
              borderRadius: `${config.borderRadius}px`,
              border: `${config.borderWidth}px solid ${config.borderColor}`,
              padding: `${config.padding}px`,
              background: config.gradientEnabled 
                ? `linear-gradient(135deg, ${config.backgroundColor}, ${config.gradientColor})`
                : config.backgroundColor
            }}
          >
            {/* Image Layer */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {image ? (
                <img 
                  src={image} 
                  alt="Card" 
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{
                    opacity: config.imageOpacity,
                    filter: `blur(${config.imageBlur}px) grayscale(${config.imageGrayscale ? 1 : 0})`,
                    transform: `scale(${config.imageScale})`,
                    referrerPolicy: 'no-referrer'
                  }}
                />
              ) : (
                <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center gap-4 text-stone-300">
                  <ImageIcon className="w-16 h-16" strokeWidth={1} />
                  <span className="text-sm font-medium uppercase tracking-widest">No Photo Selected</span>
                </div>
              )}
            </div>

            {/* Text Layers */}
            {textLayers.map(layer => (
              <div
                key={layer.id}
                className={`absolute w-full px-8 text-center pointer-events-none transition-all duration-300 ${layer.font.class}`}
                style={{
                  top: `${layer.y}%`,
                  left: `${layer.x}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                  fontSize: `${layer.size}px`,
                  color: layer.color,
                  fontWeight: layer.weight,
                  letterSpacing: layer.letterSpacing,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                {layer.text}
              </div>
            ))}

            {/* Overlay Elements */}
            <div className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            
            <div className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">VibeCard Studio</span>
            </div>
          </motion.div>

          {/* Floating Actions */}
          <div className="flex items-center gap-4">
            <button className="p-4 bg-white rounded-2xl shadow-lg hover:scale-110 transition-transform text-stone-600">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-4 bg-white rounded-2xl shadow-lg hover:scale-110 transition-transform text-stone-600">
              <Layers className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.print()}
              className="px-8 py-4 bg-stone-900 text-white rounded-2xl shadow-xl font-bold hover:scale-105 transition-transform"
            >
              Print Card
            </button>
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          aside, .floating-actions, .bg-decoration { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; height: auto !important; }
          .card-preview { 
            box-shadow: none !important; 
            width: 100% !important; 
            max-width: 500px !important;
            margin: 0 auto !important;
          }
        }
      `}} />
    </div>
  );
}
