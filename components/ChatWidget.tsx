import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, ChatAttachment, ChatMode } from '../services/geminiService';
import { X, Maximize2, Minimize2, Send, Loader2, BrainCircuit, Paperclip, Image as ImageIcon, FileText, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  isInline?: boolean; // New prop to control embedding
  chatMode?: ChatMode; // New prop to determine persona
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, isInline = false, chatMode = 'marketing' }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Define initial message based on mode
  const initialText = chatMode === 'product'
    ? 'Chào bạn! Tôi là Bot Tư Vấn Bán Hàng.\n• Hãy hỏi tôi bất cứ điều gì về sản phẩm.\n• (Tôi đang chờ được nạp dữ liệu vai trò...)'
    : 'Xin chào! Tôi là Trợ Lý Ảo Chat AI.\n• Tôi ở đây để hỗ trợ bạn mọi lúc.\n• (Tôi đang chờ được nạp dữ liệu vai trò...)';

  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; attachment?: { type: 'image' | 'file'; url: string } }[]>([
    { role: 'model', text: initialText }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepLogic, setIsDeepLogic] = useState(false); // State for Deep Logic mode
  
  // File Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ref for the scrollable container
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Optimized scroll function: modifying scrollTop prevents parent window from jumping
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, filePreview]);

  // Helper: Convert File to Base64 for Gemini
  const fileToGenerativePart = async (file: File): Promise<ChatAttachment> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve({
          mimeType: file.type,
          base64Data: base64Data
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file dưới 10MB.");
        return;
      }
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMsg = input;
    const currentFile = selectedFile;
    const currentPreview = filePreview;

    // Reset inputs immediately
    setInput('');
    clearFile();
    setIsLoading(true);

    // Add user message to UI immediately
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userMsg,
      attachment: currentPreview ? { 
        type: currentFile?.type.startsWith('image/') ? 'image' : 'file', 
        url: currentPreview 
      } : undefined
    }]);

    try {
      // Prepare attachment if exists
      let attachmentPayload: ChatAttachment | null = null;
      if (currentFile) {
        attachmentPayload = await fileToGenerativePart(currentFile);
      }

      // Format history for Gemini API (excluding attachments in history for simplicity in this implementation, 
      // though Gemini supports multi-turn history with images, basic text history is safer for long context).
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Call API
      const response = await sendMessageToGemini(userMsg, history, isDeepLogic, attachmentPayload, chatMode as ChatMode);
      
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Có lỗi xảy ra khi xử lý yêu cầu." }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * CUSTOM TEXT RENDERER v5 (Content Marketing Layout)
   * Designed for specific prompt:
   * - A. / I. -> Major Headers (Amber Color)
   * - • -> Bullet Points
   * - --- -> Divider
   */
  const renderFormattedMessage = (text: string) => {
    const lines = text.split(/\r?\n/);
    
    return lines.map((line, index) => {
      const trimmed = line.trim();
      
      // 0. Spacer for empty lines
      if (!trimmed) {
        return <div key={index} className="h-3 block w-full" />; 
      }

      // 1. Separator (--- or ⸻)
      if (trimmed === '---' || trimmed === '⸻' || trimmed.match(/^-{3,}$/)) {
        return <hr key={index} className="my-4 border-t border-amber-500/30 w-full" />;
      }

      // 2. Major Headings (A. TITLE, I. TITLE)
      // Regex: Starts with (Single Letter or Roman Numeral) followed by dot, space, and then Uppercase text
      // We are a bit loose with "Uppercase text" requirement to catch cases where AI might capitalize mostly but not all.
      if (trimmed.match(/^([IVX]+\.|[A-Z]\.)\s/)) {
        return (
          <div key={index} className="mt-4 mb-2 text-left w-full">
             <h3 className="text-amber-500 font-bold text-base uppercase tracking-wider border-l-4 border-amber-500 pl-3 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
               {trimmed}
             </h3>
          </div>
        );
      }

      // 3. Bullet Points (•)
      if (trimmed.startsWith('•')) {
         // Clean the bullet char to ensure consistent spacing
         const content = trimmed.substring(1).trim();
         return (
           <div key={index} className="flex items-start gap-3 mb-1.5 pl-1 text-left w-full">
              <div className="shrink-0 mt-1.5 text-[10px] text-amber-500">
                ●
              </div>
              <div className="flex-1 text-white/90 leading-relaxed text-sm">
                {content}
              </div>
           </div>
         );
      }

      // 4. Fallback: Standard Paragraph (No Markdown parsing for bold/italic as per request "No Markdown")
      return (
        <div key={index} className="mb-1 text-white/90 leading-relaxed text-sm text-left w-full">
          {trimmed}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  const containerClasses = isInline && !isMaximized
    ? 'relative w-full h-[320px] rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-amber-900/50' 
    : `fixed z-50 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden border border-amber-900/50 
       ${isMaximized 
          ? 'inset-0 m-0 rounded-none h-[100dvh]' // Full screen
          : 'bottom-0 left-0 right-0 h-[85vh] rounded-b-none md:top-auto md:bottom-24 md:left-auto md:right-8 md:w-96 md:h-[600px] md:rounded-lg' // Stable bottom anchor
       }`;

  return (
    <div className={`flex flex-col bg-[#1a100c] overflow-hidden ${containerClasses}`}>
      <style>{`
        .chat-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #f59e0b rgba(0, 0, 0, 0.2);
        }
        .chat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: #f59e0b; /* Amber-500 */
          border-radius: 10px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d97706; /* Amber-600 */
        }
        @keyframes scan-vertical {
          0% { top: -15%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 115%; opacity: 0; }
        }
        .animate-scanner {
          animation: scan-vertical 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
      `}</style>

      {/* --- DEEP LOGIC VISUAL EFFECTS LAYER --- */}
      {isDeepLogic && isLoading && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden animate-fadeIn">
          <div className="absolute inset-0 bg-black/85 z-0"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.35)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
          <div className="absolute left-0 w-full h-[120px] bg-gradient-to-b from-transparent via-[rgba(0,229,255,0.3)] to-transparent animate-scanner z-10 flex items-center justify-center">
             <div className="w-full h-[4px] bg-[#E0F7FA] shadow-[0_0_20px_#00E5FF,0_0_60px_#00E5FF,0_0_100px_#00E5FF] opacity-100 border-y border-[#00E5FF]/50"></div>
          </div>
          <div className="absolute inset-0 bg-radial-gradient(circle, transparent 30%, rgba(0,229,255,0.15) 100%) z-0"></div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#3E2723] to-black p-2 flex justify-between items-center border-b border-amber-900/30 shrink-0 select-none relative z-20">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative shrink-0">
             <div className={`w-2 h-2 rounded-full transition-colors duration-300
               ${isDeepLogic 
                  ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,1)]' 
                  : 'bg-green-500'} 
               ${isLoading ? 'animate-ping' : ''}
             `}></div>
          </div>
          
          <div className="flex items-center gap-2">
             {isDeepLogic ? (
               <div className="flex items-center gap-2 animate-fadeIn">
                 <BrainCircuit size={14} className={`text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
                 <span className="text-amber-400 font-bold tracking-wide text-xs drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                   Deep Logic
                 </span>
               </div>
             ) : (
               <div className="flex items-center gap-2">
                 {chatMode === 'product' ? <ShoppingBag size={14} className="text-orange-400" /> : <MessageCircle size={14} className="text-amber-400" />}
                 <span className="text-white font-bold tracking-wide text-xs">
                   {chatMode === 'product' ? 'SẢN PHẨM (Tư vấn bán hàng)' : 'CHAT AI (Trợ lý ảo 24/7)'}
                 </span>
               </div>
             )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/80 shrink-0">
          <div 
            onClick={() => setIsDeepLogic(!isDeepLogic)}
            className="group flex items-center gap-2 cursor-pointer mr-1"
            title={isDeepLogic ? "Tắt Deep Logic" : "Bật Deep Logic"}
          >
             <div className={`relative w-9 h-5 rounded-full border transition-all duration-300 ease-in-out ${
               isDeepLogic 
                 ? 'bg-amber-900/30 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                 : 'bg-gray-800 border-gray-600'
             }`}>
                <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full transition-all duration-300 ease-in-out shadow-md ${
                  isDeepLogic 
                   ? 'translate-x-4 bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.8)]' 
                   : 'translate-x-0 bg-gray-400'
                }`}></div>
             </div>
          </div>

          <div className="h-3 w-[1px] bg-white/20 mx-1"></div>

          <button onClick={() => setIsMaximized(!isMaximized)} className="hover:text-white p-1 transition-colors">
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={onClose} className="hover:text-red-400 p-1 transition-colors" title="Đóng chat">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto min-h-0 p-3 space-y-3 bg-[#261C15]/90 backdrop-blur chat-scrollbar scroll-smooth relative z-10"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[95%] md:max-w-[90%] p-3 px-4 rounded-xl text-xs md:text-sm leading-relaxed shadow-md break-words relative z-20 flex flex-col items-start ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-amber-700 to-orange-800 text-white rounded-tr-none border border-amber-600/30 whitespace-pre-wrap' 
                  : `text-white/95 rounded-tl-none border border-amber-900/40 bg-[#2E201A]`
              }`}
            >
              {/* Attachment Display for User Messages */}
              {msg.attachment && (
                <div className="mb-2 rounded-lg overflow-hidden border border-white/20 w-full max-w-[200px]">
                  {msg.attachment.type === 'image' ? (
                    <img src={msg.attachment.url} alt="Uploaded" className="w-full h-auto" />
                  ) : (
                    <div className="bg-white/10 p-4 flex items-center gap-2 text-white">
                      <FileText size={24} className="text-amber-400" />
                      <span className="text-xs truncate">File đính kèm</span>
                    </div>
                  )}
                </div>
              )}
              {msg.role === 'user' ? msg.text : renderFormattedMessage(msg.text)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className={`p-2 px-3 rounded-xl rounded-tl-none border flex items-center gap-2 text-white/80 text-xs transition-all duration-500 relative z-20 ${
              isDeepLogic 
                ? 'bg-black/90 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                : 'bg-[#2E201A] border-amber-900/40'
            }`}>
              {isDeepLogic ? (
                <BrainCircuit size={14} className="animate-pulse text-amber-400" />
              ) : (
                <Loader2 size={12} className="animate-spin text-white" />
              )}
              <span className={`font-bold tracking-wide ${isDeepLogic ? 'text-amber-400 animate-pulse drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]' : 'text-white/80'}`}>
                {isDeepLogic ? 'Deep Logic Analysis...' : 'Đang nhập...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-2 bg-[#1a100c] border-t border-amber-900/30 flex flex-col gap-2 shrink-0 z-20 relative">
        
        {/* File Preview Area */}
        {filePreview && (
          <div className="flex items-center gap-2 px-1 animate-fadeIn">
            <div className="relative group rounded-lg overflow-hidden border border-amber-500/50 bg-[#0f0a08]">
               {selectedFile?.type.startsWith('image/') ? (
                 <img src={filePreview} alt="Preview" className="h-14 w-auto object-cover opacity-80" />
               ) : (
                 <div className="h-14 w-14 flex items-center justify-center bg-white/5">
                   <FileText size={24} className="text-amber-500" />
                 </div>
               )}
               <button 
                 onClick={clearFile}
                 className="absolute top-0.5 right-0.5 bg-red-900/80 rounded-full p-1 text-white hover:bg-red-700 transition-colors shadow-lg"
               >
                 <X size={10} />
               </button>
            </div>
            <div className="text-xs text-amber-500/80 max-w-[150px] truncate">
              {selectedFile?.name}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex gap-2 items-end">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,application/pdf,text/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 mb-0.5 text-amber-500/80 hover:text-amber-400 hover:bg-amber-900/20 rounded-lg transition-colors"
            title="Đính kèm file/ảnh"
          >
            <Paperclip size={18} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isDeepLogic ? "Câu hỏi Deep Logic..." : "Nhập câu hỏi..."}
            className={`flex-1 bg-[#0f0a08] border border-amber-900/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 text-xs placeholder-white/50 transition-all ${
              isDeepLogic 
               ? 'focus:border-amber-400/80 focus:ring-amber-500/50 bg-[#0f0a08]/80' 
               : 'focus:border-amber-500/50 focus:ring-amber-500/30'
            }`}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className={`p-2 mb-0.5 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg ${
              isDeepLogic 
               ? 'bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
               : 'bg-gradient-to-br from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;