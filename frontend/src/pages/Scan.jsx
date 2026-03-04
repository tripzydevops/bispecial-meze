import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, CheckCircle2, AlertCircle, Loader2, Plus, ArrowRight, Trash2, Edit2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8001/api';

const Scan = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, scanning, verifying, saved
    const [extractedItems, setExtractedItems] = useState([]);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            startScan(selectedFile);
        }
    };

    const startScan = async (fileToScan) => {
        try {
            setStatus('scanning');
            setError(null);

            const formData = new FormData();
            formData.append('file', fileToScan);

            // Real backend call to /api/ocr/scan
            const res = await axios.post(`${API_BASE}/ocr/scan`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Simulate parsing delay for "wow" factor
            setTimeout(() => {
                setExtractedItems(res.data.extracted_items || []);
                setStatus('verifying');
            }, 2000);

        } catch (err) {
            console.error("Scan failed:", err);
            setError(err.response?.data?.detail || "Fatura tarama işlemi başarısız oldu.");
            setStatus('idle');
        }
    };

    const handleSaveItems = async () => {
        try {
            setStatus('saving');

            // Format items for the backend
            const itemsToSave = extractedItems.map(item => ({
                name: item.raw_name,
                unit_price: item.unit_price,
                unit_type: "kg", // Default for OCR items
                waste_percent: 0.0,
                category: "Gıda"
            }));

            await axios.post(`${API_BASE}/ocr/save`, { items: itemsToSave });

            setStatus('saved');
        } catch (err) {
            console.error("Save failed:", err);
            setError(err.response?.data?.detail || "Kayıt işlemi başarısız oldu.");
            setStatus('verifying');
        }
    };

    const removeExtractedItem = (index) => {
        setExtractedItems(items => items.filter((_, i) => i !== index));
    };

    const updateExtractedItem = (index, field, value) => {
        const newItems = [...extractedItems];
        newItems[index][field] = value;
        setExtractedItems(newItems);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <header>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fatura Tara</h1>
                <p className="text-slate-500 mt-2 text-lg">AI destekli OCR ile faturalarınızı otomatik olarak envantere işleyin.</p>
            </header>

            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group h-96"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-[3rem] border-4 border-dashed border-slate-200 group-hover:border-amber-400 group-hover:bg-amber-50/50 transition-all duration-500"></div>
                        <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center p-12">
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Camera className="text-amber-600" size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Fatura Yükleyin</h3>
                            <p className="text-slate-400 text-center max-w-sm">Görüntüyü buraya sürükleyin veya cihazınızdan seçin. (PNG, JPG, PDF)</p>
                        </label>
                        {error && (
                            <div className="absolute -bottom-12 inset-x-0 flex justify-center">
                                <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-bold border border-rose-100 flex items-center gap-2">
                                    <AlertCircle size={16} /> {error}
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}

                {status === 'scanning' && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-96 flex flex-col items-center justify-center space-y-6"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 border-4 border-amber-500 border-t-transparent rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="text-amber-500 animate-pulse" size={32} />
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-slate-800">Fatura Analiz Ediliyor</h2>
                            <p className="text-slate-400 animate-pulse">AI ürünleri ve fiyatları tespit ediyor...</p>
                        </div>
                    </motion.div>
                )}

                {status === 'verifying' && (
                    <motion.div
                        key="verifying"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">Tespit Edilen Veriler</h3>
                                    <p className="text-slate-500 text-sm">Lütfen fiyatları ve ürün isimlerini doğrulayın.</p>
                                </div>
                                <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-sm font-black">
                                    {extractedItems.length} Kalem Bulundu
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ürün Adı</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Birim Fiyat</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Güven</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {extractedItems.map((item, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <input
                                                        type="text"
                                                        value={item.raw_name}
                                                        onChange={(e) => updateExtractedItem(idx, 'raw_name', e.target.value)}
                                                        className="bg-transparent border-none outline-none font-bold text-slate-800 w-full focus:text-amber-600 transition-colors"
                                                    />
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={item.unit_price}
                                                            onChange={(e) => updateExtractedItem(idx, 'unit_price', parseFloat(e.target.value))}
                                                            className="bg-transparent border-none outline-none font-black text-amber-600 w-24 focus:ring-opacity-0"
                                                        />
                                                        <span className="text-slate-400 font-bold text-sm">₺</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500" style={{ width: `${item.confidence * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-[10px] font-black text-emerald-600">%{Math.round(item.confidence * 100)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => removeExtractedItem(idx)}
                                                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStatus('idle')}
                                className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={handleSaveItems}
                                className="flex-[2] px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all flex items-center justify-center gap-3"
                            >
                                Onayla ve Envantere Ekle <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {status === 'saved' && (
                    <motion.div
                        key="saved"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-96 flex flex-col items-center justify-center space-y-6 bg-emerald-50/30 rounded-[3rem] border-2 border-emerald-100"
                    >
                        <div className="bg-emerald-500 p-6 rounded-[2rem] shadow-xl shadow-emerald-200">
                            <CheckCircle2 className="text-white" size={64} />
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-slate-900">Başarıyla İşlendi!</h2>
                            <p className="text-emerald-700/60 font-bold mt-1">Tüm kalemler malzeme listesine eklendi.</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/materials'}
                            className="bg-white px-8 py-3 rounded-2xl font-black text-slate-900 shadow-sm border border-slate-100 hover:shadow-md transition-all"
                        >
                            Envanteri Görüntüle
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Scan;
