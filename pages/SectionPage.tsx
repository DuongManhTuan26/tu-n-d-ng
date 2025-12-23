
import React, { useState } from 'react';
import { SectionConfig, Post, SectionType } from '../types';
import AvatarManager from '../components/AvatarManager';
import PostCard from '../components/PostCard';
import { Plus, Search, Layers, ChevronRight, Zap, Target, Cpu } from 'lucide-react';

interface SectionPageProps {
  config: SectionConfig;
  posts: Post[];
  onUpdateAvatar: (url: string) => void;
  onAddPost: () => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  isEditMode: boolean;
}

const SectionPage: React.FC<SectionPageProps> = ({
  config, posts, onUpdateAvatar, onAddPost, onUpdatePost, onDeletePost, isEditMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Phân tách Category để lấy Nhóm lớn
  const parseCategory = (catStr: string) => {
    const parts = catStr.split('|').map(p => p.trim());
    return {
      major: parts[0] || 'CHƯA PHÂN LOẠI',
      minor: parts[1] || ''
    };
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Nhóm bài viết theo Major
  const groups = filteredPosts.reduce((acc, post) => {
    const { major } = parseCategory(post.category || '');
    if (!acc[major]) acc[major] = [];
    acc[major].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  const majorKeys = Object.keys(groups).sort();

  return (
    <div className="pt-20 md:pt-32 px-4 md:px-8 w-full pb-32">
      
      {/* SECTION HERO - Thông tin chung của trang */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-24 border-b border-amber-900/10 pb-20">
        <AvatarManager 
          currentUrl={config.avatarUrl} 
          onUpdate={onUpdateAvatar}
          isEditMode={isEditMode}
        />
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/5 border border-amber-500/20 rounded-full mb-6">
             <Cpu size={14} className="text-amber-500 animate-pulse" />
             <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.3em]">{config.description || 'Hệ sinh thái chuyên gia'}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 text-white tracking-tighter uppercase leading-none">
            {config.title}
          </h1>
          <p className="text-white/40 text-xl font-light max-w-3xl leading-relaxed italic border-l-2 border-amber-900/30 pl-6">
            Dẫn đầu kỷ nguyên trí tuệ nhân tạo thông qua các giải pháp công nghệ cốt lõi và hệ sinh thái nền tảng toàn cầu.
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="sticky top-24 z-30 mb-20">
        <div className="bg-[#1a100c]/90 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/20 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/40" size={18} />
            <input
              type="text"
              placeholder={`Tìm kiếm trong ${config.title}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-amber-900/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/20 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          {isEditMode && (
            <button onClick={onAddPost} className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg text-xs uppercase tracking-widest flex items-center gap-2">
              <Plus size={16} /> Thêm bài viết
            </button>
          )}
        </div>
      </div>

      {/* NỘI DUNG PHÂN CẤP */}
      <div className="space-y-40">
        {majorKeys.length === 0 ? (
          <div className="text-center py-40 text-white/10 uppercase tracking-[0.5em] font-black text-2xl">No Content Available</div>
        ) : (
          majorKeys.map((major, index) => {
            const groupPosts = groups[major];
            const overviewPost = groupPosts.find(p => p.isFeatured);
            const platformPosts = groupPosts.filter(p => !p.isFeatured);
            
            // Logic hiển thị tiêu đề Mục Lớn (I, II...)
            const isGroupI = major.startsWith('1.');
            const isGroupII = major.startsWith('5.');
            const isGroupIII = major.startsWith('7.');

            return (
              <section key={major} className="relative">
                
                {/* HIỂN THỊ TIÊU ĐỀ MỤC LỚN ĐỘNG */}
                {config.id === SectionType.AI_OMNI && isGroupI && (
                  <div className="mb-24 text-center md:text-left border-y border-amber-500/20 py-10 bg-amber-500/5">
                    <h2 className="text-4xl md:text-6xl font-black text-amber-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      I. CÁC NHÓM CÔNG NGHỆ AI CỐT LÕI
                    </h2>
                  </div>
                )}
                {config.id === SectionType.AI_OMNI && isGroupII && (
                  <div className="mb-24 text-center md:text-left border-y border-amber-500/20 py-10 bg-amber-500/5">
                    <h2 className="text-4xl md:text-6xl font-black text-amber-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      II. CÁC NHÓM CÔNG NGHỆ AI NÂNG CAO
                    </h2>
                  </div>
                )}
                {config.id === SectionType.AI_OMNI && isGroupIII && (
                  <div className="mb-24 text-center md:text-left border-y border-amber-500/20 py-10 bg-amber-500/5">
                    <h2 className="text-4xl md:text-6xl font-black text-amber-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      III. NHÓM HỖ TRỢ
                    </h2>
                  </div>
                )}

                {/* 1. TIÊU ĐỀ NHÓM (MAJOR TITLE) */}
                <div className="mb-16 relative">
                   <div className="absolute -top-16 left-0 text-[10rem] md:text-[14rem] font-black text-white/[0.02] pointer-events-none uppercase italic leading-none select-none">
                     {major.split('.')[0] || '0'}
                   </div>
                   <div className="relative z-10 flex flex-col items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-2 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]"></div>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                          {major}
                        </h2>
                      </div>
                      <div className="h-[1px] w-full bg-gradient-to-r from-amber-500/50 via-amber-500/10 to-transparent mt-4"></div>
                   </div>
                </div>

                {/* 2. BÀI VIẾT TỔNG QUAN (OVERVIEW) */}
                {overviewPost && (
                  <div className="mb-16 animate-fadeIn">
                    <div className="bg-gradient-to-br from-amber-950/20 to-black/40 border border-amber-500/10 rounded-3xl overflow-hidden shadow-2xl">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                          <div className="relative aspect-video lg:aspect-auto h-full overflow-hidden">
                             <img src={overviewPost.mediaUrl} className="w-full h-full object-cover opacity-60" alt="Overview" />
                             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                          </div>
                          <div className="p-8 md:p-12 flex flex-col justify-center relative bg-black/40 backdrop-blur-sm">
                             <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest mb-4">
                               <Target size={14} /> TỔNG QUAN CHUYÊN GIA
                             </div>
                             <h3 className="text-2xl md:text-4xl font-black text-white mb-6 uppercase leading-tight">
                               {overviewPost.title}
                             </h3>
                             <div className="text-white/70 text-sm md:text-base leading-relaxed whitespace-pre-line mb-8 font-light">
                               {overviewPost.content}
                             </div>
                             {isEditMode && (
                               <div className="flex gap-2">
                                 <button onClick={() => onUpdatePost({...overviewPost, isFeatured: false})} className="text-[10px] uppercase font-bold text-amber-500/50 hover:text-amber-500 transition-colors">Gỡ khỏi Featured</button>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* 3. DANH SÁCH NỀN TẢNG (PLATFORM GRID) */}
                {platformPosts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                       <Layers size={18} className="text-amber-500/60" />
                       <span className="text-xs font-black text-amber-500/60 uppercase tracking-widest">Hệ sinh thái nền tảng dẫn đầu</span>
                       <div className="h-[1px] flex-1 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {platformPosts.map(post => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onUpdate={onUpdatePost}
                          onDelete={onDeletePost}
                          primaryColor={config.color}
                          isEditMode={isEditMode}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SectionPage;
