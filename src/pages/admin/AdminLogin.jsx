import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem("sr_admin_auth", "true");
            navigate('/admin.in/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-alt)] flex items-center justify-center px-4 font-body">
            <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-primary-gold)]"></div>
                <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)] mb-6 text-center">
                    Star Ruchulu Admin
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary-green)] focus:ring-2 focus:ring-red-50 transition-all text-sm"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary-green)] focus:ring-2 focus:ring-red-50 transition-all text-sm"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[var(--color-primary-green)] text-white rounded-xl font-bold text-lg hover:bg-[var(--color-secondary-green)] transition-all shadow-md hover:-translate-y-0.5 mt-2"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
