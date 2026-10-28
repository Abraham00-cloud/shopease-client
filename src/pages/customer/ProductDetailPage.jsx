import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle2, Tag, Store } from 'lucide-react';
import { productService } from '../../api/productService';
import { cartService } from '../../api/cartService';
import { useAuth } from '../../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
      
      // Determine initial display image URL
      const primaryUrl = data?.images?.[0]?.url || data?.imageUrl || '';
      setSelectedImageUrl(primaryUrl);
    } catch (err) {
      console.error('Failed to load product details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      await cartService.addItemToCart(product.id, quantity);
      setAddedMessage('Item added to cart!');
      setTimeout(() => setAddedMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          The requested product may have been removed or does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  // Combine single imageUrl fallback with images list
  const allImages = product.images && product.images.length > 0
    ? product.images.map((img) => img.url)
    : product.imageUrl ? [product.imageUrl] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast Notification */}
      {addedMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span>{addedMessage}</span>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        {/* Product Image Viewer & Gallery */}
        <div className="space-y-4">
          <div className="h-80 md:h-96 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative border border-slate-100">
            {selectedImageUrl ? (
              <img
                src={selectedImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Tag className="h-16 w-16 text-slate-300" />
            )}
          </div>

          {/* Thumbnail Gallery (if product has multiple images) */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageUrl(imgUrl)}
                  className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageUrl === imgUrl ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {product.categoryName && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md inline-block mb-2">
                {product.categoryName}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {product.name}
            </h1>
            <div className="text-2xl font-black text-slate-900 mt-3">
              ₦{Number(product.price || 0).toLocaleString()}
            </div>
            <p className="text-slate-600 text-sm mt-4 leading-relaxed">
              {product.description || 'No description provided for this product.'}
            </p>

            {/* Vendor / Stock Metadata */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Store className="h-4 w-4 text-slate-400" />
                <span>Vendor ID: {product.vendorId || product.createdById || 'Official Store'}</span>
              </span>
              <span>
                In Stock:{' '}
                <strong className="text-slate-800">{product.stockQuantity ?? 'Available'}</strong>
              </span>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-700">Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;