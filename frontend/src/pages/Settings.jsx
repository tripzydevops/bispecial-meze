import React from 'react';
import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Database,
    Globe,
    ChevronRight,
    HelpCircle,
    Info,
    CheckCircle2
} from 'lucide-react';

const SettingItem = ({ icon, label, description, status, badge }) => (
    <div className="p-6 bg-slate-50 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all cursor-pointer flex items-center justify-between">
        <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-2xl text-slate-400 group-hover:text-amber-600 shadow-sm transition-colors border border-slate-50">
                {icon}
            </div>
            <div>
                <p className="font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase tracking-widest text-xs flex items-center gap-2">
                    {label}
                    {badge && <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-lg text-[8px] tracking-normal font-black">{badge}</span>}
                </p>
                <p className="text-slate-400 text-xs font-bold mt-1">{description}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            {status && <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{status}</span>}
            <ChevronRight size={20} className="text-slate-200 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </div>
    </div>
);

const Settings = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-12"
        >
            <header>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sistem Ayarları</h1>
                <p className="text-slate-500 mt-2 text-lg font-bold">Uygulama tercihlerini ve genel yapılandırmaları düzenleyin.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 space-y-2">
                    {['Genel', 'Profil', 'Bildirimler', 'Güvenlik', 'Veri'].map((tab, i) => (
                        <button
                            key={tab}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="md:col-span-3 premium-card p-10 space-y-10">
                    <section className="space-y-6">
                        <div className="flex justify-between items-end border-b border-slate-50 pb-6">
                            <h3 className="font-black text-slate-300 uppercase tracking-[0.2em] text-[10px]">Uygulama Ayarları</h3>
                            <button className="text-amber-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                                <HelpCircle size={14} /> Yardım Al
                            </button>
                        </div>

                        <div className="space-y-4">
                            <SettingItem
                                icon={<Globe size={20} />}
                                label="Bölge ve Dil"
                                description="Türkçe / Türkiye (TR)"
                                status="Aktif"
                            />
                            <SettingItem
                                icon={<Bell size={20} />}
                                label="Bildirim Tercihleri"
                                description="Stok ve maliyet uyarılarını yönetin"
                                badge="3 Yeni"
                            />
                            <SettingItem
                                icon={<Shield size={20} />}
                                label="Güvenlik ve Giriş"
                                description="Şifre ve iki aşamalı doğrulama"
                            />
                            <SettingItem
                                icon={<Database size={20} />}
                                label="Veri Depolama"
                                description="SQLite entegrasyon ayarları"
                                status="Sağlıklı"
                            />
                        </div>
                    </section> section

                    <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100/50 flex items-center gap-6 group">
                        <div className="bg-amber-100 p-5 rounded-2xl text-amber-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
                            <Info size={24} />
                        </div>
                        <div>
                            <p className="font-black text-amber-900 uppercase tracking-widest text-[10px] mb-1">Bulut Senkronizasyonu</p>
                            <p className="text-amber-800/60 text-xs font-bold leading-relaxed">
                                Verileriniz şu an yerel olarak kaydediliyor. Profesyonel sürüm ile
                                bulut yedeklemeyi aktif hale getirebilirsiniz.
                            </p>
                        </div>
                        <button className="ml-auto px-6 py-3 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-200">
                            Keşfet
                        </button>
                    </div>
                </div>
            </div>

            <footer className="pt-10 border-t border-slate-100 flex justify-between items-center text-slate-300">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Sistemi Tüm Ayarlar Senkronize
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest">
                    v1.0.0 (Premium)
                </div>
            </footer>
        </motion.div>
    );
};

export default Settings;
