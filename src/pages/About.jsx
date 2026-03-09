import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Users, MapPin } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white min-h-screen pt-4 pb-24">
            {/* Banner */}
            <div className="bg-gray-900 text-white py-8 md:py-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img src="/images/andhra-food-hero.jpg" alt="About Hero" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="container relative z-20 mx-auto px-4 max-w-3xl">
                    <h1 className="text-3xl md:text-6xl font-heading font-bold mb-4 md:mb-6 text-[var(--color-primary-gold)]">Our Story</h1>
                    <p className="font-body text-base md:text-xl text-gray-300 leading-relaxed px-4 md:px-0">
                        From a humble kitchen in Macherla to dining tables across India, reviving the lost art of traditional Andhra culinary recipes.
                    </p>
                </div>
            </div>

            {/* Origin Story */}
            <div className="container mx-auto px-4 md:px-8 mt-10 md:mt-20 mb-12 md:mb-24 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
                    <div className="md:w-1/2">
                        <h2 className="text-2xl md:text-4xl font-heading font-bold text-[var(--color-primary-green)] mb-4 md:mb-6">The Roots of Star Ruchulu</h2>
                        <p className="text-gray-600 font-body text-sm md:text-lg mb-4 md:mb-6 leading-relaxed">
                            Star Ruchulu was born from a simple desire: to preserve the authentic taste of homemade Andhra delicacies that are slowly being replaced by commercially manufactured products.
                        </p>
                        <p className="text-gray-600 font-body text-sm md:text-lg mb-4 md:mb-6 leading-relaxed">
                            Located in the historic town of Macherla in the Palnadu district, our kitchen operates entirely differently from a factory. We don't use large industrial machines. Instead, we rely on the skilled hands of local women who have been perfecting these recipes for decades.
                        </p>
                        <div className="mt-6 md:mt-10 p-5 md:p-6 bg-[var(--color-bg-white)] rounded-2xl border-l-4 border-[var(--color-primary-gold)]">
                            <p className="text-[var(--color-primary-green)] font-heading font-medium text-lg md:text-xl italic leading-relaxed">
                                "We don't make food for customers. We make food for family that we just haven't met yet."
                            </p>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                            <img src="/images/andhra-food-hero.jpg" alt="Traditional Preparation" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-red-50 rounded-full blur-2xl -z-0"></div>
                        <div className="absolute -top-8 -right-8 w-64 h-64 bg-yellow-50 rounded-full blur-2xl -z-0"></div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-[var(--color-bg-white)] py-8 md:py-12 border-y border-gray-100">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl md:text-5xl font-heading font-bold text-[var(--color-primary-green)] mb-3 md:mb-4">Our Promise</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto font-body text-sm md:text-lg">What makes Star Ruchulu the most trusted brand for authentic Andhra foods.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 text-[var(--color-primary-green)] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-base md:text-xl font-bold font-heading text-gray-800 mb-2 md:mb-3">Zero Preservatives</h3>
                            <p className="text-gray-500 font-body text-xs md:text-base leading-tight md:leading-normal">We rely entirely on traditional preservation methods like pure oils and salt. No chemical additives.</p>
                        </div>

                        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-50 text-[var(--color-primary-gold)] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <Heart className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-base md:text-xl font-bold font-heading text-gray-800 mb-2 md:mb-3">Made with Love</h3>
                            <p className="text-gray-500 font-body text-xs md:text-base leading-tight md:leading-normal">Prepared in small batches by experienced homemakers to ensure the homemade taste remains intact.</p>
                        </div>

                        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <Users className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-base md:text-xl font-bold font-heading text-gray-800 mb-2 md:mb-3">Empowering Women</h3>
                            <p className="text-gray-500 font-body text-xs md:text-base leading-tight md:leading-normal">Our entire preparation staff comprises local women, helping them achieve financial independence.</p>
                        </div>

                        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 text-[var(--color-primary-green)] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                <MapPin className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-base md:text-xl font-bold font-heading text-gray-800 mb-2 md:mb-3">Locally Sourced</h3>
                            <p className="text-gray-500 font-body text-xs md:text-base leading-tight md:leading-normal">Spices from Guntur, jaggery from Anakapalle - we source the best raw materials directly from farmers.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="container mx-auto px-4 mt-12 md:mt-20 text-center">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-text-primary)] mb-6">Ready to taste the tradition?</h2>
                <Link to="/shop" className="inline-block px-8 py-4 md:px-10 md:py-5 bg-[var(--color-primary-green)] text-white rounded-full font-bold text-base md:text-lg hover:bg-red-800 shadow-xl hover:-translate-y-1 transform transition-all duration-300">
                    Explore Our Menu
                </Link>
            </div>

        </div>
    );
};

export default About;
