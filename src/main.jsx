
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search,
  MapPin,
  Plus,
  Heart,
  ArrowRight,
  Recycle,
  ShieldCheck,
  Truck,
  MessageCircle,
  Menu,
  X,
  User,
  Tag,
  Package,
  Send,
  Check,
  CheckCircle,
  XCircle,
  RefreshCw,
  IndianRupee,
  Wallet,
  Clock,
  ChevronLeft,
  LayoutDashboard,
 Users,
 ShoppingBag,
CreditCard,
AlertTriangle,
BarChart3,
Settings,
Trash2,
Eye
} from 'lucide-react';
import './index.css';
import { supabase } from './lib/supabaseClient';

const demoProducts = [
  {
    id: 1,
    title: 'Lenovo ThinkPad Laptop',
    category: 'Laptops',
    price: 18000,
    condition: 'Good',
    location: 'Patiala, Punjab',
    seller: 'Rahul S.',
    icon: '💻',
    color: 'blue',
    description:
      'Reliable Lenovo ThinkPad suitable for students and everyday work.',
    specs: 'Intel Core i5 · 8GB RAM · 256GB SSD'
  },
  {
    id: 2,
    title: 'Samsung Galaxy S21',
    category: 'Phones',
    price: 14500,
    condition: 'Like new',
    location: 'Amritsar, Punjab',
    seller: 'Aman K.',
    icon: '📱',
    color: 'purple',
    description:
      'A pre-owned Samsung Galaxy S21 in excellent working condition.',
    specs: '8GB RAM · 128GB Storage · 5G'
  },
  {
    id: 3,
    title: 'Dell 24-inch Monitor',
    category: 'Monitors',
    price: 6500,
    condition: 'Good',
    location: 'Chandigarh',
    seller: 'Neha M.',
    icon: '🖥️',
    color: 'green',
    description:
      'A Dell monitor ideal for study setups, offices, and gaming.',
    specs: '24-inch Display · Full HD · HDMI'
  },
  {
    id: 4,
    title: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 1800,
    condition: 'Used',
    location: 'Ludhiana, Punjab',
    seller: 'Arjun P.',
    icon: '⌨️',
    color: 'orange',
    description:
      'Mechanical keyboard for typing, coding, and gaming.',
    specs: 'Mechanical Switches · USB Connection'
  },
  {
    id: 5,
    title: 'HP Laser Printer',
    category: 'Printers',
    price: 4200,
    condition: 'Fair',
    location: 'Jalandhar, Punjab',
    seller: 'Simran K.',
    icon: '🖨️',
    color: 'pink',
    description:
      'Used HP laser printer for home and small office requirements.',
    specs: 'Laser Printing · USB Connectivity'
  },
  {
    id: 6,
    title: 'Apple MacBook Air',
    category: 'Laptops',
    price: 42000,
    condition: 'Good',
    location: 'Mohali, Punjab',
    seller: 'Karan D.',
    icon: '💻',
    color: 'indigo',
    description:
      'Apple MacBook Air M1 for students, developers, and professionals.',
    specs: 'Apple M1 · 8GB RAM · 256GB SSD'
  }
];

const categories = [
  'All',
  'Laptops',
  'Phones',
  'Monitors',
  'Accessories',
  'Printers'
];

const initialMessages = [
  {
    id: 1,
    sender: 'seller',
    text: 'Hello! Thanks for your interest in this product.',
    time: '10:30 AM',
    type: 'text'
  },
  {
    id: 2,
    sender: 'buyer',
    text: 'Hi! Is the device working properly? Could you share more details about its condition?',
    time: '10:31 AM',
    type: 'text'
  },
  {
    id: 3,
    sender: 'seller',
    text: 'Yes, it is working properly. I can share more specifications and photos before we finalize the deal.',
    time: '10:32 AM',
    type: 'text'
  }
];

