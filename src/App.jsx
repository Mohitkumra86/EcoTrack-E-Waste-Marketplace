import { useEffect, useMemo, useRef, useState } from "react";
import {
  Recycle,
  LogOut,
  Search,
  Plus,
  MessageCircle,
  Package,
  User,
  Send,
  X,
  Check,
  XCircle,
  RefreshCw,
  ShoppingBag,
  LayoutDashboard,
  Upload,
  LoaderCircle,
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import "./App.css";

const DELIVERY_FEE = 100;
const PLATFORM_FEE = 11;
const CATEGORIES = [
  "All",
  "Mobile",
  "Laptop",
  "Computer",
  "Accessories",
  "Appliances",
  "Other",
];

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authRole, setAuthRole] = useState("buyer");

  const [page, setPage] = useState("marketplace");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("Mobile");
  const [productCondition, setProductCondition] = useState("Good");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);

  const [activeProduct, setActiveProduct] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const messageEndRef = useRef(null);

  const isSeller = profile?.role === "seller";
  const isAdmin = profile?.role === "admin";

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term);
      return (
        matchesCategory &&
        matchesSearch &&
        product.status === "available"
      );
    });
  }, [products, category, search]);

  useEffect(() => {
    let alive = true;

    async function initialize() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setSession(data.session);
      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      }
      setLoading(false);
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await loadProfile(newSession.user.id);
      } else {
        setProfile(null);
        setProducts([]);
        setOrders([]);
      }
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user && profile) {
      loadProducts();
      loadOrders();
    }
  }, [session, profile]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadProfile(userId) {
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setProfile(data);
  }

  async function loadProducts() {
    const { data, error: queryError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) setError(queryError.message);
    else setProducts(data || []);
  }

  async function loadOrders() {
    const { data, error: queryError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) setError(queryError.message);
    else setOrders(data || []);
  }

  async function handleAuth(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);

    try {
      if (authMode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              full_name: authName,
              role: authRole,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          setNotice("Account created successfully!");
        } else {
          setNotice(
            "Account created. Check your email to confirm your account, then log in."
          );
        }
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
          });

        if (signInError) throw signInError;
        setNotice("Welcome back!");
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setPage("marketplace");
    setConversation(null);
    setActiveProduct(null);
  }

  async function uploadProductImage(file) {
    if (!file) return null;

    const extension = file.name.split(".").pop();
    const filePath = `${session.user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function addProduct(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (!isSeller) {
        throw new Error("Only seller accounts can list products.");
      }

      let imageUrl = null;
      if (productImage) {
        imageUrl = await uploadProductImage(productImage);
      }

      const { error: insertError } = await supabase.from("products").insert({
        seller_id: session.user.id,
        title: productTitle.trim(),
        description: productDescription.trim(),
        category: productCategory,
        condition: productCondition,
        price: Number(productPrice),
        image_url: imageUrl,
      });

      if (insertError) throw insertError;

      setNotice("Your product has been listed!");
      setShowProductForm(false);
      setProductTitle("");
      setProductDescription("");
      setProductPrice("");
      setProductImage(null);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Could not add product.");
    } finally {
      setBusy(false);
    }
  }

  async function openConversation(product) {
    setError("");
    setNotice("");

    if (product.seller_id === session.user.id) {
      setError("You cannot start a buyer conversation on your own listing.");
      return;
    }

    try {
      const { data: existing, error: findError } = await supabase
        .from("conversations")
        .select("*")
        .eq("product_id", product.id)
        .eq("buyer_id", session.user.id)
        .maybeSingle();

      if (findError) throw findError;

      let currentConversation = existing;

      if (!currentConversation) {
        const { data: created, error: createError } = await supabase
          .from("conversations")
          .insert({
            product_id: product.id,
            buyer_id: session.user.id,
            seller_id: product.seller_id,
          })
          .select()
          .single();

        if (createError) throw createError;
        currentConversation = created;
      }

      setActiveProduct(product);
      setConversation(currentConversation);
      setPage("chat");
      await loadConversationData(currentConversation.id);
    } catch (err) {
      setError(err.message || "Could not open conversation.");
    }
  }

  async function loadConversationData(conversationId) {
    const [messageResult, offerResult] = await Promise.all([
      supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true }),
      supabase
        .from("offers")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false }),
    ]);

    if (messageResult.error) setError(messageResult.error.message);
    else setMessages(messageResult.data || []);

    if (offerResult.error) setError(offerResult.error.message);
    else setOffers(offerResult.data || []);
  }

  useEffect(() => {
    if (!conversation?.id) return;

    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        () => loadConversationData(conversation.id)
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "offers",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        () => loadConversationData(conversation.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id]);

  async function sendMessage(event) {
    event.preventDefault();
    if (!messageText.trim() || !conversation) return;

    const textToSend = messageText.trim();
    setMessageText("");

    const { error: insertError } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: session.user.id,
      message: textToSend,
    });

    if (insertError) {
      setError(insertError.message);
      setMessageText(textToSend);
    } else {
      await loadConversationData(conversation.id);
    }
  }

  async function sendOffer(event) {
    event.preventDefault();
    const amount = Number(offerAmount);

    if (!amount || amount <= 0) {
      setError("Enter a valid offer amount.");
      return;
    }

    if (!conversation) return;

    setBusy(true);
    setError("");

    const { error: insertError } = await supabase.from("offers").insert({
      conversation_id: conversation.id,
      offered_by: session.user.id,
      amount,
    });

    if (insertError) setError(insertError.message);
    else {
      setOfferAmount("");
      await loadConversationData(conversation.id);
      setNotice("Your offer has been sent.");
    }

    setBusy(false);
  }

  async function respondToOffer(offer, response) {
    if (!isSeller) {
      setError("Only the seller can accept or reject an offer.");
      return;
    }

    setBusy(true);
    setError("");

    const { error: updateError } = await supabase
      .from("offers")
      .update({ status: response })
      .eq("id", offer.id);

    if (updateError) setError(updateError.message);
    else {
      await loadConversationData(conversation.id);
      setNotice(`Offer ${response}.`);
    }

    setBusy(false);
  }

  async function counterOffer(offer) {
    if (!isSeller) return;

    const value = window.prompt(
      "Enter your counteroffer amount in rupees:",
      String(offer.amount)
    );

    if (value === null) return;

    const amount = Number(value);
    if (!amount || amount <= 0) {
      setError("Enter a valid counteroffer.");
      return;
    }

    setBusy(true);
    setError("");

    const { error: updateError } = await supabase
      .from("offers")
      .update({ status: "countered" })
      .eq("id", offer.id);

    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }

    const { error: insertError } = await supabase.from("offers").insert({
      conversation_id: conversation.id,
      offered_by: session.user.id,
      amount,
    });

    if (insertError) setError(insertError.message);
    else {
      await loadConversationData(conversation.id);
      setNotice("Your counteroffer has been sent.");
    }

    setBusy(false);
  }

  async function createOrder(offer) {
    if (isSeller || offer.status !== "accepted") return;

    const confirmed = window.confirm(
      `Create an order for ${money(offer.amount)}?\n\n` +
        `Product price: ${money(offer.amount)}\n` +
        `Your 50% delivery contribution: ${money(DELIVERY_FEE / 2)}\n` +
        `Platform fee: ${money(PLATFORM_FEE)}\n` +
        `Total: ${money(
          Number(offer.amount) + DELIVERY_FEE / 2 + PLATFORM_FEE
        )}\n\n` +
        `This creates an order record only. It does not charge your account.`
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");

    const productPrice = Number(offer.amount);
    const buyerDeliveryShare = DELIVERY_FEE / 2;
    const total = productPrice + buyerDeliveryShare + PLATFORM_FEE;
    const sellerPayout =
      productPrice - DELIVERY_FEE / 2 - PLATFORM_FEE;

    const { error: orderError } = await supabase.from("orders").insert({
      product_id: activeProduct.id,
      buyer_id: session.user.id,
      seller_id: activeProduct.seller_id,
      offer_id: offer.id,
      product_price: productPrice,
      delivery_fee: DELIVERY_FEE,
      platform_fee: PLATFORM_FEE,
      total_paid: total,
      seller_payout: sellerPayout,
      status: "awaiting_payment",
    });

    if (orderError) {
      setError(orderError.message);
    } else {
      setNotice("Order created. Payment integration is not yet connected.");
      await loadOrders();
      setPage("orders");
    }

    setBusy(false);
  }

  async function deleteProduct(productId) {
    const confirmed = window.confirm("Delete this product listing?");
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("seller_id", session.user.id);

    if (deleteError) setError(deleteError.message);
    else {
      setNotice("Product deleted.");
      await loadProducts();
    }
  }

  async function markBuyerApproved(order) {
    if (order.buyer_id !== session.user.id) return;

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        buyer_approved: true,
        status: "approved",
      })
      .eq("id", order.id);

    if (updateError) setError(updateError.message);
    else {
      setNotice("You approved the delivery.");
      await loadOrders();
    }
  }

  async function updateOrderStatus(order, status) {
    if (!isAdmin) return;

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order.id);

    if (updateError) setError(updateError.message);
    else {
      setNotice(`Order status changed to ${status}.`);
      await loadOrders();
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <LoaderCircle className="spin" size={36} />
        <p>Loading EcoTrack...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand brand-center">
            <span className="brand-icon"><Recycle size={30} /></span>
            <span>EcoTrack</span>
          </div>
          <p className="auth-subtitle">
            Give old electronics a new life.
          </p>

          <div className="auth-switch">
            <button
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              className={authMode === "signup" ? "active" : ""}
              onClick={() => setAuthMode("signup")}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleAuth} className="form-stack">
            {authMode === "signup" && (
              <>
                <label>Full name</label>
                <input
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Your name"
                  required
                />
                <label>Choose your role</label>
                <select
                  value={authRole}
                  onChange={(e) => setAuthRole(e.target.value)}
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </>
            )}

            <label>Email address</label>
            <input
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <label>Password</label>
            <input
              type="password"
              minLength={6}
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />

            <button className="primary-button" disabled={busy}>
              {busy
                ? "Please wait..."
                : authMode === "login"
                  ? "Login"
                  : "Create account"}
            </button>
          </form>

          {error && <p className="alert error">{error}</p>}
          {notice && <p className="alert success">{notice}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand brand-button"
          onClick={() => setPage("marketplace")}
        >
          <span className="brand-icon"><Recycle size={27} /></span>
          <span>EcoTrack</span>
        </button>

        <div className="topbar-right">
          <span className="role-pill">{profile?.role || "user"}</span>
          <span className="user-name">
            {profile?.full_name || session.user.email}
          </span>
          <button className="icon-button" onClick={handleLogout} title="Logout">
            <LogOut size={19} />
          </button>
        </div>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <button
            className={page === "marketplace" ? "nav-item selected" : "nav-item"}
            onClick={() => setPage("marketplace")}
          >
            <ShoppingBag size={19} /> Marketplace
          </button>

          <button
            className={page === "orders" ? "nav-item selected" : "nav-item"}
            onClick={() => {
              setPage("orders");
              loadOrders();
            }}
          >
            <Package size={19} /> My Orders
          </button>

          {isSeller && (
            <button
              className="nav-item"
              onClick={() => setShowProductForm(true)}
            >
              <Plus size={19} /> List a product
            </button>
          )}

          {isAdmin && (
            <button
              className={page === "admin" ? "nav-item selected" : "nav-item"}
              onClick={() => {
                setPage("admin");
                loadOrders();
              }}
            >
              <LayoutDashboard size={19} /> Admin Dashboard
            </button>
          )}

          <div className="sidebar-note">
            <Recycle size={22} />
            <strong>Reuse. Recycle. Repeat.</strong>
            <span>Make electronics more sustainable.</span>
          </div>
        </aside>

        <main className="main-content">
          {error && (
            <div className="alert error">
              {error}
              <button onClick={() => setError("")}><X size={16} /></button>
            </div>
          )}
          {notice && (
            <div className="alert success">
              {notice}
              <button onClick={() => setNotice("")}><X size={16} /></button>
            </div>
          )}

          {page === "marketplace" && (
            <>
              <section className="hero">
                <div>
                  <span className="eyebrow">SUSTAINABLE ELECTRONICS MARKETPLACE</span>
                  <h1>Find a new home for electronics.</h1>
                  <p>
                    Buy and sell pre-owned electronics while reducing e-waste.
                  </p>
                </div>
                <div className="hero-symbol"><Recycle size={76} /></div>
              </section>

              <div className="market-toolbar">
                <div className="search-box">
                  <Search size={19} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search electronics..."
                  />
                </div>

                {isSeller && (
                  <button
                    className="primary-button"
                    onClick={() => setShowProductForm(true)}
                  >
                    <Plus size={18} /> Add product
                  </button>
                )}
              </div>

              <div className="category-list">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    className={category === item ? "category active" : "category"}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="section-heading">
                <div>
                  <h2>Explore products</h2>
                  <p>{filteredProducts.length} listings available</p>
                </div>
                <button className="text-button" onClick={loadProducts}>
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <Package size={42} />
                  <h3>No products found</h3>
                  <p>Try another search or category.</p>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <article className="product-card" key={product.id}>
                      <div className="product-image">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.title} />
                        ) : (
                          <Package size={48} />
                        )}
                        <span className="condition-tag">
                          {product.condition || "Pre-owned"}
                        </span>
                      </div>
                      <div className="product-info">
                        <span className="product-category">
                          {product.category}
                        </span>
                        <h3>{product.title}</h3>
                        <p className="product-description">
                          {product.description || "No description provided."}
                        </p>
                        <div className="product-card-bottom">
                          <strong>{money(product.price)}</strong>
                          {product.seller_id === session.user.id ? (
                            <button
                              className="outline-button"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              className="primary-button small"
                              onClick={() => openConversation(product)}
                            >
                              <MessageCircle size={16} /> Chat with seller
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {page === "chat" && conversation && activeProduct && (
            <section className="chat-page">
              <div className="chat-header">
                <button
                  className="text-button"
                  onClick={() => setPage("marketplace")}
                >
                  ← Marketplace
                </button>
                <div>
                  <h2>{activeProduct.title}</h2>
                  <p>Listed price: {money(activeProduct.price)}</p>
                </div>
              </div>

              <div className="chat-columns">
                <div className="chat-panel">
                  <div className="chat-messages">
                    {messages.length === 0 && (
                      <div className="empty-chat">
                        Start the conversation with the seller.
                      </div>
                    )}

                    {messages.map((message) => {
                      const mine = message.sender_id === session.user.id;
                      return (
                        <div
                          key={message.id}
                          className={mine ? "message-row mine" : "message-row"}
                        >
                          <div className="message-bubble">
                            <p>{message.message}</p>
                            <small>
                              {new Date(message.created_at).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messageEndRef} />
                  </div>

                  <form className="chat-compose" onSubmit={sendMessage}>
                    <input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Write a message..."
                    />
                    <button className="primary-button" type="submit">
                      <Send size={18} />
                    </button>
                  </form>
                </div>

                <div className="offer-panel">
                  <h3>Price negotiation</h3>
                  <p className="muted">
                    {isSeller
                      ? "Review buyer offers and respond."
                      : "Send an offer to the seller."}
                  </p>

                  {!isSeller && (
                    <form className="offer-form" onSubmit={sendOffer}>
                      <label>Your offer (₹)</label>
                      <input
                        type="number"
                        min="1"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                      <button className="primary-button" disabled={busy}>
                        Send offer
                      </button>
                    </form>
                  )}

                  <h4>Offer history</h4>
                  {offers.length === 0 ? (
                    <p className="muted">No offers yet.</p>
                  ) : (
                    offers.map((offer) => (
                      <div className="offer-card" key={offer.id}>
                        <div className="offer-card-top">
                          <strong>{money(offer.amount)}</strong>
                          <span className={`status ${offer.status}`}>
                            {offer.status}
                          </span>
                        </div>
                        <small>
                          {offer.offered_by === session.user.id
                            ? "You"
                            : "Other participant"}
                          {" · "}
                          {new Date(offer.created_at).toLocaleString()}
                        </small>

                        {isSeller && offer.status === "pending" && (
                          <div className="offer-actions">
                            <button
                              className="accept-button"
                              onClick={() => respondToOffer(offer, "accepted")}
                              disabled={busy}
                            >
                              <Check size={15} /> Accept
                            </button>
                            <button
                              className="reject-button"
                              onClick={() => respondToOffer(offer, "rejected")}
                              disabled={busy}
                            >
                              <XCircle size={15} /> Reject
                            </button>
                            <button
                              className="outline-button"
                              onClick={() => counterOffer(offer)}
                              disabled={busy}
                            >
                              Counter
                            </button>
                          </div>
                        )}

                        {!isSeller && offer.status === "accepted" && (
                          <button
                            className="primary-button full-button"
                            onClick={() => createOrder(offer)}
                            disabled={busy}
                          >
                            Continue to order
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {page === "orders" && (
            <section>
              <div className="section-heading">
                <div>
                  <h1>My Orders</h1>
                  <p>Track your EcoTrack transactions.</p>
                </div>
                <button className="text-button" onClick={loadOrders}>
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={42} />
                  <h3>No orders yet</h3>
                  <p>Your orders will appear here.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const buyer = order.buyer_id === session.user.id;
                    const seller = order.seller_id === session.user.id;

                    if (!buyer && !seller && !isAdmin) return null;

                    return (
                      <article className="order-card" key={order.id}>
                        <div className="order-card-header">
                          <div>
                            <span className="eyebrow">ORDER</span>
                            <h3>{order.id.slice(0, 8).toUpperCase()}</h3>
                          </div>
                          <span className={`status ${order.status}`}>
                            {order.status.replaceAll("_", " ")}
                          </span>
                        </div>

                        <div className="order-breakdown">
                          <div>
                            <span>Negotiated product price</span>
                            <strong>{money(order.product_price)}</strong>
                          </div>
                          <div>
                            <span>Total delivery fee</span>
                            <strong>{money(order.delivery_fee)}</strong>
                          </div>
                          <div>
                            <span>Platform fee</span>
                            <strong>{money(order.platform_fee)}</strong>
                          </div>
                          <div className="total-line">
                            <span>Buyer payment amount</span>
                            <strong>{money(order.total_paid)}</strong>
                          </div>
                          <div>
                            <span>Seller estimated payout</span>
                            <strong>{money(order.seller_payout)}</strong>
                          </div>
                        </div>

                        {buyer &&
                          order.status === "delivered" &&
                          !order.buyer_approved && (
                            <button
                              className="primary-button"
                              onClick={() => markBuyerApproved(order)}
                            >
                              <Check size={17} /> Approve received product
                            </button>
                          )}

                        {isAdmin && (
                          <div className="admin-order-actions">
                            <label>Update order status</label>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order, e.target.value)
                              }
                            >
                              {[
                                "awaiting_payment",
                                "paid",
                                "shipped",
                                "delivered",
                                "approved",
                                "completed",
                                "cancelled",
                              ].map((status) => (
                                <option key={status} value={status}>
                                  {status.replaceAll("_", " ")}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {seller && (
                          <p className="muted">
                            Your estimated payout is released after buyer
                            approval and platform processing.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {page === "admin" && isAdmin && (
            <section>
              <div className="section-heading">
                <div>
                  <h1>Admin Dashboard</h1>
                  <p>Overview of EcoTrack marketplace activity.</p>
                </div>
                <button className="text-button" onClick={loadOrders}>
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>Total listings</span>
                  <strong>{products.length}</strong>
                </div>
                <div className="stat-card">
                  <span>Total orders</span>
                  <strong>{orders.length}</strong>
                </div>
                <div className="stat-card">
                  <span>Completed orders</span>
                  <strong>
                    {orders.filter((o) => o.status === "completed").length}
                  </strong>
                </div>
              </div>

              <h2>Manage orders</h2>
              <p className="muted">
                Change an order's status as it moves through delivery.
              </p>

              <div className="orders-list">
                {orders.map((order) => (
                  <article className="order-card" key={order.id}>
                    <div className="order-card-header">
                      <strong>{order.id.slice(0, 8).toUpperCase()}</strong>
                      <span className={`status ${order.status}`}>
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p>Order total: {money(order.total_paid)}</p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order, e.target.value)
                      }
                    >
                      {[
                        "awaiting_payment",
                        "paid",
                        "shipped",
                        "delivered",
                        "approved",
                        "completed",
                        "cancelled",
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {showProductForm && (
        <div className="modal-backdrop" onClick={() => setShowProductForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <h2>List a product</h2>
                <p>Add your pre-owned electronic device.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowProductForm(false)}
              >
                <X />
              </button>
            </div>

            <form className="form-stack" onSubmit={addProduct}>
              <label>Product name</label>
              <input
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="Example: Samsung Galaxy S21"
                required
              />

              <label>Description</label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe the device and its specifications..."
                rows={4}
              />

              <label>Category</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <label>Condition</label>
              <select
                value={productCondition}
                onChange={(e) => setProductCondition(e.target.value)}
              >
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
                <option>For Parts</option>
              </select>

              <label>Asking price (₹)</label>
              <input
                type="number"
                min="1"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Enter price"
                required
              />

              <label>Product image</label>
              <label className="upload-area">
                <Upload size={22} />
                <span>
                  {productImage ? productImage.name : "Choose an image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductImage(e.target.files?.[0] || null)
                  }
                  hidden
                />
              </label>

              <button className="primary-button" disabled={busy}>
                {busy ? "Publishing..." : "Publish listing"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;