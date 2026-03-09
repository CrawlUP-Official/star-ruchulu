import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { getCart, addToCart, updateQuantity } from '../utils/cartUtils';

const ProductCard = ({ product }) => {
    const [selectedWeight, setSelectedWeight] = useState('250g');
    const [isHovered, setIsHovered] = useState(false);
    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        const fetchCartItem = () => {
            const cart = getCart();
            const existing = cart.find(item => item.id === product.id && item.weight === selectedWeight);
            setCartItem(existing || null);
        };
        fetchCartItem();
        window.addEventListener('cartUpdated', fetchCartItem);
        return () => window.removeEventListener('cartUpdated', fetchCartItem);
    }, [product.id, selectedWeight]);

    const price = product.pricePerWeight[selectedWeight];

    const renderSpiceLevel = (level) => {
        return (
            <div className="flex items-center gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full inline-block ${i < level ? 'bg-[var(--color-primary-green)]' : 'bg-gray-200'}`}></span>
                ))}
            </div>
        );
    };

    const handleAddToCart = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1, selectedWeight);
    }, [product, selectedWeight]);

    const handleIncrement = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartItem) {
            updateQuantity(product.id, selectedWeight, cartItem.quantity + 1);
        }
    }, [product.id, selectedWeight, cartItem]);

    const handleDecrement = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartItem) {
            updateQuantity(product.id, selectedWeight, cartItem.quantity - 1);
        }
    }, [product.id, selectedWeight, cartItem]);

    return (
        <div
            className="bg-[var(--color-bg-white)] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-transparent hover:border-[var(--color-secondary-green)]/30 hover:shadow-[0_8px_30px_rgba(76,122,90,0.15)] transition-all duration-300 transform md:hover:-translate-y-1 relative flex flex-col h-full group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {product.isBestSeller && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-[var(--color-primary-gold)] text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                        Best Seller
                    </div>
                </div>
            )}

            <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }}
                />
                {/* Overlay for quick action on desktop */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 ${isHovered ? 'md:opacity-100' : ''} transition-opacity duration-300 hidden md:flex`}>
                    {!cartItem ? (
                        <button
                            onClick={handleAddToCart}
                            className="bg-white text-[var(--color-primary-green)] font-bold py-2 px-6 rounded-full hover:bg-[var(--color-primary-gold)] hover:text-black transition-colors transform translate-y-4 shadow-lg hover:translate-y-0"
                            style={{ transitionDuration: '400ms' }}
                        >
                            Quick Add
                        </button>
                    ) : (
                        <div className="bg-white text-[var(--color-text-primary)] font-bold py-2 px-4 rounded-full flex items-center gap-4 transform translate-y-4 shadow-lg hover:translate-y-0" style={{ transitionDuration: '400ms' }}>
                            <button
                                onClick={handleDecrement}
                                className="p-1 rounded-full transition-colors text-gray-500 hover:text-black bg-gray-100"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-4 text-center">{cartItem.quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className="text-gray-500 hover:text-black transition-colors bg-gray-100 p-1 rounded-full"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-3 md:p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1 md:mb-2 gap-1">
                    <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-green)] line-clamp-1">
                        {product.category}
                    </p>
                    <div className="flex" title={`Spice Level: ${product.spiceLevel}/5`}>
                        {product.spiceLevel > 0 && renderSpiceLevel(product.spiceLevel)}
                    </div>
                </div>

                <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm md:text-lg font-heading font-bold text-[var(--color-text-primary)] mb-2 line-clamp-2 hover:text-[var(--color-primary-green)] transition-colors leading-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto pt-2 md:pt-4 flex flex-col gap-2 md:gap-3 border-t border-gray-100">
                    <div className="flex justify-between items-center bg-gray-50 rounded-lg p-0.5 md:p-1 gap-0.5 md:gap-1">
                        {Object.keys(product.pricePerWeight).map(weight => (
                            <button
                                key={weight}
                                onClick={() => setSelectedWeight(weight)}
                                className={`py-1 px-1 text-[10px] md:text-sm font-medium rounded-md flex-1 transition-colors ${selectedWeight === weight
                                    ? 'bg-white shadow text-[var(--color-primary-green)]'
                                    : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {weight}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-base md:text-xl font-bold text-[var(--color-primary-green)]">
                            ₹{price}
                        </span>
                        {!cartItem ? (
                            <button
                                onClick={handleAddToCart}
                                className="md:hidden bg-[var(--color-primary-green)] text-white p-2 rounded-full hover:bg-[var(--color-secondary-green)] active:scale-95 transition-all shadow-md flex items-center justify-center"
                                aria-label="Add to cart"
                            >
                                <ShoppingCart size={14} />
                            </button>
                        ) : (
                            <div className="md:hidden flex items-center bg-gray-100 rounded-full border border-gray-200 shadow-sm">
                                <button
                                    onClick={handleDecrement}
                                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-l-full transition-colors"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="w-4 text-center text-xs font-bold text-gray-800">{cartItem.quantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-r-full transition-colors"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductCard);
