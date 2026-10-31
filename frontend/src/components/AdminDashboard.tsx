'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Package,
  Sparkles,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Palette,
  ArrowLeft,
  Upload,
  Camera,
  QrCode,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
  SERVICE_CATEGORIES,
} from '@/data/initialData';
import {
  BrandTheme,
  ProductCategoryId,
  ProductTag,
  ServiceCategoryId,
} from '@/types';
import { formatTsh } from '@/utils/format';
import { compressProductImage } from '@/utils/imageUpload';

interface AdminDashboardProps {
  initialTab?: 'bookings' | 'products' | 'services' | 'orders' | 'clients';
  onBackToStorefront: () => void;
  onOpenQrModal: () => void;
}

export default function AdminDashboard({
  initialTab = 'bookings',
  onBackToStorefront,
  onOpenQrModal,
}: AdminDashboardProps) {
  const {
    currentUser,
    theme,
    setTheme,
    bookings,
    updateBookingStatus,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    services,
    addService,
    updateServicePrice,
    deleteService,
    orders,
    updateOrderStatus,
    users,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'bookings' | 'products' | 'services' | 'orders' | 'clients'
  >(initialTab);

  // Product Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] =
    useState<ProductCategoryId>('facial-products');
  const [prodTag, setProdTag] = useState<ProductTag>('Oils');
  const [prodPrice, setProdPrice] = useState('15000');
  const [prodStock, setProdStock] = useState('10');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState(
    'https://images.unsplash.com/photo-1608248597359-0e6d526a6828?auto=format&fit=crop&w=900&q=80'
  );

  // Service Form State
  const [srvName, setSrvName] = useState('');
  const [srvCategory, setSrvCategory] = useState<ServiceCategoryId>('facial');
  const [srvPrice, setSrvPrice] = useState('20000');
  const [srvDuration, setSrvDuration] = useState('45 mins');
  const [srvBadge, setSrvBadge] = useState('New Treatment');
  const [srvDesc, setSrvDesc] = useState('');

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressProductImage(file);
    setProdImage(compressed);
  };

  const handleUpdateExistingProductPhoto = async (
    productId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressProductImage(file);
    updateProduct(productId, { image: compressed });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    addProduct({
      name: prodName.trim(),
      categoryId: prodCategory,
      tag: prodTag,
      price: Number(prodPrice) || 0,
      stock: Number(prodStock) || 0,
      description:
        prodDesc.trim() ||
        `Authentic ${prodTag.toLowerCase()} curated by SINYORA GEE.`,
      image: prodImage,
    });
    setProdName('');
    setProdDesc('');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) return;
    addService({
      name: srvName.trim(),
      categoryId: srvCategory,
      price: Number(srvPrice) || 0,
      duration: srvDuration.trim() || '45 mins',
      badge: srvBadge.trim() || 'Luxury Service',
      description:
        srvDesc.trim() || 'Professional treatment at SINYORA GEE Royal Hostel.',
      image:
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    });
    setSrvName('');
    setSrvDesc('');
  };

  const totalBookingRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalOrderRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <section
      style={{
        paddingBlock: '2rem 6rem',
        background: 'var(--bg-primary)',
        minBlockSize: '85dvh',
      }}
    >
      <div className="page-shell">
        {/* Top Management Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'safe center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBlockEnd: '1.75rem',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--dark-surface)',
            color: '#fffdf9',
            border: '1.5px solid var(--gold-primary)',
          }}
        >
          <div>
            <span className="gold-shimmer-badge">
              SINYORA GEE • SaaS Management Portal
            </span>
            <h1 style={{ fontSize: '1.65rem', marginTop: '0.45rem' }}>
              Welcome, {currentUser?.name || 'Admin'}
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#cfc4ca' }}>
              Logged in as <strong>{currentUser?.phone}</strong> • Manage
              appointments, upload skincare products (Oils, Masks, Shampoos),
              and update prices.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onOpenQrModal}
              className="btn-outline"
              style={{
                borderColor: 'var(--gold-primary)',
                color: '#f5e6b8',
              }}
            >
              <QrCode size={16} />
              <span>Studio QR Code</span>
            </button>

            <button
              type="button"
              onClick={onBackToStorefront}
              className="btn-gold"
            >
              <ArrowLeft size={16} />
              <span>Back to Client Storefront</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="stats-grid" style={{ marginBlockEnd: '1.75rem' }}>
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '1.1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gold-border)',
            }}
          >
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Total Bookings
            </div>
            <div
              style={{
                fontSize: '1.55rem',
                fontWeight: 800,
                color: 'var(--brand-color)',
              }}
            >
              {bookings.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Est. {formatTsh(totalBookingRevenue)}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '1.1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gold-border)',
            }}
          >
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Products in Shop
            </div>
            <div
              style={{
                fontSize: '1.55rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              {products.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Oils, Masks, Shampoos
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '1.1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gold-border)',
            }}
          >
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Product Orders
            </div>
            <div
              style={{
                fontSize: '1.55rem',
                fontWeight: 800,
                color: 'var(--brand-color)',
              }}
            >
              {orders.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Sales: {formatTsh(totalOrderRevenue)}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '1.1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gold-border)',
            }}
          >
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Active Treatments
            </div>
            <div
              style={{
                fontSize: '1.55rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              {services.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Across 5 Categories
            </div>
          </div>
        </div>

        {/* Admin Sidebar + Main Content */}
        <div className="admin-grid">
          {/* Navigation Tabs (Sidebar on PC, Horizontal Pills on Phone) */}
          <aside
            style={{
              background: 'var(--bg-surface)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gold-border)',
            }}
          >
            <div
              className="horizontal-pills"
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              {[
                {
                  id: 'bookings',
                  label: `Appointments (${bookings.length})`,
                  icon: Calendar,
                },
                {
                  id: 'products',
                  label: `Add/Manage Products (${products.length})`,
                  icon: Package,
                },
                {
                  id: 'services',
                  label: `Services & Prices (${services.length})`,
                  icon: Sparkles,
                },
                {
                  id: 'orders',
                  label: `Product Orders (${orders.length})`,
                  icon: ShoppingBag,
                },
                {
                  id: 'clients',
                  label: `Accounts & Theme (${users.length})`,
                  icon: Users,
                },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(item.id as typeof activeTab)
                    }
                    style={{
                      inlineSize: '100%',
                      textAlign: 'left',
                      padding: '0.7rem 0.95rem',
                      borderRadius: 'var(--radius-sm)',
                      border: active
                        ? '1px solid var(--brand-color)'
                        : '1px solid transparent',
                      background: active
                        ? 'var(--brand-color)'
                        : 'var(--bg-secondary)',
                      color: active ? '#fff' : 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                    }}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Panel */}
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: 'clamp(1.1rem, 2.5vw, 1.75rem)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gold-border)',
            }}
          >
            {/* TAB 1: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', marginBlockEnd: '0.35rem' }}>
                  Student &amp; Client Appointments
                </h2>
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    marginBlockEnd: '1.25rem',
                  }}
                >
                  Confirm incoming bookings, verify Mobile Money payments, or
                  message the student directly on WhatsApp.
                </p>

                {bookings.length === 0 ? (
                  <div
                    style={{
                      padding: '2.5rem 1rem',
                      textAlign: 'center',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    No appointments booked yet. When students book a service,
                    it appears right here!
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.9rem',
                    }}
                  >
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          padding: '1rem 1.15rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--gold-border)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            marginBlockEnd: '0.5rem',
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: '1rem' }}>
                              {b.clientName}
                            </strong>{' '}
                            <span style={{ color: 'var(--text-secondary)' }}>
                              • {b.clientPhone} ({b.hostelOrRoom})
                            </span>
                          </div>
                          <span className="rose-pill-badge">
                            {b.id} • {b.status}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: '0.86rem',
                            marginBlockEnd: '0.45rem',
                          }}
                        >
                          <strong>Date &amp; Time:</strong> {b.appointmentDate}{' '}
                          at {b.appointmentTime} •{' '}
                          <strong>Payment:</strong> {b.paymentMethod}
                          {b.transactionRef && ` (Ref: ${b.transactionRef})`}
                        </div>

                        <div
                          style={{
                            fontSize: '0.86rem',
                            color: 'var(--brand-color)',
                            fontWeight: 700,
                            marginBlockEnd: '0.75rem',
                          }}
                        >
                          Treatments:{' '}
                          {b.services
                            .map((s) => `${s.name} (${formatTsh(s.price)})`)
                            .join(', ')}{' '}
                          — Total: {formatTsh(b.totalPrice)}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              updateBookingStatus(b.id, 'Confirmed')
                            }
                            className="btn-primary"
                            style={{
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.78rem',
                            }}
                          >
                            <CheckCircle2 size={14} /> Confirm Slot
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateBookingStatus(b.id, 'Completed')
                            }
                            className="btn-gold"
                            style={{
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.78rem',
                            }}
                          >
                            Mark Completed
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateBookingStatus(b.id, 'Cancelled')
                            }
                            className="btn-outline"
                            style={{
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.78rem',
                            }}
                          >
                            <XCircle size={14} /> Cancel
                          </button>

                          <a
                            href={`https://wa.me/${b.clientPhone.replace(
                              /^0/,
                              '255'
                            )}?text=${encodeURIComponent(
                              `Habari ${b.clientName}! Your SINYORA GEE appointment (${b.id}) on ${b.appointmentDate} at ${b.appointmentTime} is confirmed at Royal Hostel.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            style={{
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.78rem',
                            }}
                          >
                            <MessageCircle size={14} /> WhatsApp Client
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ADD & MANAGE SKINCARE PRODUCTS */}
            {activeTab === 'products' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', marginBlockEnd: '0.35rem' }}>
                  Upload Skincare &amp; Cosmetics Products
                </h2>
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    marginBlockEnd: '1.25rem',
                  }}
                >
                  Add Oils, Masks, Shampoos, Serums, or Cosmetics. They will
                  appear immediately in their dedicated sections on the website.
                </p>

                <form
                  onSubmit={handleAddProduct}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gold-border)',
                    marginBlockEnd: '1.75rem',
                    display: 'grid',
                    gap: '0.9rem',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.85rem',
                    }}
                  >
                    <div className="form-field">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pure Rosehip Glow Facial Oil"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">
                        Dedicated Section Tag *
                      </label>
                      <select
                        value={prodTag}
                        onChange={(e) =>
                          setProdTag(e.target.value as ProductTag)
                        }
                        className="form-select"
                      >
                        {PRODUCT_TAGS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.85rem',
                    }}
                  >
                    <div className="form-field">
                      <label className="form-label">Skincare Category *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) =>
                          setProdCategory(e.target.value as ProductCategoryId)
                        }
                        className="form-select"
                      >
                        {PRODUCT_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <label className="form-label">Price (Tsh) *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        step={500}
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '0.85rem',
                    }}
                  >
                    <div className="form-field">
                      <label className="form-label">
                        <Upload
                          size={14}
                          style={{
                            display: 'inline',
                            marginInlineEnd: '0.3rem',
                          }}
                        />
                        Upload Product Photo (Phone Camera / Gallery / PC)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="form-input"
                        style={{ padding: '0.55rem' }}
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">Or Paste Image URL</label>
                      <input
                        type="url"
                        value={prodImage.startsWith('data:') ? '' : prodImage}
                        placeholder="https://..."
                        onChange={(e) => setProdImage(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Live Product Picture Preview */}
                  {prodImage && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.9rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--gold-border)',
                      }}
                    >
                      <img
                        src={prodImage}
                        alt="Selected product preview"
                        style={{
                          inlineSize: '76px',
                          blockSize: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid var(--gold-primary)',
                        }}
                      />
                      <div style={{ fontSize: '0.8rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          Live Product Photo Preview
                        </strong>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          Ready to publish to Cosmetics Shop (Cloudinary-ready)
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-field">
                    <label className="form-label">Product Description</label>
                    <textarea
                      rows={2}
                      placeholder="Describe skin benefits, ingredients, or how to use..."
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    <Plus size={17} />
                    <span>Publish Product to Shop</span>
                  </button>
                </form>

                {/* Existing Products List */}
                <h3 style={{ fontSize: '1.1rem', marginBlockEnd: '0.75rem' }}>
                  Published Products ({products.length})
                </h3>
                {products.length === 0 ? (
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    No products uploaded yet. Use the form above to add Oils,
                    Masks, Shampoos, or Serums.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    {products.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.8rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--gold-border)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                          }}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              inlineSize: '64px',
                              blockSize: '52px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid var(--gold-primary)',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <strong>{p.name}</strong>{' '}
                            <span className="rose-pill-badge">{p.tag}</span>
                            <div
                              style={{
                                fontSize: '0.82rem',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {formatTsh(p.price)} • Stock: {p.stock}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <label
                            className="btn-outline"
                            style={{
                              padding: '0.38rem 0.75rem',
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                            }}
                          >
                            <Camera size={14} />
                            <span>Change Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleUpdateExistingProductPhoto(p.id, e)
                              }
                              style={{ display: 'none' }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="btn-outline"
                            style={{
                              padding: '0.4rem 0.7rem',
                              color: 'var(--danger)',
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SERVICES & PRICES MANAGER */}
            {activeTab === 'services' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', marginBlockEnd: '0.35rem' }}>
                  Services &amp; Price List Manager
                </h2>
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    marginBlockEnd: '1.25rem',
                  }}
                >
                  All 22 services from your flyer are pre-loaded below. You can
                  update any price in real time or add a new service.
                </p>

                {/* Add New Service Form */}
                <form
                  onSubmit={handleAddService}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gold-border)',
                    marginBlockEnd: '1.5rem',
                    display: 'grid',
                    gap: '0.8rem',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    + Add a New Service or Package
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(170px, 1fr))',
                      gap: '0.75rem',
                    }}
                  >
                    <input
                      type="text"
                      required
                      placeholder="Service Name *"
                      value={srvName}
                      onChange={(e) => setSrvName(e.target.value)}
                      className="form-input"
                    />
                    <select
                      value={srvCategory}
                      onChange={(e) =>
                        setSrvCategory(e.target.value as ServiceCategoryId)
                      }
                      className="form-select"
                    >
                      {SERVICE_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1000}
                      placeholder="Price in Tsh *"
                      value={srvPrice}
                      onChange={(e) => setSrvPrice(e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 45 mins)"
                      value={srvDuration}
                      onChange={(e) => setSrvDuration(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Short description..."
                    value={srvDesc}
                    onChange={(e) => setSrvDesc(e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ justifySelf: 'start' }}
                  >
                    <Plus size={16} /> Add Service
                  </button>
                </form>

                {/* Editable Services List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  {services.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--gold-border)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                          {s.name}{' '}
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            ({s.duration})
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.76rem',
                            color: 'var(--brand-color)',
                            fontWeight: 600,
                          }}
                        >
                          Current: {formatTsh(s.price)}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          value={s.price}
                          onChange={(e) =>
                            updateServicePrice(
                              s.id,
                              Number(e.target.value) || 0
                            )
                          }
                          className="form-input"
                          style={{
                            inlineSize: '125px',
                            padding: '0.4rem 0.65rem',
                            fontSize: '0.84rem',
                          }}
                          aria-label={`Price for ${s.name}`}
                        />
                        <button
                          type="button"
                          onClick={() => deleteService(s.id)}
                          className="btn-outline"
                          style={{
                            padding: '0.4rem 0.65rem',
                            color: 'var(--danger)',
                          }}
                          aria-label={`Delete ${s.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PRODUCT ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', marginBlockEnd: '0.35rem' }}>
                  Skincare Product Orders
                </h2>
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    marginBlockEnd: '1.25rem',
                  }}
                >
                  Track orders placed by students for Oils, Masks, Shampoos,
                  and Cosmetics.
                </p>

                {orders.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No product orders placed yet.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}
                  >
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        style={{
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--gold-border)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBlockEnd: '0.4rem',
                          }}
                        >
                          <strong>
                            {o.id} • {o.clientName} ({o.clientPhone})
                          </strong>
                          <span className="gold-shimmer-badge">{o.status}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem' }}>
                          Delivery/Hostel: <strong>{o.deliveryLocation}</strong>{' '}
                          • Payment: <strong>{o.paymentMethod}</strong>
                        </div>
                        <div
                          style={{
                            fontSize: '0.86rem',
                            color: 'var(--brand-color)',
                            fontWeight: 700,
                            marginBlock: '0.4rem 0.7rem',
                          }}
                        >
                          {o.items
                            .map((i) => `${i.name} x${i.quantity}`)
                            .join(', ')}{' '}
                          — {formatTsh(o.totalPrice)}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() =>
                              updateOrderStatus(o.id, 'Processing')
                            }
                            className="btn-outline"
                            style={{
                              padding: '0.35rem 0.8rem',
                              fontSize: '0.78rem',
                            }}
                          >
                            Mark Processing
                          </button>
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(o.id, 'Delivered')}
                            className="btn-primary"
                            style={{
                              padding: '0.35rem 0.8rem',
                              fontSize: '0.78rem',
                            }}
                          >
                            Mark Delivered
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: ACCOUNTS & COLOR THEME SWITCHER */}
            {activeTab === 'clients' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', marginBlockEnd: '0.35rem' }}>
                  Website Color Theme &amp; Accounts
                </h2>
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    marginBlockEnd: '1.25rem',
                  }}
                >
                  Test and switch the live website color palette anytime, and
                  view registered management &amp; student accounts.
                </p>

                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gold-border)',
                    marginBlockEnd: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      marginBlockEnd: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <Palette size={17} color="var(--brand-color)" />
                    Select Active Website Color Palette:
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.75rem',
                    }}
                  >
                    {(
                      [
                        {
                          id: 'flyer-rose',
                          title: '1. Flyer Velvet Rose & Gold',
                          desc: 'Matches your official poster (Rose Berry, Warm Cream & Gold)',
                        },
                        {
                          id: 'clean-blush',
                          title: '2. Clean Girl Nude Blush & Gold',
                          desc: 'Our previously discussed soft blush, warm linen & espresso palette',
                        },
                        {
                          id: 'botanical-gold',
                          title: '3. Botanical Sage & Bronze',
                          desc: 'Organic spa eucalyptus green, pearl ivory & brushed gold',
                        },
                      ] as { id: BrandTheme; title: string; desc: string }[]
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTheme(t.id)}
                        style={{
                          textAlign: 'left',
                          padding: '0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          border:
                            theme === t.id
                              ? '2px solid var(--brand-color)'
                              : '1px solid var(--gold-border)',
                          background: 'var(--bg-surface)',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          {t.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.76rem',
                            color: 'var(--text-secondary)',
                            marginTop: '0.2rem',
                          }}
                        >
                          {t.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBlockEnd: '0.75rem' }}>
                  Registered Management &amp; Student Accounts ({users.length})
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  {users.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--gold-border)',
                        fontSize: '0.86rem',
                      }}
                    >
                      <div>
                        <strong>{u.name}</strong> • {u.phone}
                        <div
                          style={{
                            fontSize: '0.76rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {u.title || u.hostel || 'Royal Hostel'}
                        </div>
                      </div>
                      <span
                        className={
                          u.role === 'admin'
                            ? 'gold-shimmer-badge'
                            : 'rose-pill-badge'
                        }
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

