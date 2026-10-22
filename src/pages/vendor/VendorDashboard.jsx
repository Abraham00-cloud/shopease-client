import { useState, useEffect } from 'react';
import { Store, Package, Plus, Trash2, Tag, DollarSign, Layers } from 'lucide-react';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import { orderService } from '../../api/orderService';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      const [prodData, catData, orderData] = await Promise.all([
        productService.getAllProducts(0, 50),
        categoryService.getAllCategories(0, 50),
        orderService.getAllOrders(0, 50),
      ]);
      setProducts(prodData.content || prodData || []);
      setCategories(catData.content || catData || []);
      setOrders(orderData.content || orderData || []);
    } catch (err) {
      console.error('Failed to load vendor data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productService.createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity),
        categoryId: parseInt(newProduct.categoryId),
      });
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '' });
      fetchVendorData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      fetchVendorData();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchVendorData();
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-amber-500 rounded-2xl p-8 mb-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Store className="h-6 w-6" />
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-600 px-2.5 py-1 rounded-md">
              Vendor Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Store Management</h1>
          <p className="text-amber-100 mt-1 text-sm md:text-base">
            Manage your inventory, publish new products, and fulfill customer store orders.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-amber-700 hover:bg-amber-50 font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-colors text-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>My Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Store Orders ({orders.length})</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
        </div>
      ) : activeTab === 'products' ? (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-40 bg-slate-100 relative flex items-center justify-center">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="h-10 w-10 text-slate-300" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-black text-slate-900">₦{Number(p.price || 0).toLocaleString()}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                      Stock: {p.stockQuantity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="text-slate-400 hover:text-red-600 p-2 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">Order #{order.id}</span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Customer ID: {order.userId || 'N/A'}</p>
                <div className="font-black text-slate-900 mt-2">₦{Number(order.totalAmount || 0).toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add New Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  required
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;