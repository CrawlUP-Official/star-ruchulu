import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react';

const CheckoutAuthModal = ({ isOpen, onClose, onAuthenticated }) => {
    const [view, setView] = useState('login'); // login, signup, or otp
    const { login, signup, verifyLogin, verifySignup } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg('');
        setIsLoading(true);
        try {
            if (view === 'login') {
                const res = await login(formData.email, formData.password);
                setSuccessMsg(res.message);
                setView('otp_login');
            } else if (view === 'signup') {
                const res = await signup(formData);
                setSuccessMsg(res.message);
                setView('otp_signup');
            } else if (view === 'otp_login') {
                await verifyLogin(formData.email, formData.otp);
                onAuthenticated();
            } else if (view === 'otp_signup') {
                await verifySignup(formData);
                onAuthenticated();
            }
        } catch (err) {
            setError(err.response?.data?.message || `Operation failed`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full mx-4 shadow-xl relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 rounded-full p-2"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-heading font-bold text-[var(--color-primary-green)] mb-2">
                        {view === 'login' ? 'Sign in to continue' : view === 'signup' ? 'Create an Account' : 'Enter OTP'}
                    </h2>
                    <p className="text-gray-500 font-body text-sm">
                        {view.startsWith('otp') ? 'Please enter the OTP sent to your email.' : 'Keep track of your orders and get special offers.'}
                    </p>
                </div>

                {successMsg && <div className="p-3 bg-green-50 text-green-600 rounded-xl mb-4 text-sm font-medium">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {view === 'signup' && (
                        <>
                            <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-gold)]" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <input type="tel" placeholder="Phone Number" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-gold)]" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </>
                    )}
                    {(view === 'login' || view === 'signup') && (
                        <>
                            <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-gold)]" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            <input type="password" placeholder="Password (Optional)" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-gold)]" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </>
                    )}
                    {view.startsWith('otp') && (
                        <input type="text" placeholder="Enter 6-digit OTP" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-gold)] text-center tracking-widest font-mono text-lg" value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value })} maxLength={6} />
                    )}

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button type="submit" disabled={isLoading} className="w-full bg-[var(--color-primary-gold)] text-[var(--color-primary-green)] py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 mt-4">
                        {isLoading ? 'Processing...' : (view === 'login' ? 'Login & Checkout' : 'Create Account & Checkout')}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-gray-100 pt-4">
                    <button
                        onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                        className="text-sm text-gray-600 hover:text-[var(--color-primary-green)] font-medium"
                    >
                        {view === 'login' ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutAuthModal;
