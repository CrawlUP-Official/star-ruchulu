import { useState, useEffect } from 'react';
import { Save, Phone, MessageCircle, MapPin, Truck, LayoutTemplate, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
    const defaultSettings = {
        businessPhone: '+91 98765 43210',
        whatsappNumber: '+91 98765 43210',
        businessAddress: '1-23, Main Bazaar, Macherla, Palnadu District, Andhra Pradesh - 522426',
        freeShippingThreshold: '1000',
        bannerText: '✨ Free Shipping on orders above ₹1000! Authentic items directly from Palnadu.'
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('sr_admin_settings');
        if (stored) {
            setSettings(JSON.parse(stored));
        } else {
            localStorage.setItem('sr_admin_settings', JSON.stringify(defaultSettings));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
        setSaveSuccess(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate network delay for realistic feel
        setTimeout(() => {
            localStorage.setItem('sr_admin_settings', JSON.stringify(settings));
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Store Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure global store details, contact info, and active banners.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                {/* Visual Header */}
                <div className="h-2 w-full bg-gradient-to-r from-[var(--color-primary-green)] to-[var(--color-primary-gold)]"></div>

                <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">

                    {/* General Contact Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <h2 className="text-lg font-bold text-[var(--color-primary-green)] flex items-center gap-2">
                                <Phone size={20} className="text-[#C6A75E]" /> Contact Information
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Business Phone Line</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold"><Phone size={16} /></span>
                                    <input
                                        type="text"
                                        name="businessPhone"
                                        value={settings.businessPhone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all font-medium text-gray-800"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Order Number</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-bold"><MessageCircle size={16} /></span>
                                    <input
                                        type="text"
                                        name="whatsappNumber"
                                        value={settings.whatsappNumber}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all font-medium text-gray-800"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">Floating WhatsApp button routes here.</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Physical Store Address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-[18px] text-gray-400 font-bold"><MapPin size={16} /></span>
                                <textarea
                                    name="businessAddress"
                                    value={settings.businessAddress}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all font-medium text-gray-800 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* E-Commerce Operations */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <h2 className="text-lg font-bold text-[var(--color-primary-green)] flex items-center gap-2">
                                <Truck size={20} className="text-[#C6A75E]" /> E-Commerce Operations
                            </h2>
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Free Shipping Threshold (Amount in ₹)</label>
                            <div className="relative max-w-sm">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    name="freeShippingThreshold"
                                    value={settings.freeShippingThreshold}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all font-medium text-gray-800"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Orders above this amount won't charge standard shipping.</p>
                        </div>
                    </div>

                    {/* Visual UI Elements */}
                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <h2 className="text-lg font-bold text-[var(--color-primary-green)] flex items-center gap-2">
                                <LayoutTemplate size={20} className="text-[#C6A75E]" /> Site Banners
                            </h2>
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2">Global Announcement Banner</label>
                            <input
                                type="text"
                                name="bannerText"
                                value={settings.bannerText}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all font-medium text-gray-800"
                            />
                            <p className="text-xs text-gray-400 mt-2">Appears at the very top of the website on every page.</p>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            {saveSuccess && (
                                <span className="flex items-center gap-1 text-sm font-bold text-green-600 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <CheckCircle2 size={16} /> Saved Successfully
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-8 py-3 bg-[var(--color-primary-green)] text-white rounded-xl font-bold shadow-md transition-all ${isSaving ? 'opacity-70 cursor-wait' : 'hover:bg-[var(--color-secondary-green)] hover:-translate-y-0.5'}`}
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save size={18} />
                            )}
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
