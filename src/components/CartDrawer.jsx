import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { getCart, removeFromCart, updateQuantity, getCartTotal } from '../utils/cartUtils';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import CheckoutAuthModal from './CheckoutAuthModal';

const CartItem = React.memo(({ item, onRemove, onUpdateQuantity }) => {
    return (
        <div className="flex gap-4 border-b border-gray-100 pb-4">
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-heading font-bold text-[var(--color-text-primary)]">{item.name}</h3>
                    <button
                        onClick={() => onRemove(item.id, item.weight)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-2">Weight: {item.weight}</p>

                <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.weight, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.weight, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <span className="font-bold text-[var(--color-primary-green)] text-lg">
                        ₹{item.finalPrice * item.quantity}
                    </span>
                </div>
            </div>
        </div>
    );
});

const CartDrawer = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState(getCart());
    const { user } = useContext(AuthContext);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleCartUpdate = useCallback(() => {
        setCartItems(getCart());
    }, []);

    useEffect(() => {
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [handleCartUpdate]);

    const handleRemove = useCallback((id, weight) => {
        removeFromCart(id, weight);
    }, []);

    const handleUpdateQuantity = useCallback((id, weight, qty) => {
        updateQuantity(id, weight, qty);
    }, []);

    const total = useMemo(() => getCartTotal(), [cartItems]);
    const freeShippingThreshold = 999;
    const isFreeShipping = total >= freeShippingThreshold;

    return (
        <>
            <div
                className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={onClose}
            />

            <div
                className={`fixed inset-y-0 right-0 z-[60] w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-[var(--color-card-bg)] text-[var(--color-primary-green)]">
                    <h2 className="text-xl font-heading font-bold">Your Cart</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-[var(--color-card-bg)] p-3 text-center text-sm font-medium text-[var(--color-primary-gold)] border-b border-gray-100">
                    {isFreeShipping
                        ? "✨ You've unlocked Free Shipping!"
                        : `Add ₹${freeShippingThreshold - total} more for Free Shipping`}
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <p className="text-lg">Your cart is empty</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-6 py-2 bg-[var(--color-primary-green)] text-white font-medium rounded-md"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItem
                                key={`${item.id}-${item.weight}`}
                                item={item}
                                onRemove={handleRemove}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-4 bg-[var(--color-bg-white)] border-t border-gray-100 space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-10">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span className="text-[var(--color-text-primary)]">Subtotal</span>
                            <span className="text-[var(--color-primary-green)]">₹{total}</span>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] text-center">Taxes and shipping calculated at checkout</p>
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/cart"
                                onClick={onClose}
                                className="w-full py-3 text-center font-bold bg-white text-[var(--color-primary-green)] border border-[var(--color-primary-green)] hover:bg-[var(--color-bg-alt)] transition-colors rounded-xl"
                            >
                                View Cart
                            </Link>
                            <button
                                onClick={() => {
                                    if (!user) {
                                        setIsAuthModalOpen(true);
                                    } else {
                                        onClose();
                                        navigate('/checkout');
                                    }
                                }}
                                className="w-full py-3 text-center font-bold bg-[var(--color-primary-green)] text-white hover:bg-[var(--color-secondary-green)] transition-all rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <CheckoutAuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthenticated={() => {
                    setIsAuthModalOpen(false);
                    onClose();
                    navigate('/checkout');
                }}
            />
        </>
    );
};

export default CartDrawer;
