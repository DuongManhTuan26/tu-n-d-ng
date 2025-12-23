
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SectionPage from './pages/SectionPage';
import ContactPage from './pages/ContactPage';
import { SectionType, SectionConfig, Post, VisitorData, InboxMessage } from './types';
import { X, Facebook, Phone, Mail, Music, Send, Lock, Unlock, LogIn, Fingerprint, Trash2, Clock, CheckCircle, AlertCircle, Search, ArrowRight, ExternalLink, MessageSquare, Settings, User } from 'lucide-react';

// --- INITIAL DATA ---
const initialSections: Record<SectionType, SectionConfig> = {
  [SectionType.HOME]: { id: SectionType.HOME, title: 'Trang Chủ', path: '/', color: '#1a100c', avatarUrl: 'https://picsum.photos/id/1011/200/200', description: 'Cổng thông tin chính thức của Dương Mạnh Tuấn' },
  [SectionType.ABOUT]: { id: SectionType.ABOUT, title: 'Giới Thiệu', path: '/about', color: '#0a1014', avatarUrl: 'https://picsum.photos/id/1025/200/200', description: 'Hành trình và sứ mệnh' },
  [SectionType.NEWS]: { id: SectionType.NEWS, title: 'Bản Tin', path: '/news', color: '#14140a', avatarUrl: 'https://picsum.photos/id/1033/200/200', description: 'Cập nhật tin tức AI & Công nghệ' },
  [SectionType.BLOG]: { id: SectionType.BLOG, title: 'Blog', path: '/blog', color: '#100a14', avatarUrl: 'https://picsum.photos/id/1044/200/200', description: 'Góc nhìn và chia sẻ chuyên sâu' },
  [SectionType.AI_OMNI]: { id: SectionType.AI_OMNI, title: 'AI Omni', path: '/ai-omni', color: '#0a1412', avatarUrl: 'https://picsum.photos/id/1050/200/200', description: 'CÁC NHÓM CÔNG NGHỆ AI' },
  [SectionType.PRODUCTS]: { id: SectionType.PRODUCTS, title: 'Sản Phẩm', path: '/products', color: '#140a0a', avatarUrl: 'https://picsum.photos/id/1060/200/200', description: 'Giải pháp công nghệ đột phá' },
  [SectionType.CONTACT]: { id: SectionType.CONTACT, title: 'Liên Hệ', path: '/contact', color: '#0a1214', avatarUrl: 'https://picsum.photos/id/1070/200/200', description: 'Kết nối và hợp tác' },
};

