import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import OrderTracking from '../../components/OrderTracking';
import api from '../../services/api';

const Dashboard = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) navigate('/account/login');
    }, [user, loading, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">My Account</h1>
                    <button onClick={() => { logout(); navigate('/'); }} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm">
                        Log Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Summary */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-[var(--color-primary-gold)]/20 text-[var(--color-primary-green)] rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                            {user.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-500 mb-2">{user.email}</p>
                        <p className="text-gray-500 mb-6">{user.phone}</p>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Subscription Status</h3>
                            {user.is_subscribed ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Subscribed
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                    Not Subscribed
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
                        {user.orders && user.orders.length > 0 ? (
                            <div className="space-y-6">
                                {user.orders.map(order => (
                                    <div key={order.id} className="border border-gray-100 rounded-2xl p-4 md:p-6 pb-2">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">Order #{order.order_id}</p>
                                                <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-[var(--color-primary-green)]">₹{order.total_amount}</p>
                                                <span className={`inline-flex px-2 mt-1 py-0.5 rounded text-xs font-bold ${order.order_status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {order.order_status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 pb-4 border-t border-gray-100">
                                            <OrderTracking status={order.order_status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                <p className="text-gray-500 font-medium">No previous orders found.</p>
                                <button onClick={() => navigate('/shop')} className="mt-4 px-6 py-2 bg-[var(--color-primary-green)] text-[var(--color-primary-gold)] rounded-xl font-bold hover:bg-green-900 transition-colors">Start Shopping</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
