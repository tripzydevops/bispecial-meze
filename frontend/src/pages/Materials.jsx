import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, Package, Percent, Tag } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8001/api';

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
        <div className="space-y-8">
            <header className="flex justify-between items-center text-slate-900">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Malzeme Envanteri</h1>
                    <p className="text-slate-500 mt-1">Ham maddelerin birim maliyetlerini ve fire paylarını yönetin.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-200 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Malzeme Ekle
                </button>
            </header>

            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Malzeme ara..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 text-sm font-bold">
                    <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl">Toplam: {materials.length} Çeşit</span>
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl">KDV Hariç</span>
                </div>
            </div>

            {/* Materials Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Malzeme Adı</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Birim Fiyat</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Fire Payı</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">Yükleniyor...</td></tr>
                        ) : filteredMaterials.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">Kayıtlı malzeme bulunamadı.</td></tr>
                        ) : filteredMaterials.map((material) => (
                            <tr key={material.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold">
                                            {material.name[0]}
                                        </div>
                                        <span className="font-bold text-slate-800">{material.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">{material.category}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="font-black text-slate-900">{material.unit_price} ₺</span>
                                    <span className="text-slate-400 text-xs ml-1">/ {material.unit_type}</span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`font-bold ${material.waste_percent > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                        %{material.waste_percent}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-900">
                                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-amber-600 transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-rose-600 transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Placeholder */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 space-y-6">
                        <h2 className="text-2xl font-black text-slate-900 text-slate-900">Yeni Malzeme</h2>
                        <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-1">Malzeme Adı</label>
                                <input
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
                                    value={newMaterial.name}
                                    onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })}
                                    placeholder="Örn: Süzme Yoğurt"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Birim Tipi</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
                                        value={newMaterial.unit_type}
                                        onChange={e => setNewMaterial({ ...newMaterial, unit_type: e.target.value })}
                                    >
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="lt">Litre (lt)</option>
                                        <option value="adet">Adet</option>
                                        <option value="bağ">Bağ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Birim Fiyat (₺)</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
                                        value={newMaterial.unit_price}
                                        onChange={e => setNewMaterial({ ...newMaterial, unit_price: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-1">Fire Payı (%)</label>
                                <input
                                    type="number" required
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all font-sans"
                                    value={newMaterial.waste_percent}
                                    onChange={e => setNewMaterial({ ...newMaterial, waste_percent: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Vazgeç</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Materials;