const initialPosts: Post[] = [
  // --- 1. THỊ GIÁC MÁY TÍNH (COMPUTER VISION) ---
  {
    id: 'cv-overview-pro',
    sectionId: SectionType.AI_OMNI,
    category: '1. THỊ GIÁC MÁY TÍNH | TỔNG QUAN CHUYÊN GIA',
    title: 'Thị Giác Máy Tính: Đưa Trí Tuệ Vào Từng Khung Hình',
    content: 'Thị giác máy tính là nghệ thuật dạy máy móc cách nhìn và thấu hiểu thế giới vật lý thông qua dữ liệu hình ảnh. Bằng việc kết hợp Vision Transformer và Mạng nơ-ron tích chập (CNN), công nghệ này đang trở thành giác quan quan trọng nhất của AI hiện đại, tạo nên cầu nối trực tiếp giữa dữ liệu số và thực tế đời sống.',
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'cv-01-google',
    sectionId: SectionType.AI_OMNI,
    category: '1. THỊ GIÁC MÁY TÍNH | NỀN TẢNG SỐ 1',
    title: 'Google Vertex AI Vision',
    content: 'Nền tảng điện toán đám mây tiên tiến của Google cho phép doanh nghiệp xây dựng các mô hình thị giác máy tính tùy chỉnh với độ chính xác vượt trội thông qua công nghệ AutoML. Hệ thống này tối ưu hóa toàn diện quy trình từ gán nhãn dữ liệu đến triển khai API, hỗ trợ phân tích dữ liệu thị giác quy mô lớn tích hợp trực tiếp cùng kho dữ liệu BigQuery.',
    mediaUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Giải Pháp Google AI',
    externalUrl: 'https://cloud.google.com/vertex-ai-vision',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'cv-02-aws',
    sectionId: SectionType.AI_OMNI,
    category: '1. THỊ GIÁC MÁY TÍNH | NỀN TẢNG SỐ 2',
    title: 'AWS Rekognition',
    content: 'Dịch vụ phân tích hình ảnh và video chuyên sâu của Amazon cung cấp khả năng nhận diện vật thể và phân tích dữ liệu thời gian thực với độ trễ cực thấp. Tận dụng hạ tầng đám mây khổng lồ, Rekognition cho phép xử lý hàng tỷ hình ảnh mỗi ngày, giúp doanh nghiệp dễ dàng tích hợp các tính năng an ninh và vận hành thông minh vào quy trình huấn luyện SageMaker.',
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Hệ Sinh Thái AWS',
    externalUrl: 'https://aws.amazon.com/rekognition/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'cv-03-azure',
    sectionId: SectionType.AI_OMNI,
    category: '1. THỊ GIÁC MÁY TÍNH | NỀN TẢNG SỐ 3',
    title: 'Azure AI Vision',
    content: 'Giải pháp thị giác thông minh từ Microsoft tập trung vào trải nghiệm Low-code, giúp các tổ chức xây dựng ứng dụng AI nhanh chóng trong hệ sinh thái Windows và Office. Với khả năng kéo thả linh hoạt, người dùng có thể tạo mô hình tùy biến, tích hợp dữ liệu trực tiếp vào Power BI và Microsoft Teams để chuyển hóa hình ảnh thành các báo cáo chiến lược quan trọng.',
    mediaUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Trải Nghiệm Azure',
    externalUrl: 'https://azure.microsoft.com/en-us/products/ai-services/ai-vision',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'cv-04-roboflow',
    sectionId: SectionType.AI_OMNI,
    category: '1. THỊ GIÁC MÁY TÍNH | NỀN TẢNG SỐ 4',
    title: 'Roboflow',
    content: 'Nền tảng quản lý vòng đời dự án Computer Vision toàn diện, từ khâu thu thập, gán nhãn dữ liệu đến khi triển khai API ứng dụng thực tế. Roboflow hỗ trợ mạnh mẽ các kiến trúc hiện đại như YOLO và Vision Transformers, giúp các nhóm phát triển rút ngắn tối đa thời gian từ ý tưởng đến sản phẩm hoàn thiện trên một giao diện thống nhất.',
    mediaUrl: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Khám Phá Roboflow',
    externalUrl: 'https://roboflow.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'cv-05-huggingface',
    sectionId: SectionType.AI_OMNI,
    category: '1. THỊ GIÁC MÁY TÍNH | NỀN TẢNG SỐ 5',
    title: 'Hugging Face Vision',
    content: 'Thánh địa của cộng đồng mã nguồn mở, cung cấp kho tàng mô hình thị giác khổng lồ cho phép các kỹ sư tự do tùy chỉnh và tối ưu hóa. Nền tảng này giúp tiếp cận các mô hình SOTA (State-of-the-art) miễn phí, hỗ trợ Fine-tune linh hoạt bằng Python và triển khai thông qua hạ tầng Inference Endpoints với hiệu suất cao.',
    mediaUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Hugging Face Hub',
    externalUrl: 'https://huggingface.co/models?pipeline_tag=image-classification',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },

  // --- 2. XỬ LÝ NGÔN NGỮ TỰ NHIÊN (NLP / LLM) ---
  {
    id: 'nlp-overview-pro',
    sectionId: SectionType.AI_OMNI,
    category: '2. NLP & LLM | TỔNG QUAN CHUYÊN GIA',
    title: 'NLP & LLM: Cuộc Cách Mạng Ngôn Ngữ Của Máy Tính',
    content: 'Xử lý ngôn ngữ tự nhiên và các Mô hình ngôn ngữ lớn đã mở ra kỷ nguyên mới nơi máy móc có thể đọc, hiểu và sáng tạo ngôn ngữ như con người. Dựa trên kiến trúc Transformer đột phá, AI giờ đây có thể suy luận logic phức tạp, thay đổi hoàn toàn cách chúng ta giao tiếp và khai thác kho tàng tri thức nhân loại.',
    mediaUrl: 'https://images.unsplash.com/photo-1678382156212-f1400106bb41?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'nlp-01-huggingface',
    sectionId: SectionType.AI_OMNI,
    category: '2. NLP & LLM | NỀN TẢNG SỐ 1',
    title: 'Hugging Face NLP Hub',
    content: 'Hệ sinh thái AI cộng tác lớn nhất hành tinh, chuyên cung cấp và triển khai các mô hình ngôn ngữ mã nguồn mở chất lượng cao. Với khả năng deploy siêu tốc, nền tảng này hỗ trợ đầy đủ các tác vụ từ tóm tắt văn bản, phân tích cảm xúc đến xây dựng các hệ thống hội thoại thông minh cho cộng đồng nhà phát triển toàn cầu.',
    mediaUrl: 'https://images.unsplash.com/photo-1676299081847-824916de030a?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'NLP Open Source',
    externalUrl: 'https://huggingface.co/tasks/text-generation',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'nlp-02-openai',
    sectionId: SectionType.AI_OMNI,
    category: '2. NLP & LLM | NỀN TẢNG SỐ 2',
    title: 'OpenAI Enterprise API',
    content: 'Tiêu chuẩn vàng của AI tạo sinh với dòng mô hình GPT danh tiếng, sở hữu khả năng suy luận logic và giải quyết các bài toán trí tuệ phức tạp nhất. OpenAI cung cấp các API mạnh mẽ giúp doanh nghiệp xây dựng trợ lý ảo cá nhân hóa, tự động hóa quy trình sáng tạo và phân tích dữ liệu chuyên sâu với độ ổn định tuyệt đối.',
    mediaUrl: 'https://images.unsplash.com/photo-1679083216051-aa510a1a2c0e?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Khám Phá OpenAI',
    externalUrl: 'https://openai.com/api/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'nlp-03-aws-bedrock',
    sectionId: SectionType.AI_OMNI,
    category: '2. NLP & LLM | NỀN TẢNG SỐ 3',
    title: 'AWS Bedrock',
    content: 'Nền tảng quản lý tập trung cho phép truy cập vào các mô hình nền tảng hàng đầu thế giới từ Anthropic, Meta, Mistral cùng cam kết bảo mật dữ liệu doanh nghiệp. Bedrock hỗ trợ các tổ chức Fine-tuning mô hình bằng dữ liệu nội bộ một cách an toàn, tích hợp hoàn hảo vào hạ tầng Cloud hiện có để mở rộng quy mô ứng dụng AI.',
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Trải Nghiệm Bedrock',
    externalUrl: 'https://aws.amazon.com/bedrock/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'nlp-04-google-vertex',
    sectionId: SectionType.AI_OMNI,
    category: '2. NLP & LLM | NỀN TẢNG SỐ 4',
    title: 'Google Vertex AI (Gemini)',
    content: 'Đột phá với kiến trúc đa phương thức bản sinh, dòng mô hình Gemini trên Vertex AI cho phép máy tính hiểu đồng thời văn bản, hình ảnh, video và âm thanh. Với cửa sổ ngữ cảnh dài kỷ lục, nền tảng này tối ưu hóa việc phân tích dữ liệu quy mô lớn và tự động hóa các tác vụ văn phòng thông minh trong Google Workspace.',
    mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Sức Mạnh Google AI',
    externalUrl: 'https://cloud.google.com/vertex-ai',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'nlp-05-anthropic',
    sectionId: SectionType.AI_OMNI,
    category: '2. NLP & LLM | NỀN TẢNG SỐ 5',
    title: 'Anthropic Claude API',
    content: 'Tập trung vào tính an toàn và trung thực của thông tin thông qua công nghệ Constitutional AI, Claude là mô hình ngôn ngữ lý tưởng cho các tác vụ đòi hỏi sự tin cậy cao. Với khả năng xử lý ngữ cảnh dài và tư duy logic mạch lạc, Anthropic mang đến giải pháp phân tích tài liệu chuyên sâu và hỗ trợ lập trình với độ chính xác vượt trội.',
    mediaUrl: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Kết Nối Anthropic',
    externalUrl: 'https://www.anthropic.com/api',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },

  // --- 3. XỬ LÝ ÂM THANH (AUDIO / SPEECH PROCESSING) ---
  {
    id: 'audio-overview-pro',
    sectionId: SectionType.AI_OMNI,
    category: '3. XỬ LÝ ÂM THANH | TỔNG QUAN CHUYÊN GIA',
    title: 'Audio AI: Công Nghệ Giúp Máy Tính "Nghe" Và "Nói"',
    content: 'Xử lý âm thanh là nhóm công nghệ cốt lõi giúp AI tương tác trực tiếp qua giọng nói thông qua các mô hình nhận dạng (ASR) và tổng hợp (TTS) hiện đại. Máy tính hiện nay có thể thấu cảm ngữ điệu, dịch thuật tức thời và tạo ra những trợ lý ảo có giọng đọc tự nhiên như con người.',
    mediaUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'audio-01-google',
    sectionId: SectionType.AI_OMNI,
    category: '3. XỬ LÝ ÂM THANH | NỀN TẢNG SỐ 1',
    title: 'Google Cloud Speech AI',
    content: 'Cung cấp giải pháp nhận dạng và tổng hợp tiếng nói với độ chính xác hàng đầu trên hơn 125 ngôn ngữ. Hệ thống hỗ trợ xử lý âm thanh thời gian thực và phân tích dữ liệu chuyên sâu, giúp các tổ chức xây dựng hệ thống trợ lý ảo thông minh có khả năng giao tiếp tự nhiên trên quy mô toàn cầu.',
    mediaUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Google Audio AI',
    externalUrl: 'https://cloud.google.com/speech-to-text',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'audio-02-aws',
    sectionId: SectionType.AI_OMNI,
    category: '3. XỬ LÝ ÂM THANH | NỀN TẢNG SỐ 2',
    title: 'AWS Transcribe & Polly',
    content: 'Bộ đôi dịch vụ từ Amazon chuyên trách việc chuyển đổi tiếng nói thành văn bản và ngược lại với khả năng mở rộng cực lớn. Polly tạo ra giọng nói tự nhiên vượt trội với nhiều ngữ điệu, trong khi Transcribe xử lý hàng triệu cuộc gọi đồng thời, tự động tách kênh người nói phục vụ nhu cầu Call Center hiện đại.',
    mediaUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Amazon Speech AI',
    externalUrl: 'https://aws.amazon.com/polly/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'audio-03-azure',
    sectionId: SectionType.AI_OMNI,
    category: '3. XỬ LÝ ÂM THANH | NỀN TẢNG SỐ 3',
    title: 'Azure AI Speech Services',
    content: 'Tập trung vào các dòng giọng nói Neural giàu cảm xúc và khả năng dịch thuật âm thanh tức thời trên phạm vi quốc tế. Nền tảng cho phép doanh nghiệp tạo ra các "Giọng nói thương hiệu" độc quyền, tích hợp hoàn hảo vào các ứng dụng cộng tác như Teams và hệ sinh thái Office 365.',
    mediaUrl: 'https://images.unsplash.com/photo-1520529011872-59c3ad54f21b?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Azure Speech AI',
    externalUrl: 'https://azure.microsoft.com/en-us/products/ai-services/ai-speech',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'audio-04-huggingface',
    sectionId: SectionType.AI_OMNI,
    category: '3. XỬ LÝ ÂM THANH | NỀN TẢNG SỐ 4',
    title: 'Hugging Face Audio Models',
    content: 'Trung tâm phân phối các mô hình âm thanh mã nguồn mở tiên tiến nhất thế giới, bao gồm các kiến trúc nổi tiếng như Whisper. Nền tảng cho phép cộng đồng nghiên cứu tự do Fine-tune và triển khai các giải pháp xử lý tiếng nói chuyên biệt với chi phí tối ưu và khả năng tùy chỉnh vô hạn.',
    mediaUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Open Audio Hub',
    externalUrl: 'https://huggingface.co/tasks/audio-classification',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'audio-05-assemblyai',
    sectionId: SectionType.AI_OMNI,
    category: '3. XỬ LÝ ÂM THANH | NỀN TẢNG SỐ 5',
    title: 'AssemblyAI Intelligence',
    content: 'Nền tảng Speech Intelligence thế hệ mới kết hợp khả năng Transcription với sự thấu hiểu nội dung sâu sắc như tóm tắt, phân tích cảm xúc và nhận diện chủ đề. Đây là giải pháp API hàng đầu cho các nền tảng truyền thông hiện đại, Podcast và hệ thống phân tích hội thoại kinh doanh tự động.',
    mediaUrl: 'https://images.unsplash.com/photo-1551712702-4b7335dd8706?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'AssemblyAI API',
    externalUrl: 'https://www.assemblyai.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },

  // --- 4. DỮ LIỆU BẢNG & CHUỖI THỜI GIAN (TABULAR & TIME SERIES) ---
  {
    id: 'tabular-overview-pro',
    sectionId: SectionType.AI_OMNI,
    category: '4. DỮ LIỆU BẢNG & CHUỖI THỜI GIAN | TỔNG QUAN CHUYÊN GIA',
    title: 'Tabular AI: Khai Phá Sức Mạnh Dự Báo Từ Dữ Liệu Số',
    content: 'Dữ liệu dạng bảng và chuỗi thời gian là xương sống của AI trong quản trị và kinh doanh hiện đại. Bằng cách ứng dụng các thuật toán học máy chuyên biệt, AI có thể dự báo xu hướng thị trường, phân loại hành vi khách hàng và tối ưu hóa chuỗi cung ứng với độ chính xác thực thụ.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'tab-01-databricks',
    sectionId: SectionType.AI_OMNI,
    category: '4. DỮ LIỆU BẢNG & CHUỖI THỜI GIAN | NỀN TẢNG SỐ 1',
    title: 'Databricks Data Intelligence',
    content: 'Nền tảng xử lý dữ liệu hợp nhất cho phép doanh nghiệp xây dựng các mô hình dự báo trực tiếp trên kho dữ liệu Big Data khổng lồ. Với khả năng vận hành trên hạ tầng Spark mạnh mẽ, Databricks tự động hóa việc tìm kiếm mô hình tối ưu cho các bài toán Tabular và Forecasting phức tạp nhất của doanh nghiệp.',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Databricks AI',
    externalUrl: 'https://www.databricks.com/product/automl',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'tab-02-google',
    sectionId: SectionType.AI_OMNI,
    category: '4. DỮ LIỆU BẢNG & CHUỖI THỜI GIAN | NỀN TẢNG SỐ 2',
    title: 'Google Vertex AI Tabular',
    content: 'Kết nối trực tiếp sức mạnh của BigQuery với trí tuệ nhân tạo, cho phép thực hiện các dự báo kinh doanh quy mô lớn mà không cần di chuyển dữ liệu. Quy trình AutoML khép kín giúp huấn luyện mô hình dữ liệu bảng chỉ với vài cú click, tối ưu hóa độ chính xác dựa trên những thuật toán học máy độc quyền từ Google.',
    mediaUrl: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Vertex Tabular AI',
    externalUrl: 'https://cloud.google.com/vertex-ai/docs/tabular-data/overview',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'tab-03-aws',
    sectionId: SectionType.AI_OMNI,
    category: '4. DỮ LIỆU BẢNG & CHUỖI THỜI GIAN | NỀN TẢNG SỐ 3',
    title: 'AWS SageMaker Autopilot',
    content: 'Giải pháp MLOps chuyên nghiệp giúp tự động hóa hoàn toàn quy trình xây dựng, huấn luyện và triển khai mô hình học máy cho dữ liệu cấu trúc. SageMaker Autopilot cung cấp khả năng kiểm soát toàn diện, mã nguồn minh bạch và hạ tầng mở rộng linh hoạt phục vụ nhu cầu triển khai sản phẩm AI ở quy mô công nghiệp.',
    mediaUrl: 'https://images.unsplash.com/photo-1504868584819-f8eec7b63576?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Amazon SageMaker',
    externalUrl: 'https://aws.amazon.com/sagemaker/autopilot/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'tab-04-azure',
    sectionId: SectionType.AI_OMNI,
    category: '4. DỮ LIỆU BẢNG & CHUỖI THỜI GIAN | NỀN TẢNG SỐ 4',
    title: 'Azure Machine Learning Studio',
    content: 'Phổ cập phân tích dữ liệu bảng thông qua giao diện kéo thả trực quan, giúp các chuyên gia dữ liệu xây dựng chuỗi xử lý phức tạp mà không cần viết quá nhiều mã. Nền tảng tích hợp sâu với Power BI để trình diễn các kết quả dự báo chiến lược, hỗ trợ đầy đủ các mô hình tiên tiến cho dữ liệu chuỗi thời gian.',
    mediaUrl: 'https://images.unsplash.com/photo-1640161704729-cbe966a08476?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Azure ML Studio',
    externalUrl: 'https://azure.microsoft.com/en-us/products/machine-learning',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'tab-05-datarobot',
    sectionId: SectionType.AI_OMNI,
    category: '4. DỮ LIỆU BẢNG & CHUỖI THỜI GIAN | NỀN TẢNG SỐ 5',
    title: 'DataRobot Enterprise AI',
    content: 'Tập trung chuyên sâu vào khả năng giải thích của AI, giúp doanh nghiệp thấu hiểu rõ ràng nguyên nhân đằng sau các kết quả dự báo. Nền tảng tự động hóa việc kiểm định mô hình để đảm bảo tính minh bạch, công bằng và tuân thủ các tiêu chuẩn quản trị khắt khe nhất trong lĩnh vực tài chính và bảo hiểm.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'DataRobot Platform',
    externalUrl: 'https://www.datarobot.com/platform/automl/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },

  // --- 5. ĐA PHƯƠNG THỨC (MULTIMODAL AI) ---
  {
    id: 'mm-overview-pro',
    sectionId: SectionType.AI_OMNI,
    category: '5. ĐA PHƯƠNG THỨC | TỔNG QUAN CHUYÊN GIA',
    title: 'Multimodal AI: Khi Trí Tuệ Nhân Tạo Hội Tụ Đa Giác Quan',
    content: 'Đỉnh cao của sự tích hợp nơi văn bản, hình ảnh, âm thanh và video hòa quyện trong một mô hình thống nhất. Multimodal AI cho phép máy móc thấu hiểu bối cảnh thực tế giống con người, mở ra kỷ nguyên của những trợ lý đa năng siêu thông minh có thể tương tác đồng thời qua nhiều giác quan.',
    mediaUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'mm-01-openai',
    sectionId: SectionType.AI_OMNI,
    category: '5. ĐA PHƯƠNG THỨC | NỀN TẢNG SỐ 1',
    title: 'OpenAI Omni API',
    content: 'Xây dựng trên nền tảng các mô hình o1 và GPT-4o, OpenAI cung cấp khả năng xử lý đồng thời nhiều định dạng dữ liệu với độ trễ tối thiểu. Hệ thống cho phép các ứng dụng giao tiếp mượt mà qua hình ảnh và giọng nói, tạo nên trải nghiệm tương tác tự nhiên và trực quan chưa từng có cho người dùng cuối.',
    mediaUrl: 'https://images.unsplash.com/photo-1679083216051-aa510a1a2c0e?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'OpenAI Omni',
    externalUrl: 'https://openai.com/api/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'mm-02-google',
    sectionId: SectionType.AI_OMNI,
    category: '5. ĐA PHƯƠNG THỨC | NỀN TẢNG SỐ 2',
    title: 'Google Gemini Multimodal',
    content: 'Dẫn đầu với khả năng phân tích video và tài liệu quy mô lớn nhờ cửa sổ ngữ cảnh siêu dài, cho phép AI "đọc" hàng giờ video trong vài giây. Gemini trên Vertex AI là công cụ chiến lược giúp doanh nghiệp khai phá tri thức từ các kho dữ liệu hỗn hợp bao gồm văn bản, sơ đồ, bảng biểu và âm thanh hội thoại.',
    mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Gemini Multimodal',
    externalUrl: 'https://cloud.google.com/vertex-ai',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'mm-03-anthropic',
    sectionId: SectionType.AI_OMNI,
    category: '5. ĐA PHƯƠNG THỨC | NỀN TẢNG SỐ 3',
    title: 'Anthropic Claude Vision',
    content: 'Kết hợp khả năng suy luận logic sâu sắc với thị giác máy tính để phân tích các tài liệu kỹ thuật và sơ đồ phức tạp nhất. Claude Opus mang đến giải pháp tối ưu cho việc kiểm tra mã nguồn có hình ảnh minh họa, phân tích báo cáo tài chính đồ họa và thiết kế các sơ đồ logic với độ chính xác và tính an toàn cao.',
    mediaUrl: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Claude Vision',
    externalUrl: 'https://www.anthropic.com/api',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'mm-04-xai',
    sectionId: SectionType.AI_OMNI,
    category: '5. ĐA PHƯƠNG THỨC | NỀN TẢNG SỐ 4',
    title: 'xAI Grok Multimodal',
    content: 'Nền tảng AI tích hợp nguồn dữ liệu trực tiếp từ hệ sinh thái mạng xã hội X, cung cấp khả năng suy luận đa dạng dữ liệu với tốc độ xử lý tức thời. Grok có thể phản hồi các sự kiện đang diễn ra bằng cách phân tích đồng thời luồng văn bản và hình ảnh lan truyền, mang lại góc nhìn cập nhật và sắc bén.',
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Grok Multimodal',
    externalUrl: 'https://x.ai/api',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'mm-05-huggingface',
    sectionId: SectionType.AI_OMNI,
    category: '5. ĐA PHƯƠNG THỨC | NỀN TẢNG SỐ 5',
    title: 'Open Multimodal Hub',
    content: 'Trung tâm phân phối các mô hình Vision-Language mã nguồn mở hàng đầu như LLaVA và Qwen-VL, cho phép cộng đồng tự do Fine-tuning và tùy chỉnh. Đây là nơi lý tưởng để các nhà phát triển xây dựng các ứng dụng đa phương thức chuyên biệt cho từng lĩnh vực ngách mà không bị ràng buộc bởi các API độc quyền.',
    mediaUrl: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Open MM Hub',
    externalUrl: 'https://huggingface.co/models?pipeline_tag=visual-question-answering',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },

  // --- 6. TRI THỨC & SUY LUẬN TRỪU TƯỢNG (ADVANCED REASONING) ---
  {
    id: 'reasoning-overview-pro',
    sectionId: SectionType.AI_OMNI,
    category: '6. TRI THỨC & SUY LUẬN | TỔNG QUAN CHUYÊN GIA',
    title: 'Advanced Reasoning: Khi AI Biết Suy Nghĩ Trước Khi Trả Lời',
    content: 'Đại diện cho bước chuyển mình từ AI bắt chước sang AI tư duy thực thụ, có khả năng thực hiện các suy luận nhân quả phức tạp. Nhóm công nghệ này giúp máy móc tự kiểm chứng logic, giải các bài toán chuyên sâu và lập kế hoạch chiến lược với độ minh bạch cao nhất.',
    mediaUrl: 'https://images.unsplash.com/photo-1678382156212-f1400106bb41?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'res-01-openai',
    sectionId: SectionType.AI_OMNI,
    category: '6. TRI THỨC & SUY LUẬN | NỀN TẢNG SỐ 1',
    title: 'OpenAI Reasoning Series',
    content: 'Đỉnh cao của khả năng giải quyết vấn đề thông qua cơ chế suy nghĩ từng bước nội tại (Internal Chain-of-thought) trên các dòng mô hình o1 và o3. Nền tảng này thiết lập tiêu chuẩn mới cho việc nghiên cứu khoa học, tối ưu hóa thuật toán phức tạp và xây dựng các hệ thống tự động ra quyết định đòi hỏi trí tuệ vượt bậc.',
    mediaUrl: 'https://images.unsplash.com/photo-1679083216051-aa510a1a2c0e?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'OpenAI Reasoning',
    externalUrl: 'https://openai.com/api/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'res-02-anthropic',
    sectionId: SectionType.AI_OMNI,
    category: '6. TRI THỨC & SUY LUẬN | NỀN TẢNG SỐ 2',
    title: 'Anthropic Safe Reasoning',
    content: 'Tập trung vào việc thực hiện các suy luận logic dựa trên bộ nguyên tắc đạo đức và an toàn nghiêm ngặt, đảm bảo kết quả trung thực và có thể giải trình. Claude mang đến giải pháp suy luận đáng tin cậy cho các nhiệm vụ nhạy cảm trong y tế, pháp lý và tư vấn chiến lược doanh nghiệp cấp cao.',
    mediaUrl: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Claude Reasoning',
    externalUrl: 'https://www.anthropic.com/api',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'res-03-google',
    sectionId: SectionType.AI_OMNI,
    category: '6. TRI THỨC & SUY LUẬN | NỀN TẢNG SỐ 3',
    title: 'Google Vertex Reasoning',
    content: 'Tăng cường khả năng giải quyết các bài toán logic đa bước thông qua hạ tầng TPU chuyên biệt, giúp AI xử lý các mối quan hệ nhân quả sâu sắc. Nền tảng cung cấp môi trường MLOps toàn diện để triển khai các mô hình suy luận vào sản xuất, tối ưu hóa hiệu năng cho các dự báo kinh tế và kỹ thuật phức tạp.',
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Gemini Logic',
    externalUrl: 'https://cloud.google.com/vertex-ai',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'res-04-xai',
    sectionId: SectionType.AI_OMNI,
    category: '6. TRI THỨC & SUY LUẬN | NỀN TẢNG SỐ 4',
    title: 'xAI Real-time Reasoning',
    content: 'Thực hiện các suy luận nâng cao trên luồng dữ liệu cập nhật từng giây, giúp AI nắm bắt và phân tích nguyên nhân của các sự kiện thời sự đang bùng nổ. Grok mang đến tư duy phản biện mạnh mẽ và khả năng cập nhật tri thức siêu tốc, giúp người dùng hiểu sâu sắc về các biến động thị trường và xã hội.',
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Grok Reasoning',
    externalUrl: 'https://x.ai/api',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'res-05-causalens',
    sectionId: SectionType.AI_OMNI,
    category: '6. TRI THỨC & SUY LUẬN | NỀN TẢNG SỐ 5',
    title: 'causaLens Intelligence',
    content: 'Nền tảng chuyên biệt tập trung vào việc khám phá các mối quan hệ nhân quả (Causal Discovery) để đưa ra các quyết định kinh doanh dựa trên sự thấu hiểu bản chất. Hệ thống giúp doanh nghiệp phân tích tác động của các chính sách và tối ưu hóa chuỗi cung ứng bằng cách trả lời câu hỏi "Tại sao" đằng sau dữ liệu.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'causaLens Platform',
    externalUrl: 'https://www.causalens.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },

  // --- 7. TỰ ĐỘNG HÓA THÔNG MINH (INTELLIGENT / AGENTIC AUTOMATION) ---
  {
    id: 'auto-overview-pro',
    sectionId: SectionType.AI_OMNI,
    category: '7. TỰ ĐỘNG HÓA THÔNG MINH | TỔNG QUAN CHUYÊN GIA',
    title: 'Tự động hóa thông minh (Intelligent Automation)',
    content: 'Ứng dụng AI để tự động hóa quy trình với khả năng tự quyết định và thích ứng linh hoạt. Nhóm công nghệ này giúp thay thế các công việc lặp lại một cách thông minh, nâng cao hiệu suất vận hành trong cả môi trường doanh nghiệp lẫn sản xuất công nghiệp.',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'auto-01-uipath',
    sectionId: SectionType.AI_OMNI,
    category: '7. TỰ ĐỘNG HÓA THÔNG MINH | NỀN TẢNG SỐ 1',
    title: 'UiPath AI Agents',
    content: 'Hệ thống tự động hóa quy trình nghiệp vụ (RPA) kết hợp cùng các AI Agent thông minh giúp xử lý những luồng công việc phức tạp như hóa đơn, tài liệu pháp lý và quản trị văn phòng. Nền tảng này dẫn đầu thị trường về khả năng triển khai thực tế và tỷ lệ áp dụng thành công trong các tập đoàn đa quốc gia.',
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'UiPath Platform',
    externalUrl: 'https://www.uipath.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'auto-02-automation-anywhere',
    sectionId: SectionType.AI_OMNI,
    category: '7. TỰ ĐỘNG HÓA THÔNG MINH | NỀN TẢNG SỐ 2',
    title: 'Automation Anywhere',
    content: 'Tập trung vào khả năng thấu hiểu tài liệu (Document Understanding) thông qua AI, giúp doanh nghiệp tự động hóa việc trích xuất và xử lý dữ liệu từ các nguồn phi cấu trúc. Hệ thống cung cấp các bộ tiêu chuẩn đo lường hiệu suất mạnh mẽ, đảm bảo tính chính xác và bảo mật tuyệt đối cho mọi quy trình tự động.',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Automation Anywhere',
    externalUrl: 'https://www.automationanywhere.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'auto-03-power-automate',
    sectionId: SectionType.AI_OMNI,
    category: '7. TỰ ĐỘNG HÓA THÔNG MINH | NỀN TẢNG SỐ 3',
    title: 'Microsoft Power Automate',
    content: 'Giải pháp xây dựng quy trình làm việc Low-code tích hợp sâu vào hệ sinh thái Microsoft 365, cho phép người dùng tự động hóa các tác vụ hàng ngày trên Outlook và Teams. Với Copilot Studio, doanh nghiệp có thể dễ dàng kiến tạo các chatbot thông minh để hỗ trợ nhân sự và khách hàng một cách trực quan.',
    mediaUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Power Automate',
    externalUrl: 'https://powerautomate.microsoft.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'auto-04-zapier',
    sectionId: SectionType.AI_OMNI,
    category: '7. TỰ ĐỘNG HÓA THÔNG MINH | NỀN TẢNG SỐ 4',
    title: 'Zapier AI Workflows',
    content: 'Nền tảng No-code phổ biến nhất thế giới giúp kết nối hàng nghìn ứng dụng khác nhau để tạo nên các luồng tự động hóa linh hoạt. Zapier mang sức mạnh AI đến với mọi người dùng, giúp tối ưu hóa việc gửi thông báo, quản trị dữ liệu khách hàng và đồng bộ hóa thông tin giữa các nền tảng đám mây phổ biến.',
    mediaUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Khám Phá Zapier',
    externalUrl: 'https://zapier.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'auto-05-n8n',
    sectionId: SectionType.AI_OMNI,
    category: '7. TỰ ĐỘNG HÓA THÔNG MINH | NỀN TẢNG SỐ 5',
    title: 'n8n Workflow Automation',
    content: 'Giải pháp tự động hóa mã nguồn mở cho phép doanh nghiệp tự host trên server riêng để đảm bảo quyền riêng tư và bảo mật dữ liệu tuyệt đối. n8n cung cấp khả năng tùy biến vô hạn cho các kỹ sư, giúp xây dựng những quy trình tự động hóa phức tạp và tiết kiệm chi phí vận hành cho tổ chức.',
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Trải Nghiệm n8n',
    externalUrl: 'https://n8n.io/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },

  // --- 8. PROMPT ENGINEERING VÀ NỀN TẢNG HỖ TRỢ PROMPT ---
  {
    id: 'prompt-overview-pro',
    sectionId: SectionType.AI_OMNI,
    category: '8. PROMPT ENGINEERING | TỔNG QUAN CHUYÊN GIA',
    title: 'Prompt Engineering & LLMOps',
    content: 'Nghệ thuật thiết kế câu lệnh kết hợp cùng các quy trình LLMOps để quản lý và tối ưu hóa hiệu suất của các mô hình ngôn ngữ lớn. Nhóm công cụ này đóng vai trò quyết định trong việc điều khiển AI làm việc chính xác, ổn định và hiệu quả trong môi trường thực tế.',
    mediaUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'prompt-01-langsmith',
    sectionId: SectionType.AI_OMNI,
    category: '8. PROMPT ENGINEERING | NỀN TẢNG SỐ 1',
    title: 'LangSmith Platform',
    content: 'Bộ công cụ thiết yếu từ LangChain chuyên trách việc debug, kiểm định và giám sát các chuỗi thực thi của AI Agent. Nền tảng giúp các nhà phát triển thấu hiểu sâu sắc quy trình tư duy của mô hình, từ đó tinh chỉnh các câu lệnh để đạt được độ ổn định và hiệu năng cao nhất trong ứng dụng thực tế.',
    mediaUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'LangSmith',
    externalUrl: 'https://www.langchain.com/langsmith',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'prompt-02-promptlayer',
    sectionId: SectionType.AI_OMNI,
    category: '8. PROMPT ENGINEERING | NỀN TẢNG SỐ 2',
    title: 'PromptLayer CMS',
    content: 'Giải pháp quản trị phiên bản và phân tích hiệu suất câu lệnh dành riêng cho các dự án LLM chuyên nghiệp. PromptLayer cho phép các đội ngũ kỹ sư quản lý prompt như mã nguồn code, theo dõi chi phí API và đánh giá chất lượng phản hồi của mô hình theo thời gian thực một cách khoa học.',
    mediaUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'PromptLayer',
    externalUrl: 'https://promptlayer.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'prompt-03-langfuse',
    sectionId: SectionType.AI_OMNI,
    category: '8. PROMPT ENGINEERING | NỀN TẢNG SỐ 3',
    title: 'Langfuse Observability',
    content: 'Nền tảng quan sát mã nguồn mở cung cấp cái nhìn toàn diện về cách thức LLM vận hành trong môi trường thực tế. Hệ thống tự động ghi nhật ký các cuộc gọi API, giám sát độ trễ và chất lượng câu trả lời, giúp các tổ chức tối ưu hóa trải nghiệm người dùng và tiết kiệm tài nguyên hệ thống.',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Langfuse',
    externalUrl: 'https://langfuse.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'prompt-04-helicone',
    sectionId: SectionType.AI_OMNI,
    category: '8. PROMPT ENGINEERING | NỀN TẢNG SỐ 4',
    title: 'Helicone Optimization',
    content: 'Giải pháp tối ưu hóa chi phí và quản lý bộ nhớ đệm (Caching) cho các yêu cầu gọi API đến các mô hình ngôn ngữ lớn. Helicone mang lại khả năng phân tích sâu sắc về tần suất sử dụng, giúp doanh nghiệp cắt giảm chi phí vận hành AI đồng thời tăng tốc độ phản hồi cho các ứng dụng chatbot.',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Helicone',
    externalUrl: 'https://www.helicone.ai/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 'prompt-05-poe',
    sectionId: SectionType.AI_OMNI,
    category: '8. PROMPT ENGINEERING | NỀN TẢNG SỐ 5',
    title: 'Poe AI Playground',
    content: 'Môi trường thử nghiệm đa mô hình mạnh mẽ từ Quora, cho phép so sánh tức thời hiệu năng của các dòng AI hàng đầu như GPT, Claude, Llama và Gemini trên cùng một câu lệnh. Đây là công cụ lý tưởng để các chuyên gia Prompt Engineering tìm kiếm mô hình phù hợp nhất cho từng bài toán cụ thể.',
    mediaUrl: 'https://images.unsplash.com/photo-1678382156212-f1400106bb41?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image',
    ctaText: 'Poe.com',
    externalUrl: 'https://poe.com/',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    comments: []
  },

  // --- HOME PAGE WELCOME ---
  {
    id: 'welcome-01',
    sectionId: SectionType.HOME,
    content: 'Chào mừng quý đối tác đến với hệ sinh thái AI Omni của Dương Mạnh Tuấn. Đây là không gian hội tụ những tinh hoa công nghệ AI hàng đầu thế giới, nơi chúng tôi không chỉ cập nhật thông tin và còn định hình lộ trình chuyển đổi số toàn diện cho doanh nghiệp của bạn.',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    comments: [],
    mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
    mediaType: 'image'
  }
];

const QAModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', method: 'zalo', detail: '', question: '' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a100c] border border-amber-500/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-4 border-b border-amber-900/50 flex justify-between items-center bg-amber-900/10">
          <h2 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">Hỏi & Đáp</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={20} /></button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); onClose(); }}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Họ tên" required className="bg-black/40 border border-amber-900/30 rounded-lg p-2.5 text-white text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="text" placeholder="Số điện thoại" required className="bg-black/40 border border-amber-900/30 rounded-lg p-2.5 text-white text-sm" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select className="bg-black/40 border border-amber-900/30 rounded-lg p-2.5 text-white text-sm" onChange={e => setFormData({...formData, method: e.target.value as any})}>
              <option value="zalo">Zalo</option>
              <option value="facebook">Facebook</option>
              <option value="email">Email</option>
              <option value="tiktok">Tiktok</option>
            </select>
            <input type="text" placeholder="Link/Email chi tiết" required className="bg-black/40 border border-amber-900/30 rounded-lg p-2.5 text-white text-sm" onChange={e => setFormData({...formData, detail: e.target.value})} />
          </div>
          <textarea placeholder="Câu hỏi của bạn..." required className="w-full bg-black/40 border border-amber-900/30 rounded-lg p-2.5 text-white text-sm h-32" onChange={e => setFormData({...formData, question: e.target.value})}></textarea>
          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">Gửi Câu Hỏi <Send size={18} /></button>
        </form>
      </div>
    </div>
  );
};

const GlobalSearchModal: React.FC<{ isOpen: boolean; onClose: () => void; posts: Post[]; sections: Record<SectionType, SectionConfig> }> = ({ isOpen, onClose, posts, sections }) => {
  const [query, setQuery] = useState('');
  if (!isOpen) return null;
  const filtered = posts.filter(p => p.content?.toLowerCase().includes(query.toLowerCase()) || p.title?.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-md p-4 md:p-10">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4 flex-1">
            <Search className="text-amber-500" size={24} />
            <input autoFocus placeholder="Tìm kiếm toàn hệ thống..." className="bg-transparent border-b-2 border-amber-500/30 focus:border-amber-500 text-2xl text-white w-full outline-none py-2" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <button onClick={onClose} className="ml-6 text-white/50 hover:text-white"><X size={32} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh] pr-4">
          {query && filtered.map(p => (
            <Link key={p.id} to={sections[p.sectionId].path} onClick={onClose} className="bg-[#1a100c] border border-amber-900/30 p-4 rounded-xl hover:border-amber-500 transition-all group">
              <span className="text-[10px] text-amber-500 font-bold uppercase">{sections[p.sectionId].title}</span>
              <h4 className="text-white font-bold group-hover:text-amber-400 mt-1">{p.title || 'Bài viết'}</h4>
              <p className="text-white/60 text-xs mt-2 line-clamp-2">{p.content}</p>
            </Link>
          ))}
          {query && filtered.length === 0 && <div className="col-span-full text-center text-white/30 italic py-10">Không tìm thấy kết quả...</div>}
        </div>
      </div>
    </div>
  );
};

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLoginSuccess: () => void }> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [account, setAccount] = useState('');
  const [pass, setPass] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (account === 'tuan260988' && pass === 'bolaymay123') {
      onLoginSuccess();
    } else {
      alert('Tài khoản hoặc Mật khẩu không chính xác!');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="bg-[#1a100c] border border-amber-500/40 p-8 rounded-3xl w-full max-w-sm text-center animate-fadeIn shadow-[0_0_50px_rgba(245,158,11,0.1)]">
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Fingerprint size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">System Access</h2>
        <p className="text-white/40 text-[10px] mb-8 italic uppercase tracking-wider">Vui lòng xác minh thông tin quản trị</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-amber-500 transition-colors" size={16} />
            <input 
              type="text" 
              autoFocus 
              className="w-full bg-black/50 border border-amber-900/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-amber-500 transition-all placeholder-white/20" 
              value={account} 
              onChange={e => setAccount(e.target.value)} 
              placeholder="Tên tài khoản..." 
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-amber-500 transition-colors" size={16} />
            <input 
              type="password" 
              className="w-full bg-black/50 border border-amber-900/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-amber-500 transition-all placeholder-white/20" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              placeholder="Mật khẩu..." 
            />
          </div>
          
          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 uppercase tracking-widest text-xs mt-2">
            AUTHENTICATE
          </button>
        </form>
        
        <button onClick={onClose} className="mt-6 text-white/30 hover:text-white text-[10px] transition-colors uppercase font-bold tracking-widest">Hủy bỏ</button>
      </div>
    </div>
  );
};

