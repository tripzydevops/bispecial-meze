import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutGrid, BookOpen, Camera, Settings, PlusCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';

const App = () => {
    return (
        <Router>
            <div className="flex min-h-screen bg-slate-50">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-amber-600 flex items-center gap-2">
                            <PlusCircle className="text-amber-500" />
                            BiSpecial Meze
                        </h2>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-all">
                            <LayoutGrid size={20} />
                            <span>Panel</span>
                        </Link>
                        <Link to="/recipes" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-all">
                            <BookOpen size={20} />
                            <span>Reçeteler</span>
                        </Link>
                        <Link to="/scan" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-all">
                            <Camera size={20} />
                            <span>Fatura Tara</span>
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                            <Settings size={20} />
                            <span>Ayarlar</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/recipes" element={<div className="p-8 text-slate-500">Reçete Yönetimi Yakında...</div>} />
                        <Route path="/scan" element={<div className="p-8 text-slate-500">Fatura OCR Modülü Yakında...</div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
