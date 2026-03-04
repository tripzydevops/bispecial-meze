import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutGrid, BookOpen, Camera, Settings, PlusCircle, LogOut, Package } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';

const App = () => {
    return (
        <Router>
            <div className="flex min-h-screen bg-slate-50">
                {/* Sidebar */}
                <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col fixed inset-y-0 shadow-sm">
                    <div className="p-8">
                        <div className="flex items-center gap-3 text-2xl font-black text-amber-600 tracking-tighter">
                            <div className="bg-amber-100 p-2 rounded-2xl">
                                <PlusCircle className="text-amber-600" size={32} strokeWidth={3} />
                            </div>
                            <span>BiSpecial</span>
                        </div>
                    </div>

                    <nav className="flex-1 px-6 space-y-2 mt-4">
                        <NavLink to="/" className={({ isActive }) => `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}>
                            <LayoutGrid size={22} />
                            <span className="text-lg">Panel</span>
                        </NavLink>
                        <NavLink to="/materials" className={({ isActive }) => `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}>
                            <Package size={22} />
                            <span className="text-lg font-sans">Malzemeler</span>
                        </NavLink>
                        <NavLink to="/recipes" className={({ isActive }) => `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}>
                            <BookOpen size={22} />
                            <span className="text-lg">Reçeteler</span>
                        </NavLink>
                        <NavLink to="/scan" className={({ isActive }) => `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}>
                            <Camera size={22} />
                            <span className="text-lg">Fatura Tara</span>
                        </NavLink>
                    </nav>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                        <NavLink to="/settings" className="flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-slate-900 font-medium rounded-2xl transition-all mb-4">
                            <Settings size={22} />
                            <span className="text-lg">Ayarlar</span>
                        </NavLink>
                        <button className="flex items-center gap-4 px-5 py-4 w-full text-rose-400 hover:bg-rose-50 hover:text-rose-600 font-bold rounded-2xl transition-all">
                            <LogOut size={22} />
                            <span className="text-lg">Çıkış Yap</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Spacer */}
                <div className="hidden md:block w-72 flex-shrink-0"></div>

                {/* Main Content */}
                <main className="flex-1 p-12 max-w-7xl mx-auto w-full">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/materials" element={<Materials />} />
                        <Route path="/recipes" element={<div className="p-12 text-slate-400 font-medium italic text-center text-xl mt-20">Reçete Yönetimi Yakında...</div>} />
                        <Route path="/scan" element={<div className="p-12 text-slate-400 font-medium italic text-center text-xl mt-20">Fatura OCR Modülü Yakında...</div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
