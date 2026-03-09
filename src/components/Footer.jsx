import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ChevronDown } from 'lucide-react';

const Footer = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };
    return (
        <footer className="bg-[var(--color-footer-bg)] text-[#F5F5F5] pt-16 pb-12 border-t-2 border-white/10">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-3xl font-heading font-bold text-[var(--color-primary-gold)] mb-6">Star Ruchulu</h3>
                        <p className="text-gray-300 mb-6 font-body leading-relaxed max-w-sm">
                            Authentic homemade Andhra flavors delivered fresh from Macherla, Palnadu District to any corner of India.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com/starruchulu" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--color-primary-gold)] hover:text-black transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="https://instagram.com/starruchulu" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--color-primary-gold)] hover:text-black transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://twitter.com/starruchulu" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--color-primary-gold)] hover:text-black transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="border-b border-white/10 md:border-none pb-4 md:pb-0">
                        <div
                            role="button"
                            className="flex justify-between items-center w-full md:cursor-default cursor-pointer outline-none"
                            onClick={() => toggleSection('quickLinks')}
                        >
                            <span className="text-xl font-heading font-bold mb-0 md:mb-6 block pointer-events-none">Quick links</span>
                            <ChevronDown className={`md:hidden transition-transform pointer-events-none ${openSection === 'quickLinks' ? 'rotate-180' : ''}`} />
                        </div>
                        <ul className={`md:block space-y-3 text-gray-400 mt-4 md:mt-0 overflow-hidden transition-all duration-300 ${openSection === 'quickLinks' ? 'max-h-48' : 'max-h-0 md:max-h-none'}`}>
                            <li><Link to="/" className="hover:text-[var(--color-primary-gold)] transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-[var(--color-primary-gold)] transition-colors">Our Story</Link></li>
                            <li><Link to="/shop" className="hover:text-[var(--color-primary-gold)] transition-colors">Shop All</Link></li>
                            <li><Link to="/contact" className="hover:text-[var(--color-primary-gold)] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="border-b border-white/10 md:border-none pb-4 md:pb-0">
                        <div
                            role="button"
                            className="flex justify-between items-center w-full md:cursor-default cursor-pointer outline-none"
                            onClick={() => toggleSection('categories')}
                        >
                            <span className="text-xl font-heading font-bold mb-0 md:mb-6 block pointer-events-none">Shop</span>
                            <ChevronDown className={`md:hidden transition-transform pointer-events-none ${openSection === 'categories' ? 'rotate-180' : ''}`} />
                        </div>
                        <ul className={`md:block space-y-3 text-gray-400 mt-4 md:mt-0 overflow-hidden transition-all duration-300 ${openSection === 'categories' ? 'max-h-48' : 'max-h-0 md:max-h-none'}`}>
                            <li><Link to="/shop/Veg Pickles" className="hover:text-[var(--color-primary-gold)] transition-colors">Veg Pickles</Link></li>
                            <li><Link to="/shop/Non-Veg Pickles" className="hover:text-[var(--color-primary-gold)] transition-colors">Non-Veg Pickles</Link></li>
                            <li><Link to="/shop/Sweets" className="hover:text-[var(--color-primary-gold)] transition-colors">Authentic Sweets</Link></li>
                            <li><Link to="/shop/Snacks" className="hover:text-[var(--color-primary-gold)] transition-colors">Crunchy Snacks</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <div
                            role="button"
                            className="flex justify-between items-center w-full md:cursor-default cursor-pointer outline-none"
                            onClick={() => toggleSection('contact')}
                        >
                            <span className="text-xl font-heading font-bold mb-0 md:mb-6 block pointer-events-none">Contact Us</span>
                            <ChevronDown className={`md:hidden transition-transform pointer-events-none ${openSection === 'contact' ? 'rotate-180' : ''}`} />
                        </div>
                        <ul className={`md:block space-y-4 text-gray-400 mt-4 md:mt-0 overflow-hidden transition-all duration-300 ${openSection === 'contact' ? 'max-h-48' : 'max-h-0 md:max-h-none'}`}>
                            <li className="flex items-start space-x-3">
                                <MapPin className="text-[var(--color-primary-gold)] shrink-0 mt-1" size={20} />
                                <span>Macherla, Palnadu District, Andhra Pradesh, India</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="text-[var(--color-primary-gold)] shrink-0" size={20} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="text-[var(--color-primary-gold)] shrink-0" size={20} />
                                <span>hello@starruchulu.com</span>
                            </li>
                        </ul>


                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