function formatPrice(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', status: 'Active' },
    { id: 2, name: 'Aman Kumar', email: 'aman@example.com', status: 'Active' },
    { id: 3, name: 'Neha Mehta', email: 'neha@example.com', status: 'Blocked' }
  ]);

  const [listings, setListings] = useState([
    { id: 1, name: 'Lenovo ThinkPad Laptop', seller: 'Rahul Sharma', status: 'Approved' },
    { id: 2, name: 'Samsung Galaxy S21', seller: 'Aman Kumar', status: 'Pending' },
    { id: 3, name: 'Dell Monitor', seller: 'Neha Mehta', status: 'Approved' }
  ]);

  const blockUser = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'Blocked' ? 'Active' : 'Blocked'
            }
          : user
      )
    );
  };

  const approveListing = (id) => {
    setListings((currentListings) =>
      currentListings.map((listing) =>
        listing.id === id
          ? { ...listing, status: 'Approved' }
          : listing
      )
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <span className="section-kicker">ECOTRACK CONTROL CENTER</span>
          <h1>Admin Dashboard</h1>
          <p>Manage users, listings, orders, and platform activity.</p>
        </div>

        <button className="secondary-button" onClick={onBack}>
          <ArrowRight size={17} />
          Back to Marketplace
        </button>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button
            className={activeTab === 'overview' ? 'admin-nav active' : 'admin-nav'}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            className={activeTab === 'users' ? 'admin-nav active' : 'admin-nav'}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Users
          </button>

          <button
            className={activeTab === 'listings' ? 'admin-nav active' : 'admin-nav'}
            onClick={() => setActiveTab('listings')}
          >
            <ShoppingBag size={18} />
            Listings
          </button>

          <button
            className={activeTab === 'orders' ? 'admin-nav active' : 'admin-nav'}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} />
            Orders
          </button>

          <button
            className={activeTab === 'payments' ? 'admin-nav active' : 'admin-nav'}
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard size={18} />
            Payments
          </button>

          <button
            className={activeTab === 'disputes' ? 'admin-nav active' : 'admin-nav'}
            onClick={() => setActiveTab('disputes')}
          >
            <AlertTriangle size={18} />
            Disputes
          </button>
        </aside>

        <section className="admin-content">
          {activeTab === 'overview' && (
            <>
              <h2>Platform Overview</h2>

              <div className="admin-stat-grid">
                <div className="admin-stat-card">
                  <Users size={24} />
                  <span>Total Users</span>
                  <strong>1,248</strong>
                  <small>+12% this month</small>
                </div>

                <div className="admin-stat-card">
                  <ShoppingBag size={24} />
                  <span>Total Listings</span>
                  <strong>856</strong>
                  <small>64 pending approval</small>
                </div>

                <div className="admin-stat-card">
                  <IndianRupee size={24} />
                  <span>Total Revenue</span>
                  <strong>₹84,520</strong>
                  <small>Platform earnings</small>
                </div>

                <div className="admin-stat-card">
                  <Truck size={24} />
                  <span>Active Orders</span>
                  <strong>128</strong>
                  <small>Currently in progress</small>
                </div>
              </div>

              <div className="admin-panel">
                <BarChart3 size={24} />
                <h3>Monthly Activity</h3>
                <p>
                  Marketplace activity and user engagement statistics will
                  appear here after backend integration.
                </p>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="admin-panel">
              <h2>User Management</h2>

              {users.map((user) => (
                <div className="admin-list-row" key={user.id}>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>

                  <span className={`admin-status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>

                  <button
                    className="admin-action-button"
                    onClick={() => blockUser(user.id)}
                  >
                    {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="admin-panel">
              <h2>Listing Management</h2>

              {listings.map((listing) => (
                <div className="admin-list-row" key={listing.id}>
                  <div>
                    <strong>{listing.name}</strong>
                    <small>Seller: {listing.seller}</small>
                  </div>

                  <span className={`admin-status ${listing.status.toLowerCase()}`}>
                    {listing.status}
                  </span>

                  {listing.status === 'Pending' && (
                    <button
                      className="admin-action-button"
                      onClick={() => approveListing(listing.id)}
                    >
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-panel">
              <h2>Order Monitoring</h2>
              <p>Active orders: 128</p>
              <p>Orders awaiting delivery: 42</p>
              <p>Orders completed: 486</p>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="admin-panel">
              <h2>Payment Tracking</h2>
              <p>Total processed payments: ₹12,45,800</p>
              <p>Pending payouts: ₹32,500</p>
              <p>Platform fees collected: ₹84,520</p>
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="admin-panel">
              <h2>Dispute Management</h2>
              <div className="admin-list-row">
                <div>
                  <strong>Order #ET1024</strong>
                  <small>Product condition dispute</small>
                </div>

                <span className="admin-status pending">Under Review</span>

                <button
                  className="admin-action-button"
                  onClick={() => alert('Dispute details will open here.')}
                >
                  <Eye size={16} />
                  View
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


function AuthModal({ onClose, onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) throw new Error('Please enter your full name.');
        if (password.length < 6) {
          throw new Error('Password must contain at least 6 characters.');
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim() || null,
              location: location.trim() || null,
              role,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user && data.session) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: fullName.trim(),
              email: email.trim(),
              phone: phone.trim() || null,
              location: location.trim() || null,
              role,
            });

          if (profileError) throw profileError;
          await onAuthenticated(data.user);
          return;
        }

        setSuccess(
          'Account created. Check your email to confirm your account, then log in.'
        );
        setMode('login');
        setPassword('');
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (loginError) throw loginError;
        await onAuthenticated(data.user);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div
        className="auth-modal"
        style={{
          width: 'min(520px, calc(100vw - 32px))',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.22)',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            border: 0,
            background: '#f1f5f9',
            borderRadius: 10,
            width: 38,
            height: 38,
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ paddingRight: 45 }}>
          <div className="eyebrow">ECOTRACK ACCOUNT</div>
          <h2 style={{ margin: '8px 0 6px', fontSize: 30 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ margin: 0, color: '#64748b' }}>
            {mode === 'login'
              ? 'Log in to manage your EcoTrack activity.'
              : 'Join EcoTrack and start giving electronics a second life.'}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            margin: '24px 0 20px',
            background: '#f1f5f9',
            padding: 5,
            borderRadius: 12,
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            style={{
              border: 0,
              borderRadius: 9,
              padding: '11px 8px',
              cursor: 'pointer',
              background: mode === 'login' ? '#fff' : 'transparent',
              fontWeight: 700,
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            style={{
              border: 0,
              borderRadius: 9,
              padding: '11px 8px',
              cursor: 'pointer',
              background: mode === 'signup' ? '#fff' : 'transparent',
              fontWeight: 700,
            }}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span className="field-label">Full name</span>
                <input className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ display: 'block', marginBottom: 14 }}>
                  <span className="field-label">Phone</span>
                  <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
                </label>
                <label style={{ display: 'block', marginBottom: 14 }}>
                  <span className="field-label">Location</span>
                  <input className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / State" />
                </label>
              </div>

              <label style={{ display: 'block', marginBottom: 14 }}>
                <span className="field-label">Account role</span>
                <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </label>
            </>
          )}

          <label style={{ display: 'block', marginBottom: 14 }}>
            <span className="field-label">Email</span>
            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>

          <label style={{ display: 'block', marginBottom: 18 }}>
            <span className="field-label">Password</span>
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required />
          </label>

          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '11px 13px', borderRadius: 10, marginBottom: 14, fontSize: 14 }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#f0fdf4', color: '#15803d', padding: '11px 13px', borderRadius: 10, marginBottom: 14, fontSize: 14 }}>
              {success}
            </div>
          )}

          <button className="primary-button" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}


function productPresentation(category = '') {
  const value = category.toLowerCase();
  if (value.includes('laptop') || value.includes('computer')) return { icon: '💻', color: 'blue' };
  if (value.includes('phone') || value.includes('mobile')) return { icon: '📱', color: 'purple' };
  if (value.includes('monitor') || value.includes('display')) return { icon: '🖥️', color: 'green' };
  if (value.includes('keyboard') || value.includes('access')) return { icon: '⌨️', color: 'orange' };
  if (value.includes('printer')) return { icon: '🖨️', color: 'pink' };
  return { icon: '♻️', color: 'indigo' };
}

function ListingModal({ profile, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Laptops',
    price: '',
    condition: 'Good',
    location: profile?.location || '',
    description: '',
    specs: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!profile?.id) {
      setError('Please log in before creating a listing.');
      return;
    }
    if (profile.role !== 'seller') {
      setError('Your account is currently a Buyer account. Create or use a Seller account to list an item.');
      return;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      setError('Please enter a valid price.');
      return;
    }

    setSaving(true);

    // Always get the currently authenticated Supabase user here.
    // This prevents an RLS mismatch between the loaded profile and auth.uid().
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      setSaving(false);
      setError('Your login session has expired. Please log in again.');
      return;
    }

    const authenticatedUserId = authData.user.id;

    const { data, error: insertError } = await supabase
      .from('products')
      .insert({
        seller_id: authenticatedUserId,
        title: form.title.trim(),
        category: form.category,
        price,
        condition: form.condition,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        specs: form.specs.trim() || null,
        status: 'available',
      })
      .select('*, profiles(full_name)')
      .single();

    setSaving(false);

    if (insertError) {
      console.error('Product insert failed:', insertError);
      setError(insertError.message);
      return;
    }

    onCreated(data);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close listing form">
          <X size={20} />
        </button>
        <div className="modal-content" style={{ paddingTop: 10 }}>
          <div className="section-kicker">SELL ON ECOTRACK</div>
          <h2 style={{ marginBottom: 8 }}>Create a new listing</h2>
          <p style={{ color: '#64748b', marginTop: 0 }}>
            Add your unused electronics and make them available to buyers.
          </p>

          <form onSubmit={submit}>
            <label style={{ display: 'block', marginBottom: 14 }}>
              <span className="field-label">Product title</span>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Lenovo ThinkPad Laptop" required />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span className="field-label">Category</span>
                <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span className="field-label">Price (₹)</span>
                <input className="form-input" type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="18000" required />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span className="field-label">Condition</span>
                <select className="form-input" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                  <option>Like new</option>
                  <option>Good</option>
                  <option>Used</option>
                  <option>Fair</option>
                </select>
              </label>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span className="field-label">Location</span>
                <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Patiala, Punjab" />
              </label>
            </div>

            <label style={{ display: 'block', marginBottom: 14 }}>
              <span className="field-label">Specifications</span>
              <input className="form-input" value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} placeholder="Intel i5 · 8GB RAM · 256GB SSD" />
            </label>

            <label style={{ display: 'block', marginBottom: 18 }}>
              <span className="field-label">Description</span>
              <textarea className="form-input" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe condition, usage, accessories, etc." style={{ resize: 'vertical' }} />
            </label>

            {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '11px 13px', borderRadius: 10, marginBottom: 14, fontSize: 14 }}>{error}</div>}

            <button className="primary-button modal-action" type="submit" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={18} />
              {saving ? 'Saving listing...' : 'Publish listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


function MessagesCenter({ user, profile, initialProduct, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [people, setPeople] = useState({});
  const [products, setProducts] = useState({});
  const [draft, setDraft] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const myRole = profile?.role || 'buyer';

  const loadInbox = async () => {
    if (!user?.id) return;
    setLoading(true); setError('');
    const { data, error: inboxError } = await supabase.from('conversations')
      .select('*').or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('updated_at', { ascending: false });
    if (inboxError) { setError(inboxError.message); setLoading(false); return; }
    const rows = data || [];
    setConversations(rows);
    const productIds = [...new Set(rows.map(x => x.product_id).filter(Boolean))];
    const personIds = [...new Set(rows.flatMap(x => [x.buyer_id, x.seller_id]).filter(Boolean))];
    if (productIds.length) {
      const { data: ps } = await supabase.from('products').select('id,title,price,category,status').in('id', productIds);
      setProducts(Object.fromEntries((ps || []).map(x => [x.id, x])));
    }
    if (personIds.length) {
      const { data: us } = await supabase.from('profiles').select('id,full_name,email,role').in('id', personIds);
      setPeople(Object.fromEntries((us || []).map(x => [x.id, x])));
    }
    setLoading(false);
  };

  const openConversation = async (conversation) => {
    setActive(conversation); setError('');
    const [{ data: ms, error: me }, { data: os, error: oe }] = await Promise.all([
      supabase.from('messages').select('*').eq('conversation_id', conversation.id).order('created_at', { ascending: true }),
      supabase.from('price_offers').select('*').eq('conversation_id', conversation.id).order('created_at', { ascending: true })
    ]);
    if (me || oe) setError((me || oe).message);
    setMessages(ms || []); setOffers(os || []);
  };

  useEffect(() => { loadInbox(); }, [user?.id]);

  useEffect(() => {
    let cancelled = false;
    const begin = async () => {
      if (!initialProduct || !user?.id) return;
      if (initialProduct.seller_id === user.id) { setError('You cannot start a buyer conversation on your own listing. Open Messages to view buyer enquiries.'); return; }
      const { data, error: createError } = await supabase.from('conversations').upsert({
        product_id: initialProduct.id, buyer_id: user.id, seller_id: initialProduct.seller_id,
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id,buyer_id' }).select().single();
      if (cancelled) return;
      if (createError) { setError(createError.message); return; }
      await loadInbox();
      if (!cancelled) await openConversation(data);
    };
    begin();
    return () => { cancelled = true; };
  }, [initialProduct?.id, user?.id]);

  useEffect(() => {
    if (!active?.id) return;
    const channel = supabase.channel(`ecotrack-conversation-${active.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${active.id}` }, payload => {
        if (payload.eventType === 'INSERT') setMessages(current => current.some(x => x.id === payload.new.id) ? current : [...current, payload.new]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'price_offers', filter: `conversation_id=eq.${active.id}` }, payload => {
        if (payload.eventType === 'INSERT') setOffers(current => current.some(x => x.id === payload.new.id) ? current : [...current, payload.new]);
        if (payload.eventType === 'UPDATE') setOffers(current => current.map(x => x.id === payload.new.id ? payload.new : x));
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [active?.id]);

  const sendText = async () => {
    const body = draft.trim(); if (!body || !active) return;
    setBusy(true); setError('');
    const { error: e } = await supabase.from('messages').insert({ conversation_id: active.id, sender_id: user.id, body });
    if (e) setError(e.message); else { setDraft(''); await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', active.id); }
    setBusy(false);
  };

  const submitOffer = async () => {
    const n = Number(amount); if (!active || !Number.isFinite(n) || n <= 0) { setError('Enter a valid offer amount.'); return; }
    setBusy(true); setError('');
    const { error: e } = await supabase.from('price_offers').insert({ conversation_id: active.id, sender_id: user.id, amount: n, status: 'pending' });
    if (e) setError(e.message); else setAmount('');
    setBusy(false);
  };

  const respondOffer = async (offer, action) => {
    let counter = null;
    if (action === 'counter') { counter = Number(amount); if (!Number.isFinite(counter) || counter <= 0) { setError('Enter a valid counteroffer amount first.'); return; } }
    setBusy(true); setError('');
    const { error: e } = await supabase.rpc('respond_to_price_offer', { p_offer_id: offer.id, p_action: action, p_counter_amount: counter });
    if (e) setError(e.message); else { setAmount(''); await openConversation(active); await loadInbox(); }
    setBusy(false);
  };

  const latestPending = [...offers].reverse().find(x => x.status === 'pending');
  const otherId = active ? (active.buyer_id === user.id ? active.seller_id : active.buyer_id) : null;
  const otherName = people[otherId]?.full_name || 'EcoTrack member';
  const product = active ? products[active.product_id] : null;
  const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return <div className="messages-overlay">
    <section className="messages-center">
      <header className="messages-topbar"><div><span className="messages-kicker">ECOTRACK CONNECT</span><h2><MessageCircle size={22}/> Messages</h2></div><button className="chat-close" onClick={onClose} aria-label="Close messages"><X/></button></header>
      {error && <div className="messages-error">{error}</div>}
      <div className="messages-layout">
        <aside className="messages-inbox"><div className="inbox-heading"><strong>Your conversations</strong><button onClick={loadInbox}>Refresh</button></div>
          {loading ? <p className="messages-empty">Loading conversations…</p> : conversations.length === 0 ? <p className="messages-empty">No conversations yet. Open a product and choose Start Negotiation to contact its seller.</p> : conversations.map(c => {
            const pid = c.product_id, other = c.buyer_id === user.id ? c.seller_id : c.buyer_id;
            return <button key={c.id} className={`conversation-item ${active?.id === c.id ? 'selected' : ''}`} onClick={() => openConversation(c)}><span className="conversation-avatar">{(people[other]?.full_name || 'E').charAt(0).toUpperCase()}</span><span className="conversation-copy"><strong>{products[pid]?.title || 'Product conversation'}</strong><small>{people[other]?.full_name || 'EcoTrack member'}</small></span><span className="conversation-chevron">›</span></button>;
          })}
        </aside>
        <section className="messages-chat">
          {!active ? <div className="messages-placeholder"><MessageCircle size={42}/><h3>Select a conversation</h3><p>Choose a chat from your inbox to view messages and negotiate.</p></div> : <>
            <div className="messages-chat-head"><div><strong>{product?.title || 'Product discussion'}</strong><small>Chatting with {otherName} · {myRole}</small></div><span className="chat-product-price">{product ? fmt(product.price) : ''}</span></div>
            <div className="persistent-message-list">{messages.length === 0 && <p className="messages-empty">Say hello and start the conversation.</p>}{messages.map(m => <div key={m.id} className={`persistent-message ${m.sender_id === user.id ? 'mine' : ''}`}><p>{m.body}</p><time>{new Date(m.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</time></div>)}
              {offers.map(o => <div className={`persistent-offer ${o.sender_id === user.id ? 'mine' : ''}`} key={`offer-${o.id}`}><strong>{o.sender_id === user.id ? 'Your offer' : 'Offer received'} · {fmt(o.amount)}</strong><small>Status: {o.status}</small>
                {o.status === 'pending' && o.sender_id !== user.id && <div className="offer-controls">{myRole === 'seller' && active.seller_id === user.id && o.sender_id === active.buyer_id && <><button onClick={() => respondOffer(o, 'accept')} disabled={busy}>Accept</button><button className="decline" onClick={() => respondOffer(o, 'reject')} disabled={busy}>Reject</button><input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Counter ₹"/><button onClick={() => respondOffer(o, 'counter')} disabled={busy}>Counter</button></>}{myRole === 'buyer' && active.buyer_id === user.id && o.sender_id === active.seller_id && <><button onClick={() => respondOffer(o, 'accept')} disabled={busy}>Accept counter</button><button className="decline" onClick={() => respondOffer(o, 'reject')} disabled={busy}>Reject counter</button></>}{myRole === 'buyer' && active.buyer_id === user.id && o.sender_id === active.buyer_id && <span>Waiting for the seller's response.</span>}</div>}
                {o.status === 'pending' && o.sender_id === user.id && <small>Waiting for the other participant.</small>}
                {o.status === 'countered' && o.sender_id !== user.id && <div className="offer-controls"><button onClick={() => respondOffer(o, 'accept')} disabled={busy}>Accept counter</button><button className="decline" onClick={() => respondOffer(o, 'reject')} disabled={busy}>Reject</button></div>}
              </div>)}
              {active.final_price && <div className="deal-finalized">Deal agreed at {fmt(active.final_price)}. Continue to the payment stage.</div>}
            </div>
            <div className="messages-composer"><input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendText()} placeholder="Write a message…"/><button onClick={sendText} disabled={busy || !draft.trim()}><Send size={17}/> Send</button></div>
            <div className="offer-composer"><span>Make a price offer</span><input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount in ₹"/><button onClick={submitOffer} disabled={busy || !amount}>Send offer</button></div>
          </>}
        </section>
      </div>
    </section>
  </div>;
}


function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [liked, setLiked] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dbProducts, setDbProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showMessagesCenter, setShowMessagesCenter] = useState(false);
  const [messagesStartProduct, setMessagesStartProduct] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [negotiatingProduct, setNegotiatingProduct] = useState(null);

  // Negotiation state
  const [messages, setMessages] = useState(initialMessages);
  const [messageText, setMessageText] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [currentOffer, setCurrentOffer] = useState(null);
  const [negotiationStatus, setNegotiationStatus] = useState('ongoing');
  const [finalPrice, setFinalPrice] = useState(null);
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);
  const [viewerRole, setViewerRole] = useState('buyer');

  const [deliveryFee, setDeliveryFee] = useState(200);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (user) => {
      if (!user) {
        if (mounted) setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Could not load profile:', error);
        return;
      }

      if (mounted) {
        setProfile(data);
        if (data?.role === 'buyer' || data?.role === 'seller') {
          setViewerRole(data.role);
        }
      }
    };

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await loadProfile(data.session?.user ?? null);
      if (mounted) setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      await loadProfile(nextSession?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, profiles(full_name)')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Could not load products:', error);
      setDbProducts([]);
    } else {
      const normalized = (data || []).map((item) => {
        const presentation = productPresentation(item.category);
        return {
          ...item,
          seller: item.profiles?.full_name || 'EcoTrack Seller',
          icon: presentation.icon,
          color: presentation.color,
          description: item.description || 'No description provided yet.',
          specs: item.specs || 'Specifications not provided',
        };
      });
      setDbProducts(normalized);
    }
    setProductsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAuthenticated = async (user) => {
    let { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;

    if (!existingProfile) {
      const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'EcoTrack User';
      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fallbackName,
          email: user.email || '',
          phone: user.user_metadata?.phone || null,
          location: user.user_metadata?.location || null,
          role: user.user_metadata?.role === 'seller' ? 'seller' : 'buyer',
        })
        .select()
        .single();

      if (createError) throw createError;
      existingProfile = createdProfile;
    }

    setProfile(existingProfile);
    setSession((current) => current || { user });
    if (existingProfile.role === 'buyer' || existingProfile.role === 'seller') {
      setViewerRole(existingProfile.role);
    }
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    setSession(null);
    setProfile(null);
    setShowAdminDashboard(false);
    setViewerRole('buyer');
  };

  const filteredProducts = useMemo(() => {
    return dbProducts.filter((product) => {
      const matchesCategory =
        category === 'All' || product.category === category;

      const text = `${product.title} ${product.location || ''} ${product.category} ${product.seller}`
        .toLowerCase();

      return matchesCategory && text.includes(query.toLowerCase());
    });
  }, [dbProducts, query, category]);

  const toggleLike = (id) => {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const closeDetails = () => {
    setSelectedProduct(null);
  };

  const resetNegotiation = () => {
    setMessages(initialMessages);
    setMessageText('');
    setOfferAmount('');
    setCurrentOffer(null);
    setNegotiationStatus('ongoing');
    setFinalPrice(null);
    setShowPaymentPreview(false);
    setViewerRole('buyer');
  };

  const startNegotiation = (product) => {
    closeDetails();
    if (!session?.user) { setShowAuthModal(true); return; }
    if (product.seller_id === session.user.id) { alert('You cannot negotiate on your own listing.'); return; }
    setMessagesStartProduct(product);
    setShowMessagesCenter(true);
  };

  const closeNegotiation = () => {
    setNegotiatingProduct(null);
    setShowPaymentPreview(false);
  };

  const sendMessage = () => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) return;

    const newMessage = {
      id: Date.now(),
      sender: viewerRole,
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: 'text'
    };

    setMessages((current) => [...current, newMessage]);
    setMessageText('');
  };

  const sendOffer = () => {
    if (viewerRole !== 'buyer') {
      alert('Only the buyer can send a new price offer.');
      return;
    }

    const amount = Number(offerAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Please enter a valid offer amount.');
      return;
    }

    if (!negotiatingProduct) return;

    const newOffer = {
      id: Date.now(),
      sender: 'buyer',
      amount,
      status: 'pending'
    };

    setCurrentOffer(newOffer);
    setMessages((current) => [
      ...current,
      {
        id: Date.now() + 1,
        sender: 'buyer',
        type: 'offer',
        amount,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
    setOfferAmount('');
  };

  const acceptOffer = () => {
    if (!currentOffer) return;

    setFinalPrice(currentOffer.amount);
    setNegotiationStatus('accepted');

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: 'seller',
        type: 'system',
        text: `Offer accepted. Final agreed price: ${formatPrice(
          currentOffer.amount
        )}.`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  const rejectOffer = () => {
    if (!currentOffer) return;

    setCurrentOffer((current) =>
      current ? { ...current, status: 'rejected' } : null
    );

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: 'seller',
        type: 'system',
        text: 'The current offer was declined. You can make another offer.',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  const counterOffer = () => {
    if (viewerRole !== 'buyer') {
      alert('Only the buyer can request a counteroffer.');
      return;
    }

    if (!negotiatingProduct) return;

    const counterAmount = Math.round(
      negotiatingProduct.price * 0.95
    );

    setCurrentOffer({
      id: Date.now(),
      sender: 'seller',
      amount: counterAmount,
      status: 'countered'
    });

    setMessages((current) => [
      ...current,
      {
        id: Date.now() + 1,
        sender: 'seller',
        type: 'offer',
        amount: counterAmount,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  const acceptCounterOffer = () => {
    if (!currentOffer) return;

    setFinalPrice(currentOffer.amount);
    setNegotiationStatus('accepted');

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: 'buyer',
        type: 'system',
        text: `Counteroffer accepted. Final agreed price: ${formatPrice(
          currentOffer.amount
        )}.`,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'inherit' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="brand-mark" style={{ margin: '0 auto 12px' }}><Recycle size={22} /></div>
          <strong>Loading EcoTrack...</strong>
        </div>
      </div>
    );
  }

  // Show the admin dashboard as a separate full-screen view.
  if (showAdminDashboard) {
    return (
      <AdminDashboard
        onBack={() => setShowAdminDashboard(false)}
      />
    );
  }

  const paymentAmount = finalPrice ?? 0;
  const buyerDeliveryShare = deliveryFee / 2;
  const platformFee = 11;
  const buyerTotal = paymentAmount + buyerDeliveryShare + platformFee;
  const sellerPayout =
    paymentAmount - buyerDeliveryShare - platformFee;

  return (
    <div className="app-shell">
      {/* NAVBAR */}
      <header className="navbar">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <Recycle size={22} />
          </span>
          <span>
            Eco<span className="brand-accent">Track</span>
          </span>
        </a>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>

        <nav className={mobileOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#marketplace" onClick={() => setMobileOpen(false)}>
            Marketplace
          </a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>
            How it works
          </a>
          <a href="#impact" onClick={() => setMobileOpen(false)}>
            Our impact
          </a>
          {session && <button className="messages-nav-button" type="button" onClick={() => { setMobileOpen(false); setMessagesStartProduct(null); setShowMessagesCenter(true); }}><MessageCircle size={17}/> Messages</button>}
          <button
            className="nav-sell"
            type="button"
            onClick={() => {
              setMobileOpen(false);
              if (!session) {
                setShowAuthModal(true);
                return;
              }
              setShowListingModal(true);
            }}
          >
            <Plus size={17} />
            Sell an item
          </button>
          <button
            className="admin-nav-button"
            onClick={() => {
              setMobileOpen(false);
              setShowAdminDashboard(true);
            }}
          >
            <LayoutDashboard size={17} />
            Admin
          </button>

          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="login-button" style={{ cursor: 'default' }}>
                <User size={17} />
                {profile?.full_name || session.user?.email?.split('@')[0] || 'Account'}
              </span>
              <button className="login-button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={() => setShowAuthModal(true)}>
              <User size={17} />
              Log in / Sign up
            </button>
          )}
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              A smarter way to give tech a second life
            </div>

            <h1>
              Give your old tech
              <br />
              <span>
                a new <em>purpose.</em>
              </span>
            </h1>

            <p>
              Buy, sell, and reuse electronics with people around you.
              EcoTrack makes responsible e-waste exchange simple,
              transparent, and rewarding.
            </p>

            <div className="hero-actions">
              <a href="#marketplace" className="primary-button">
                Explore marketplace
                <ArrowRight size={18} />
              </a>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  if (!session) setShowAuthModal(true);
                  else setShowListingModal(true);
                }}
              >
                <Plus size={18} />
                List your e-waste
              </button>
            </div>

            <div className="trust-row">
              <div className="avatars">
                <span>R</span>
                <span>A</span>
                <span>N</span>
                <span>+</span>
              </div>
              <div>
                <strong>Built for conscious communities</strong>
                <small>Reuse more. Waste less.</small>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="device-card laptop-card">
              <div className="device-top">
                <span className="tiny-label">FEATURED DROP</span>
                <span className="status-pill">● Available</span>
              </div>
              <div className="device-emoji">💻</div>
              <div className="device-info">
                <h3>MacBook Air M1</h3>
                <p>8GB RAM · 256GB SSD</p>
                <div>
                  <strong>₹42,000</strong>
                  <span>Good condition</span>
                </div>
              </div>
            </div>

            <div className="floating-card impact-card">
              <span className="floating-icon">♻</span>
              <div>
                <strong>2,480+</strong>
                <small>Devices recirculated</small>
              </div>
            </div>

            <div className="floating-card location-card">
              <MapPin size={17} />
              <div>
                <strong>Find nearby</strong>
                <small>Trusted local sellers</small>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-strip" id="impact">
          <div>
            <strong>100%</strong>
            <span>Community-driven</span>
          </div>
          <div>
            <strong>6+</strong>
            <span>Device categories</span>
          </div>
          <div>
            <strong>₹11</strong>
            <span>Simple platform fee</span>
          </div>
          <div>
            <strong>1 goal</strong>
            <span>Less e-waste</span>
          </div>
        </section>

        {/* MARKETPLACE */}
        <section className="market-section" id="marketplace">
          <div className="section-heading">
            <div>
              <div className="section-kicker">DISCOVER & REUSE</div>
              <h2>
                Find your next <span>tech treasure.</span>
              </h2>
              <p>
                Explore pre-owned electronics from people in your community.
              </p>
            </div>

            <a href="#marketplace" className="text-link">
              View all listings
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="search-row">
            <div className="search-box">
              <Search size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search laptops, phones, monitors..."
              />
            </div>

            <div className="category-list">
              {categories.map((item) => (
                <button
                  key={item}
                  className={
                    category === item ? 'category active' : 'category'
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {productsLoading ? (
            <div className="empty-state">Loading live listings from EcoTrack...</div>
          ) : (
            <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className={`product-visual ${product.color}`}>
                  <span className="condition-tag">{product.condition}</span>

                  <button
                    className="like-button"
                    onClick={() => toggleLike(product.id)}
                    aria-label="Save listing"
                  >
                    <Heart
                      size={18}
                      fill={
                        liked.includes(product.id) ? 'currentColor' : 'none'
                      }
                    />
                  </button>

                  <div className="product-icon">{product.icon}</div>
                </div>

                <div className="product-content">
                  <div className="product-category">{product.category}</div>
                  <h3>{product.title}</h3>

                  <div className="product-meta">
                    <MapPin size={14} />
                    {product.location}
                  </div>

                  <div className="product-bottom">
                    <div>
                      <strong>{formatPrice(product.price)}</strong>
                      <small>Seller: {product.seller}</small>
                    </div>

                    <button
                      className="chat-button"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View Details
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            </div>
          )}

          {!productsLoading && filteredProducts.length === 0 && (
            <div className="empty-state">
              No live listings match your search. Sellers can add the first listing using "Sell an item".
            </div>
          )}
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section" id="how-it-works">
          <div className="section-kicker">SIMPLE BY DESIGN</div>
          <h2>
            From unused to <span>useful.</span>
          </h2>
          <p className="section-intro">
            A straightforward way to keep electronics in use for longer.
          </p>

          <div className="steps">
            <div className="step">
              <div className="step-icon">
                <Plus />
              </div>
              <span>01</span>
              <h3>List your device</h3>
              <p>Add photos, specs, condition, and your asking price.</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <MessageCircle />
              </div>
              <span>02</span>
              <h3>Connect & agree</h3>
              <p>Chat with interested buyers and finalize the deal.</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <Truck />
              </div>
              <span>03</span>
              <h3>We manage delivery</h3>
              <p>Pay securely and track the delivery through EcoTrack.</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <ShieldCheck />
              </div>
              <span>04</span>
              <h3>Verify & complete</h3>
              <p>Approve the product after delivery and release the seller payout.</p>
            </div>
          </div>
        </section>

        {/* SELL BANNER */}
        <section className="sell-banner" id="sell">
          <div>
            <div className="section-kicker">HAVE UNUSED TECH?</div>
            <h2>
              Someone out there
              <br />
              needs what you have.
            </h2>
            <p>
              Turn your unused electronics into value while helping reduce
              e-waste.
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => {
              if (!session) {
                setShowAuthModal(true);
                return;
              }
              setShowListingModal(true);
            }}
          >
            Start selling
            <ArrowRight size={18} />
          </button>
        </section>

        {/* PRODUCT DETAILS MODAL */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={closeDetails}>
            <div
              className="product-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={closeDetails}
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              <div className={`product-visual ${selectedProduct.color}`}>
                <div className="product-icon">{selectedProduct.icon}</div>
              </div>

              <div className="modal-content">
                <div className="product-category">
                  {selectedProduct.category}
                </div>

                <h2>{selectedProduct.title}</h2>
                <h3>{formatPrice(selectedProduct.price)}</h3>

                <div className="modal-detail">
                  <Tag size={17} />
                  <span>
                    <strong>Condition:</strong> {selectedProduct.condition}
                  </span>
                </div>

                <div className="modal-detail">
                  <MapPin size={17} />
                  <span>
                    <strong>Location:</strong> {selectedProduct.location}
                  </span>
                </div>

                <div className="modal-detail">
                  <User size={17} />
                  <span>
                    <strong>Seller:</strong> {selectedProduct.seller}
                  </span>
                </div>

                <div className="modal-detail">
                  <Package size={17} />
                  <span>
                    <strong>Specifications:</strong> {selectedProduct.specs}
                  </span>
                </div>

                <p className="modal-description">
                  {selectedProduct.description}
                </p>

                <button
                  className="primary-button modal-action"
                  onClick={() => startNegotiation(selectedProduct)}
                >
                  <MessageCircle size={18} />
                  Start Negotiation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHAT AND NEGOTIATION MODAL */}
        {negotiatingProduct && (
          <div className="modal-overlay chat-overlay">
            <div
              className="chat-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CHAT HEADER */}
              <div className="chat-header">
                <div className="chat-header-left">
                  <button
                    className="back-button"
                    onClick={closeNegotiation}
                    aria-label="Close chat"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <div className="seller-avatar">
                    {negotiatingProduct.seller.charAt(0)}
                  </div>

                  <div>
                    <h2>{negotiatingProduct.seller}</h2>
                    <span>
                      <span className="online-dot" />
                      Seller · EcoTrack
                    </span>
                  </div>
                </div>

                <button
                  className="chat-close"
                  onClick={closeNegotiation}
                  aria-label="Close negotiation"
                >
                  <X size={21} />
                </button>
              </div>

              {/* DEMO ROLE SWITCH
                  In the production version this will come from the logged-in user. */}
              <div className="role-switch">
                <span>Viewing as:</span>
                <button
                  className={viewerRole === 'buyer' ? 'role-button active' : 'role-button'}
                  onClick={() => setViewerRole('buyer')}
                >
                  Buyer
                </button>
                <button
                  className={viewerRole === 'seller' ? 'role-button active' : 'role-button'}
                  onClick={() => setViewerRole('seller')}
                >
                  Seller
                </button>
              </div>

              {/* PRODUCT SUMMARY */}
              <div className="chat-product-summary">
                <div className={`mini-product-icon ${negotiatingProduct.color}`}>
                  {negotiatingProduct.icon}
                </div>

                <div className="chat-product-info">
                  <strong>{negotiatingProduct.title}</strong>
                  <span>Listed price: {formatPrice(negotiatingProduct.price)}</span>
                </div>

                <div className="chat-product-status">
                  <span>●</span> Available
                </div>
              </div>

              {/* NEGOTIATION STATUS */}
              <div className="negotiation-status-bar">
                <div className="status-label">
                  <span className="status-icon">
                    {negotiationStatus === 'accepted' ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                  </span>

                  <div>
                    <strong>
                      {negotiationStatus === 'accepted'
                        ? 'Deal finalized'
                        : 'Negotiation in progress'}
                    </strong>
                    <small>
                      {negotiationStatus === 'accepted'
                        ? `Agreed price: ${formatPrice(finalPrice)}`
                        : 'Discuss the price and product details'}
                    </small>
                  </div>
                </div>

                {negotiationStatus === 'accepted' && (
                  <span className="agreed-badge">Agreed</span>
                )}
              </div>

              {/* MESSAGES */}
              <div className="messages-area">
                <div className="date-divider">
                  <span>Today</span>
                </div>

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-row ${
                      message.sender === 'buyer' ? 'buyer-row' : 'seller-row'
                    } ${message.type === 'system' ? 'system-row' : ''}`}
                  >
                    {message.type === 'system' ? (
                      <div className="system-message">
                        <CheckCircle size={15} />
                        {message.text}
                      </div>
                    ) : message.type === 'offer' ? (
                      <div className="offer-message">
                        <div className="offer-heading">
                          <Wallet size={18} />
                          <strong>
                            {message.sender === 'buyer'
                              ? 'Your price offer'
                              : 'Seller counteroffer'}
                          </strong>
                        </div>

                        <div className="offer-amount">
                          {formatPrice(message.amount)}
                        </div>

                        <span className="offer-caption">
                          {message.sender === 'buyer'
                            ? 'Proposed purchase price'
                            : 'Seller proposed price'}
                        </span>

                        <span className="message-time">{message.time}</span>
                      </div>
                    ) : (
                      <div className="message-bubble">
                        <p>{message.text}</p>
                        <span className="message-time">
                          {message.time}
                          {message.sender === 'buyer' && (
                            <Check size={14} />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {negotiationStatus === 'accepted' && (
                  <div className="deal-complete-card">
                    <CheckCircle size={24} />
                    <h3>Price finalized!</h3>
                    <strong>{formatPrice(finalPrice)}</strong>
                    <p>
                      Both parties can now proceed to the payment and delivery
                      stage.
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => setShowPaymentPreview(true)}
                    >
                      Continue to payment
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </div>

              {/* OFFER ACTIONS */}
              {negotiationStatus !== 'accepted' && (
                <div className="negotiation-actions">
                  {viewerRole === 'seller' && (
                    <p className="seller-only-note">Seller controls: accept or reject buyer offers above.</p>
                  )}

                  <div className="offer-input-row">
                    <div className="offer-input">
                      <IndianRupee size={16} />
                      <input
                        type="number"
                        min="1"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder="Enter your offer"
                      />
                    </div>

                    <button
                      className="send-offer-button"
                      onClick={sendOffer}
                      disabled={viewerRole !== 'buyer'}
                    >
                      Send offer
                    </button>
                  </div>

                  {currentOffer && currentOffer.status !== 'rejected' && (
                    <div className="offer-decision">
                      <div>
                        <small>
                          {currentOffer.sender === 'buyer'
                            ? 'Latest buyer offer'
                            : 'Latest seller counteroffer'}
                        </small>
                        <strong>{formatPrice(currentOffer.amount)}</strong>
                        <span className="offer-caption">
                          Status: {currentOffer.status}
                        </span>
                      </div>

                      {viewerRole === 'seller' && currentOffer.sender === 'buyer' && (
                        <div className="offer-decision-buttons">
                          <button
                            className="accept-button"
                            onClick={acceptOffer}
                            disabled={negotiationStatus === 'accepted'}
                          >
                            <Check size={15} />
                            Accept
                          </button>

                          <button
                            className="reject-button"
                            onClick={rejectOffer}
                            disabled={negotiationStatus === 'accepted'}
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        </div>
                      )}

                      {viewerRole === 'buyer' && currentOffer.sender === 'buyer' && (
                        <span className="buyer-note">
                          Waiting for the seller to accept or reject this offer.
                        </span>
                      )}

                      {viewerRole === 'buyer' && currentOffer.sender === 'seller' && (
                        <div className="offer-decision-buttons">
                          <button
                            className="accept-button"
                            onClick={acceptCounterOffer}
                            disabled={negotiationStatus === 'accepted'}
                          >
                            <Check size={15} />
                            Accept counter
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {viewerRole === 'buyer' && (
                    <button
                      className="counter-button"
                      onClick={counterOffer}
                    >
                      <RefreshCw size={15} />
                      Ask seller for a counteroffer
                    </button>
                  )}
                </div>
              )}

              {/* MESSAGE INPUT */}
              {negotiationStatus !== 'accepted' && (
                <div className="message-input-area">
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendMessage();
                    }}
                    placeholder="Write a message..."
                  />

                  <button
                    className="send-message-button"
                    onClick={sendMessage}
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}

              {/* PAYMENT PREVIEW */}
              {showPaymentPreview && finalPrice !== null && (
                <div
                  className="payment-overlay"
                  onClick={() => setShowPaymentPreview(false)}
                >
                  <div
                    className="payment-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="modal-close"
                      onClick={() => setShowPaymentPreview(false)}
                    >
                      <X size={20} />
                    </button>

                    <div className="payment-icon">
                      <Wallet size={28} />
                    </div>

                    <div className="section-kicker">PAYMENT SUMMARY</div>
                    <h2>Review your order</h2>
                    <p className="payment-subtitle">
                      This is a payment preview. No real money will be charged.
                    </p>

                    <div className="payment-product">
                      <span>{negotiatingProduct.title}</span>
                      <strong>{formatPrice(finalPrice)}</strong>
                    </div>

                    <div className="payment-lines">
                      <div>
                        <span>Finalized product price</span>
                        <strong>{formatPrice(finalPrice)}</strong>
                      </div>
                      <div>
                        <span>50% delivery fee</span>
                        <strong>{formatPrice(buyerDeliveryShare)}</strong>
                      </div>
                      <div>
                        <span>EcoTrack development fee</span>
                        <strong>{formatPrice(platformFee)}</strong>
                      </div>
                    </div>

                    <div className="delivery-edit">
                      <label htmlFor="delivery-fee">
                        Estimated total delivery fee
                      </label>
                      <div className="delivery-input">
                        <IndianRupee size={16} />
                        <input
                          id="delivery-fee"
                          type="number"
                          min="0"
                          value={deliveryFee}
                          onChange={(e) =>
                            setDeliveryFee(Math.max(0, Number(e.target.value)))
                          }
                        />
                      </div>
                      <small>
                        The buyer pays half of the delivery fee.
                      </small>
                    </div>

                    <div className="payment-total">
                      <span>Total payable by buyer</span>
                      <strong>{formatPrice(buyerTotal)}</strong>
                    </div>

                    <div className="seller-payout-preview">
                      <div>
                        <span>Estimated seller payout</span>
                        <strong>{formatPrice(sellerPayout)}</strong>
                      </div>
                      <small>
                        Includes deduction of half the delivery fee and ₹11
                        platform fee, as specified in your current prototype.
                      </small>
                    </div>

                    <button
                      className="primary-button modal-action"
                      onClick={() =>
                        alert(
                          'Payment gateway integration will be added in a future phase.'
                        )
                      }
                    >
                      Proceed to payment
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {showListingModal && session && profile && (
        <ListingModal
          profile={profile}
          onClose={() => setShowListingModal(false)}
          onCreated={() => loadProducts()}
        />
      )}

      {showMessagesCenter && session?.user && profile && <MessagesCenter user={session.user} profile={profile} initialProduct={messagesStartProduct} onClose={() => { setShowMessagesCenter(false); setMessagesStartProduct(null); }} />}

      {showAuthModal && !authLoading && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {/* FOOTER */}
      <footer>
        <a className="brand" href="#top">
          <span className="brand-mark">
            <Recycle size={20} />
          </span>
          <span>
            Eco<span className="brand-accent">Track</span>
          </span>
        </a>

        <p>Building a more circular future, one device at a time.</p>
        <span>© 2026 EcoTrack</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);