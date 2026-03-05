import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, Percent, Tag, X, Filter } from 'lucide-react';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8001/api';

const Materials = () => {
    const [materials, setMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newMaterial, setNewMaterial] = useState({
        name: '',
        unit_type: 'kg',
        unit_price: 0,
        waste_percent: 0,
        category: 'Gıda'
    });

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/materials/`);
            setMaterials(res.data);
        } catch (err) {
            console.error("Error fetching materials:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/materials/`, newMaterial);
            setIsModalOpen(false);
            setNewMaterial({ name: '', unit_type: 'kg', unit_price: 0, waste_percent: 0, category: 'Gıda' });
            fetchMaterials();
        } catch (err) {
            console.error("Error creating material:", err);
        }
    };

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Malzeme Envanteri</h1>
                    <p className="text-slate-500 mt-2 text-lg">Ham maddelerin birim maliyetlerini ve fire paylarını yönetin.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-amber-200 transition-all flex items-center gap-3"
                >
                    <Plus size={24} strokeWidth={3} />
                    Yeni Malzeme Ekle
                </motion.button>
            </header>

            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-full max-w-xl group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={22} />
                    <input
                        type="text"
                        placeholder="Malzeme ara..."
                        className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none shadow-sm hover:shadow-md text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="bg-amber-50 text-amber-700 px-6 py-4 rounded-2xl border border-amber-100 flex items-center gap-3">
                        <Package size={20} className="opacity-50" />
                        <span className="font-black">{materials.length} Çeşit</span>
                    </div>
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-slate-200">
                        <Filter size={20} className="opacity-50" />
                        <span className="font-bold text-sm">Filtrele</span>
                    </div>
                </div>
            </div>

            {/* Materials Table */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Malzeme Adı</th>
                            <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                            <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Birim Fiyat</th>
                            <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center">Fire Payı</th>
                            <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="px-10 py-24 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-slate-400 font-bold italic">Yükleniyor...</span>
                                </div>
                            </td></tr>
                        ) : filteredMaterials.length === 0 ? (
                            <tr><td colSpan="5" className="px-10 py-24 text-center text-slate-400 font-bold italic">Kayıtlı malzeme bulunamadı.</td></tr>
                        ) : filteredMaterials.map((material, idx) => (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={material.id}
                                className="hover:bg-amber-50/30 transition-colors group cursor-pointer"
                            >
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center text-amber-600 font-black text-xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                                            {material.name[0]}
                                        </div>
                                        <div>
                                            <span className="font-black text-slate-800 text-lg block">{material.name}</span>
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">#{material.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <span className="bg-white border border-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest group-hover:border-amber-200 transition-colors">{material.category}</span>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-900 text-lg">{material.unit_price} ₺</span>
                                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/ {material.unit_type}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-center">
                                    <span className={`inline-flex items-center gap-1 font-black px-3 py-1 rounded-lg ${material.waste_percent > 0 ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                                        <Percent size={12} /> {material.waste_percent}
                                    </span>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <button className="p-3 bg-white hover:bg-amber-500 hover:text-white rounded-xl text-slate-400 shadow-sm transition-all duration-300">
                                            <Edit2 size={20} />
                                        </button>
                                        <button className="p-3 bg-white hover:bg-rose-500 hover:text-white rounded-xl text-slate-400 shadow-sm transition-all duration-300">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                        >
                            <div className="p-10 space-y-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Yeni Malzeme</h2>
                                        <p className="text-slate-500 font-bold mt-1 text-sm">Envantere yeni bir kalem ekleyin.</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
                                        <X size={28} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Malzeme Adı</label>
                                        <input
                                            required
                                            className="premium-input text-lg font-bold"
                                            value={newMaterial.name}
                                            onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })}
                                            placeholder="Örn: Süzme Yoğurt"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Birim Tipi</label>
                                            <select
                                                className="premium-input font-bold appearance-none"
                                                value={newMaterial.unit_type}
                                                onChange={e => setNewMaterial({ ...newMaterial, unit_type: e.target.value })}
                                            >
                                                <option value="kg">Kilogram (kg)</option>
                                                <option value="lt">Litre (lt)</option>
                                                <option value="adet">Adet</option>
                                                <option value="bağ">Bağ</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Birim Fiyat (₺)</label>
                                            <input
                                                type="number" step="0.01" required
                                                className="premium-input font-black text-amber-600"
                                                value={newMaterial.unit_price}
                                                onChange={e => setNewMaterial({ ...newMaterial, unit_price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Fire Payı (%)</label>
                                        <input
                                            type="number" required
                                            className="premium-input font-black text-rose-500"
                                            value={newMaterial.waste_percent}
                                            onChange={e => setNewMaterial({ ...newMaterial, waste_percent: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 bg-slate-50 text-slate-500 rounded-2xl font-black hover:bg-slate-100 transition-all uppercase tracking-widest text-xs">Vazgeç</button>
                                        <button type="submit" className="flex-[2] px-8 py-5 bg-amber-600 text-white rounded-2xl font-black hover:bg-amber-700 shadow-xl shadow-amber-200 transition-all uppercase tracking-widest text-xs">Malzemeyi Kaydet</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Materials;
