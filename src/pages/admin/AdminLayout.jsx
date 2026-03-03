import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const isLogged = localStorage.getItem("sr_admin_auth");
        if (!isLogged) {
            navigate('/admin.in/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("sr_admin_auth");
        navigate('/admin.in/login');
    };

    const routes = [
        { path: '/admin.in/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin.in/products', name: 'Products', icon: <Package size={20} /> },
        { path: '/admin.in/orders', name: 'Orders', icon: <ShoppingCart size={20} /> },
        { path: '/admin.in/customers', name: 'Customers', icon: <Users size={20} /> },
        { path: '/admin.in/subscriptions', name: 'Subscriptions', icon: <Package size={20} /> },
        { path: '/admin.in/contact-messages', name: 'Messages', icon: <Users size={20} /> },
        { path: '/admin.in/settings', name: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="flex bg-[var(--color-bg-alt)] min-h-screen font-body relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white w-64 shadow-xl z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-[var(--color-card-bg)]">
                    <h2 className="text-xl font-heading font-bold text-[var(--color-primary-green)]">Admin Panel</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {routes.map((route) => (
                        <Link
                            key={route.path}
                            to={route.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${location.pathname === route.path ? 'bg-[var(--color-primary-green)] text-[var(--color-primary-gold)] shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary-green)]'}`}
                        >
                            <span className={location.pathname === route.path ? 'text-white' : ''}>{route.icon}</span>
                            <span className={location.pathname === route.path ? 'text-white' : ''}>{route.name}</span>
                        </Link>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 mt-8 transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden h-screen bg-gray-50/50">
                <header className="h-16 bg-white shadow-sm flex items-center px-4 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--color-primary-green)]">
                        <Menu size={24} />
                    </button>
                    <h1 className="ml-4 font-heading font-bold text-lg text-[var(--color-primary-green)]">Star Ruchulu</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
