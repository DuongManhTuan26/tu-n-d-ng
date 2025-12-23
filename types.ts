
export enum SectionType {
  HOME = 'home',
  ABOUT = 'about',
  NEWS = 'news',
  BLOG = 'blog',
  AI_OMNI = 'ai_omni',
  PRODUCTS = 'products',
  CONTACT = 'contact'
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  sectionId: SectionType;
  category?: string; // Nhóm bài viết (VD: Computer Vision, Automation...)
  title?: string;
  content: string;
  mediaUrl?: string; // Image or Video URL
  mediaType?: 'image' | 'video';
  ctaText?: string; // Văn bản nút hành động
  externalUrl?: string; // Link ra ngoài
  isFeatured: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface SectionConfig {
  id: SectionType;
  title: string;
  path: string;
  color: string; // Hex code
  avatarUrl: string;
  description?: string;
}

export interface VisitorData {
  count: number;
  questions: {
    name: string;
    email: string;
    phone: string;
    question: string;
    date: string;
  }[];
}

export interface InboxMessage {
  id: string;
  senderName: string;
  phoneNumber: string;
  contactMethod: string;
  contactDetail: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
