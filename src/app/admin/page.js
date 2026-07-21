'use client';

import { useState, useEffect } from 'react';
import Firestore from '@/lib/firebase/Firestore';
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "@/lib/firebase/config"; 

export default function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showAddOrder, setShowAddOrder] = useState(false);
    const [updatingStock, setUpdatingStock] = useState({});

    const [authState, setAuthState] = useState({ user: null, isAdmin: false, loading: true });
    const [loginData, setLoginData] = useState({ email: '', password: ''});
    
    const firestore = new Firestore();
    const adminEmails = ["o.sweet.work@gmail.com", "felipebatista2k20@gmail.com", "atmoxhere@gmail.com"];

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthState({
                    user,
                    isAdmin: adminEmails.includes(user.email),
                    loading: false,
                });
            } else {
                setAuthState({
                    user: null,
                    isAdmin: false,
                    loading: false,
                });
            }
        });

        return unsubscribe;
    }, []);

    // Fetch data based on active tab
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            if (activeTab === 'products') {
                const data = await firestore.getAllProducts();
                setProducts(data);
            } else {
                const data = await firestore.getAllOrders();
                setOrders(data);
            }
        } catch (err) {
            setError(`Failed to fetch ${activeTab}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Only fetch data when both authenticated AND tab changes
    useEffect(() => {
        if (authState.user && authState.isAdmin && !authState.loading) {
            fetchData();
        }
    }, [activeTab, authState.user, authState.isAdmin, authState.loading]);

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setAuthState(prev => ({ ...prev, loading: true }));
            await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
            setError('');
        } catch (err) {
            setError('Login failed: ' + err.message);
            setAuthState(prev => ({ ...prev, loading: false }));
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            setError('Logout failed: ' + err.message);
        }
    };

    // Add new product
    const addProduct = async (productData) => {
        try {
            setLoading(true);
            await firestore.addProduct(productData);
            setShowAddProduct(false);
            if (activeTab === 'products') {
                await fetchData();
            }
        } catch (err) {
            setError(`Failed to add product: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Add new order
    const addOrder = async (orderData) => {
        try {
            setLoading(true);
            await firestore.addOrder(orderData);
            setShowAddOrder(false);
            if (activeTab === 'orders') {
                await fetchData();
            }
        } catch (err) {
            setError(`Failed to add order: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Mark an order as shipped
    const markShipped = async (orderId) => {
        try {
            await firestore.updateOrder(orderId, { fulfillment: 'shipped', shippedAt: new Date() });
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, fulfillment: 'shipped' } : order
            ));
        } catch (err) {
            setError(`Failed to mark shipped: ${err.message}`);
        }
    };

    // Mark an order as unfulfilled
    const markUnfulfilled = async (orderId) => {
      try {
        await firestore.updateOrder(orderId, { fulfillment: 'unfulfilled' });
        setOrders(prev => prev.map(order => 
            order.id === orderId ? { ...order, fulfillment: 'unfulfilled' } : order
        ));
      } catch (err) {
        setError(`Failed to mark as unfulfilled: ${err.message}`);
      }
    }

    // Update product stock
    const updateStock = async (productId, newStock) => {
        try {
            setUpdatingStock(prev => ({ ...prev, [productId]: true }));
            await firestore.updateProduct(productId, { stock: newStock });
            
            setProducts(prev => prev.map(product => 
                product.id === productId ? { ...product, stock: newStock } : product
            ));
        } catch (err) {
            setError(`Failed to update stock: ${err.message}`);
        } finally {
            setUpdatingStock(prev => ({ ...prev, [productId]: false }));
        }
    };

    // Show loading screen while checking auth
    if (authState.loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    // Show login form if not authenticated
    if (!authState.user || !authState.isAdmin) {
        return (
            <div className="min-h-screen bg-gray-200 flex items-center justify-center">
                <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl text-white font-bold mb-6 text-center">Admin Login</h1>
                    
                    {error && (
                        <div className="text-xs mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Admin Email"
                            required
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            disabled={authState.loading}
                            className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded"
                        >
                            {authState.loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-300 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-black tracking-wide">Admin Panel</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'products'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Products ({products.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'orders'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Orders ({orders.length})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-4 space-x-2">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                    
                    {activeTab === 'products' && (
                        <button
                            onClick={() => setShowAddProduct(true)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Product
                        </button>
                    )}
                    
                    {activeTab === 'orders' && (
                        <button
                            onClick={() => setShowAddOrder(true)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Order
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="text-gray-600">Loading {activeTab}...</div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && !loading && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Products</h2>
                        {products.length === 0 ? (
                            <div className="text-gray-400">No products found</div>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <li key={product.id} className="px-6 py-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {product.name}
                                                    </h3>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        <p>Slug: {product.slug}</p>
                                                        <p>Collection: {product.collection || 'N/A'}</p>
                                                        <p>Price: ${product.priceUSD}</p>
                                                        <p>Stock: {product.stock}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end space-y-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        product.stock > 0 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                    
                                                    {/* Stock Controls */}
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => updateStock(product.id, product.stock - 1)}
                                                            disabled={updatingStock[product.id] || product.stock <= 0}
                                                            className="w-6 h-6 bg-red-500 hover:bg-red-700 disabled:bg-gray-300 text-white text-xs rounded"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-black text-sm font-medium min-w-[30px] text-center">
                                                            {updatingStock[product.id] ? '...' : product.stock}
                                                        </span>
                                                        <button
                                                            onClick={() => updateStock(product.id, product.stock + 1)}
                                                            disabled={updatingStock[product.id]}
                                                            className="w-6 h-6 bg-green-500 hover:bg-green-700 disabled:bg-gray-300 text-white text-xs rounded"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    
                                                    <span className="text-xs text-gray-400">
                                                        ID: {product.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && !loading && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Orders</h2>
                        {orders.length === 0 ? (
                            <div className="text-gray-600">No orders found</div>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <li key={order.id} className="px-6 py-4 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        Order #{order.id.substring(0, 8)}
                                                    </h3>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        {order.customerEmail && <p>Email: {order.customerEmail}</p>}
                                                        {order.amountTotal != null && (
                                                            <p>Total: {(order.amountTotal / 100).toFixed(2)} {(order.currency || '').toUpperCase()}</p>
                                                        )}
                                                        <p>Payment: {order.paymentStatus || 'N/A'}</p>
                                                        {order.createdAt && (
                                                            <p>Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
                                                        )}
                                                        {order.lineItems && (
                                                            <p>Items: {order.lineItems.map((i) => `${i.name} x${i.quantity}`).join(', ')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end space-y-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        order.fulfillment === 'shipped'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.fulfillment === 'cancelled'
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.fulfillment || 'unfulfilled'}
                                                    </span>

                                                    {order.fulfillment !== 'shipped' && (
                                                        <button
                                                            onClick={() => markShipped(order.id)}
                                                            className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded"
                                                        >
                                                            Mark shipped
                                                        </button>
                                                    )}

                                                    {order.fulfillment == 'shipped' && (
                                                      <button
                                                        onClick={() => markUnfulfilled(order.id)}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded"
                                                      >
                                                          Mark as not shipped
                                                      </button>
                                                    )}

                                                    <span className="text-xs text-gray-400 mt-1">
                                                        ID: {order.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Product Modal */}
                {showAddProduct && <AddProductModal onAdd={addProduct} onClose={() => setShowAddProduct(false)} />}
                
                {/* Add Order Modal */}
                {showAddOrder && <AddOrderModal onAdd={addOrder} onClose={() => setShowAddOrder(false)} />}
            </div>
        </div>
    );
}

// Add Product Modal Component
function AddProductModal({ onAdd, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        priceUSD: '',
        stock: '',
        collection: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            priceUSD: parseFloat(formData.priceUSD),
            stock: parseInt(formData.stock)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg text-white font-semibold mb-4">Add New Product</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    
                    <input
                        type="text"
                        placeholder="Slug (URL-friendly)"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                    />
                    
                    <input
                        type="number"
                        placeholder="Price (USD)"
                        required
                        step="0.01"
                        value={formData.priceUSD}
                        onChange={(e) => setFormData(prev => ({ ...prev, priceUSD: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    
                    <input
                        type="number"
                        placeholder="Stock Quantity"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    
                    <input
                        type="text"
                        placeholder="Collection"
                        value={formData.collection}
                        onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Product
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Add Order Modal Component
function AddOrderModal({ onAdd, onClose }) {
    const [formData, setFormData] = useState({
        customerEmail: '',
        amountTotal: '',
        currency: 'usd',
        fulfillment: 'unfulfilled',
        items: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // parse items as JSON, or fall back to comma-separated names
        let parsedItems;
        try {
            parsedItems = formData.items ? JSON.parse(formData.items) : [];
        } catch {
            parsedItems = formData.items.split(',').map(item => ({ name: item.trim(), quantity: 1 }));
        }

        // match the shape the webhook writes so the orders list renders it the same
        onAdd({
            customerEmail: formData.customerEmail,
            amountTotal: parseInt(formData.amountTotal),
            currency: formData.currency,
            fulfillment: formData.fulfillment,
            paymentStatus: 'manual',
            lineItems: parsedItems
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Add New Order</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Customer Email"
                        required
                        value={formData.customerEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    
                    <input
                        type="number"
                        placeholder="Total in cents (e.g. 10000 = $100.00)"
                        required
                        value={formData.amountTotal}
                        onChange={(e) => setFormData(prev => ({ ...prev, amountTotal: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                    />

                    <select
                        value={formData.fulfillment}
                        onChange={(e) => setFormData(prev => ({ ...prev, fulfillment: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="unfulfilled">Unfulfilled</option>
                        <option value="shipped">Shipped</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <textarea
                        placeholder="Items (comma-separated or JSON array)"
                        value={formData.items}
                        onChange={(e) => setFormData(prev => ({ ...prev, items: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                    />
                    
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Order
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
