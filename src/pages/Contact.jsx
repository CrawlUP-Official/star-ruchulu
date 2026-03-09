import { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        try {
            await api.post('/contact', formData);
            setIsSubmitting(false);
            setIsSent(true);
            setFormData({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Failed to send message. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[var(--color-bg-white)] min-h-screen pt-4 pb-24">
            {/* Banner */}
            <div className="bg-[var(--color-primary-green)] text-white py-12 md:py-16 text-center shadow-inner relative overflow-hidden">
                <h1 className="text-3xl md:text-5xl font-heading font-bold mb-3 md:mb-4 drop-shadow-md z-10 relative">
                    Contact Us
                </h1>
                <p className="text-red-100 font-body text-sm md:text-lg max-w-2xl mx-auto z-10 relative px-4">
                    Have a question about bulk orders, international shipping, or something else? We're here to help.
                </p>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-primary-gold)] rounded-full blur-3xl opacity-10 -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 mt-8 md:mt-12 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-8">

                    {/* Contact Information */}
                    <div className="lg:w-1/3">
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-text-primary)] mb-6 md:mb-8 pb-3 md:pb-4 border-b border-[var(--color-primary-gold)]/30">Get in Touch</h2>

                        <div className="space-y-4 md:space-y-8">
                            <div className="flex items-start gap-4 p-5 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 text-[var(--color-primary-green)] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg mb-1">Phone</h3>
                                    <p className="text-gray-500 font-medium">+91 98765 43210</p>
                                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1"><Clock size={12} /> Mon-Sat: 9AM to 7PM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-50 text-[var(--color-primary-gold)] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail size={20} className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-base md:text-lg mb-0.5 md:mb-1">Email</h3>
                                    <p className="text-gray-500 font-medium text-sm md:text-base">hello@starruchulu.com</p>
                                    <p className="text-xs md:text-sm text-gray-400 mt-1">We aim to reply within 24 hours.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin size={20} className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-base md:text-lg mb-0.5 md:mb-1">Address</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">Door No. 4-12, Gandhi Nagar,<br />Macherla, Palnadu District,<br />Andhra Pradesh - 522426</p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        <div className="mt-8 md:mt-12 p-6 md:p-8 bg-green-50 rounded-3xl border border-green-100 text-center shadow-inner">
                            <h3 className="font-heading font-bold text-lg md:text-xl text-green-800 mb-2 md:mb-3 block">Faster Response?</h3>
                            <p className="text-green-700 text-xs md:text-sm mb-4 md:mb-6">Reach out directly to our customer support team on WhatsApp.</p>
                            <a
                                href="https://wa.me/919876543210?text=I want to order from Star Ruchulu"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3 md:py-4 bg-green-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-green-600 shadow-md text-sm md:text-base"
                            >
                                <MessageSquare size={18} /> Chat with us
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-[var(--color-primary-gold)]/20 relative">

                            {isSent && (
                                <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl animate-in fade-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-md border border-green-200">
                                        <MessageSquare size={32} />
                                    </div>
                                    <h3 className="text-3xl font-heading font-bold text-[var(--color-text-primary)] mb-3 text-center">Message Received!</h3>
                                    <p className="text-gray-600 font-body text-center max-w-sm">Thank you for getting in touch. One of our team members will respond to your query shortly.</p>
                                    <button
                                        onClick={() => setIsSent(false)}
                                        className="mt-8 px-8 py-3 bg-[var(--color-primary-green)] text-white rounded-full font-bold hover:bg-red-800 transition-colors shadow-md"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            )}

                            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-primary-green)] mb-6 md:mb-8 flex items-center gap-3">
                                Send us a Message
                            </h2>

                            {submitError && (
                                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                                    <AlertCircle className="shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold">Message Failed</h4>
                                        <p className="text-sm mt-1">{submitError}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2 md:mb-3 text-xs md:text-sm tracking-wide uppercase">Your Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 md:py-4 md:px-5 focus:outline-none focus:bg-white focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-all font-body text-base md:text-lg"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2 md:mb-3 text-xs md:text-sm tracking-wide uppercase">Phone Number <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 md:py-4 md:px-5 focus:outline-none focus:bg-white focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-all font-body text-base md:text-lg"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2 md:mb-3 text-xs md:text-sm tracking-wide uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 md:py-4 md:px-5 focus:outline-none focus:bg-white focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-all font-body text-base md:text-lg"
                                        placeholder="john@example.com (Optional)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2 md:mb-3 text-xs md:text-sm tracking-wide uppercase">Your Message <span className="text-red-500">*</span></label>
                                    <textarea
                                        required
                                        rows="5"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 md:py-4 md:px-5 focus:outline-none focus:bg-white focus:border-[var(--color-primary-green)] font-medium focus:ring-2 focus:ring-red-100 transition-all font-body text-base md:text-lg resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 md:py-5 bg-[var(--color-primary-green)] text-white rounded-xl font-bold text-lg md:text-xl hover:bg-red-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-3 mt-2 md:mt-4"
                                >
                                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                                    {isSubmitting && <div className="w-5 h-5 md:w-6 md:h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
