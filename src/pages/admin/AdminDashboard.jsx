import { Package, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        activeProducts: 0,
        totalCustomers: 0,
        totalSubscriptions: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [ordersRes, productsRes, subscriptionsRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products'),
                    api.get('/subscribe'),
                ]);

                const orders = ordersRes.data || [];
                const products = productsRes.data || [];
                const subscriptions = subscriptionsRes.data || [];

                // Calculate stats
                const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
                const uniqueCustomers = new Set(orders.map(o => o.email)).size;

                setStats({
                    totalRevenue,
                    totalOrders: orders.length,
                    activeProducts: products.length,
                    totalCustomers: uniqueCustomers,
                    totalSubscriptions: subscriptions.length,
                });

                // Recent orders (last 5)
                const sorted = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setRecentOrders(sorted.slice(0, 5));

                // Top products by order frequency
                const productSales = {};
                orders.forEach(order => {
                    (order.items || []).forEach(item => {
                        const name = item.name || `Product #${item.product_id}`;
                        if (!productSales[name]) {
                            productSales[name] = { name, sales: 0, revenue: 0 };
                        }
                        productSales[name].sales += item.quantity || 1;
                        productSales[name].revenue += parseFloat(item.price || 0) * (item.quantity || 1);
                    });
                });
                const sortedProducts = Object.values(productSales).sort((a, b) => b.sales - a.sales);
                setTopProducts(sortedProducts.slice(0, 5));

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const statCards = [
        { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: <DollarSign size={24} className="text-[var(--color-primary-green)]" /> },
        { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: <ShoppingCart size={24} className="text-[#C6A75E]" /> },
        { title: 'Active Products', value: stats.activeProducts.toLocaleString(), icon: <Package size={24} className="text-blue-500" /> },
        { title: 'Total Customers', value: stats.totalCustomers.toLocaleString(), icon: <Users size={24} className="text-purple-500" /> },
        { title: 'Subscriptions', value: stats.totalSubscriptions.toLocaleString(), icon: <Mail size={24} className="text-orange-500" /> },
    ];

    if (loading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Dashboard Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                            <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                            <div className="h-7 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Dashboard Overview</h1>
                <div className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    Live Data
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                {stat.icon}
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
                        <Link to="/admin.in/orders" className="text-sm font-bold text-[#C6A75E] hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        {recentOrders.length > 0 ? (
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
                                            <td className="py-4 px-2 font-bold text-gray-700">{order.order_id}</td>
                                            <td className="py-4 px-2 text-gray-600">{order.customer_name}</td>
                                            <td className="py-4 px-2 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="py-4 px-2 font-bold text-[var(--color-primary-green)]">{formatCurrency(order.total_amount)}</td>
                                            <td className="py-4 px-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                        order.order_status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No orders yet</p>
                                <p className="text-xs mt-1">Orders will appear here once customers start ordering.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-[var(--color-primary-green)] mb-6">Top Selling Products</h2>
                    <div className="space-y-5">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-gray-800 text-sm mb-1">{product.name}</div>
                                        <div className="text-xs text-gray-500">{product.sales} sales</div>
                                    </div>
                                    <div className="font-bold text-[var(--color-primary-green)] text-sm">
                                        {formatCurrency(product.revenue)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <Package size={36} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm font-medium">No sales data yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
