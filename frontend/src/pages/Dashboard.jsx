import React from 'react';
import { ShoppingBag, Utensils, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { name: 'Toplam Malzeme', value: '24', icon: ShoppingBag, color: 'bg-blue-500' },
        { name: 'Aktif Reçete', value: '12', icon: Utensils, icon: Utensils, color: 'bg-amber-500' },
        { name: 'Ort. Kar Marjı', value: '%65', icon: TrendingUp, color: 'bg-emerald-500' },
        { name: 'Son Güncelleme', value: 'Bugün', icon: Clock, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 font-sans">BiSpecial Meze Paneli</h1>
                <p className="text-slate-500 mt-1">Hoş geldiniz, maliyetlerinizi buradan kontrol edebilirsiniz.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.name}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 italic text-slate-600">
                    {/* Placeholder for recipe list or charts */}
                    Burada en çok maliyeti artan mezeler ve fiyat değişim grafikleri yer alacaktır.
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
