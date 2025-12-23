import React, { useState } from 'react';
import { SectionConfig, Post } from '../types';
import { Link } from 'react-router-dom';
import AvatarManager from '../components/AvatarManager';
import PostCard from '../components/PostCard';
import ChatWidget from '../components/ChatWidget';
import { MessageCircle, ShoppingBag, HelpCircle, Plus, X, ExternalLink, FileAudio, ArrowRight, Image as ImageIcon, Globe, Trash2, Link as LinkIcon, Check, Box } from 'lucide-react';

interface HomePageProps {
  config: SectionConfig;
  onUpdateAvatar: (url: string) => void;
  posts: Post[];
  onUpdatePost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onAddPost: () => void;
  onOpenQA: () => void;
  isEditMode: boolean; // New Prop
}

// Define interface for local product state
interface ProductItem {
  id: string;
  name: string;
  description: string;
  url: string;
  iconType: 'audio' | 'image' | 'web'; // Simple mapping for icons
}

// Initial Data - Removed AI GENSTUDIO PHẦN 3 as requested
const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'tts-01',
    name: 'Văn Bản - Giọng đọc',
    description: 'Chuyển đổi văn bản thành giọng nói AI tự nhiên, đa cảm xúc.',
    url: 'https://ai.studio/apps/drive/172Ma2GGMFZuLM4q-xlqncvsNranBfP52?fullscreenApplet=true',
    iconType: 'audio'
  },
  {
    id: 'gen-studio-v2',
    name: 'AI GENSTUDIO',
    description: 'Studio sáng tạo nghệ thuật và thiết kế hình ảnh với AI chuyên nghiệp.',
    url: 'https://ai.studio/apps/drive/1BbcIbYyv2MhHEt8FV3YoGyT5ErYZ90Pu?fullscreenApplet=true',
    iconType: 'image'
  },
  {
    id: 'gen-studio-part2',
    name: 'AI GENSTUDIO Phần 2',
    description: 'Phiên bản mở rộng với các công cụ tạo ảnh và xử lý thị giác máy tính nâng cao.',
    url: 'https://ai.studio/apps/drive/15P9Ex4is-o0LRf9C_I6wK8ej2jGFmi6m?fullscreenApplet=true',
    iconType: 'image'
  }
];

