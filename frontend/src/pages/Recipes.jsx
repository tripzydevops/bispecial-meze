import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Book, User, ArrowRight, DollarSign, ChefHat, X, Filter, Clock } from 'lucide-react';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8001/api';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newRecipe, setNewRecipe] = useState({
        name: '',
        portions: 1,
        kdv_rate: 1.0,
        ingredients: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [recRes, matRes] = await Promise.all([
                axios.get(`${API_BASE}/recipes/`),
                axios.get(`${API_BASE}/materials/`)
            ]);
            setRecipes(recRes.data);
            setMaterials(matRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const addIngredient = () => {
        setNewRecipe({
            ...newRecipe,
            ingredients: [...newRecipe.ingredients, { material_id: '', amount: 0, unit: 'kg' }]
        });
    };

    const updateIngredient = (index, field, value) => {
        const updated = [...newRecipe.ingredients];
        updated[index][field] = value;
        setNewRecipe({ ...newRecipe, ingredients: updated });
    };

    const removeIngredient = (index) => {
        const updated = newRecipe.ingredients.filter((_, i) => i !== index);
        setNewRecipe({ ...newRecipe, ingredients: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/recipes/`, newRecipe);
            setIsModalOpen(false);
            setNewRecipe({ name: '', portions: 1, kdv_rate: 1.0, ingredients: [] });
            fetchData();
        } catch (err) {
            alert("Lütfen tüm malzemeleri ve miktarları doğru girdiğinizden emin olun.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Meze Reçeteleri</h1>
                    <p className="text-slate-500 mt-2 text-lg">Maliyetlerinizle uyumlu profesyonel reçeteler hazırlayın.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-amber-200 transition-all flex items-center gap-3"
                >
                    <ChefHat size={24} strokeWidth={2.5} />
                    Yeni Reçete Oluştur
                </motion.button>
            </header>

            {/* Grid of recipes */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-32 text-center text-slate-400 font-bold italic">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>Veriler yükleniyor...</span>
                        </div>
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="col-span-full py-32 text-center text-slate-400 font-bold italic bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                        Henüz reçete eklenmemiş. "Yeni Reçete Oluştur" butonu ile başlayın.
                    </div>
                ) : recipes.map((recipe, idx) => (
                    <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="premium-card p-8 group cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <Book size={28} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Porsiyon Maliyeti</p>
                                <p className="text-3xl font-black text-emerald-600 leading-none">{recipe.portion_cost} ₺</p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-amber-600 transition-colors">{recipe.name}</h3>
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest">
                            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><User size={14} className="text-slate-300" /> {recipe.portions} Porsiyon</span>
                            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><DollarSign size={14} className="text-slate-300" /> KDV %{Math.round((recipe.kdv_rate - 1) * 100)}</span>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold">Toplam Maliyet:</span>
                                <span className="text-slate-900 font-black text-lg">{recipe.total_cost} ₺</span>
                            </div>
                            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500/50 w-2/3"></div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black group-hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group-hover:shadow-amber-200">
                            Reçeteyi İncele <ArrowRight size={20} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Create Modal */}
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
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 pb-0 flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Yeni Meze Reçetesi</h2>
                                    <p className="text-slate-500 font-bold mt-1 text-sm">Malzemeleri seçin ve porsiyonları ayarlayın.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
                                    <X size={28} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 pt-8 space-y-8 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Meze Adı</label>
                                        <input
                                            required
                                            className="premium-input text-lg font-bold"
                                            value={newRecipe.name}
                                            onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })}
                                            placeholder="Örn: Atom"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Porsiyon Sayısı</label>
                                        <input
                                            type="number" required min="1"
                                            className="premium-input font-black text-amber-600"
                                            value={newRecipe.portions}
                                            onChange={e => setNewRecipe({ ...newRecipe, portions: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center px-2">
                                        <h4 className="font-black text-slate-300 uppercase tracking-[0.2em] text-[10px]">İçerik Malzemeleri</h4>
                                        <button
                                            type="button" onClick={addIngredient}
                                            className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-amber-100 transition-colors"
                                        >
                                            <Plus size={14} strokeWidth={3} /> Malzeme Ekle
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <AnimatePresence mode="popLayout">
                                            {newRecipe.ingredients.map((ing, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="grid grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 group"
                                                >
                                                    <div className="col-span-6">
                                                        <select
                                                            required
                                                            className="w-full bg-white border-none rounded-xl px-4 py-3 outline-none ring-2 ring-transparent focus:ring-amber-500 font-bold text-sm transition-all"
                                                            value={ing.material_id}
                                                            onChange={e => updateIngredient(idx, 'material_id', parseInt(e.target.value))}
                                                        >
                                                            <option value="">Malzeme Seç...</option>
                                                            {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit_type})</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <input
                                                            type="number" step="0.01" required placeholder="0.00"
                                                            className="w-full bg-white border-none rounded-xl px-4 py-3 outline-none ring-2 ring-transparent focus:ring-amber-500 font-black text-amber-600 text-sm transition-all"
                                                            value={ing.amount}
                                                            onChange={e => updateIngredient(idx, 'amount', parseFloat(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <select
                                                            className="w-full bg-white border-none rounded-xl px-2 py-3 outline-none ring-2 ring-transparent focus:ring-amber-500 font-black text-[10px] uppercase tracking-widest transition-all"
                                                            value={ing.unit}
                                                            onChange={e => updateIngredient(idx, 'unit', e.target.value)}
                                                        >
                                                            <option value="kg">kg</option>
                                                            <option value="gr">gr</option>
                                                            <option value="lt">lt</option>
                                                            <option value="ml">ml</option>
                                                            <option value="adet">adet</option>
                                                            <option value="bağ">bağ</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-span-1 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeIngredient(idx)}
                                                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {newRecipe.ingredients.length === 0 && (
                                            <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-300 font-bold italic text-sm">
                                                Henüz malzeme eklenmedi.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-slate-50">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 bg-slate-50 text-slate-500 rounded-2xl font-black hover:bg-slate-100 transition-all uppercase tracking-widest text-xs">Vazgeç</button>
                                    <button type="submit" className="flex-[2] px-8 py-5 bg-amber-600 text-white rounded-2xl font-black hover:bg-amber-700 shadow-xl shadow-amber-200 transition-all uppercase tracking-widest text-xs">Reçeteyi Kaydet</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Recipes;
