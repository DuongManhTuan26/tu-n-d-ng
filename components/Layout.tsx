
import React, { useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SectionConfig, SectionType } from '../types';
import { Home, User, Newspaper, PenTool, Cpu, ShoppingBag, Phone, Zap, Activity, Mic, Volume2, Upload, Trash2, Users, MessageSquare, Settings, Lock, Unlock, LogOut, ShieldCheck, Fingerprint, Mail, Search } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  sections: Record<SectionType, SectionConfig>;
  voiceUrl?: string;
  onUploadVoice?: (file: File) => void;
  onDeleteVoice?: () => void;
  voiceStatus?: 'playing' | 'stopped' | 'error';
  visitorCount?: number;
  questionsCount?: number;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  onOpenInbox: () => void; 
  onSearchClick: () => void; // New Prop
  unreadCount: number; 
}

const navItems = [
  { id: SectionType.HOME, icon: Home, label: 'Trang Chủ' },
  { id: SectionType.ABOUT, icon: User, label: 'Giới Thiệu' },
  { id: SectionType.NEWS, icon: Newspaper, label: 'Bản Tin' },
  { id: SectionType.BLOG, icon: PenTool, label: 'Blog' },
  { id: SectionType.AI_OMNI, icon: Cpu, label: 'AI Omni' },
  { id: SectionType.PRODUCTS, icon: ShoppingBag, label: 'Sản Phẩm' },
  { id: SectionType.CONTACT, icon: Phone, label: 'Liên Hệ' },
];

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  sections,
  voiceUrl,
  onUploadVoice,
  onDeleteVoice,
  voiceStatus = 'error',
  visitorCount = 0,
  questionsCount = 0,
  isEditMode,
  onToggleEditMode,
  isAuthenticated,
  onLogout,
  onLoginClick,
  onOpenInbox,
  onSearchClick,
  unreadCount
}) => {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSectionKey = Object.keys(sections).find(
    key => sections[key as SectionType].path === location.pathname
  ) as SectionType || SectionType.HOME;

  const currentSection = sections[currentSectionKey];

  const handleVoiceUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadVoice) {
      onUploadVoice(file);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      
      <aside className="hidden md:flex w-72 flex-col bg-black border-r border-amber-500/30 relative z-20 shadow-2xl">
        <div className="p-8 pb-6">
          <h1 className="text-3xl font-black tracking-widest text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            DMT<span className="text-white animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">.AI</span>
          </h1>
          <div className="flex items-center gap-2 text-xs font-mono text-white tracking-wider mb-4">
            <Zap size={12} className="fill-white animate-pulse" />
            SYSTEM ONLINE
          </div>
          
          <div className="bg-[#1a100c] rounded-lg p-3 space-y-2 border border-amber-500/30 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
             <div className="flex justify-between items-center text-xs text-white">
               <span className="flex items-center gap-1.5"><Users size={12} className="text-white"/> Visitors</span>
               <span className="font-mono text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{visitorCount.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center text-xs text-white">
               <span className="flex items-center gap-1.5"><MessageSquare size={12} className="text-white"/> Questions</span>
               <span className="font-mono text-white font-bold animate-pulse">{questionsCount}</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3 overflow-y-auto scrollbar-hide py-2">
          {navItems.map((item) => {
            const section = sections[item.id];
            const isActive = location.pathname === section.path;
            
            return (
              <Link
                key={item.id}
                to={section.path}
                className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-amber-900/60 text-white border border-amber-500/50' 
                    : 'text-white hover:text-white hover:bg-amber-900/20'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-amber-500 rounded-r-full shadow-[0_0_15px_rgba(245,158,11,1)] animate-pulse"></div>
                )}

                <item.icon 
                  size={20} 
                  className={`transition-colors ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white group-hover:text-white'}`} 
                />
                <span className={`text-sm font-medium tracking-wide ${isActive ? 'font-bold text-white' : 'text-white'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-amber-500/20 mt-auto">
          {isAuthenticated ? (
             <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between bg-[#1a100c] p-3 rounded-lg border border-amber-500/30">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold border border-amber-300">
                         A
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] text-white/50 uppercase font-bold">Admin</span>
                          <span className="text-xs font-bold text-white">Tuan260988</span>
                       </div>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="text-red-400 hover:text-red-300 transition-colors p-1.5 hover:bg-red-900/20 rounded"
                      title="Đăng xuất"
                    >
                      <LogOut size={16} />
                    </button>
                 </div>
                 
                 <button 
                   onClick={onOpenInbox}
                   className="w-full flex items-center justify-between p-3 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-500/20 rounded-lg transition-all group"
                 >
                    <div className="flex items-center gap-2 text-white">
                       <Mail size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                       <span className="text-xs font-bold uppercase tracking-wide">Hộp thư</span>
                    </div>
                    {unreadCount > 0 ? (
                       <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-600 rounded-full text-[10px] font-bold text-white animate-pulse">
                         {unreadCount}
                       </span>
                    ) : (
                       <span className="text-[10px] text-white/30">0</span>
                    )}
                 </button>
             </div>
          ) : (
             <div className="flex items-center justify-center">
                <button 
                  onClick={onLoginClick}
                  className="group flex items-center gap-2 text-white/20 hover:text-amber-500/80 transition-all duration-500"
                  title="System Secure Access"
                >
                  <ShieldCheck size={14} className="group-hover:animate-pulse" />
                  <span className="text-[9px] font-mono tracking-widest uppercase">Secured 2025</span>
                </button>
             </div>
          )}
        </div>
      </aside>

      <div className="fixed top-24 right-6 z-40">
          <div className="bg-black/90 backdrop-blur-md border border-amber-500/40 rounded-full px-4 py-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] group transition-all hover:scale-105 flex items-center gap-3">
             <div className={`flex items-center gap-2 ${isEditMode ? 'border-r border-white/20 pr-3' : ''}`}>
                {voiceUrl ? <Volume2 size={16} className="text-white animate-pulse"/> : <Mic size={16} className="text-white"/>}
                <div className="flex items-center gap-1">
                   <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                     voiceStatus !== 'error' 
                       ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)] opacity-100' 
                       : 'bg-green-900/30 opacity-0 hidden'
                     } ${voiceStatus === 'playing' ? 'animate-pulse' : ''}`}
                   ></div>
                   <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                     voiceStatus === 'error' 
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] opacity-100' 
                        : 'bg-red-900/30 opacity-0 hidden'
                     }`}
                   ></div>
                </div>
             </div>
             
             {isEditMode && (
               <div className="flex items-center gap-2 animate-fadeIn">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="audio/*" 
                    onChange={handleFileChange}
                  />
                  
                  {voiceUrl ? (
                    <>
                        <button 
                          onClick={handleVoiceUploadClick}
                          className="p-1.5 hover:bg-amber-900/30 rounded-full text-white transition-colors"
                          title="Thay đổi Voice"
                        >
                          <Upload size={14} />
                        </button>
                        <button 
                          onClick={onDeleteVoice}
                          className="p-1.5 hover:bg-red-900/30 text-red-400 rounded-full transition-colors"
                          title="Xoá Voice"
                        >
                          <Trash2 size={14} />
                        </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleVoiceUploadClick}
                      className="flex items-center gap-2 text-xs font-bold text-white hover:text-white transition-colors uppercase tracking-wider animate-pulse"
                    >
                      <Upload size={14} /> Tải lên
                    </button>
                  )}
               </div>
             )}
          </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        <header className="h-20 border-b border-amber-500/20 bg-black/95 backdrop-blur-md flex items-center justify-between px-6 md:px-10 shrink-0 z-10 sticky top-0 shadow-lg">
            <div className="flex items-center gap-4 shrink-0">
               <div className="md:hidden flex items-center gap-3">
                 {!isAuthenticated ? (
                   <button 
                    onClick={onLoginClick}
                    className="text-white/20 hover:text-amber-500 transition-colors"
                   >
                     <Fingerprint size={20} />
                   </button>
                 ) : (
                   <button 
                    onClick={onOpenInbox}
                    className="relative text-amber-500 hover:text-white transition-colors"
                   >
                     <Mail size={20} />
                     {unreadCount > 0 && (
                       <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[14px] h-[14px] px-0.5 bg-red-600 rounded-full text-[8px] font-bold text-white animate-pulse">
                         {unreadCount}
                       </span>
                     )}
                   </button>
                 )}
               </div>

               <div className="p-2.5 bg-amber-900/20 rounded-lg border border-amber-500/30 hidden md:block group hover:bg-amber-900/40 transition-colors">
                  <Link to="/" className="text-white group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                    <Home size={20} />
                  </Link>
               </div>
               <div className="h-8 w-[1px] bg-amber-500/20 hidden md:block"></div>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded text-white md:hidden">
                    <Activity size={20} />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-white whitespace-nowrap hidden sm:block drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
                    {currentSection.title}
                  </h2>
               </div>
            </div>
            
            <div className="flex-1 overflow-hidden mx-6 md:mx-12 relative h-full flex items-center">
              <div className="whitespace-nowrap animate-scroll-text text-lg md:text-2xl font-bold text-white tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                "Chào mừng" đến với website : Dương Mạnh Tuấn - 0763 012 345
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6 shrink-0">
                {/* GLOBAL SEARCH BUTTON */}
                <button 
                  onClick={onSearchClick}
                  className="p-2.5 bg-amber-900/20 hover:bg-amber-700/40 border border-amber-500/30 rounded-lg text-white transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] group"
                  title="Tìm kiếm (Search)"
                >
                   <Search size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                {isAuthenticated && (
                  <div 
                     onClick={onToggleEditMode}
                     className="hidden md:flex items-center gap-2 cursor-pointer group animate-fadeIn"
                     title="Bật/Tắt chế độ chỉnh sửa"
                  >
                     <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isEditMode ? 'text-amber-500' : 'text-gray-500'}`}>
                       Edit Mode
                     </span>
                     
                     <div className={`relative w-12 h-6 rounded-full border transition-all duration-300 ${
                       isEditMode 
                         ? 'bg-amber-900/30 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                         : 'bg-gray-900 border-gray-700'
                     }`}>
                        <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full transition-all duration-300 shadow-md flex items-center justify-center p-0.5 ${
                          isEditMode 
                           ? 'translate-x-6 bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.8)]' 
                           : 'translate-x-0 bg-gray-600'
                        }`}>
                           <Settings size={10} className={`text-black ${isEditMode ? 'animate-spin-slow' : ''}`} />
                        </div>
                     </div>
                  </div>
                )}

                <div className="h-6 w-[1px] bg-white/20 hidden md:block"></div>

                <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-white">
                  <span>SERVER: ASIA-VN</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]"></span>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#261C15]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#42200b] via-[#261C15] to-[#120a06] pointer-events-none -z-10" />
          <div className="min-h-full">
            {children}
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-amber-500/30 z-40 px-4 py-3 flex justify-between overflow-x-auto shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const section = sections[item.id];
            const isActive = location.pathname === section.path;
            return (
              <Link 
                key={item.id} 
                to={section.path}
                className={`flex flex-col items-center justify-center px-2 min-w-[64px] ${isActive ? 'text-white' : 'text-white'}`}
              >
                <item.icon size={22} className={isActive ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse' : ''} />
                <span className={`text-[9px] mt-1.5 font-bold uppercase tracking-wide text-white`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;
