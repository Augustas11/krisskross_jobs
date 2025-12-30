'use client';

import React, { useState, useEffect } from 'react';
import {
    Download,
    Image as ImageIcon,
    Video,
    Calendar,
    ExternalLink,
    Filter,
    RefreshCw,
    Search,
    CheckCircle2,
    Clock,
    LayoutGrid,
    AlertCircle,
    UserCheck,
    Briefcase
} from 'lucide-react';

interface Generation {
    id: string;
    type: 'video' | 'image';
    prompt: string;
    status: string;
    internal_url: string;
    external_url: string;
    created_at: string;
    ref_images: string[];
    user_email?: string;
    creator?: {
        status: string;
    };
}

export default function AdminDashboard() {
    const [view, setView] = useState<'generations' | 'applications'>('generations');
    const [applications, setApplications] = useState<any[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [total, setTotal] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (view === 'generations') {
                const response = await fetch(`/api/admin/generations?type=${filterType}`);
                const data = await response.json();
                if (data.generations) {
                    setGenerations(data.generations);
                    setTotal(data.total);
                }
            } else {
                const response = await fetch('/api/admin/applications');
                const data = await response.json();
                if (data.applications) {
                    setApplications(data.applications);
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterType, view]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Internal Assets Dashboard</h1>
                    <p className="text-gray-500">Review and manage all user-generated content from BytePlus.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Switcher */}
                    <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <button
                            onClick={() => setView('generations')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'generations' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <LayoutGrid size={16} /> Assets
                        </button>
                        <button
                            onClick={() => setView('applications')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view === 'applications' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <UserCheck size={16} /> Applicants
                        </button>
                    </div>

                    {view === 'generations' && (
                        <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                className="bg-transparent border-none outline-none text-sm font-medium"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All Content</option>
                                <option value="video">Videos Only</option>
                                <option value="image">Images Only</option>
                            </select>
                        </div>
                    )}

                    <button
                        onClick={fetchData}
                        className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Assets</p>
                    <p className="text-3xl font-bold">{total}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Videos</p>
                    <p className="text-3xl font-bold">
                        {generations.filter(g => g.type === 'video').length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Images</p>
                    <p className="text-3xl font-bold">
                        {generations.filter(g => g.type === 'image').length}
                    </p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : (
                    view === 'generations' ? (
                        generations.length === 0 ? (
                            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-300">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900">No assets found</h3>
                                <p className="text-gray-500">Generate some content to see results here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {generations.map((gen) => (
                                    <div
                                        key={gen.id}
                                        className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        {/* Preview Container */}
                                        <div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center">
                                            {gen.status === 'completed' ? (
                                                gen.type === 'video' ? (
                                                    <video
                                                        src={gen.internal_url || gen.external_url}
                                                        className="w-full h-full object-cover"
                                                        controls
                                                        poster={gen.ref_images?.[0]}
                                                    />
                                                ) : (
                                                    <img
                                                        src={gen.internal_url || gen.external_url}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        alt={gen.prompt}
                                                    />
                                                )
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 text-gray-400">
                                                    {gen.status === 'pending' ? (
                                                        <>
                                                            <Clock className="w-10 h-10 animate-pulse" />
                                                            <span className="text-sm font-medium">Processing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="w-10 h-10 text-red-300" />
                                                            <span className="text-sm font-medium text-red-500">Failed Generation</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Type Badge */}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                                                    {gen.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                                    {gen.type}
                                                </div>
                                                {gen.status === 'completed' && (
                                                    <div className="px-3 py-1.5 bg-green-500 rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-white/20">
                                                        <CheckCircle2 size={12} />
                                                        Stored
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} />
                                                    {formatDate(gen.created_at)}
                                                </div>
                                                {gen.user_email && (
                                                    <div className="flex items-center gap-1 text-primary lowercase truncate max-w-[120px]" title={gen.user_email}>
                                                        {gen.user_email}
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-800 line-clamp-3 mb-6 min-h-[60px] leading-relaxed">
                                                “{gen.prompt}”
                                            </p>

                                            {/* Creator Approval Section */}
                                            {gen.user_email && (
                                                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Creator Status</span>
                                                        <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${gen.creator?.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            gen.creator?.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {gen.creator?.status || 'unregistered'}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={async () => {
                                                            const isApproved = gen.creator?.status === 'approved';
                                                            const res = await fetch('/api/admin/approve', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    email: gen.user_email,
                                                                    action: isApproved ? 'reject' : 'approve'
                                                                })
                                                            });
                                                            if (res.ok) fetchData();
                                                        }}
                                                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${gen.creator?.status === 'approved'
                                                            ? 'bg-white border-red-100 text-red-600 hover:bg-red-50'
                                                            : 'bg-white border-gray-200 text-gray-700 hover:border-green-500 hover:text-green-600'
                                                            }`}
                                                    >
                                                        {gen.creator?.status === 'approved' ? 'Revoke Approval' : 'Approve as Creator'}
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={gen.internal_url || gen.external_url}
                                                    download={`krisskross-${gen.type}-${gen.id}`}
                                                    target="_blank"
                                                    className="flex-1 bg-[#0033FF] hover:bg-[#0026CC] text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download {gen.type === 'video' ? 'HD' : 'PNG'}
                                                </a>

                                                <div className="flex items-center gap-1">
                                                    <a
                                                        href={gen.external_url}
                                                        target="_blank"
                                                        title="View original link"
                                                        className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 border border-gray-100 rounded-2xl transition-all hover:bg-white hover:border-gray-200"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Full Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Portfolio</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Samples</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app) => (
                                        <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-gray-900">{app.full_name}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">{formatDate(app.created_at)}</div>
                                            </td>
                                            <td className="px-8 py-6 font-medium text-gray-600">{app.email}</td>
                                            <td className="px-8 py-6">
                                                <a href={app.portfolio_url} target="_blank" className="inline-flex items-center gap-2 text-primary hover:underline font-bold text-sm">
                                                    <ExternalLink size={14} /> View
                                                </a>
                                            </td>
                                            <td className="px-8 py-6">
                                                {app.samples_url ? (
                                                    <a href={app.samples_url} target="_blank" className="inline-flex items-center gap-2 text-primary hover:underline font-bold text-sm">
                                                        <Briefcase size={14} /> Samples
                                                    </a>
                                                ) : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={async () => {
                                                        const res = await fetch('/api/admin/approve', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ email: app.email, action: 'approve' })
                                                        });
                                                        if (res.ok) fetchData();
                                                    }}
                                                    className="bg-primary text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {applications.length === 0 && (
                                <div className="p-20 text-center">
                                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">No applications pending review.</p>
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>

            {/* Footer info */}
            <div className="max-w-7xl mx-auto mt-20 p-8 bg-brand-dark rounded-[40px] text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Internal Compliance & Review</h2>
                        <p className="text-gray-400 text-sm max-w-md">
                            All assets shown here are backed up to our internal Supabase storage.
                            These files will remain accessible even after BytePlus temp links expire.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Storage Status</span>
                            <span className="text-accent-green font-bold">Active & Secure</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-accent-green/10 flex items-center justify-center text-accent-green">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Subtle decorative glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
            </div>
        </div>
    );
}
