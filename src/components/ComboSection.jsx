import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Plus, Minus } from 'lucide-react';
import { getCart, addToCart, updateQuantity } from '../utils/cartUtils';

import api from '../services/api';

const ComboCard = ({ combo }) => {
    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        const fetchCartItem = () => {
            const cart = getCart();
            const existing = cart.find(item => item.id === `combo-${combo.id}` && item.weight === "Combo");
            setCartItem(existing || null);
        };
        fetchCartItem();
        window.addEventListener('cartUpdated', fetchCartItem);
        return () => window.removeEventListener('cartUpdated', fetchCartItem);
    }, [combo.id]);

    const handleAdd = () => {
        const comboProduct = {
            id: `combo-${combo.id}`,
            name: combo.name,
            image: combo.image_url || combo.image,
            spiceLevel: 0,
            pricePerWeight: { "Combo": combo.price }
        };
        addToCart(comboProduct, 1, "Combo");
    };

    return (
        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100 flex flex-col h-full transform hover:-translate-y-2 relative">
            <div className="absolute top-0 right-4 md:right-8 bg-[var(--color-primary-gold)] text-gray-900 font-bold text-[10px] md:text-xs px-3 py-1 md:px-4 md:py-1.5 rounded-b-lg shadow-md uppercase tracking-wider">
                {combo.tag}
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 mt-4">
                <img src={combo.image_url || combo.image} alt={combo.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 bg-gray-100" onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }} />
            </div>

            <h3 className="text-xl md:text-2xl font-bold font-heading text-[var(--color-text-primary)] mb-2 md:mb-3">{combo.name}</h3>
            <p className="text-gray-500 mb-4 md:mb-6 flex-grow text-sm md:text-base leading-tight md:leading-normal">{combo.description}</p>

            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                    <span className="text-gray-400 line-through text-xs md:text-sm mr-2">₹{combo.original_price || combo.originalPrice}</span>
                    <span className="text-2xl md:text-3xl font-bold text-[var(--color-primary-green)]">₹{combo.price}</span>
                </div>
                <div className="bg-green-100 text-green-800 text-[10px] md:text-xs font-bold px-2 py-1 rounded">
                    Save ₹{(combo.original_price || combo.originalPrice) - combo.price}
                </div>
            </div>

            {!cartItem ? (
                <button
                    className="w-full py-3 md:py-4 bg-[var(--color-text-primary)] hover:bg-[var(--color-primary-green)] text-white rounded-xl font-bold text-sm md:text-lg transition-colors flex justify-center items-center gap-2"
                    onClick={handleAdd}
                >
                    Add Combo to Cart
                </button>
            ) : (
                <div className="w-full py-2.5 md:py-3.5 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center px-4 shadow-inner">
                    <button
                        onClick={() => updateQuantity(`combo-${combo.id}`, "Combo", cartItem.quantity - 1)}
                        className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <Minus size={20} />
                    </button>
                    <span className="text-lg font-bold text-[var(--color-text-primary)] px-4">{cartItem.quantity}</span>
                    <button
                        onClick={() => updateQuantity(`combo-${combo.id}`, "Combo", cartItem.quantity + 1)}
                        className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

const ComboSection = () => {
    const [combos, setCombos] = useState([]);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const res = await api.get('/combos');
                setCombos(res.data);
            } catch (err) {
                console.error("Failed to load combos", err);
            }
        };
        fetchCombos();
    }, []);

    return (
        <section className="py-8 md:py-12 bg-[var(--color-bg-white)] overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12">
                    <div className="max-w-xl text-center md:text-left">
                        <h2 className="text-2xl md:text-5xl font-heading font-bold text-[var(--color-primary-green)] mb-3 md:mb-4 flex items-center justify-center md:justify-start gap-3">
                            Special Combos <Gift className="text-[var(--color-primary-gold)] w-6 h-6 md:w-8 md:h-8" />
                        </h2>
                        <p className="text-gray-600 font-body text-sm md:text-lg">
                            Curated packs for family gatherings and festive gifting. Save big on authentic flavors!
                        </p>
                    </div>
                    <Link to="/shop" className="hidden md:inline-flex mt-6 md:mt-0 font-bold border-b-2 border-[var(--color-primary-green)] text-[var(--color-primary-green)] hover:text-red-900 transition-colors pb-1">
                        View All Offers
                    </Link>
                </div>

                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scroll-bar -mx-4 px-4 md:mx-0 md:px-0">
                    {combos.map((combo) => (
                        <div key={combo.id} className="flex-none w-[85%] sm:w-[60%] md:w-auto snap-center">
                            <ComboCard combo={combo} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ComboSection;
