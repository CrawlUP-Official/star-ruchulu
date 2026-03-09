import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, ChevronDown, User } from 'lucide-react';
import { getCartCount } from '../utils/cartUtils';
import CartDrawer from './CartDrawer';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(getCartCount());
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const urlQuery = searchParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [searchOpen, setSearchOpen] = useState(!!urlQuery);
    const navigate = useNavigate();

    useEffect(() => {
        setSearchQuery(urlQuery);
        setSearchOpen(!!urlQuery);
    }, [urlQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchOpen(false);
        navigate('/shop');
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateCartCount = () => {
            setCartCount(getCartCount());
        };
        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop All', path: '/shop' },
        { name: 'Veg Pickles', path: '/shop/Veg Pickles' },
        { name: 'Non-Veg Pickles', path: '/shop/Non-Veg Pickles' },
        { name: 'Sweets', path: '/shop/Sweets' },
    ];

    return (
        <>
            <header
                className={`fixed w-full z-40 transition-all duration-300 border-b border-gray-100 ${isScrolled ? 'backdrop-blur-md bg-white/90 shadow-sm py-2' : 'bg-[var(--color-card-bg)] py-3 md:py-4'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="text-xl md:text-3xl font-heading font-bold text-[var(--color-primary-green)] border border-transparent shadow-none hover:shadow-none">
                            Star Ruchulu
                        </Link>

                        {/* Desktop Navigation - Mega Menu style for Categories */}
                        <nav className="hidden md:flex space-x-8 items-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary-green)] transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-primary-gold)] transition-all group-hover:w-full"></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <form onSubmit={handleSearch} className="flex items-center relative">
                                <div className={`transition-all duration-300 overflow-hidden flex items-center bg-gray-50 rounded-full border absolute right-full mr-2 md:relative md:right-auto md:mr-0 z-20 ${searchOpen ? 'w-[160px] sm:w-[220px] md:w-56 px-2 md:px-3 py-1.5 border-gray-200 opacity-100 shadow-sm md:shadow-none' : 'w-0 px-0 py-1.5 border-transparent opacity-0'}`}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full bg-transparent border-none focus:outline-none text-xs md:text-sm text-gray-700"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus={searchOpen && !urlQuery}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="text-gray-400 hover:text-red-500 transition-colors ml-1 p-0.5"
                                            title="Clear Search"
                                        >
                                            <X size={14} className="md:w-4 md:h-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (searchOpen && !searchQuery) setSearchOpen(false);
                                        else setSearchOpen(true);
                                    }}
                                    className="p-1 md:p-2 text-gray-700 hover:text-[var(--color-primary-gold)] transition-colors ml-1 z-20 relative bg-white md:bg-transparent rounded-full"
                                    title="Search"
                                >
                                    <Search size={20} className="md:w-5 md:h-5" />
                                </button>
                            </form>

                            <Link to="/account/dashboard" className="p-2 text-[var(--color-primary-green)] hover:text-[var(--color-primary-gold)] transition-colors relative" title="Account">
                                <User size={24} />
                            </Link>

                            <button
                                className="p-2 text-[var(--color-primary-green)] hover:text-[var(--color-primary-gold)] transition-colors relative"
                                onClick={() => setCartOpen(true)}
                            >
                                <ShoppingCart size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-[var(--color-primary-gold)] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </button>



                            <button
                                className="md:hidden p-1 text-[var(--color-primary-green)] hover:text-[var(--color-primary-gold)] transition-colors ml-1"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            ></div>

            {/* Mobile Menu Side Panel */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-5 flex justify-between items-center border-b">
                    <span className="text-xl font-heading font-bold text-[var(--color-primary-green)]">Menu</span>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-5 flex flex-col space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
                    <Link to="/" className="text-lg font-medium text-gray-800 hover:text-[var(--color-primary-green)] py-3 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/shop" className="text-lg font-medium text-gray-800 hover:text-[var(--color-primary-green)] py-3 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>

                    <div className="border-b border-gray-100">
                        <button
                            className="w-full text-left text-lg font-medium text-gray-800 hover:text-[var(--color-primary-green)] py-3 flex justify-between items-center"
                            onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                        >
                            Categories
                            <ChevronDown size={20} className={`transform transition-transform duration-300 ${mobileCategoryOpen ? 'rotate-180 text-[var(--color-primary-green)]' : 'text-gray-400'}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileCategoryOpen ? 'max-h-64 mb-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="flex flex-col pl-4 border-l-2 border-gray-100 ml-2 space-y-1">
                                <Link to="/shop/Veg Pickles" className="text-base text-gray-600 hover:text-[var(--color-primary-green)] hover:bg-gray-50 py-2 px-2 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Veg Pickles</Link>
                                <Link to="/shop/Non-Veg Pickles" className="text-base text-gray-600 hover:text-[var(--color-primary-green)] hover:bg-gray-50 py-2 px-2 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Non-Veg Pickles</Link>
                                <Link to="/shop/Sweets" className="text-base text-gray-600 hover:text-[var(--color-primary-green)] hover:bg-gray-50 py-2 px-2 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Authentic Sweets</Link>
                                <Link to="/shop/Snacks" className="text-base text-gray-600 hover:text-[var(--color-primary-green)] hover:bg-gray-50 py-2 px-2 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Crunchy Snacks</Link>
                            </div>
                        </div>
                    </div>

                    <Link to="/about" className="text-lg font-medium text-gray-800 hover:text-[var(--color-primary-green)] py-3 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Our Story</Link>
                    <Link to="/contact" className="text-lg font-medium text-gray-800 hover:text-[var(--color-primary-green)] py-3" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
                </div>
            </div>

            {/* Cart Drawer Provider */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            {/* Spacer to push content down because of fixed header */}
            <div className="h-[76px] md:h-[88px]"></div>
        </>
    );
};

export default Navbar;
