import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Eye, X, CheckCircle, Clock, Truck, XCircle, MapPin, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            // Map db schema to ui format
            const mappedOrders = res.data.map(o => ({
                id: o.order_id,
                customerName: o.customer_name,
                email: o.email,
                phone: o.phone,
                date: o.created_at,
                total: o.total_amount,
                status: o.order_status,
                paymentMethod: o.payment_method,
                address: o.address,
                city: o.city,
                state: o.state,
                pincode: o.pincode,
                items: o.items || []
            }));
            setOrders(mappedOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
            setOrders(updated);
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/orders/${id}`);
            setOrders(prev => prev.filter(o => o.id !== id));
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder(null);
            }
        } catch (err) {
            console.error('Order delete failed:', err.response?.data || err.message);
            alert('Failed to delete order: ' + (err.response?.data?.message || err.message));
            await fetchOrders();
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            'Processing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'Shipped': 'bg-blue-100 text-blue-700 border-blue-200',
            'Delivered': 'bg-green-100 text-green-700 border-green-200',
            'Cancelled': 'bg-red-100 text-red-700 border-red-200'
        };
        const icons = {
            'Processing': <Clock size={12} />,
            'Shipped': <Truck size={12} />,
            'Delivered': <CheckCircle size={12} />,
            'Cancelled': <XCircle size={12} />
        };
        return (
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border flex items-center justify-center gap-1 w-max ${colors[status]}`}>
                {icons[status]} {status}
            </span>
        );
    };

    const filteredOrders = orders.filter(o => {
        const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage shipments, view order details, and update statuses.</p>
                </div>
                <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-bold text-gray-600 flex items-center gap-2">
                    <ShoppingCart size={18} className="text-[var(--color-primary-gold)]" /> Total: {orders.length}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 pb-2 md:pb-0 overflow-x-auto hide-scrollbar">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-[var(--color-primary-green)] text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4 pl-6">Order ID & Date</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total Amount</th>
                                <th className="p-4">Status Update</th>
                                <th className="p-4 pr-6 text-right">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="font-bold text-gray-800 font-mono text-sm">{order.id}</div>
                                        <div className="text-xs text-gray-500 mt-1">{new Date(order.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-700 text-sm">{order.customerName}</div>
                                    </td>
                                    <td className="p-4 font-bold text-[var(--color-primary-green)] text-sm">
                                        ₹{order.total}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={`text-xs font-bold rounded-lg border px-2 py-1.5 outline-none transition-colors cursor-pointer
                                                    ${order.status === 'Processing' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 focus:ring-yellow-500/20' : ''}
                                                    ${order.status === 'Packing' ? 'bg-orange-50 border-orange-200 text-orange-700 focus:ring-orange-500/20' : ''}
                                                    ${order.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-500/20' : ''}
                                                    ${order.status === 'Out for Delivery' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 focus:ring-indigo-500/20' : ''}
                                                    ${order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700 focus:ring-green-500/20' : ''}
                                                    ${order.status === 'Cancelled' ? 'bg-red-50 border-red-200 text-red-700 focus:ring-red-500/20' : ''}
                                                `}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Packing">Packing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <Eye size={14} /> Details
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(order.id)}
                                            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Sliding Drawer / Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[var(--color-bg-alt)]">
                            <div>
                                <h2 className="text-xl font-heading font-bold text-[var(--color-primary-green)]">Order Details</h2>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm border border-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                            {/* Status & Date */}
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                                    <StatusBadge status={selectedOrder.status} />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Date Placed</p>
                                    <p className="font-bold text-gray-800 text-sm">{new Date(selectedOrder.date).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h3 className="text-sm font-bold text-[var(--color-primary-green)] border-b border-gray-100 pb-2 mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <MapPin size={16} /> Shipping Info
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm border border-gray-100">
                                    <p><span className="text-gray-500 w-20 inline-block">Name:</span> <span className="font-bold text-gray-800">{selectedOrder.customerName}</span></p>
                                    <p><span className="text-gray-500 w-20 inline-block">Phone:</span> <span className="font-bold text-gray-800">{selectedOrder.phone}</span></p>
                                    <p><span className="text-gray-500 w-20 inline-block">Email:</span> <span className="font-bold text-gray-800">{selectedOrder.email}</span></p>
                                    <p className="pt-2 mt-2 border-t border-gray-200">
                                        <span className="block text-gray-500 mb-1">Address:</span>
                                        <span className="text-gray-700 leading-relaxed font-medium">
                                            {selectedOrder.address}<br />
                                            {selectedOrder.city}, {selectedOrder.state}<br />
                                            {selectedOrder.pincode}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-bold text-[var(--color-primary-green)] border-b border-gray-100 pb-2 mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <ShoppingCart size={16} /> Order Items
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.weight} &times; {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-[var(--color-primary-green)]">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-[var(--color-primary-green)] text-white p-5 rounded-xl shadow-md">
                                <div className="flex justify-between items-center mb-2 text-sm text-[var(--color-bg-alt)]">
                                    <span>Payment Method</span>
                                    <span className="font-bold">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold border-t border-white/20 pt-2 mt-2">
                                    <span>Total Amount</span>
                                    <span className="text-[var(--color-primary-gold)]">₹{selectedOrder.total}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => handleDelete(deleteTarget)}
                title="Delete Order"
                message="Are you sure you want to permanently delete this order? All order items will be removed. This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="No, Cancel"
            />
        </div>
    );
};

export default AdminOrders;
