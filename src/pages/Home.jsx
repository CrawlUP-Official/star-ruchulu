import { Link } from 'react-router-dom';
import CategoryGrid from '../components/CategoryGrid';
import ComboSection from '../components/ComboSection';
import TestimonialSection from '../components/TestimonialSection';
import InstagramGallery from '../components/InstagramGallery';
import SubscriptionForm from '../components/SubscriptionForm';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { Leaf, Award, Recycle, Truck } from 'lucide-react';

const Home = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await api.get('/products');
                // Filter best sellers on client side
                const sellers = response.data.filter(p => p.isBestSeller);
                setBestSellers(sellers);
                setIsLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load best sellers. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    const regionals = [
        { name: 'Palnadu', image: '/images/palnadu-special.jpg', color: 'bg-red-900' },
        { name: 'Godavari', image: '/images/godavari-special.jpg', color: 'bg-green-800' },
        { name: 'Rayalaseema', image: '/images/rayalaseema-special.jpg', color: 'bg-yellow-600' },
        { name: 'Coastal Andhra', image: '/images/coastal-andhra.jpg', color: 'bg-blue-900' },
    ];

    return (
        <div className="w-full relative">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] min-h-[450px] md:min-h-[600px] flex items-center justify-start overflow-hidden bg-gray-100 bg-fixed">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/andhra-food-hero.jpg"
                        alt="Authentic Andhra Food"
                        className="w-full h-full object-cover object-right"
                        loading="eager"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

                <div className="container relative z-20 px-4 md:px-8 text-left mt-12 w-full max-w-6xl mx-auto">
                    <span className="inline-block py-1 px-4 text-xs md:text-sm font-bold tracking-widest text-[var(--color-primary-green)] border border-[var(--color-primary-gold)] rounded-full mb-6 uppercase bg-white/50 backdrop-blur-sm">
                        Premium Quality Homemade Foods
                    </span>
                    <h1 className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-[var(--color-primary-green)] mb-4 md:mb-6 leading-tight max-w-3xl">
                        Authentic Andhra Flavours <br className="hidden md:block" />
                        <span className="text-[var(--color-primary-gold)] text-xl min-[360px]:text-2xl sm:text-3xl md:text-6xl lg:text-7xl">Delivered Pan-India</span>
                    </h1>
                    <div className="w-16 h-1 bg-[var(--color-primary-gold)] mb-6 md:mb-8"></div>
                    <p className="text-sm min-[360px]:text-base md:text-2xl text-[var(--color-text-secondary)] font-body mb-8 md:mb-10 max-w-2xl drop-shadow-sm leading-relaxed">
                        Handcrafted pickles, traditional sweets, and crunchy snacks made with love from the kitchens of Palnadu.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start items-center md:items-start w-full max-w-[95vw] overflow-hidden">
                        <Link
                            to="/shop"
                            className="px-4 py-3 md:px-8 md:py-4 w-full sm:w-auto bg-[var(--color-primary-green)] hover:bg-[var(--color-secondary-green)] text-white font-bold rounded-xl text-sm min-[360px]:text-base md:text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
                        >
                            Shop Now
                        </Link>
                        <a
                            href="https://wa.me/919876543210?text=I want to order from Star Ruchulu"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-3 md:px-8 md:py-4 w-full sm:w-auto bg-white border border-[var(--color-primary-green)] text-[var(--color-primary-green)] hover:bg-gray-50 font-bold rounded-xl text-xs min-[360px]:text-sm md:text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center whitespace-normal break-words leading-tight"
                        >
                            Order on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Regional Specialties */}
            <section className="py-12 md:py-20 bg-[var(--color-bg-white)]">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl md:text-5xl font-heading font-bold text-[var(--color-primary-green)] mb-3 md:mb-4">Flavors by Region</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto font-body text-sm md:text-lg">Every district in Andhra Pradesh has a unique culinary story. Explore our distinct regional offerings.</p>
                    </div>

                    <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-8 overflow-x-auto pb-6 snap-x snap-mandatory hide-scroll-bar -mx-4 px-4 md:mx-0 md:px-0">
                        {regionals.map((region) => (
                            <Link to="/shop" key={region.name} className="flex-none w-[80%] sm:w-[45%] md:w-auto snap-center group overflow-hidden rounded-2xl relative aspect-[4/5] md:aspect-[3/4] shadow-md hover:shadow-2xl transition-all duration-500">
                                <img
                                    src={region.image}
                                    alt={region.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }}
                                />
                                <div className={`absolute inset-0 ${region.color} opacity-40 mix-blend-multiply transition-opacity group-hover:opacity-60`}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">{region.name}</h3>
                                    <span className="text-[var(--color-primary-gold)] font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                                        Explore <span className="text-xl">→</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Grid */}
            <CategoryGrid />

            {/* Best Sellers */}
            <section className="py-12 md:py-24 bg-[var(--color-bg-white)] relative">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16">
                        <div className="text-center md:text-left w-full">
                            <h2 className="text-2xl md:text-5xl font-heading font-bold text-[var(--color-primary-green)] mb-3 md:mb-4">Our Best Sellers</h2>
                            <p className="text-gray-600 font-body text-sm md:text-lg max-w-xl mx-auto md:mx-0">
                                The most loved recipes that keep our customers coming back for more. Must-try for first timers!
                            </p>
                        </div>
                        <Link to="/shop" className="hidden md:inline-flex mt-6 md:mt-0 px-6 py-3 border-2 border-[var(--color-primary-green)] text-[var(--color-primary-green)] rounded-full font-bold hover:bg-[var(--color-primary-green)] hover:text-white transition-colors">
                            View Entire Menu
                        </Link>
                    </div>

                    <div className="flex justify-start md:grid md:grid-cols-4 gap-4 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scroll-bar -mx-4 px-4 md:mx-0 md:px-0">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex-none w-[80%] sm:w-[45%] md:w-auto snap-center animate-pulse">
                                    <div className="bg-gray-200 aspect-square rounded-2xl mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded-full w-full"></div>
                                </div>
                            ))
                        ) : error ? (
                            <div className="col-span-full text-center py-10 bg-red-50 text-red-500 rounded-2xl border border-red-100 w-full">
                                {error}
                            </div>
                        ) : bestSellers.length > 0 ? (
                            bestSellers.map(product => (
                                <div key={product.id} className="flex-none w-[80%] sm:w-[45%] md:w-auto snap-center">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 bg-gray-50 text-gray-500 rounded-2xl border border-gray-100 w-full">
                                No best sellers currently available.
                            </div>
                        )}
                    </div>
                    <div className="mt-10 text-center md:hidden">
                        <Link to="/shop" className="inline-block px-8 py-4 border-2 border-[var(--color-primary-green)] text-[var(--color-primary-green)] rounded-full font-bold hover:bg-[var(--color-primary-green)] hover:text-white transition-colors">
                            View Entire Menu
                        </Link>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-12 md:py-24 bg-white border-y border-gray-100">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-5xl font-heading font-bold text-[var(--color-primary-green)] mb-3 md:mb-4">From Our Kitchen To You</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto font-body text-sm md:text-lg">Our commitment to quality, tradition, and taste in every step.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative">
                        <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-1 bg-yellow-100 -z-10"></div>

                        <div className="text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-[var(--color-primary-green)] mb-6 shadow-sm border border-green-100">
                                <Leaf size={32} />
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-3">Handpicked Ingredients</h3>
                            <p className="text-gray-500 text-sm">Finest quality spices and farm-fresh produce.</p>
                        </div>

                        <div className="text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[var(--color-primary-green)] mb-6 shadow-sm border border-red-100">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-3">Traditional Preparation</h3>
                            <p className="text-gray-500 text-sm">Authentic recipes passed down through generations.</p>
                        </div>

                        <div className="text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 shadow-sm border border-blue-100">
                                <Recycle size={32} />
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-3">Hygienic Packaging</h3>
                            <p className="text-gray-500 text-sm">Sealed with zero preservatives to lock in freshness.</p>
                        </div>

                        <div className="text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mb-6 shadow-sm border border-yellow-100">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-3">Delivered Fresh</h3>
                            <p className="text-gray-500 text-sm">Fast and secure Pan-India delivery to your doorstep.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges Strip */}
            <div className="bg-gray-50 border-y border-gray-200 py-6 overflow-x-auto hide-scroll-bar whitespace-nowrap">
                <div className="flex items-center justify-center gap-8 md:gap-16 px-4 font-bold text-gray-700 uppercase tracking-widest text-xs md:text-sm">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]"></div>FSSAI Certified</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]"></div>100% Homemade</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]"></div>No Preservatives</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]"></div>Secure Payments</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]"></div>Pan-India Shipping</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]"></div>Cash on Delivery</span>
                </div>
            </div>

            <ComboSection />
            <TestimonialSection />
            <InstagramGallery />
            <SubscriptionForm />

        </div>
    );
};

export default Home;