const AdminInboxModal: React.FC<{ isOpen: boolean; onClose: () => void; messages: InboxMessage[]; onMarkAsRead: (id: string) => void; onDeleteMessage: (id: string) => void }> = ({ isOpen, onClose, messages, onMarkAsRead, onDeleteMessage }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a100c] border border-amber-500/50 rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-amber-900/50 flex justify-between items-center bg-amber-900/10">
          <h2 className="text-white font-bold uppercase tracking-widest flex items-center gap-2"><Mail size={20} /> Hộp Thư Admin</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.length === 0 ? <div className="text-center py-20 text-white/20 italic">Chưa có tin nhắn nào.</div> : messages.map(msg => (
            <div key={msg.id} className={`p-4 rounded-xl border transition-all ${msg.isRead ? 'bg-black/20 border-white/5' : 'bg-amber-900/10 border-amber-500/30 shadow-lg shadow-amber-500/5'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-amber-500 font-bold flex items-center gap-2">{msg.senderName} <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded text-amber-400 font-mono">{msg.phoneNumber}</span></h4>
                  <div className="text-[10px] text-white/40 mt-1 flex items-center gap-2"><Clock size={10} /> {new Date(msg.timestamp).toLocaleString()} | {msg.contactMethod}: {msg.contactDetail}</div>
                </div>
                <div className="flex gap-2">
                  {!msg.isRead && <button onClick={() => onMarkAsRead(id)} className="p-1.5 bg-green-900/30 text-green-400 rounded hover:bg-green-900/50 transition-colors" title="Đánh dấu đã đọc"><CheckCircle size={14}/></button>}
                  <button onClick={() => onDeleteMessage(msg.id)} className="p-1.5 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors" title="Xóa"><Trash2 size={14}/></button>
                </div>
              </div>
              <p className="text-white/80 text-sm italic border-l-2 border-amber-500/30 pl-3 py-1">{msg.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [sections, setSections] = useState(initialSections);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isQAOpen, setIsQAOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminInboxOpen, setIsAdminInboxOpen] = useState(false); 
  const [adminMessages, setAdminMessages] = useState<InboxMessage[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [visitorCount, setVisitorCount] = useState(12845);
  const [questionsCount, setQuestionsCount] = useState(12);
  const [voiceUrl, setVoiceUrl] = useState<string>(''); 
  const [voiceStatus, setVoiceStatus] = useState<'playing' | 'stopped' | 'error'>('error');

  const handleUpdateAvatar = (type: SectionType, url: string) => setSections(prev => ({ ...prev, [type]: { ...prev[type], avatarUrl: url } }));
  const handleUpdatePost = (updatedPost: Post) => setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  const handleDeletePost = (id: string) => { if (window.confirm("Xóa bài viết?")) setPosts(prev => prev.filter(p => p.id !== id)); };
  const handleAddPost = (sectionId: SectionType) => {
    const newPost: Post = { id: Date.now().toString(), sectionId, content: 'Nội dung mới...', title: 'Tiêu đề mới', isFeatured: false, createdAt: new Date().toISOString(), comments: [] };
    setPosts(prev => [newPost, ...prev]);
  };
  const handleQASubmit = (data: any) => {
    const newMessage: InboxMessage = { id: Date.now().toString(), senderName: data.name, phoneNumber: data.phone, contactMethod: data.method, contactDetail: data.detail, content: data.question, timestamp: new Date().toISOString(), isRead: false };
    setAdminMessages(prev => [newMessage, ...prev]);
    setQuestionsCount(prev => prev + 1);
    alert('Tin nhắn của bạn đã được gửi tới hệ thống quản trị!');
  };
  const handleMarkAsRead = (id: string) => setAdminMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  const handleDeleteMessage = (id: string) => setAdminMessages(prev => prev.filter(m => m.id !== id));
  const handleUploadVoice = (file: File) => { const url = URL.createObjectURL(file); setVoiceUrl(url); setVoiceStatus('playing'); };
  const handleDeleteVoice = () => { setVoiceUrl(''); setVoiceStatus('error'); };
  const handleToggleEditModeWrapper = () => setIsEditMode(!isEditMode);
  const handleLogout = () => { setIsAuthenticated(false); setIsEditMode(false); };
  const handleLoginClick = () => setIsLoginModalOpen(true);

  return (
    <Router>
      <QAModal isOpen={isQAOpen} onClose={() => setIsQAOpen(false)} onSubmit={handleQASubmit} />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} posts={posts} sections={sections} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={() => { setIsAuthenticated(true); setIsEditMode(true); setIsLoginModalOpen(false); }} />
      <AdminInboxModal isOpen={isAdminInboxOpen} onClose={() => setIsAdminInboxOpen(false)} messages={adminMessages} onMarkAsRead={handleMarkAsRead} onDeleteMessage={handleDeleteMessage} />

      <Layout 
        sections={sections}
        voiceUrl={voiceUrl}
        onUploadVoice={handleUploadVoice}
        onDeleteVoice={handleDeleteVoice}
        voiceStatus={voiceStatus}
        visitorCount={visitorCount}
        questionsCount={questionsCount}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditModeWrapper}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onLoginClick={handleLoginClick}
        onOpenInbox={() => setIsAdminInboxOpen(true)} 
        onSearchClick={() => setIsSearchOpen(true)} 
        unreadCount={adminMessages.filter(m => !m.isRead).length} 
      >
        <Routes>
          <Route path="/" element={
            <HomePage 
              config={sections[SectionType.HOME]}
              onUpdateAvatar={(url) => handleUpdateAvatar(SectionType.HOME, url)}
              posts={posts}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
              onAddPost={() => handleAddPost(SectionType.HOME)}
              onOpenQA={() => setIsQAOpen(true)}
              isEditMode={isEditMode}
            />
          } />
          
          {[SectionType.ABOUT, SectionType.NEWS, SectionType.BLOG, SectionType.AI_OMNI, SectionType.PRODUCTS].map((type) => (
            <Route key={type} path={sections[type].path} element={
              <SectionPage 
                config={sections[type]}
                onUpdateAvatar={(url) => handleUpdateAvatar(type, url)}
                posts={posts.filter(p => p.sectionId === type)}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
                onAddPost={() => handleAddPost(type)}
                isEditMode={isEditMode} 
              />
            } />
          ))}

          <Route path="/contact" element={<ContactPage config={sections[SectionType.CONTACT]} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
