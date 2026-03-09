import { useState, useEffect } from 'react';
import { Users, Search, Eye, X, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchCustomersFromOrders = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data.customers.map(c => ({
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                joined: c.created_at,
                totalOrders: c.total_orders,
                totalSpending: parseFloat(c.total_spend)
            })));
        } catch (error) {
            console.error("Failed to fetch customers", error);
        }
    };

    useEffect(() => {
        fetchCustomersFromOrders();
    }, []);

    const handleDeleteCustomer = async (customer) => {
        try {
            // Backend will handle deleting all orders of the customer inside a transaction!
            await api.delete(`/customers/${customer.id}`);

            setCustomers(prev => prev.filter(c => c.email !== customer.email));
            if (selectedCustomer && selectedCustomer.email === customer.email) {
                setSelectedCustomer(null);
            }
            setDeleteTarget(null);
        } catch (err) {
            console.error('Customer delete failed:', err);
            alert('Failed to delete customer: ' + (err.response?.data?.message || err.message));
            await fetchCustomersFromOrders();
        }
    };

    const filteredCustomers = customers.filter(c => {
        const query = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.id.toString().toLowerCase().includes(query);
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Customers</h1>
                    <p className="text-sm text-gray-500 mt-1">View customer profiles, contact info, and lifetime value.</p>
                </div>
                <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-bold text-gray-600 flex items-center gap-2">
                    <Users size={18} className="text-[var(--color-primary-gold)]" /> Total: {customers.length}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-1/2 lg:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Name, Email, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] transition-all text-sm"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4 pl-6">Customer Info</th>
                                <th className="p-4">Contact Details</th>
                                <th className="p-4">Total Orders</th>
                                <th className="p-4">Total Spent</th>
                                <th className="p-4 pr-6 text-right">View Profile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-green)]/10 text-[var(--color-primary-green)] flex items-center justify-center font-bold text-lg border border-[var(--color-primary-green)]/20">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{customer.name}</div>
                                                <div className="text-xs text-gray-400 font-mono mt-0.5">{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-700 flex items-center gap-1.5 mb-1"><Mail size={12} className="text-gray-400" /> {customer.email}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {customer.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm border border-blue-100">
                                            {customer.totalOrders}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-[var(--color-primary-green)] text-sm">
                                        ₹{customer.totalSpending.toLocaleString()}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button
                                            onClick={() => setSelectedCustomer(customer)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <Eye size={14} /> Profile
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(customer)}
                                            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profile Drawer / Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCustomer(null)}>
                    <div
                        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-start bg-[var(--color-bg-alt)]">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[var(--color-primary-green)] text-[var(--color-primary-gold)] flex items-center justify-center font-heading font-bold text-2xl shadow-md border-2 border-white">
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-heading font-bold text-[var(--color-primary-green)]">{selectedCustomer.name}</h2>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${selectedCustomer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {selectedCustomer.status} Customer
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm border border-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                            {/* Analytics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-800">{selectedCustomer.totalOrders}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Lifetime Value</p>
                                    <p className="text-xl font-bold text-[var(--color-primary-green)] mt-1">₹{selectedCustomer.totalSpending.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div>
                                <h3 className="text-sm font-bold text-[var(--color-primary-green)] border-b border-gray-100 pb-2 mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <Users size={16} /> Contact Information
                                </h3>
                                <div className="space-y-4 text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                        <div className="font-medium">{selectedCustomer.email}</div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                        <div className="font-medium">{selectedCustomer.phone}</div>
                                    </div>
                                    <div className="flex items-start gap-3 pt-4 border-t border-gray-100 mt-2">
                                        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                        <div className="font-medium leading-relaxed">{selectedCustomer.address}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-400">Customer ID: {selectedCustomer.id}</p>
                                <p className="text-xs text-gray-400 mt-1">Joined: {new Date(selectedCustomer.joined).toLocaleDateString()}</p>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => handleDeleteCustomer(deleteTarget)}
                title="Delete Customer"
                message={`Are you sure you want to permanently delete this customer and all their orders? This action cannot be undone.`}
                confirmText="Yes, Delete"
                cancelText="No, Cancel"
            />
        </div>
    );
};

export default AdminCustomers;
