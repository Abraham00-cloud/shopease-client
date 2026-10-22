import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, Tag, CheckCircle2 } from 'lucide-react';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { cartService } from '../../api/cartService';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        productService.getAllProducts(0, 50),
        categoryService.getAllCategories(0, 50),
      ]);
      setProducts(prodData.content || prodData || []);
      setCategories(catData.content || catData || []);
    } catch (err) {
      console.error('Failed to load shop data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    try {
      await cartService.addItemToCart(productId, 1);
      setAddedMessage('Item added to cart!');
      setTimeout(() => setAddedMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add item to cart.');
    }
  };

  // Filter products by search term and selected category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'ALL' ||
      p.categoryName === selectedCategory ||
      p.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-indigo-600 rounded-2xl p-8 mb-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome to ShopEase</h1>
          <p className="text-indigo-100 mt-2 max-w-xl text-sm md:text-base">
            Discover quality products from verified multi-vendor stores with seamless Paystack checkout.
          </p>
        </div>
      </div>

      {/* Notification toast */}
      {addedMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span>{addedMessage}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name || cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === (cat.name || cat.id)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 8].map((n) => (
            <div key={n} className="bg-slate-200 animate-pulse rounded-2xl h-64"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Tag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No products found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {p.imageUrl || p.images?.[0]?.url ? (
                  <img
                    src={p.imageUrl || p.images[0].url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Tag className="h-12 w-12 text-slate-300" />
                )}
                {p.categoryName && (
                  <span className="absolute top-3 left-3 bg-slate-900/75 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase backdrop-blur-sm">
                    {p.categoryName}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Price</span>
                    <span className="text-lg font-black text-slate-900">
                      ₦{Number(p.price || 0).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(p.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;