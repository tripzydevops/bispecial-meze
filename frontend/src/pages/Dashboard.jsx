import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    TrendingUp,
    Package,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRight,
    Search,
    Bell,
    Calendar,
    ChefHat,
    DollarSign,
    Target
} from 'lucide-react';

const API_BASE = '/api';

const StatCard = ({ title, value, change, icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="premium-card p-8 group relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-${color}-500/10 transition-colors`}></div>
        <div className="flex justify-between items-start mb-6">
            <div className={`bg-${color}-50 p-4 rounded-2xl text-${color}-600 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {icon}
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-full">
                {change > 0 ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-rose-500" />}
                <span className={`text-xs font-black ${change > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>%{Math.abs(change)}</span>
            </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 leading-tight">{value}</h3>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        materials: 0,
        recipes: 0,
        avg_cost: 0,
        active_tasks: 0
    });
    const [activity, setActivity] = useState([]);
    const [trends, setTrends] = useState([40, 65, 55, 80, 45, 90, 70]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(`${API_BASE}/stats/summary`);
                setStats(res.data.stats);
                setActivity(res.data.activity);
                if (res.data.trends) setTrends(res.data.trends);
            } catch (err) {
                console.error("Dashboard data fetching failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">Kontrol Paneli</h1>
                    <p className="text-slate-500 font-bold text-lg">Maliyetlerinizi ve reçetelerinizi gerçek zamanlı takip edin.</p>
                </div>
                <div className="flex gap-4">
                    <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group cursor-pointer hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Bugün</p>
                            <p className="text-sm font-black text-slate-900 leading-none">04 Mart 2026</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200 flex items-center gap-4 cursor-pointer hover:bg-amber-600 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <ChefHat size={24} />
                        </div>
                        <p className="text-sm font-black tracking-widest uppercase">Mutfak Modu</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Toplam Malzeme"
                    value={stats.materials}
                    change={12.5}
                    icon={<Package size={28} />}
                    color="amber"
                />
                <StatCard
                    title="Aktif Reçete"
                    value={stats.recipes}
                    change={4.2}
                    icon={<FileText size={28} />}
                    color="blue"
                />
                <StatCard
                    title="Ortalama Porsiyon"
                    value={`${stats.avg_cost} ₺`}
                    change={-2.1}
                    icon={<Target size={28} />}
                    color="emerald"
                />
                <StatCard
                    title="Aktif Görevler"
                    value={stats.active_tasks}
                    change={0}
                    icon={<Bell size={28} />}
                    color="rose"
                />
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Mockup */}
                <div className="lg:col-span-2 premium-card p-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-1">Maliyet Analizi</h3>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Son 7 Günlük Değişim</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-5 py-2.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded-xl uppercase tracking-widest">Haftalık</button>
                            <button className="px-5 py-2.5 hover:bg-slate-50 text-slate-400 text-[10px] font-black rounded-xl uppercase tracking-widest transition-colors">Aylık</button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4">
                        {trends.map((height, i) => (
                            <div key={i} className="flex-1 group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: i * 0.1, duration: 1 }}
                                    className="w-full bg-slate-50 rounded-2xl group-hover:bg-amber-500 transition-all duration-500 relative"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {(height * 1.5).toFixed(1)}₺
                                    </div>
                                </motion.div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mt-4">Gün {i + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Content */}
                <div className="premium-card p-10 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] -mr-32 -mt-32"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="bg-white/10 p-5 rounded-3xl w-fit mb-8 shadow-xl backdrop-blur-xl border border-white/5">
                            <TrendingUp size={32} className="text-amber-500" />
                        </div>
                        <h3 className="text-4xl font-black leading-tight mb-4 tracking-tight">Son<br />Aktiviteler</h3>
                        <p className="text-white/60 font-bold mb-10 leading-relaxed">Sisteminizde gerçekleşen son işlemler ve güncellemeler.</p>

                        <div className="space-y-4 mt-auto">
                            {activity.length > 0 ? activity.map((item) => (
                                <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${item.type === 'recipe' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                                        <div>
                                            <p className="font-bold text-sm tracking-wide leading-none mb-1">{item.title}</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{item.subtitle}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-white/20 group-hover:text-amber-500 transition-colors uppercase">{item.time}</span>
                                </div>
                            )) : (
                                <p className="text-white/20 text-xs font-black uppercase tracking-widest text-center py-10">Henüz aktivite yok</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
