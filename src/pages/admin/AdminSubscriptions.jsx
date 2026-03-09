import { useState, useEffect } from 'react';
import { Mail, Search, Trash2, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchSubscriptions = async () => {
        try {
            const res = await api.get('/subscribe');
            const data = res.data.map(s => ({
                id: s.id,
                email: s.email,
                coupon: s.coupon_code,
                date: s.created_at
            }));
            setSubscriptions(data);
        } catch (error) {
            console.error("Failed to fetch subscriptions:", error);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/subscribe/${id}`);
            setSubscriptions(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error('Subscription delete failed:', err.response?.data || err.message);
            alert('Failed to delete subscriber: ' + (err.response?.data?.message || err.message));
            await fetchSubscriptions();
        }
    };

    const filteredSubs = subscriptions.filter(s =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Newsletter Subscriptions</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage email lists and introductory coupons.</p>
                </div>
                <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-bold text-gray-600 flex items-center gap-2">
                    <Mail size={18} className="text-[var(--color-primary-gold)]" /> Total Active: {subscriptions.length}
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] transition-all text-sm"
                    />
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4 pl-6 w-1/2">Email Address</th>
                                <th className="p-4 w-1/4">Assigned Coupon</th>
                                <th className="p-4 w-1/4">Date Joined</th>
                                <th className="p-4 pr-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubs.map(sub => (
                                <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--color-bg-alt)] border border-[var(--color-primary-green)]/10 flex items-center justify-center shrink-0">
                                                <CheckCircle size={14} className="text-[var(--color-primary-green)]" />
                                            </div>
                                            <span className="font-bold text-gray-700 text-sm sm:text-base">{sub.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-[var(--color-primary-gold)] to-yellow-600 text-white rounded-lg text-xs font-bold font-mono shadow-sm tracking-wider">
                                            {sub.coupon}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 font-medium">
                                        {new Date(sub.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button
                                            onClick={() => setDeleteTarget(sub.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 inline-flex"
                                            title="Delete subscriber"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSubs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        No subscribers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => handleDelete(deleteTarget)}
                title="Delete Subscriber"
                message="Are you sure you want to permanently delete this subscriber? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="No, Cancel"
            />
        </div>
    );
};

export default AdminSubscriptions;
