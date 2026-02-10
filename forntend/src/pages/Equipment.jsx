import React, { useState, useEffect, useMemo } from 'react';
import {
    Add, Search, Close, Science, LocalHospital,
    CheckCircle, Biotech, Autorenew
} from '@mui/icons-material';

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', type: '', sterilization_cycle_hours: 2 });

    useEffect(() => {
        setEquipment([
            { id: 1, name: 'Cardiac Monitor XR-500', type: 'Monitoring Device', sterilization_cycle_hours: 2, is_available: true },
            { id: 2, name: 'Surgical Scalpel Set Pro', type: 'Surgical Instrument', sterilization_cycle_hours: 3, is_available: false },
            { id: 3, name: 'Anesthesia Machine V8', type: 'Anesthesia Machine', sterilization_cycle_hours: 4, is_available: true },
            { id: 4, name: 'Defibrillator AED Plus', type: 'Life Support', sterilization_cycle_hours: 2, is_available: true },
        ]);
    }, []);

    const filteredEquipment = useMemo(() => {
        return equipment.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, equipment]);

    const handleSterilize = (id) => {
        setEquipment(prev => prev.map(eq => eq.id === id ? { ...eq, is_available: false } : eq));
        setTimeout(() => {
            setEquipment(prev => prev.map(eq => eq.id === id ? { ...eq, is_available: true } : eq));
        }, 4000);
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-10 font-['Outfit',sans-serif]">
            <div className="max-w-7xl mx-auto">

                {/* TOP BAR: Title and Action */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Inventory <span className="text-blue-600">Control</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Surgical Equipment & Sterilization Tracking</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        {showForm ? <Close /> : <Add />} {showForm ? 'Cancel' : 'New Equipment'}
                    </button>
                </div>

                {/* STATS CARDS: Improved spacing and sizing */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <StatCard label="Total Units" value={equipment.length} icon={Science} color="blue" />
                    <StatCard label="Ready For Use" value={equipment.filter(e => e.is_available).length} icon={CheckCircle} color="emerald" />
                    <StatCard label="In Sterilization" value={equipment.filter(e => !e.is_available).length} icon={Autorenew} color="amber" />
                    <StatCard label="Critical Gear" value={equipment.filter(e => e.type === 'Life Support').length} icon={LocalHospital} color="rose" />
                </div>

                {/* INVENTORY CONTAINER */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">

                    {/* CONTROL BAR: Fixed the jumbled search area */}
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                        <h2 className="text-xl font-bold text-slate-800">Master Inventory</h2>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                            <input
                                type="text"
                                placeholder="Search equipment..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* TABLE: Added significant horizontal padding and row height */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-[0.1em] font-bold">
                                <th className="px-8 py-5">Equipment Details</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Cycle Time</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredEquipment.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {item.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-700">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-slate-500 text-sm">{item.type}</td>
                                    <td className="px-8 py-6 text-slate-600 text-sm font-medium">{item.sterilization_cycle_hours}h Cycle</td>
                                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_available ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {item.is_available ? 'Ready' : 'Sterilizing'}
                      </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {item.is_available ? (
                                            <button
                                                onClick={() => handleSterilize(item.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-bold underline underline-offset-4"
                                            >
                                                Run Sterilization
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic font-medium">Processing...</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
    const themes = {
        blue: 'text-blue-600 bg-blue-50',
        emerald: 'text-emerald-600 bg-emerald-50',
        amber: 'text-amber-600 bg-amber-50',
        rose: 'text-rose-600 bg-rose-50'
    };
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${themes[color]}`}>
                <Icon fontSize="small" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-black text-slate-800">{value}</p>
            </div>
        </div>
    );
};

export default Equipment;