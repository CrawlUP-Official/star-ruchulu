import { useState } from 'react';
import api from '../services/api';

const SubscriptionForm = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);
        try {
            const res = await api.post('/subscribe', { email });
            setStatus({ type: 'success', text: `Success! Use code ${res.data.coupon_code} for 10% OFF!` });
            setEmail('');
        } catch (error) {
            if (error.response?.status === 409) {
                setStatus({ type: 'error', text: 'Already Subscribed' });
            } else {
                setStatus({ type: 'error', text: 'Subscription failed. Try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-8 md:py-12 bg-[var(--color-primary-green)] text-white relative overflow-hidden">
            {/* Decorative patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400 rounded-full blur-3xl opacity-10 -translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white drop-shadow-md">Get 10% OFF on First Order</h2>
                <p className="text-red-100 font-body text-lg mb-10">
                    Subscribe to our newsletter to receive exclusive offers, new product announcements, and traditional recipes right to your inbox.
                </p>

                <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow bg-white px-6 py-4 rounded-full text-gray-900 border-none outline-none focus:ring-4 focus:ring-[var(--color-primary-gold)]/50 transition-all text-lg shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || status?.type === 'success'}
                        className="bg-[var(--color-primary-gold)] text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-75 disabled:transform-none disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                </form>
                {status && (
                    <div className={`mt-4 p-3 rounded-xl font-bold max-w-xl mx-auto text-sm md:text-base ${status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200 shadow-md' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {status.text}
                    </div>
                )}
                {!status && <p className="text-sm mt-4 text-red-200">We respect your privacy. No spam, ever.</p>}
            </div>
        </section>
    );
};

export default SubscriptionForm;
