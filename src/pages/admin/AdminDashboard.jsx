import { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Trash2, Tag, Layers, Users } from 'lucide-react';
import { categoryService } from '../../api/categoryService';
import { productService } from '../../api/productService';
import { orderService } from '../../api/orderService';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [catData, prodData, orderData] = await Promise.all([
        categoryService.getAllCategories(0, 50),
        productService.getAllProducts(0, 50),
        orderService.getAllOrders(0, 50),
      ]);
      setCategories(catData.content || catData || []);
      setProducts(prodData.content || prodData || []);
      setOrders(orderData.content || orderData || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryService.createCategory({
        name: newCategoryName,
        description: newCategoryDesc,
      });
      setShowCatModal(false);
      setNewCategoryName('');
      setNewCategoryDesc('');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this global category?')) return;
    try {
      await categoryService.deleteCategory(id);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete category. Ensure no products are attached to it.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-indigo-900 rounded-2xl p-8 mb-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-6 w-6 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-800 text-indigo-200 px-2.5 py-1 rounded-md">
              Platform Admin Panel
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Oversight</h1>
          <p className="text-indigo-200 mt-1 text-sm md:text-base">
            Manage global product categories, monitor vendor listings, and track marketplace order volume.
          </p>
        </div>

        <button
          onClick={() => setShowCatModal(true)}
          className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-colors text-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Add Global Category</span>
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Categories</span>
            <span className="text-2xl font-black text-slate-900">{categories.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Products</span>
            <span className="text-2xl font-black text-slate-900">{products.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Orders</span>
            <span className="text-2xl font-black text-slate-900">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <h2 className="text-xl font-bold text-slate-900 mb-4">Global Categories Management</h2>
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{cat.description || 'No description provided'}</p>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                title="Delete Category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create Global Category</h2>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Electronics, Fashion"
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Brief summary of category..."
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;