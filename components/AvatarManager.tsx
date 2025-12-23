import React, { useRef } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';

interface AvatarManagerProps {
  currentUrl: string;
  onUpdate: (url: string) => void;
  className?: string;
  isEditMode: boolean; // New Prop
}

const AvatarManager: React.FC<AvatarManagerProps> = ({ currentUrl, onUpdate, className, isEditMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdate(url);
    }
  };

  const handleDelete = () => {
    onUpdate('https://picsum.photos/200/200'); // Reset to default
  };

  return (
    <div className={`relative group inline-block ${className}`}>
      <img
        src={currentUrl}
        alt="Avatar"
        className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-transform duration-300 hover:scale-105"
      />
      
      {/* Controls Overlay - ONLY SHOW IF EDIT MODE IS ON */}
      {isEditMode && (
        <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-amber-600 rounded-full text-white hover:bg-amber-500 transition-colors shadow-lg"
            title="Upload / Change"
          >
            <Upload size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-900/80 rounded-full text-white hover:bg-red-800 transition-colors shadow-lg"
            title="Reset"
          >
            <Trash2 size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default AvatarManager;