import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Signup = () => {
    const { signup, verifySignup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            if (step === 1) {
                const res = await signup(formData);
                setSuccessMsg(res.message);
                setStep(2);
            } else {
                await verifySignup(formData);
                navigate('/account/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-[var(--color-primary-green)]">
                    {step === 1 ? 'Create your account' : 'Verify your email'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm border border-[var(--color-primary-gold)]/20 rounded-3xl sm:px-10">
                    {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">{successMsg}</div>}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <div className="mt-1">
                                        <input name="name" type="text" required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)] sm:text-sm"
                                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                                    <div className="mt-1">
                                        <input name="email" type="email" required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)] sm:text-sm"
                                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <div className="mt-1">
                                        <input name="phone" type="tel" required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)] sm:text-sm"
                                            value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password (Optional)</label>
                                    <div className="mt-1">
                                        <input name="password" type="password"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)] sm:text-sm"
                                            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                                <div className="mt-1">
                                    <input name="otp" type="text" required maxLength={6}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-[var(--color-primary-gold)] focus:border-[var(--color-primary-gold)] text-center tracking-widest font-mono text-lg"
                                        value={formData.otp} onChange={(e) => setFormData({ ...formData, otp: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[var(--color-primary-green)] bg-[var(--color-primary-gold)] hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-gold)] disabled:opacity-50">
                                {isLoading ? 'Processing...' : step === 1 ? 'Continue' : 'Verify & Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/account/login" className="font-bold text-[var(--color-primary-green)] hover:text-green-800">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
