import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Book, User, ArrowRight, DollarSign, ChefHat } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8001/api';

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
        <div className="space-y-8">
            <header className="flex justify-between items-center text-slate-900 font-sans">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Meze Reçeteleri</h1>
                    <p className="text-slate-500 mt-1">Meze reçetelerini oluşturun ve porsiyon maliyetlerini inceleyin.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-200 transition-all flex items-center gap-2"
                >
                    <ChefHat size={20} />
                    Yeni Reçete Oluştur
                </button>
            </header>

            {/* Grid of recipes */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-sans italic">Veriler yükleniyor...</div>
                ) : recipes.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-sans italic">Henüz reçete eklenmemiş.</div>
                ) : recipes.map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                                <Book size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Porsiyon Maliyeti</p>
                                <p className="text-2xl font-black text-emerald-600">{recipe.portion_cost} ₺</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">{recipe.name}</h3>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                            <span className="flex items-center gap-1"><User size={14} /> {recipe.portions} Porsiyon</span>
                            <span className="flex items-center gap-1"><DollarSign size={14} /> KDV %{Math.round((recipe.kdv_rate - 1) * 100)}</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Toplam Maliyet:</span>
                                <span className="text-slate-900 font-bold">{recipe.total_cost} ₺</span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold group-hover:bg-amber-50 group-hover:text-amber-600 transition-all flex items-center justify-center gap-2">
                            Detayları Gör <ArrowRight size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 text-slate-900">Yeni Meze Reçetesi</h2>
                        <form onSubmit={handleSubmit} className="space-y-6 text-slate-900">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Meze Adı</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
                                        value={newRecipe.name}
                                        onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })}
                                        placeholder="Örn: Atom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Porsiyon Sayısı</label>
                                    <input
                                        type="number" required min="1"
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
                                        value={newRecipe.portions}
                                        onChange={e => setNewRecipe({ ...newRecipe, portions: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Malzemeler</h4>
                                    <button
                                        type="button" onClick={addIngredient}
                                        className="text-amber-600 font-bold text-sm flex items-center gap-1 hover:underline"
                                    >
                                        <Plus size={16} /> Malzeme Ekle
                                    </button>
                                </div>

                                {newRecipe.ingredients.map((ing, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-6">
                                            <select
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
                                                value={ing.material_id}
                                                onChange={e => updateIngredient(idx, 'material_id', parseInt(e.target.value))}
                                            >
                                                <option value="">Malzeme Seç...</option>
                                                {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit_type})</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                type="number" step="0.01" required placeholder="Miktar"
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
                                                value={ing.amount}
                                                onChange={e => updateIngredient(idx, 'amount', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <select
                                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none ring-2 ring-transparent focus:ring-amber-500 transition-all"
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
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Vazgeç</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all">Reçeteyi Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recipes;