const HomePage: React.FC<HomePageProps> = ({ 
  config, onUpdateAvatar, posts, onUpdatePost, onDeletePost, onAddPost, onOpenQA, isEditMode
}) => {
  // Local state for inline chat
  const [isChatActive, setIsChatActive] = useState(false);
  // Local state for Product App (Launcher)
  const [isProductChatActive, setIsProductChatActive] = useState(false);

  // --- PRODUCT MANAGEMENT STATE ---
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({ name: '', description: '', url: '' });

  // Filter all featured posts regardless of origin section
  const featuredPosts = posts.filter(p => p.isFeatured);

  // Helper to render icon based on type
  const renderProductIcon = (type: string, size: number, className: string) => {
    switch (type) {
      case 'audio': return <FileAudio size={size} className={className} />;
      case 'image': return <ImageIcon size={size} className={className} />;
      default: return <Box size={size} className={className} />;
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      name: newProductForm.name,
      description: newProductForm.description,
      url: newProductForm.url,
      iconType: 'web' // Default for user added items
    };
    setProducts([...products, newProduct]);
    setIsAddingProduct(false);
    setNewProductForm({ name: '', description: '', url: '' });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xoá ứng dụng này không?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="pt-10 md:pt-16 px-4 md:px-8 w-full relative">
      
      {/* --- ADD PRODUCT MODAL --- */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#1a100c] border border-orange-500 rounded-xl w-full max-w-md shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <div className="p-4 border-b border-orange-900/50 flex justify-between items-center">
               <h3 className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                 <Plus size={18} className="text-orange-500" /> Thêm Ứng Dụng Mới
               </h3>
               <button onClick={() => setIsAddingProduct(false)} className="text-white/50 hover:text-white">
                 <X size={20} />
               </button>
            </div>
            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4">
               <div>
                 <label className="block text-xs font-bold text-orange-500 mb-1 uppercase">Tên ứng dụng</label>
                 <input 
                   required
                   type="text" 
                   value={newProductForm.name}
                   onChange={e => setNewProductForm({...newProductForm, name: e.target.value})}
                   className="w-full bg-black/50 border border-orange-900/50 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none placeholder-white/20"
                   placeholder="VD: Chatbot Support..."
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-orange-500 mb-1 uppercase">Link (URL)</label>
                 <input 
                   required
                   type="url" 
                   value={newProductForm.url}
                   onChange={e => setNewProductForm({...newProductForm, url: e.target.value})}
                   className="w-full bg-black/50 border border-orange-900/50 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none placeholder-white/20"
                   placeholder="https://..."
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-orange-500 mb-1 uppercase">Mô tả ngắn</label>
                 <textarea 
                   required
                   value={newProductForm.description}
                   onChange={e => setNewProductForm({...newProductForm, description: e.target.value})}
                   className="w-full bg-black/50 border border-orange-900/50 rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none placeholder-white/20 h-24 resize-none"
                   placeholder="Mô tả chức năng của ứng dụng..."
                 />
               </div>
               <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                 <Check size={18} /> Lưu Ứng Dụng
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <AvatarManager 
          currentUrl={config.avatarUrl} 
          onUpdate={onUpdateAvatar} 
          className="mb-8 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-90"
          isEditMode={isEditMode}
        />
        
        {/* ULTRA COMPACT Control Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl items-start transition-all duration-500 ease-in-out">
          
          {/* 1. CHAT AI (Top Left - expands if active) */}
          <div className={`w-full transition-all duration-500 ${isChatActive ? 'md:col-span-2' : 'md:col-span-1'}`}>
            {isChatActive ? (
              <ChatWidget 
                isOpen={true} 
                onClose={() => setIsChatActive(false)} 
                isInline={true}
                chatMode="marketing" // Maps to CHAT AI
              />
            ) : (
              <button 
                onClick={() => {
                   setIsChatActive(true);
                   setIsProductChatActive(false); // Close other chat
                }}
                className="w-full group relative p-4 rounded-xl bg-gradient-to-br from-[#2b1d18] to-black border border-amber-700/40 hover:border-amber-500 transition-all hover:-translate-y-0.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] flex items-center justify-center gap-5 min-h-[90px]"
              >
                <div className="p-3 rounded-full bg-amber-900/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-600/20 transition-all">
                  <MessageCircle size={28} className="text-amber-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col items-start text-left">
                   <span className="text-xl font-black text-white uppercase tracking-widest group-hover:text-amber-400 transition-colors drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">CHAT AI</span>
                   <span className="text-[11px] text-white/60 font-medium tracking-wide group-hover:text-white/80">Trợ lý ảo 24/7</span>
                </div>
              </button>
            )}
          </div>

          {/* 2. SẢN PHẨM (Top Right - expands if active) - APP STORE GRID MODE */}
          <div className={`w-full transition-all duration-500 ${isProductChatActive ? 'md:col-span-2' : 'md:col-span-1'}`}>
             {isProductChatActive ? (
               <div className="w-full h-[500px] rounded-2xl border border-orange-500/50 overflow-hidden relative bg-[#1a100c] flex flex-col shadow-[0_0_30px_rgba(249,115,22,0.3)] animate-fadeIn group">
                  {/* Custom Header */}
                  <div className="bg-gradient-to-r from-[#2b1d18] to-black p-3 flex justify-between items-center border-b border-orange-900/50 shrink-0 z-20 relative">
                      <div className="flex items-center gap-2 px-2">
                         <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] animate-pulse"></div>
                         <ShoppingBag size={16} className="text-orange-400" />
                         <span className="text-white font-bold tracking-wide text-sm">AI STORE APPS</span>
                      </div>
                      <button 
                        onClick={() => setIsProductChatActive(false)}
                        className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                        title="Đóng cửa sổ"
                      >
                        <X size={20} />
                      </button>
                  </div>
                  
                  {/* App Grid UI */}
                  <div className="w-full flex-1 border-0 bg-[#0f0a08] relative overflow-y-auto p-4 md:p-6 custom-scrollbar">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_60%)] pointer-events-none"></div>
                      
                      <div className="relative z-10 grid grid-cols-1 gap-4">
                        {products.map((product) => (
                           <div key={product.id} className="group/item relative bg-[#1a100c] border border-orange-900/30 hover:border-orange-500 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:-translate-y-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              
                              {/* Icon Container */}
                              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-900/40 to-black border border-orange-500/20 group-hover/item:border-orange-500/50 shrink-0 shadow-inner">
                                {renderProductIcon(product.iconType, 32, "text-orange-500 group-hover/item:scale-110 transition-transform duration-500")}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-white group-hover/item:text-orange-400 transition-colors uppercase tracking-wide flex items-center gap-2 truncate">
                                  {product.name}
                                  <span className="text-[10px] bg-green-900/50 border border-green-500/30 text-green-400 px-1.5 py-0.5 rounded font-mono shrink-0">LIVE</span>
                                </h4>
                                <p className="text-white/60 text-xs md:text-sm mt-1 leading-relaxed line-clamp-2">
                                  {product.description}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 w-full sm:w-auto">
                                <a 
                                  href={product.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-orange-600 border border-orange-500/30 hover:border-orange-500 rounded-lg text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                >
                                  Mở Ứng Dụng 
                                  <ExternalLink size={14} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                </a>

                                {/* Delete Button - Only in Edit Mode */}
                                {isEditMode && (
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="w-full sm:w-auto px-5 py-1.5 bg-red-900/20 hover:bg-red-900/80 border border-red-500/30 hover:border-red-500 rounded-lg text-red-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                  >
                                    <Trash2 size={12} /> Xoá
                                  </button>
                                )}
                              </div>
                           </div>
                        ))}

                        {/* ADD PRODUCT BUTTON - ONLY IN EDIT MODE */}
                        {isEditMode ? (
                           <button 
                             onClick={() => setIsAddingProduct(true)}
                             className="group/add relative bg-[#1a100c] border border-dashed border-orange-500/30 hover:border-orange-500 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] flex flex-col items-center justify-center text-center gap-3 min-h-[120px]"
                           >
                              <div className="p-3 rounded-full bg-orange-900/20 group-hover/add:bg-orange-600 group-hover/add:text-white text-orange-500 transition-all">
                                <Plus size={24} />
                              </div>
                              <span className="text-orange-500/80 group-hover/add:text-orange-400 font-bold uppercase tracking-widest text-xs">
                                Thêm Ứng Dụng Mới
                              </span>
                           </button>
                        ) : (
                          /* Placeholder for Visitors */
                          <div className="relative border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 opacity-50 select-none">
                              <span className="text-white/20 text-xs font-mono uppercase tracking-widest">Sắp ra mắt</span>
                              <div className="text-white/40 font-bold">Ứng dụng AI mới đang được phát triển...</div>
                          </div>
                        )}
                      </div>
                  </div>
               </div>
             ) : (
               <button 
                onClick={() => {
                   setIsProductChatActive(true);
                   setIsChatActive(false); // Close other chat
                }}
                className="w-full group relative p-4 rounded-xl bg-gradient-to-br from-[#2b1d18] to-black border border-amber-700/40 hover:border-amber-500 transition-all hover:-translate-y-0.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] flex items-center justify-center gap-5 min-h-[90px]"
              >
                  <div className="p-3 rounded-full bg-orange-900/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-orange-600/20 transition-all">
                     <ShoppingBag size={28} className="text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xl font-black text-white uppercase tracking-widest group-hover:text-orange-400 transition-colors drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">SẢN PHẨM</span>
                    <span className="text-[11px] text-white/60 font-medium tracking-wide group-hover:text-white/80">Tư vấn bán hàng</span>
                  </div>
              </button>
             )}
          </div>

          {/* 3. QA Button (Bottom - Always Full Width) */}
          <div className="w-full md:col-span-2 mt-1">
            <button 
              onClick={onOpenQA}
              className="w-full group relative p-3 rounded-xl bg-gradient-to-br from-[#2D241E] to-black border border-yellow-700/30 hover:border-yellow-500 transition-all hover:-translate-y-0.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center justify-center gap-4 min-h-[60px]"
            >
                <div className="p-1.5 rounded-full bg-yellow-900/20 shadow-[0_0_10px_rgba(234,179,8,0.2)] group-hover:shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all">
                  <HelpCircle size={20} className="text-yellow-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-base font-bold text-white uppercase tracking-wider group-hover:text-yellow-400 transition-colors">HỎI / ĐÁP</span>
                  <span className="text-[10px] text-white/50 font-mono group-hover:text-white/80">Gửi câu hỏi</span>
                </div>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Featured Posts Section */}
      <div className="mb-20 px-2 md:px-6">
        <div className="flex justify-between items-center mb-6 border-b border-amber-900/50 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)] animate-pulse"></span>
            <span className="animate-pulse text-white">Bài Viết Nổi Bật</span>
          </h2>
          {/* Add Post Button - ONLY SHOW IN EDIT MODE */}
          {isEditMode && (
            <button 
              onClick={onAddPost}
              className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-600 border border-amber-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.6)] text-xs font-bold uppercase tracking-wide"
            >
              <Plus size={14} /> Thêm mới
            </button>
          )}
        </div>

        {featuredPosts.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-amber-900/30 rounded-xl text-white font-medium text-sm">
            Chưa có bài viết nổi bật nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {featuredPosts.map(post => (
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
        )}
      </div>
    </div>
  );
};

export default HomePage;