// src/pages/Hospitals.jsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHospital } from '../context/HospitalContext';
import { hospitalAPI } from '../api/hospital.api';
// Backend imports (uncomment when backend is ready):
// import axiosInstance from '../api/axios';
// import { API_ENDPOINTS } from '../utils/constants';

const Hospitals = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { setHospitalId } = useHospital();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            // Using mock data API
            const response = await hospitalAPI.getAll();
            setHospitals(response.data || response);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.get(API_ENDPOINTS.HOSPITALS);
            // setHospitals(response.data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Using mock data API
            const response = await hospitalAPI.create(data);
            setHospitals([...hospitals, response]);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.post(API_ENDPOINTS.HOSPITALS, data);
            // setHospitals([...hospitals, response.data]);

            reset();
            setShowForm(false);
            alert('Hospital created successfully!');
        } catch (error) {
            console.error('Error creating hospital:', error);
            alert('Failed to create hospital');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectHospital = (hospital) => {
        setHospitalId(hospital.id, hospital.name);
        alert(`Selected hospital: ${hospital.name}`);
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Hospitals</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage hospitals and set the active context.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <span className="text-base">➕</span>
                    {showForm ? 'Cancel' : 'Add Hospital'}
                </button>
            </div>

            {showForm && (
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">Create New Hospital</h3>
                        <span className="text-xs text-gray-500">Required fields *</span>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Hospital Name *</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Hospital name is required' })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                placeholder="e.g., City General Hospital"
                            />
                            {errors.name && (
                                <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>
                            )}
                        </div>

                        <div className="md:col-span-1">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Location *</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">📍</span>
                                <input
                                    type="text"
                                    {...register('location', { required: 'Location is required' })}
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="e.g., New York, NY"
                                />
                            </div>
                            {errors.location && (
                                <span className="mt-1 block text-xs text-red-600">{errors.location.message}</span>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="text-base">✅</span>
                                {loading ? 'Creating...' : 'Create Hospital'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">All Hospitals</h3>
                    <span className="text-xs text-gray-500">{hospitals.length} total</span>
                </div>
                {hospitals.length === 0 ? (
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-6 text-sm text-amber-800">
                        <span className="text-base">⚠️</span>
                        No hospitals found. Create one to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    <th className="w-20 px-4 py-3">ID</th>
                                    <th className="min-w-[260px] px-4 py-3">Name</th>
                                    <th className="min-w-[220px] px-4 py-3">Location</th>
                                    <th className="w-40 px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {hospitals.map((hospital) => (
                                    <tr key={hospital.id} className="transition hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{hospital.id}</td>
                                        <td className="px-4 py-3 text-gray-700">{hospital.name}</td>
                                        <td className="px-4 py-3 text-gray-700">{hospital.location}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleSelectHospital(hospital)}
                                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                                            >
                                                <span className="text-sm">✔️</span>
                                                Select
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hospitals;

