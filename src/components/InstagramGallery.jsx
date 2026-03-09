import { Instagram } from 'lucide-react';

const galleryImages = [
    '/images/gallery1.jpg',
    '/images/gallery2.jpg',
    '/images/gallery3.jpg',
    '/images/gallery4.jpg',
];

const InstagramGallery = () => {
    return (
        <section className="py-8 md:py-12 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-[var(--color-primary-green)] flex items-center gap-3">
                        <Instagram className="text-[var(--color-primary-green)]" /> Follow Us @StarRuchulu
                    </h2>
                    <p className="text-gray-500 font-body mt-2">Tag your meals to get featured!</p>
                </div>
                <a href="https://instagram.com/starruchulu" target="_blank" rel="noopener noreferrer" className="hidden md:block py-2 px-6 border border-gray-300 rounded-full font-bold hover:bg-gray-100 transition-colors">
                    View Profile
                </a>
            </div>

            <div className="flex w-full overflow-x-auto pb-4 gap-2 md:gap-4 px-4 snap-x snap-mandatory hide-scroll-bar">
                {galleryImages.map((img, index) => (
                    <a href="https://instagram.com/starruchulu" target="_blank" rel="noopener noreferrer" key={index} className="flex-none w-64 md:w-80 aspect-square snap-center relative group overflow-hidden bg-gray-100 rounded-lg block">
                        <img src={img} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Instagram className="text-white w-12 h-12" />
                        </div>
                    </a>
                ))}
                {/* Fillers if there's less images to show grid */}
                {[...Array(4 - galleryImages.length)].map((_, index) => (
                    <div key={`empty-${index}`} className="flex-none w-64 md:w-80 aspect-square snap-center relative bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                        <Instagram className="text-gray-300 w-12 h-12" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InstagramGallery;
