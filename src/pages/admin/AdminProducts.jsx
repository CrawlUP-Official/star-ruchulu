import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Search, X, Package } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const initialFormState = {
        id: '', name: '', category: 'Veg Pickles', region: 'Andhra', spiceLevel: 3,
        image: '/images/placeholder.jpg', imageFile: null, price: 0, stock: 100, isBestSeller: false,
        pricePerWeight: { '250g': 150, '500g': 280, '1kg': 550 }
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            alert("Error loading products");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleBestSeller = async (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        try {
            const weights = Object.entries(product.pricePerWeight).map(([w, p]) => ({ weight: w, price: p }));
            const payload = {
                productData: {
                    name: product.name,
                    category: product.category,
                    region: product.region,
                    spice_level: product.spiceLevel,
                    image_url: product.image,
                    shelf_life: product.shelfLife || '12 Months',
                    storage: product.storage || 'Dry place',
                    is_best_seller: !product.isBestSeller
                },
                weights
            };
            await api.put(`/products/${id}`, payload);
            await fetchProducts();
        } catch (err) {
            alert('Failed to update Best Seller status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                await fetchProducts();
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    };

    const openAddModal = () => {
        setFormData({ ...initialFormState, id: '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        // Transform the object for edit form
        setFormData({
            id: product.id,
            name: product.name,
            category: product.category,
            region: product.region,
            spiceLevel: product.spiceLevel,
            image: product.image || '/images/placeholder.jpg',
            imageFile: null,
            price: product.price || 0,
            stock: 100,
            isBestSeller: product.isBestSeller,
            pricePerWeight: product.pricePerWeight || {}
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const weights = Object.entries(formData.pricePerWeight).map(([w, p]) => ({ weight: w, price: p }));
            const productData = {
                name: formData.name,
                category: formData.category,
                region: formData.region,
                spice_level: formData.spiceLevel,
                image_url: formData.image, // fallback
                shelf_life: '6 Months',
                storage: 'Cool dry place',
                is_best_seller: formData.isBestSeller
            };

            const payload = new FormData();
            payload.append('productData', JSON.stringify(productData));
            payload.append('weights', JSON.stringify(weights));

            if (formData.imageFile) {
                payload.append('image', formData.imageFile);
            }

            if (isEditing) {
                await api.put(`/products/${formData.id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/products', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            await fetchProducts();
            setIsModalOpen(false);
        } catch (err) {
            alert('Failed to save product');
        }
    };

    const handleWeightChange = (weight, value) => {
        setFormData({
            ...formData,
            pricePerWeight: { ...formData.pricePerWeight, [weight]: Number(value) }
        });
    };

    // Filter Logic
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[var(--color-primary-green)]">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your inventory, pricing, and active listings.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary-green)] text-[var(--color-primary-gold)] rounded-xl font-bold hover:bg-[var(--color-secondary-green)] shadow-md transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 pb-2 md:pb-0 overflow-x-auto hide-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-[var(--color-primary-green)] text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[var(--color-primary-green)]'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4 pl-6">Product Info</th>
                                <th className="p-4">Region & Spice</th>
                                <th className="p-4">Pricing (Variants)</th>
                                <th className="p-4">Best Seller</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                                            {product.image ? (
                                                <img src={product.image} className="w-full h-full object-cover" alt="Product" onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder.jpg"; }} />
                                            ) : (
                                                <Package size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 line-clamp-1">{product.name}</div>
                                            <div className="text-xs text-gray-500 mt-1 font-medium">{product.category}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-bold text-gray-700">{product.region}</div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < product.spiceLevel ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-bold text-[var(--color-primary-green)] mb-1">
                                            ₹{product.pricePerWeight?.['250g'] || product.price} <span className="text-xs font-normal text-gray-500">/ 250g</span>
                                        </div>
                                        <div className="text-xs font-medium text-gray-400">
                                            {product.pricePerWeight ? Object.keys(product.pricePerWeight).join(', ') : 'Standard'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleBestSeller(product.id)}
                                            className={`w-12 h-6 rounded-full relative transition-colors shadow-inner ${product.isBestSeller ? 'bg-[var(--color-primary-gold)] border border-transparent' : 'bg-gray-200 border border-gray-300'}`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${product.isBestSeller ? 'left-[26px]' : 'left-[2px]'}`}></div>
                                        </button>
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-bold flex items-center gap-1 text-sm border border-transparent hover:border-blue-100">
                                                <Edit2 size={16} /> <span className="hidden xl:inline">Edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold flex items-center gap-1 text-sm border border-transparent hover:border-red-100">
                                                <Trash2 size={16} /> <span className="hidden xl:inline">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No products found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[var(--color-bg-alt)]">
                            <h2 className="text-xl font-heading font-bold text-[var(--color-primary-green)]">
                                {isEditing ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="productForm" onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name <span className="text-red-500">*</span></label>
                                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category <span className="text-red-500">*</span></label>
                                            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all">
                                                <option value="Veg Pickles">Veg Pickles</option>
                                                <option value="Non-Veg Pickles">Non-Veg Pickles</option>
                                                <option value="Sweets">Sweets</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Region</label>
                                            <input type="text" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all" placeholder="e.g. Palnadu" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Spice Level (1-5)</label>
                                            <input type="number" min="1" max="5" required value={formData.spiceLevel} onChange={e => setFormData({ ...formData, spiceLevel: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-[var(--color-bg-alt)] rounded-2xl border border-gray-100">
                                            <label className="block text-xs font-bold text-[var(--color-primary-green)] uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Pricing Variants <span className="text-red-500">*</span></label>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-16 text-sm font-bold text-gray-600">250g:</span>
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                        <input type="number" required min="0" value={formData.pricePerWeight['250g'] || ''} onChange={e => handleWeightChange('250g', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:border-[var(--color-primary-green)]" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-16 text-sm font-bold text-gray-600">500g:</span>
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                        <input type="number" min="0" value={formData.pricePerWeight['500g'] || ''} onChange={e => handleWeightChange('500g', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:border-[var(--color-primary-green)]" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-16 text-sm font-bold text-gray-600">1kg:</span>
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                        <input type="number" min="0" value={formData.pricePerWeight['1kg'] || ''} onChange={e => handleWeightChange('1kg', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:border-[var(--color-primary-green)]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Image (JPG only, Max 5MB)</label>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg"
                                                onChange={e => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
                                                            alert('Only JPG/JPEG files are allowed');
                                                            e.target.value = '';
                                                            return;
                                                        }
                                                        if (file.size > 5 * 1024 * 1024) {
                                                            alert('File size exceeds 5MB limit');
                                                            e.target.value = '';
                                                            return;
                                                        }
                                                        const previewUrl = URL.createObjectURL(file);
                                                        setFormData({ ...formData, imageFile: file, image: previewUrl });
                                                    }
                                                }}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary-green)]/20 focus:border-[var(--color-primary-green)] outline-none transition-all"
                                            />
                                            {formData.image && (
                                                <div className="mt-4 w-32 h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                            <button form="productForm" type="submit" className="px-5 py-2.5 bg-[var(--color-primary-green)] text-[var(--color-primary-gold)] font-bold rounded-xl hover:bg-[var(--color-secondary-green)] shadow-md transition-colors">
                                {isEditing ? 'Save Changes' : 'Create Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
