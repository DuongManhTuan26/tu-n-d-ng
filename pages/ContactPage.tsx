import React from 'react';
import { SectionConfig } from '../types';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

interface ContactPageProps {
  config: SectionConfig;
}

const ContactPage: React.FC<ContactPageProps> = ({ config }) => {
  return (
    <div className="pt-20 md:pt-32 px-4 md:px-8 w-full pb-20">
      <h1 className="text-4xl font-bold mb-12 text-center text-white drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] uppercase tracking-wider animate-pulse">{config.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Info Card */}
        <div className="bg-[#1a100c]/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">Thông tin liên hệ</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="bg-amber-900/40 p-3 rounded-lg text-white group-hover:text-white group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all border border-amber-500/30">
                <MapPin size={24} className="animate-pulse" />
              </div>
              <div>
                <label className="text-xs text-white uppercase font-bold tracking-wide">Địa chỉ</label>
                <p className="text-lg text-white font-medium">Số nhà 29, ngõ 236, đường Dương Tự Minh, Quan Triều, Thái Nguyên</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="bg-amber-900/40 p-3 rounded-lg text-white group-hover:text-white group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all border border-amber-500/30">
                <Phone size={24} className="animate-pulse" />
              </div>
              <div>
                <label className="text-xs text-white uppercase font-bold tracking-wide">Hotline / Zalo</label>
                <p className="text-lg font-mono tracking-wider text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">0763 012 345</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="bg-amber-900/40 p-3 rounded-lg text-white group-hover:text-white group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all border border-amber-500/30">
                <Mail size={24} className="animate-pulse" />
              </div>
              <div>
                <label className="text-xs text-white uppercase font-bold tracking-wide">Email</label>
                <p className="text-lg text-white font-medium">tuanmanh2609@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="bg-amber-900/40 p-3 rounded-lg text-white group-hover:text-white group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all border border-amber-500/30">
                <Globe size={24} className="animate-pulse" />
              </div>
              <div>
                <label className="text-xs text-white uppercase font-bold tracking-wide">Tiktok</label>
                <p className="text-lg text-white font-medium">@tuank2609</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container - ALWAYS OPEN */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-full min-h-[400px] bg-[#1a100c] rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
             <iframe 
                title="Google Maps"
                width="100%" 
                height="100%" 
                style={{border:0, minHeight: '400px', height: '100%'}} 
                loading="lazy" 
                allowFullScreen 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.87654321!2d105.80!3d21.60!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDM2JzAwLjAiTiAxMDXCsDQ4JzAwLjAiRQ!5e0!3m2!1sen!2s!4v1600000000000"
             ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;