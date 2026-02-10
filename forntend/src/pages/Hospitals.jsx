import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHospital } from '../context/HospitalContext';
import { hospitalAPI } from '../api/hospital.api';
import {
    Add, Close, LocationOn, LocalHospital,
    Domain, CheckCircle, WarningAmber
} from '@mui/icons-material';

const Hospitals = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { setHospitalId } = useHospital();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await hospitalAPI.getAll();
            setHospitals(Array.isArray(response) ? response : response.data || []);
        } catch (err) {
            console.error('Error fetching hospitals:', err);
            setError('Failed to load hospitals. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSubmitLoading(true);
        try {
            const response = await hospitalAPI.create(data);
            setHospitals([...hospitals, response]);
            reset();
            setShowForm(false);
            alert('Hospital registered successfully!');
        } catch (err) {
            console.error('Error creating hospital:', err);
            alert('Failed to register hospital. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleSelectHospital = (hospital) => {
        setHospitalId(hospital.id, hospital.name);
        alert(`Context switched to: ${hospital.name}`);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-8 font-['Outfit',sans-serif]">
            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
                    <WarningAmber className="text-red-600" />
                    <span className="text-sm font-medium">{error}</span>
                    <button onClick={fetchHospitals} className="ml-auto text-xs font-bold underline hover:no-underline">
                        Retry
                    </button>
                </div>
            )}

            {/* Header Section */}
            <div className="mb-12 flex items-center justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Hospital Management
                    </h1>
                    <p className="text-slate-500">Manage medical facilities and set active operational context</p>
                </div>

                {!loading && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center justify-center gap-2 px-12 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 font-semibold whitespace-nowrap"
                    >
                        {showForm ? <Close /> : <Add />}
                        {showForm ? 'Cancel' : 'Register Hospital'}
                    </button>
                )}
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading hospitals...</p>
                </div>
            ) : (
                <>
                    {/* Stats / Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                        {[
                            { label: 'Total Facilities', value: hospitals.length, icon: Domain, color: 'from-blue-500 to-indigo-600' },
                            { label: 'Primary Regions', value: new Set(hospitals.map(h => h.location || '')).size, icon: LocationOn, color: 'from-violet-500 to-purple-600' },
                            { label: 'System Status', value: 'Active', icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col items-center">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg mb-4 text-white`}>
                                        <Icon />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                                    <p className="text-slate-500 font-medium">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Section */}
                    {showForm && (
                        <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 mb-16 hospitals-fadeInUp">
                            <h2 className="text-2xl font-bold text-slate-800 mb-8">Register New Facility</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Hospital Name *</label>
                                        <input
                                            {...register('name', { required: 'Hospital name is required' })}
                                            className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.name ? 'border-rose-400' : 'border-slate-200 focus:border-cyan-400'}`}
                                            placeholder="e.g., City General Hospital"
                                        />
                                        {errors.name && <p className="mt-2 text-xs text-rose-500 font-medium">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Location *</label>
                                        <div className="relative">
                                            <LocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                                            <input
                                                {...register('location', { required: 'Location is required' })}
                                                className={`w-full px-10 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none transition-all ${errors.location ? 'border-rose-400' : 'border-slate-200 focus:border-cyan-400'}`}
                                                placeholder="e.g., London, UK"
                                            />
                                        </div>
                                        {errors.location && <p className="mt-2 text-xs text-rose-500 font-medium">{errors.location.message}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
                                >
                                    {submitLoading ? "Processing..." : "Confirm Registration"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Hospitals Grid */}
                    <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-100">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold text-slate-800">Available Facilities</h2>
                            <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-sm font-bold">
                                {hospitals.length} Total
                            </span>
                        </div>

                        {hospitals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                                <WarningAmber className="text-amber-400 mb-4" style={{ fontSize: 48 }} />
                                <p className="text-slate-500 font-medium text-lg">No hospitals registered in the system yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {hospitals.map((hospital, index) => (
                                    <div
                                        key={hospital.id}
                                        className="group relative bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-cyan-200 hover:bg-white transition-all duration-300 hover:shadow-xl"
                                        style={{ animation: 'fadeInUp 0.5s ease-out forwards', animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                                <LocalHospital className="text-cyan-500" fontSize="large" />
                                            </div>
                                            <button
                                                onClick={() => handleSelectHospital(hospital)}
                                                className="px-6 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 shadow-sm"
                                            >
                                                Select Context
                                            </button>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-slate-800">{hospital.name}</h3>
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <LocationOn fontSize="inherit" />
                                                <span className="text-sm font-medium">{hospital.location}</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 uppercase tracking-widest font-bold">
                                            <span>Facility ID</span>
                                            <span>#{hospital.id.toString().padStart(4, '0')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                .hospitals-fadeInUp {
                    animation: hospitalsSpringFadeIn 0.5s ease-out forwards;
                }
                @keyframes hospitalsSpringFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Hospitals;