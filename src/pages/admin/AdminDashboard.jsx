import { Package, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight, Mail } from 'lucide-react';
import React from 'react';

const AdminDashboard = () => {
    const stats = [
        { title: 'Total Revenue', value: '₹4,52,000', change: '+12.5%', isUp: true, icon: <DollarSign size={24} className="text-[var(--color-primary-green)]" /> },
        { title: 'Total Orders', value: '1,245', change: '+8.2%', isUp: true, icon: <ShoppingCart size={24} className="text-[#C6A75E]" /> },
        { title: 'Active Products', value: '48', change: '-2.4%', isUp: false, icon: <Package size={24} className="text-blue-500" /> },
        { title: 'Total Customers', value: '892', change: '+15.3%', isUp: true, icon: <Users size={24} className="text-purple-500" /> },
        { title: 'New Subscriptions', value: '156', change: '+5.1%', isUp: true, icon: <Mail size={24} className="text-orange-500" /> },
    ];

    const recentOrders = [
        { id: 'SR-2026-0042', customer: 'Pawan K', date: '2026-03-02', total: '₹4,500', status: 'Processing' },
        { id: 'SR-2026-0041', customer: 'Raju G', date: '2026-03-01', total: '₹1,250', status: 'Shipped' },
        { id: 'SR-2026-0040', customer: 'Venkat S', date: '2026-02-28', total: '₹3,400', status: 'Delivered' },
        { id: 'SR-2026-0039', customer: 'Sita R', date: '2026-02-28', total: '₹850', status: 'Processing' },
        { id: 'SR-2026-0038', customer: 'Laxmi N', date: '2026-02-27', total: '₹2,100', status: 'Delivered' },
    ];

    const topProducts = [
        { name: 'Gongura Pickle', sales: 420, revenue: '₹63,000' },
        { name: 'Avakaya (Mango)', sales: 385, revenue: '₹57,750' },
        { name: 'Chicken Pickle', sales: 310, revenue: '₹93,000' },
        { name: 'Pootharekulu', sales: 250, revenue: '₹37,500' },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Dashboard Overview</h1>
                <div className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    Last updated: Just now
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                                {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                        <div className="text-2xl font-bold text-[var(--color-primary-green)]">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[var(--color-primary-green)]">Recent Orders</h2>
                        <button className="text-sm font-bold text-[#C6A75E] hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 font-medium text-sm border-b border-gray-100">
                                    <th className="pb-3 px-2">Order ID</th>
                                    <th className="pb-3 px-2">Customer</th>
                                    <th className="pb-3 px-2">Date</th>
                                    <th className="pb-3 px-2">Total</th>
                                    <th className="pb-3 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.map((order, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-2 font-bold text-gray-700">{order.id}</td>
                                        <td className="py-4 px-2 text-gray-600">{order.customer}</td>
                                        <td className="py-4 px-2 text-gray-500">{order.date}</td>
                                        <td className="py-4 px-2 font-bold text-[var(--color-primary-green)]">{order.total}</td>
                                        <td className="py-4 px-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-[var(--color-primary-green)] mb-6">Top Selling Products</h2>
                    <div className="space-y-5">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-800 text-sm mb-1">{product.name}</div>
                                    <div className="text-xs text-gray-500">{product.sales} sales</div>
                                </div>
                                <div className="font-bold text-[var(--color-primary-green)] text-sm">
                                    {product.revenue}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
