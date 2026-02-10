import React, { useState } from 'react';
import {
    Add, Close, HealthAndSafety, Person,
    Schedule, CheckCircle
} from '@mui/icons-material';

const Staff = () => {
    const [staff, setStaff] = useState([
        { id: 1, name: 'Dr. Sarah Mitchell', role: 'SURGEON', specialization: 'Cardiology', max_hours_per_day: 12, is_available: true },
        { id: 2, name: 'Dr. James Wilson', role: 'SURGEON', specialization: 'Neurology', max_hours_per_day: 10, is_available: false },
        { id: 3, name: 'Dr. Emily Chen', role: 'ANESTHESIOLOGIST', specialization: 'General Anesthesia', max_hours_per_day: 12, is_available: true },
        { id: 4, name: 'Nurse Rachel Green', role: 'NURSE', specialization: 'OR Nursing', max_hours_per_day: 8, is_available: true },
        { id: 5, name: 'Tech. Mark Davis', role: 'TECHNICIAN', specialization: 'Surgical Equipment', max_hours_per_day: 8, is_available: true },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        specialization: '',
        max_hours_per_day: 12
    });


    const getRoleColor = (role) => {
        const colors = {
            'SURGEON': 'from-violet-500 to-purple-600',
            'ANESTHESIOLOGIST': 'from-emerald-500 to-teal-600',
            'NURSE': 'from-cyan-500 to-blue-600',
            'TECHNICIAN': 'from-amber-500 to-orange-600'
        };
        return colors[role] || 'from-slate-500 to-slate-600';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setStaff([...staff, { id: staff.length + 1, ...formData, is_available: true }]);
            setShowForm(false);
            setFormData({ name: '', role: '', specialization: '', max_hours_per_day: 12 });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-8 font-['Outfit',sans-serif]">
            {/* Header Section */}
            <div className="mb-12 flex items-center justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Staff Management
                    </h1>
                    <p className="text-slate-500">Manage hospital surgical staff and their schedules</p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center justify-center gap-2 px-16 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 font-semibold whitespace-nowrap min-w-fit"
                >
                    {showForm ? <Close /> : <Add />}
                    {showForm ? 'Cancel' : 'Add Staff Member'}
                </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                {[
                    { label: 'Total Staff', value: staff.length, icon: Person, color: 'from-cyan-500 to-blue-600' },
                    { label: 'Surgeons', value: staff.filter(s => s.role === 'SURGEON').length, icon: HealthAndSafety, color: 'from-violet-500 to-purple-600' },
                    { label: 'Available', value: staff.filter(s => s.is_available).length, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
                    { label: 'On Duty', value: staff.filter(s => !s.is_available).length, icon: Schedule, color: 'from-rose-500 to-pink-600' }
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 group cursor-pointer flex flex-col items-center justify-center text-center">
                            <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-6`}>
                                <Icon className="text-white" style={{ fontSize: '32px' }} />
                            </div>
                            <h3 className="text-4xl font-bold text-slate-800 mb-3">{stat.value}</h3>
                            <p className="text-slate-500 font-medium text-lg">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Form Section */}
            {showForm && (
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 mb-16">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8">Add New Staff Member</h2>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:bg-white transition-all"
                                    placeholder="e.g., Dr. John Smith"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4">
                                    Role *
                                </label>
                                <select
                                    required
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:bg-white transition-all"
                                >
                                    <option value="">Select role</option>
                                    <option value="SURGEON">Surgeon</option>
                                    <option value="ANESTHESIOLOGIST">Anesthesiologist</option>
                                    <option value="NURSE">Nurse</option>
                                    <option value="TECHNICIAN">Technician</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4">
                                    Specialization *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.specialization}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            specialization: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:bg-white transition-all"
                                    placeholder="e.g., Cardiology"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-4">
                                    Max Hours/Day *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="16"
                                    required
                                    value={formData.max_hours_per_day}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            max_hours_per_day: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
                        >
                            {loading ? "Adding Staff..." : "Add Staff Member"}
                        </button>
                    </form>

                </div>
            )}

            {/* Staff Grid Section */}
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-800 mb-14">All Staff Members</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16">
                    {staff.map((member, index) => {
                        const roleColor = getRoleColor(member.role);

                        return (
                            <div
                                key={member.id}
                                className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-12 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-3"
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    animation: 'fadeInUp 0.5s ease-out forwards'
                                }}
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`w-20 h-20 bg-linear-to-br ${roleColor} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap ${member.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {member.is_available ? 'Available' : 'Busy'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-800 mb-2">{member.name}</h3>
                                <p className="text-base text-slate-500 mb-8">{member.specialization}</p>

                                <div className="space-y-4 pt-8 border-t border-slate-200">
                                    <div className="flex justify-between text-base">
                                        <span className="text-slate-500 font-medium">Role</span>
                                        <span className="font-bold text-slate-800">{member.role}</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-slate-500 font-medium">Max Hours</span>
                                        <span className="font-bold text-slate-800">{member.max_hours_per_day}h/day</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default Staff;