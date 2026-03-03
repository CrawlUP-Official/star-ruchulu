import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Info, LayoutList, Package, Star } from 'lucide-react';
import api from '../services/api';
import { getCart, addToCart, updateQuantity } from '../utils/cartUtils';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedWeight, setSelectedWeight] = useState('250g');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProductData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch single product
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                setSelectedWeight('250g');
                setQuantity(1);

                // Fetch all products to find related ones
                const allRes = await api.get('/products');
                const related = allRes.data.filter(p => p.category === res.data.category && p.id != id).slice(0, 4);
                setRelatedProducts(related);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('Product Not Found');
                } else {
                    setError(err.response?.data?.message || 'Failed to load product details');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    useEffect(() => {
        if (!product) return;
        const fetchCartItem = () => {
            const cart = getCart();
            const existing = cart.find(item => item.id === product.id && item.weight === selectedWeight);
            setCartItem(existing || null);
            if (!existing) setQuantity(1); // Reset placeholder quantity if removed
        };
        fetchCartItem();
        window.addEventListener('cartUpdated', fetchCartItem);
        return () => window.removeEventListener('cartUpdated', fetchCartItem);
    }, [product, selectedWeight]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-white)] pt-20 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--color-primary-green)] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-white)] pt-20 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || 'Product Not Found'}</h2>
                    <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-[var(--color-primary-green)] text-white rounded-xl font-bold transition-all shadow-md hover:-translate-y-0.5">
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const price = product.pricePerWeight?.[selectedWeight] || product.price;

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedWeight);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity, selectedWeight);
        navigate('/checkout');
    };

    return (
        <div className="bg-[var(--color-bg-white)] pt-20 md:pt-24 pb-10 md:pb-16 min-h-screen">
            <div className="container mx-auto px-4 md:px-8">

                {/* Breadcrumbs */}
                <nav className="text-sm font-medium text-gray-500 mb-8 flex gap-2">
                    <a href="/" className="hover:text-[var(--color-primary-green)] transition-colors">Home</a>
                    <span>/</span>
                    <a href="/shop" className="hover:text-[var(--color-primary-green)] transition-colors">Shop</a>
                    <span>/</span>
                    <a href={`/shop/${product.category}`} className="hover:text-[var(--color-primary-green)] transition-colors">{product.category}</a>
                    <span>/</span>
                    <span className="text-gray-900 font-bold">{product.name}</span>
                </nav>

                {/* Product Section */}
                <div className="flex flex-col lg:flex-row gap-6 md:gap-12 bg-white rounded-3xl p-5 md:p-12 shadow-md border border-[var(--color-primary-gold)]/20 mb-10 md:mb-16 relative">

                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-gold)]/10 rounded-bl-full pointer-events-none"></div>

                    {/* Images */}
                    <div className="lg:w-1/2 flex flex-col gap-4">
                        <div className="aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group relative cursor-zoom-in max-h-[300px] md:max-h-[500px]">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-125 md:group-hover:origin-center"
                            />
                            {product.isBestSeller && (
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wide">
                                    🔥 Best Seller
                                </div>
                            )}
                        </div>

                        {/* Thumbnails (Static 3 identical for demo) */}
                        <div className="flex gap-4">
                            {[1, 2, 3].map(thumb => (
                                <button key={thumb} className="w-24 aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[var(--color-primary-green)] transition-all">
                                    <img src={product.image} alt="Thumbnail relative" className="w-full h-full object-cover opacity-75 hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="lg:w-1/2 flex flex-col">
                        <h1 className="text-2xl md:text-5xl font-heading font-extrabold text-[var(--color-primary-green)] mb-2 md:mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-[var(--color-primary-gold)]">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} size={20} fill="currentColor" />
                                ))}
                            </div>
                            <span className="text-gray-500 font-medium">(24 reviews)</span>
                            <span className="text-gray-300">|</span>
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">In Stock</span>
                        </div>

                        <p className="text-gray-600 font-body text-sm md:text-lg mb-4 md:mb-8 leading-relaxed">
                            Experience the authentic taste of {product.region}. Handcrafted by expert homemakers using the finest ingredients and traditional recipes passed down through generations.
                        </p>

                        {/* Price */}
                        <div className="mb-6 md:mb-8 p-3 md:p-4 bg-red-50/50 rounded-xl border border-red-100">
                            <span className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] flex items-end gap-2">
                                ₹{price} <span className="text-sm md:text-lg text-gray-500 font-normal line-through mb-1">₹{Math.floor(price * 1.2)}</span>
                            </span>
                            <p className="text-[10px] md:text-sm text-[var(--color-primary-green)] font-medium mt-1">Inclusive of all local taxes</p>
                        </div>

                        {/* Options */}
                        <div className="space-y-6 flex-grow">

                            <div>
                                <h3 className="font-bold text-gray-800 mb-3 flex justify-between items-center">
                                    Select Weight
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {Object.keys(product.pricePerWeight).map(weight => (
                                        <button
                                            key={weight}
                                            onClick={() => setSelectedWeight(weight)}
                                            className={`py-2 px-4 md:py-3 md:px-6 rounded-xl font-bold border-2 transition-all text-sm md:text-base ${selectedWeight === weight
                                                ? 'border-[var(--color-primary-green)] bg-red-50 text-[var(--color-primary-green)] shadow-sm scale-[1.02]'
                                                : 'border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50/50'
                                                }`}
                                        >
                                            {weight}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-10 pb-6 md:pb-8 border-b border-gray-100">
                            {!cartItem ? (
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-3 md:py-4 px-4 md:px-6 border-2 border-[var(--color-primary-green)] text-[var(--color-primary-green)] hover:bg-red-50 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-sm hover:shadow"
                                >
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                            ) : (
                                <div className="flex-1 py-1.5 md:py-2 px-2 bg-green-50/50 border-2 border-[var(--color-primary-green)] rounded-xl flex justify-between items-center shadow-inner">
                                    <button
                                        onClick={() => updateQuantity(product.id, selectedWeight, cartItem.quantity - 1)}
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-[var(--color-primary-green)] hover:bg-[var(--color-primary-green)] hover:text-white rounded-lg transition-colors text-2xl font-medium"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl md:text-2xl font-bold text-[var(--color-primary-green)] px-4">{cartItem.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(product.id, selectedWeight, cartItem.quantity + 1)}
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-[var(--color-primary-green)] hover:bg-[var(--color-primary-green)] hover:text-white rounded-lg transition-colors text-2xl font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 py-3 md:py-4 px-4 md:px-6 bg-[var(--color-primary-gold)] hover:bg-yellow-400 text-gray-900 rounded-xl font-bold flex justify-center items-center transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Meta Info */}
                        <div className="mt-8 flex gap-6 text-sm font-medium text-gray-500">
                            <button className="flex items-center gap-2 hover:text-[var(--color-primary-green)] transition-colors"><Share2 size={18} /> Share</button>
                            <button className="flex items-center gap-2 hover:text-[var(--color-primary-green)] transition-colors"><Info size={18} /> Ask Question</button>
                        </div>

                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mb-10 md:mb-16 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-wrap border-b border-gray-100 bg-gray-50">
                        <button
                            className={`flex-1 min-w-[120px] md:min-w-[150px] py-4 px-4 md:py-5 md:px-6 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-2 text-xs md:text-sm ${activeTab === 'description' ? 'border-[var(--color-primary-green)] text-[var(--color-primary-green)] bg-white' : 'border-transparent text-gray-600 hover:text-[var(--color-primary-green)] hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('description')}
                        >
                            <LayoutList size={16} className="md:w-[18px] md:h-[18px]" /> Details
                        </button>
                        <button
                            className={`flex-1 min-w-[120px] md:min-w-[150px] py-4 px-4 md:py-5 md:px-6 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-2 text-xs md:text-sm ${activeTab === 'ingredients' ? 'border-[var(--color-primary-green)] text-[var(--color-primary-green)] bg-white' : 'border-transparent text-gray-600 hover:text-[var(--color-primary-green)] hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('ingredients')}
                        >
                            <Package size={16} className="md:w-[18px] md:h-[18px]" /> Ingredients
                        </button>
                        <button
                            className={`flex-1 min-w-[100px] md:min-w-[150px] py-4 px-4 md:py-5 md:px-6 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-2 text-xs md:text-sm ${activeTab === 'reviews' ? 'border-[var(--color-primary-green)] text-[var(--color-primary-green)] bg-white' : 'border-transparent text-gray-600 hover:text-[var(--color-primary-green)] hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <Star size={16} className="md:w-[18px] md:h-[18px]" /> Reviews
                        </button>
                    </div>

                    <div className="p-8 md:p-12">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none text-gray-600 leading-relaxed font-body text-lg">
                                <p className="mb-4">Experience the bold, fiery, and deeply comforting flavors of our {product.name}. Carefully prepared using a traditional recipe straight from the heart of {product.region}.</p>
                                <div className="grid md:grid-cols-2 gap-8 mt-8">
                                    <div className="bg-red-50/50 p-6 rounded-xl border border-red-100">
                                        <h4 className="font-bold text-[var(--color-primary-green)] flex items-center gap-2 mb-2"><Info size={16} /> Shelf Life</h4>
                                        <p>{product.shelfLife}</p>
                                    </div>
                                    <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                                        <h4 className="font-bold text-[var(--color-primary-green)] flex items-center gap-2 mb-2"><Package size={16} /> Storage Instructions</h4>
                                        <p>{product.storage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ingredients' && (
                            <ul className="grid grid-cols-2 gap-y-4 gap-x-8 max-w-2xl text-lg font-medium text-gray-700">
                                {product.ingredients.map((ing, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]"></div>
                                        {ing}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-8">
                                {[1, 2].map(r => (
                                    <div key={r} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-[var(--color-primary-gold)]">
                                                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                                            </div>
                                            <span className="font-bold text-[var(--color-text-primary)]">Awesome Taste!</span>
                                        </div>
                                        <p className="text-gray-600 mb-3 text-lg leading-relaxed">"This tastes exactly like the ones my grandmother used to make. The spice levels are perfect and you can taste the high quality oil and ingredients used. A masterclass in pickling."</p>
                                        <span className="text-sm text-gray-400 font-medium">Verified Buyer - 2 days ago</span>
                                    </div>
                                ))}
                                <button className="px-6 py-2 border-2 border-[var(--color-primary-green)] text-[var(--color-primary-green)] rounded-lg font-bold hover:bg-red-50 transition-colors">Write a Review</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Target Recommendations */}
                {relatedProducts.length > 0 && (
                    <div>
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Pairs Well With</h2>
                            <a href="/shop" className="text-[var(--color-primary-green)] font-bold hover:underline hidden md:block">View All</a>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                            {relatedProducts.map(rp => (
                                <ProductCard key={rp.id} product={rp} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetails;
