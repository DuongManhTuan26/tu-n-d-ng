
import React, { useState, useRef } from 'react';
import { Post, Comment } from '../types';
import { Edit2, Trash2, MessageSquare, Star, Save, X, ChevronDown, ChevronUp, Upload, Image as ImageIcon, Film, ExternalLink } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onUpdate: (updatedPost: Post) => void;
  onDelete: (id: string) => void;
  primaryColor: string;
  isEditMode: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate, onDelete, primaryColor, isEditMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editCategory, setEditCategory] = useState(post.category || '');
  const [editContent, setEditContent] = useState(post.content);
  const [editMediaUrl, setEditMediaUrl] = useState(post.mediaUrl || '');
  const [editMediaType, setEditMediaType] = useState<'image' | 'video'>(post.mediaType || 'image');
  const [editCtaText, setEditCtaText] = useState(post.ctaText || '');
  const [editExternalUrl, setEditExternalUrl] = useState(post.externalUrl || '');
  const [newComment, setNewComment] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLongText = post.content.length > 180;
  const displayContent = !expanded && isLongText ? post.content.substring(0, 180) + '...' : post.content;

  const handleSave = () => {
    onUpdate({ 
      ...post, 
      title: editTitle,
      category: editCategory,
      content: editContent,
      mediaUrl: editMediaUrl,
      mediaType: editMediaType,
      ctaText: editCtaText,
      externalUrl: editExternalUrl
    });
    setIsEditing(false);
  };

  const toggleFeatured = () => isEditMode && onUpdate({ ...post, isFeatured: !post.isFeatured });

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Visitor',
      content: newComment,
      createdAt: new Date().toISOString()
    };
    onUpdate({ ...post, comments: [...post.comments, comment] });
    setNewComment('');
  };

  return (
    <div className="bg-[#1a100c]/90 backdrop-blur-lg border border-amber-900/40 rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 flex flex-col h-full group">
      
      {/* Media Content */}
      <div className="relative aspect-video bg-black/40 overflow-hidden shrink-0">
        {post.mediaUrl ? (
          post.mediaType === 'video' ? (
            <video src={post.mediaUrl} className="w-full h-full object-cover" controls />
          ) : (
            <img src={post.mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Post" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-900/20"><ImageIcon size={48}/></div>
        )}
        
        {/* Overlays for Edit */}
        {isEditMode && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {isEditing ? (
              <button onClick={handleSave} className="p-1.5 bg-green-600 rounded-lg text-white"><Save size={14}/></button>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="p-1.5 bg-amber-600 rounded-lg text-white"><Edit2 size={14}/></button>
                <button onClick={() => onDelete(post.id)} className="p-1.5 bg-red-600 rounded-lg text-white"><Trash2 size={14}/></button>
              </>
            )}
            <button onClick={toggleFeatured} className={`p-1.5 rounded-lg ${post.isFeatured ? 'bg-amber-500 text-black' : 'bg-black/50 text-white'}`}><Star size={14} fill={post.isFeatured ? 'currentColor' : 'none'}/></button>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col">
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-amber-500 font-black uppercase">Phân loại (Mục lớn | Mục nhỏ)</label>
              <input placeholder="VD: I. NHÓM 1 | A. NHÓM CON..." className="w-full bg-black/40 border border-amber-900/30 rounded p-2 text-xs text-amber-500 font-bold" value={editCategory} onChange={e => setEditCategory(e.target.value)} />
            </div>
            <input placeholder="Tiêu đề..." className="w-full bg-black/40 border border-amber-900/30 rounded p-2 text-sm text-white font-bold" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            <textarea placeholder="Nội dung..." className="w-full bg-black/40 border border-amber-900/30 rounded p-2 text-xs text-white min-h-[100px]" value={editContent} onChange={e => setEditContent(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Tên nút (CTA)..." className="bg-black/40 border border-amber-900/30 rounded p-2 text-xs text-white" value={editCtaText} onChange={e => setEditCtaText(e.target.value)} />
              <input placeholder="Link (URL)..." className="bg-black/40 border border-amber-900/30 rounded p-2 text-xs text-white" value={editExternalUrl} onChange={e => setEditExternalUrl(e.target.value)} />
            </div>
          </div>
        ) : (
          <>
            {post.title && <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-amber-400 transition-colors">{post.title}</h3>}
            <div className="text-white/80 text-xs md:text-sm leading-relaxed mb-4 whitespace-pre-line">
              {displayContent.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('•') ? 'pl-4 relative mb-1' : 'mb-2'}>
                  {line.startsWith('•') && <span className="absolute left-0 text-amber-500">•</span>}
                  {line.startsWith('•') ? line.substring(1).trim() : line}
                </p>
              ))}
            </div>
            {isLongText && (
              <button onClick={() => setExpanded(!expanded)} className="text-amber-500 hover:text-amber-400 text-xs font-bold flex items-center gap-1 mb-4 uppercase tracking-tighter">
                {expanded ? 'Thu gọn' : 'Đọc thêm'} {expanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
              </button>
            )}
          </>
        )}

        <div className="mt-auto pt-4 border-t border-amber-900/20 flex flex-wrap gap-2">
          {post.externalUrl && (
            <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-lg transition-all shadow-lg active:scale-95">
              {post.ctaText || 'Truy cập ngay'} <ExternalLink size={12} />
            </a>
          )}
          <button onClick={() => setShowComments(!showComments)} className="p-2 bg-amber-900/20 hover:bg-amber-900/40 rounded-lg text-white/50 hover:text-white transition-colors">
            <MessageSquare size={16} />
          </button>
        </div>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="p-4 bg-black/40 border-t border-amber-900/20 animate-fadeIn">
          <div className="max-h-32 overflow-y-auto mb-3 space-y-2 scrollbar-hide">
            {post.comments.length === 0 ? <p className="text-[10px] text-white/20 italic">Chưa có bình luận nào.</p> : post.comments.map(c => (
              <div key={c.id} className="text-[10px] bg-amber-900/10 p-2 rounded">
                <span className="font-bold text-amber-500">{c.author}:</span> <span className="text-white/70">{c.content}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            <input placeholder="Viết phản hồi..." className="flex-1 bg-black/50 border border-amber-900/30 rounded p-1.5 text-[10px] text-white outline-none focus:border-amber-500" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
            <button onClick={handleAddComment} className="p-1.5 bg-amber-600 rounded text-white"><X size={12} className="rotate-45"/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
