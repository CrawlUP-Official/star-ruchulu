import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, getCartTotal, clearCart } from '../utils/cartUtils';
import { CheckCircle, Lock, ShieldCheck, MapPin, Truck, AlertCircle } from 'lucide-react';
import api from '../services/api';

import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Checkout = () => {
    const navigate = useNavigate();
    const cartItems = getCart();
    const total = getCartTotal();
    const deliveryCharge = total >= 999 || total === 0 ? 0 : 60;
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        fullName: user ? user.name : 'Test User',
        phone: user ? user.phone : '9876543210',
        email: user ? user.email : 'test@example.com',
        address: '123 Fake St',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        paymentMethod: 'cod',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [generatedOrderId, setGeneratedOrderId] = useState('');
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (cartItems.length === 0 && !orderSuccess) {
            navigate('/shop');
        }
    }, [cartItems.length, navigate, orderSuccess]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const payload = {
                customer_name: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                payment_method: formData.paymentMethod,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    weight: item.weight,
                    quantity: item.quantity
                }))
            };

            const response = await api.post('/orders', payload);

            setGeneratedOrderId(response.data.order_id);
            setIsSubmitting(false);
            setOrderSuccess(true);
            clearCart();
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Failed to process order. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[var(--color-bg-white)] px-4 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-md">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-4xl font-heading font-bold text-[var(--color-text-primary)] mb-4">Order Confirmed!</h2>
                <p className="text-gray-600 text-lg mb-8 max-w-md font-body">
                    Thank you for choosing Star Ruchulu. Your authentic Andhra flavors are being prepared and will be shipped soon.
                </p>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 inline-block text-left">
                    <p className="font-bold text-gray-800 mb-2">Order ID: <span className="text-[var(--color-primary-green)]">#{generatedOrderId}</span></p>
                    <p className="text-gray-600">A confirmation email has been sent to <span className="font-bold">{formData.email}</span></p>
                </div>
                <Link to="/" className="px-8 py-4 bg-[var(--color-primary-green)] text-white rounded-full font-bold hover:bg-red-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-bg-white)] min-h-screen pt-8 md:pt-12 pb-16 md:pb-24">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <h1 className="text-2xl md:text-5xl font-heading font-bold text-[var(--color-primary-green)] mb-6 md:mb-8">Secure Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Checkout Form */}
                    <div className="lg:w-2/3">
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 space-y-6 md:space-y-8">

                            {submitError && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                                    <AlertCircle className="shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold">Checkout Failed</h4>
                                        <p className="text-sm mt-1">{submitError}</p>
                                    </div>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold font-heading text-[var(--color-text-primary)] mb-4 md:mb-6 flex items-center gap-2 pb-3 md:pb-4 border-b border-gray-100">
                                    <Lock className="text-[var(--color-primary-gold)] w-5 h-5 md:w-6 md:h-6" /> Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-shadow"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-shadow"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 font-bold mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-shadow"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold font-heading text-[var(--color-text-primary)] mb-4 md:mb-6 flex items-center gap-2 pb-3 md:pb-4 border-b border-gray-100">
                                    <MapPin className="text-[var(--color-primary-gold)] w-5 h-5 md:w-6 md:h-6" /> Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 font-bold mb-2">Detailed Address *</label>
                                        <textarea
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-shadow"
                                            placeholder="House No., Street, Landmark"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-shadow"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">State *</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-shadow"
                                        >
                                            <option>Andhra Pradesh</option>
                                            <option>Telangana</option>
                                            <option>Karnataka</option>
                                            <option>Tamil Nadu</option>
                                            <option>Maharashtra</option>
                                            <option>Delhi</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Pincode *</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="pincode"
                                                required
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-shadow pr-20"
                                                placeholder="522426"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-2 bottom-2 bg-gray-200 text-gray-700 font-bold px-3 rounded hover:bg-gray-300 transition-colors text-xs"
                                            >
                                                CHECK
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold font-heading text-[var(--color-text-primary)] mb-4 md:mb-6 flex items-center gap-2 pb-3 md:pb-4 border-b border-gray-100">
                                    <ShieldCheck className="text-[var(--color-primary-gold)] w-5 h-5 md:w-6 md:h-6" /> Payment Method
                                </h2>
                                <div className="space-y-3 md:space-y-4">

                                    <label className={`flex items-center p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-[var(--color-primary-green)] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={formData.paymentMethod === 'online'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary-green)] focus:ring-[var(--color-primary-green)]"
                                        />
                                        <div className="ml-3 md:ml-4 flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                            <span className="font-bold text-gray-800 text-sm md:text-lg mb-1 sm:mb-0">Pay Online (UPI, Cards, NetBanking)</span>
                                            <div className="flex gap-2">
                                                <div className="w-8 h-5 bg-blue-100 rounded text-[8px] font-bold text-blue-800 flex items-center justify-center">VISA</div>
                                                <div className="w-8 h-5 bg-green-100 rounded text-[8px] font-bold text-green-800 flex items-center justify-center">UPI</div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`flex items-center p-4 md:p-5 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-[var(--color-primary-green)] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary-green)] focus:ring-[var(--color-primary-green)]"
                                        />
                                        <div className="ml-3 md:ml-4">
                                            <span className="block font-bold text-gray-800 text-sm md:text-lg">Cash on Delivery</span>
                                            <span className="text-[10px] md:text-sm text-gray-500">Pay using cash or UPI at your doorstep.</span>
                                        </div>
                                    </label>

                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 md:py-5 bg-[var(--color-primary-green)] text-white rounded-xl font-bold text-base md:text-xl hover:bg-red-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                            >
                                {isSubmitting ? 'Processing...' : `Place Order (₹${total + deliveryCharge})`}
                                {isSubmitting && <div className="w-4 h-4 md:w-6 md:h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            </button>

                            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                                <Lock size={14} /> 100% Secure Encrypted Checkout
                            </p>
                        </form>
                    </div>

                    {/* Order Summary sidebar */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-[var(--color-primary-gold)]/20 sticky top-28">
                            <h3 className="text-lg md:text-xl font-heading font-bold text-[var(--color-text-primary)] mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-100 flex items-center justify-between">
                                Order Summary <span className="bg-gray-100 text-[10px] md:text-sm py-1 px-2 md:px-3 rounded-md font-medium">{cartItems.length} items</span>
                            </h3>

                            <div className="space-y-3 md:space-y-4 max-h-[40vh] overflow-y-auto hide-scroll-bar mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-100 pr-2">
                                {cartItems.map(item => (
                                    <div key={`${item.id}-${item.weight}`} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative border border-gray-200">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <div className="absolute -top-2 -right-2 bg-gray-800 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-white">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.weight}</p>
                                        </div>
                                        <div className="font-bold text-[var(--color-primary-green)]">
                                            ₹{item.finalPrice * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-gray-600 font-medium mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-800">₹{total}</span>
                                </div>
                                <div className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded-lg -mx-2">
                                    <span className="flex items-center gap-1"><Truck size={16} /> Shipping</span>
                                    <span className="font-bold">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-dashed border-gray-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg md:text-xl font-bold text-gray-800">Total</span>
                                    <span className="text-2xl md:text-3xl font-extrabold text-[var(--color-primary-green)]">₹{total + deliveryCharge}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
