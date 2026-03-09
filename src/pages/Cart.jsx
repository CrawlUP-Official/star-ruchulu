import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { getCart, removeFromCart, updateQuantity, getCartTotal } from '../utils/cartUtils';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CheckoutAuthModal from '../components/CheckoutAuthModal';

const Cart = () => {
    const [cartItems, setCartItems] = useState(getCart());
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleRemove = (id, weight) => {
        setCartItems(removeFromCart(id, weight));
    };

    const handleUpdateQuantity = (id, weight, newQuantity) => {
        setCartItems(updateQuantity(id, weight, newQuantity));
    };

    const total = getCartTotal();
    const freeShippingThreshold = 999;
    const deliveryCharge = total >= freeShippingThreshold || total === 0 ? 0 : 60;
    const finalTotal = total + deliveryCharge;

    const handleCheckoutClick = () => {
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-bg-white)] px-4">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-md mb-8">
                    <ShoppingBag size={64} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-[var(--color-primary-green)] mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 font-body text-lg max-w-md text-center">Looks like you haven't added any of our delicious homemade treats yet.</p>
                <Link
                    to="/shop"
                    className="px-8 py-4 bg-[var(--color-primary-green)] text-white rounded-full font-bold hover:bg-red-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-bg-white)] min-h-screen pt-8 md:pt-12 pb-16 md:pb-24">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-5xl font-heading font-bold text-[var(--color-primary-green)]">Shopping Cart</h1>
                    <span className="text-gray-500 font-medium text-lg bg-gray-100 px-4 py-2 rounded-lg">{cartItems.length} Items</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Cart Items List */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header hidden on mobile */}
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 text-sm uppercase tracking-wider">
                                <div className="col-span-6">Product Details</div>
                                <div className="col-span-3 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Price</div>
                                <div className="col-span-1 text-center">Action</div>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.weight}`} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center hover:bg-gray-50/50 transition-colors relative">

                                        {/* Mobile: Product & Price, Desktop: Product */}
                                        <div className="col-span-1 md:col-span-6 flex gap-4 md:gap-6">
                                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-[var(--color-primary-green)] mb-1">{item.category}</span>
                                                <Link to={`/product/${item.id}`} className="text-base md:text-xl font-heading font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary-green)] transition-colors pr-8 md:pr-0 line-clamp-2 md:line-clamp-1">
                                                    {item.name}
                                                </Link>
                                                <p className="text-gray-500 mt-1 md:mt-2 flex items-center gap-2">
                                                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 rounded-md text-xs md:text-sm font-medium border border-gray-200">{item.weight}</span>
                                                </p>

                                                {/* Mobile Price */}
                                                <div className="md:hidden mt-2 font-bold text-lg md:text-xl text-[var(--color-primary-green)]">
                                                    ₹{item.finalPrice * item.quantity}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
                                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm w-28 md:w-auto">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.weight, item.quantity - 1)}
                                                    className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[var(--color-primary-green)] transition-colors text-base md:text-lg"
                                                >
                                                    <Minus size={14} className="md:w-[16px] md:h-[16px]" />
                                                </button>
                                                <span className="w-8 md:w-10 text-center font-bold text-base md:text-lg">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.weight, item.quantity + 1)}
                                                    className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[var(--color-primary-green)] transition-colors text-base md:text-lg"
                                                >
                                                    <Plus size={14} className="md:w-[16px] md:h-[16px]" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mobile: Actions row, Desktop: Price & Action */}
                                        <div className="col-span-1 md:col-span-3 hidden md:grid grid-cols-3 gap-4 items-center">
                                            <div className="col-span-2 text-xl font-bold text-[var(--color-primary-green)] text-right">
                                                ₹{item.finalPrice * item.quantity}
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                <button
                                                    onClick={() => handleRemove(item.id, item.weight)}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 transition-all shadow-sm"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mobile Remove Button */}
                                        <div className="md:hidden absolute right-4 top-4">
                                            <button
                                                onClick={() => handleRemove(item.id, item.weight)}
                                                className="p-1 text-gray-400 hover:text-red-500 bg-red-50/50 rounded-full"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                            <Link to="/shop" className="flex items-center gap-2 text-[var(--color-primary-green)] font-bold hover:underline py-2 px-4 rounded-lg hover:bg-red-50 transition-colors">
                                <ArrowLeft size={18} /> Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--color-primary-gold)]/20 sticky top-28">
                            <h3 className="text-2xl font-heading font-bold text-[var(--color-text-primary)] mb-6 border-b border-gray-100 pb-4">Order Summary</h3>

                            <div className="space-y-4 text-lg text-gray-600 mb-6 font-medium">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-800">₹{total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Estimate</span>
                                    <span className="font-bold text-gray-800">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Taxes</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-dashed border-gray-300 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg md:text-xl font-bold text-gray-800">Total</span>
                                    <span className="text-2xl md:text-4xl font-extrabold text-[var(--color-primary-green)]">₹{finalTotal}</span>
                                </div>
                                {deliveryCharge > 0 && (
                                    <p className="text-[10px] md:text-sm text-center mt-3 md:mt-4 bg-yellow-50 text-[var(--color-primary-green)] py-1.5 md:py-2 rounded-lg font-medium border border-yellow-100">
                                        Add ₹{freeShippingThreshold - total} more for <span className="font-bold">FREE Delivery</span>
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleCheckoutClick}
                                className="w-full py-3 md:py-4 px-4 md:px-6 bg-[var(--color-primary-gold)] text-gray-900 rounded-xl font-bold text-base md:text-lg hover:bg-yellow-400 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-4 border-t border-gray-100 pt-6 opacity-60">
                                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-2 font-medium tracking-wide uppercase">Secure encrypted checkout</p>
                        </div>
                    </div>

                </div>
            </div>

            <CheckoutAuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthenticated={() => {
                    setIsAuthModalOpen(false);
                    navigate('/checkout');
                }}
            />
        </div>
    );
};

export default Cart;
