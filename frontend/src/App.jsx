import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutGrid, BookOpen, Camera, Settings, Package, LogOut, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Recipes from './pages/Recipes';
import Scan from './pages/Scan';
import SettingsPage from './pages/Settings';

const SidebarLink = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
            flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group
            ${isActive
                ? 'bg-amber-500 text-white shadow-xl shadow-amber-200/50 translate-x-1'
                : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-md hover:shadow-slate-100'}
        `}
    >
        {({ isActive }) => (
            <>
                <div className="flex items-center gap-4">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-500 group-hover:scale-110" />
                    <span className="text-lg font-bold tracking-tight">{label}</span>
                </div>
                <ChevronRight size={18} className={`transition-all duration-500 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </>
        )}
    </NavLink>
);

const App = () => {
    return (
        <Router>
            <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-amber-100">
                {/* Sidebar */}
                <aside className="w-80 bg-white/80 backdrop-blur-xl border-r border-slate-100 hidden md:flex flex-col fixed inset-y-0 z-50">
                    <div className="p-10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 group cursor-pointer"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-amber-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-[1.25rem] shadow-lg shadow-amber-200">
                                    <Package className="text-white" size={28} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">BiSpecial</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mt-1">Meze Maliyet</p>
                            </div>
                        </motion.div>
                    </div>

                    <nav className="flex-1 px-6 space-y-3 mt-4">
                        <SidebarLink to="/" icon={LayoutGrid} label="Panel" />
                        <SidebarLink to="/materials" icon={Package} label="Malzemeler" />
                        <SidebarLink to="/recipes" icon={BookOpen} label="Reçeteler" />
                        <SidebarLink to="/scan" icon={Camera} label="Fatura Tara" />
                        <SidebarLink to="/settings" icon={Settings} label="Ayarlar" />
                    </nav>

                    <div className="p-8 mt-auto">
                        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50">
                            <NavLink to="/settings" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-slate-900 font-bold transition-all mb-2">
                                <Settings size={20} />
                                <span>Ayarlar</span>
                            </NavLink>
                            <button className="flex items-center gap-4 px-4 py-3 w-full text-rose-400 hover:text-rose-600 font-black transition-all">
                                <LogOut size={20} />
                                <span>Çıkış Yap</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Spacer */}
                <div className="hidden md:block w-80 flex-shrink-0"></div>

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    <div className="max-w-7xl mx-auto p-12">
                        <AnimatePresence mode="wait">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/materials" element={<Materials />} />
                                <Route path="/recipes" element={<Recipes />} />
                                <Route path="/scan" element={<Scan />} />
                                <Route path="/settings" element={<SettingsPage />} />
                            </Routes>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </Router>
    );
};

export default App;
