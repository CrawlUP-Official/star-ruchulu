import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { Filter, ChevronDown } from 'lucide-react';

const categories = ['All', 'Veg Pickles', 'Non-Veg Pickles', 'Sweets', 'Snacks', 'Fryums', 'Curries', 'Palnadu', 'Rayalaseema', 'Godavari', 'Coastal Andhra'];
const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Spice Level'];

const Shop = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [activeCategory, setActiveCategory] = useState(category || 'All');
    const [activeSort, setActiveSort] = useState('Recommended');
    const [showFilters, setShowFilters] = useState(false);

    // Backend State
    const [baseProducts, setBaseProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [category]);

    useEffect(() => {
        setActiveCategory(category || 'All');
    }, [category]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setBaseProducts(res.data);
                setIsLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load products');
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const products = useMemo(() => {
        let filtered = [...baseProducts];

        // Search
        if (searchQuery) {
            const normalizedQuery = searchQuery.toLowerCase()
                .replace(/pickels/g, 'pickle')
                .replace(/pickel/g, 'pickle');

            const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);

            filtered = filtered.map(p => {
                const searchableText = [
                    p.name,
                    p.category,
                    ...(p.ingredients || [])
                ].join(' ').toLowerCase();

                let score = 0;
                queryWords.forEach(word => {
                    if (searchableText.includes(word)) {
                        score += 1;
                    }
                });

                return { ...p, _searchScore: score };
            }).filter(p => p._searchScore > 0);
        }

        // Filter
        if (activeCategory !== 'All') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        // Sort
        switch (activeSort) {
            case 'Price: Low to High':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'Spice Level':
                filtered.sort((a, b) => (b.spiceLevel || 0) - (a.spiceLevel || 0));
                break;
            default: // Recommended
                if (searchQuery) {
                    filtered.sort((a, b) => {
                        if (b._searchScore !== a._searchScore) {
                            return b._searchScore - a._searchScore; // Best match first
                        }
                        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
                    });
                } else {
                    filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
                }
        }

        return filtered;
    }, [baseProducts, activeCategory, activeSort, searchQuery]);

    return (
        <div className="bg-[var(--color-bg-white)] min-h-screen pt-2 md:pt-4 pb-16 md:pb-20">
            {/* Banner */}
            <div className="bg-[var(--color-primary-green)] text-white py-6 md:py-16 text-center shadow-inner">
                <h1 className="text-2xl md:text-5xl font-heading font-bold mb-2 md:mb-4 drop-shadow-md">
                    {searchQuery ? `Search: "${searchQuery}"` : (activeCategory === 'All' ? 'Our Menu' : activeCategory)}
                </h1>
                <p className="text-white/80 font-body text-xs md:text-lg max-w-2xl mx-auto px-4">
                    Authentic homemade flavors prepared with traditional recipes. No preservatives, 100% natural.
                </p>
            </div>

            <div className="container mx-auto px-4 md:px-8 mt-4 md:mt-8">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-8">

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden flex justify-between items-center mb-2 md:mb-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
                        <span className="font-bold text-gray-700 text-sm md:text-base">{products.length} Products</span>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 md:px-4 md:py-2 rounded-md font-medium text-xs md:text-sm"
                        >
                            <Filter size={16} className="md:w-[18px] md:h-[18px]" /> Filters
                        </button>
                    </div>

                    {/* Sidebar / Filters */}
                    <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100 sticky top-28">
                            <h3 className="font-heading font-bold text-2xl text-[var(--color-primary-green)] mb-6 pb-4 border-b border-gray-100">
                                Categories
                            </h3>
                            <ul className="space-y-3 font-body">
                                <li>
                                    <Link
                                        to={searchQuery ? `/shop?search=${searchQuery}` : '/shop'}
                                        onClick={() => setShowFilters(false)}
                                        className={`block px-3 py-2 rounded-lg transition-colors text-lg ${activeCategory === 'All'
                                            ? 'bg-[var(--color-primary-green)] text-white font-bold shadow-md'
                                            : 'text-gray-600 hover:bg-red-50 hover:text-[var(--color-primary-green)]'
                                            }`}
                                    >
                                        All
                                    </Link>
                                </li>
                                {categories.filter(c => c !== 'All').map(cat => (
                                    <li key={cat}>
                                        <Link
                                            to={searchQuery ? `/shop/${cat}?search=${searchQuery}` : `/shop/${cat}`}
                                            className={`block px-3 py-2 rounded-lg transition-colors text-lg ${activeCategory === cat
                                                ? 'bg-[var(--color-primary-green)] text-white font-bold shadow-md'
                                                : 'text-gray-600 hover:bg-red-50 hover:text-[var(--color-primary-green)]'
                                                }`}
                                            onClick={() => setShowFilters(false)}
                                        >
                                            {cat}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <h3 className="font-heading font-bold text-2xl text-[var(--color-primary-green)] mt-10 mb-6 pb-4 border-b border-gray-100">
                                Sort By
                            </h3>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-[var(--color-primary-green)] font-medium font-body focus:ring-2 focus:ring-red-100 transition-shadow"
                                    value={activeSort}
                                    onChange={(e) => setActiveSort(e.target.value)}
                                >
                                    {sortOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:w-3/4">
                        {isLoading ? (
                            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                                        <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                        <div className="mt-auto h-10 w-full bg-gray-200 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-500 p-8 rounded-2xl text-center border border-red-100 font-bold">
                                {error}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <Filter size={40} className="text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">We couldn't find any items matching your current filters.</p>
                                <Link to="/shop" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="px-6 py-3 bg-[var(--color-primary-green)] text-white rounded-full font-bold">
                                    Clear Filters
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {products.length > 0 && (
                            <div className="mt-8 md:mt-16 text-center">
                                <button className="px-6 py-2.5 md:px-8 md:py-3 border-2 border-[var(--color-primary-gold)] text-[var(--color-text-primary)] rounded-full font-bold hover:bg-[var(--color-primary-gold)] transition-colors shadow-sm text-sm md:text-base">
                                    Load More Products
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Shop;
