'use client';

import React, { useRef, useState } from 'react';
import {
  Calendar,
  Package,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Camera,
  ImagePlus,
  Trash2,
  QrCode,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
} from '@/data/initialData';
import { ProductCategoryId, ProductTag } from '@/types';
import { formatTsh } from '@/utils/format';
import { compressProductImage } from '@/utils/imageUpload';

interface MobileAdminViewProps {
  onOpenQrModal: () => void;
}

type AdminSubTab = 'appointments' | 'orders' | 'add-product' | 'catalog';

export default function MobileAdminView({ onOpenQrModal }: MobileAdminViewProps) {
  const {
    currentUser,
    bookings,
    orders,
    products,
    services,
    updateBookingStatus,
    updateOrderStatus,
    addProduct,
    deleteProduct,
  } = useStore();

  const [subTab, setSubTab] = useState<AdminSubTab>('appointments');

  // Add Product Form State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('15000');
  const [prodStock, setProdStock] = useState('10');
  const [prodTag, setProdTag] = useState<ProductTag>('Serums');
  const [prodCategory, setProdCategory] =
    useState<ProductCategoryId>('facial-products');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const pendingBookingsCount = bookings.filter(
    (b) => b.status === 'Pending'
  ).length;
  const totalRevenue =
    bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0) +
    orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalPrice, 0);

  const handlePhotoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressProductImage(file);
    setProdImage(compressed);
  };

  const handlePublishProduct = (e: React.FormEvent) => {
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
        `Authentic ${prodTag.toLowerCase()} curated by Sinyora Gee.`,
      image:
        prodImage.trim() ||
        'https://images.unsplash.com/photo-1608248597359-0e6d526a6828?auto=format&fit=crop&w=900&q=80',
    });
    setProdName('');
    setProdDesc('');
    setProdImage('');
    setUploadMsg('Product published! Clients have been notified.');
    setTimeout(() => setUploadMsg(''), 3500);
    setSubTab('catalog');
  };

  return (
    <section style={{ paddingBlock: '1rem 2rem' }}>
      <div className="page-shell" style={{ display: 'grid', gap: '1rem' }}>
        {/* Admin Header Strip */}
        <div
          style={{
            background:
              'linear-gradient(135deg, #24101a 0%, #3a1527 100%)',
            borderRadius: '18px',
            border: '1.5px solid rgba(212, 175, 55, 0.55)',
            padding: '1rem 1.1rem',
            color: '#fffdf9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.68rem',
                color: '#f7df8b',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Management Portal
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
              {currentUser?.name}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenQrModal}
            className="btn-gold"
            style={{ padding: '0.42rem 0.85rem', fontSize: '0.76rem' }}
          >
            <QrCode size={14} />
            <span>QR Code</span>
          </button>
        </div>

        {/* 2x2 Compact KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.65rem',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '14px',
              border: '1px solid var(--gold-border)',
              padding: '0.8rem 0.9rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Appointments
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-color)' }}>
              {bookings.length}{' '}
              {pendingBookingsCount > 0 && (
                <span style={{ fontSize: '0.72rem', color: '#b51053' }}>
                  ({pendingBookingsCount} pending)
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '14px',
              border: '1px solid var(--gold-border)',
              padding: '0.8rem 0.9rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Est. Revenue
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#23141b' }}>
              {totalRevenue === 0 ? 'Tsh 0' : formatTsh(totalRevenue)}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '14px',
              border: '1px solid var(--gold-border)',
              padding: '0.8rem 0.9rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Product Orders
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-color)' }}>
              {orders.length}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '14px',
              border: '1px solid var(--gold-border)',
              padding: '0.8rem 0.9rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Shop Products
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#23141b' }}>
              {products.length}
            </div>
          </div>
        </div>

        {/* Clean Pill Sub-Navigation */}
        <div className="horizontal-pills">
          {(
            [
              { id: 'appointments', label: `Appointments (${bookings.length})`, icon: Calendar },
              { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
              { id: 'add-product', label: '+ Add Product', icon: PlusCircle },
              { id: 'catalog', label: `Shop (${products.length})`, icon: Sparkles },
            ] as { id: AdminSubTab; label: string; icon: React.ComponentType<{ size?: number }> }[]
          ).map((t) => {
            const Icon = t.icon;
            const active = subTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                style={{
                  padding: '0.5rem 0.95rem',
                  borderRadius: '999px',
                  border: active
                    ? '1.5px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                  background: active ? 'var(--brand-color)' : 'var(--bg-surface)',
                  color: active ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {uploadMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'rgba(21, 128, 61, 0.12)',
              border: '1px solid rgba(21, 128, 61, 0.35)',
              color: 'var(--success)',
              fontSize: '0.84rem',
              fontWeight: 700,
            }}
          >
            {uploadMsg}
          </div>
        )}

        {/* TAB 1: APPOINTMENTS */}
        {subTab === 'appointments' && (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {bookings.length === 0 ? (
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  background: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px dashed var(--gold-border)',
                  color: 'var(--text-muted)',
                  fontSize: '0.86rem',
                }}
              >
                No client appointments yet. You will get an instant notification when a client books!
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--gold-border)',
                    padding: '1rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'grid',
                    gap: '0.45rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <strong style={{ fontSize: '0.96rem' }}>
                      {b.clientName}
                    </strong>
                    <span className="rose-pill-badge">
                      {b.id} • {b.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    📞 {b.clientPhone} • 📍 {b.hostelOrRoom}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    📅 {b.appointmentDate} at {b.appointmentTime} • 💳 {b.paymentMethod}
                    {b.transactionRef ? ` (${b.transactionRef})` : ''}
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--brand-color)' }}>
                    {b.services.map((s) => s.name).join(', ')} — {formatTsh(b.totalPrice)}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.45rem',
                      marginTop: '0.35rem',
                    }}
                  >
                    {b.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                        >
                          <CheckCircle2 size={14} /> Confirm Slot
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                          className="btn-outline"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </>
                    )}

                    {b.status === 'Confirmed' && (
                      <>
                        <span
                          style={{
                            padding: '0.38rem 0.8rem',
                            borderRadius: '999px',
                            background: 'rgba(184, 29, 91, 0.1)',
                            color: 'var(--brand-color)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <CheckCircle2 size={13} /> Slot Confirmed
                        </span>
                        <button
                          type="button"
                          onClick={() => updateBookingStatus(b.id, 'Completed')}
                          className="btn-gold"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                        >
                          <CheckCircle2 size={14} /> Mark Completed
                        </button>
                      </>
                    )}

                    {b.status === 'Completed' && (
                      <span
                        style={{
                          padding: '0.38rem 0.8rem',
                          borderRadius: '999px',
                          background: 'rgba(21, 128, 61, 0.12)',
                          color: 'var(--success)',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                        }}
                      >
                        ✓ Completed
                      </span>
                    )}

                    <a
                      href={`https://wa.me/255${b.clientPhone
                        .replace(/\D/g, '')
                        .replace(/^0/, '')}?text=${encodeURIComponent(
                        `Habari ${b.clientName}, your SINYORA GEE appointment (${b.id}) on ${b.appointmentDate} at ${b.appointmentTime} is ${b.status.toLowerCase()}!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.78rem',
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT ORDERS */}
        {subTab === 'orders' && (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {orders.length === 0 ? (
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  background: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px dashed var(--gold-border)',
                  color: 'var(--text-muted)',
                  fontSize: '0.86rem',
                }}
              >
                No product orders yet.
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--gold-border)',
                    padding: '1rem',
                    display: 'grid',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{o.clientName}</strong>
                    <span className="gold-shimmer-badge">
                      {o.id} • {o.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    📞 {o.clientPhone} • 📍 {o.deliveryLocation}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-color)' }}>
                    {o.items.map((i) => `${i.name} x${i.quantity}`).join(', ')} —{' '}
                    {formatTsh(o.totalPrice)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.3rem' }}>
                    {o.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(o.id, 'Processing')}
                        className="btn-primary"
                        style={{ padding: '0.38rem 0.8rem', fontSize: '0.76rem' }}
                      >
                        Confirm Order
                      </button>
                    )}
                    {o.status === 'Processing' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(o.id, 'Delivered')}
                        className="btn-gold"
                        style={{ padding: '0.38rem 0.8rem', fontSize: '0.76rem' }}
                      >
                        Mark Delivered
                      </button>
                    )}
                    <a
                      href={`https://wa.me/255${o.clientPhone
                        .replace(/\D/g, '')
                        .replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{
                        padding: '0.38rem 0.8rem',
                        fontSize: '0.76rem',
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: ADD PRODUCT (WITH PHONE CAMERA & PUSH ALERT TO CLIENTS) */}
        {subTab === 'add-product' && (
          <form
            onSubmit={handlePublishProduct}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '18px',
              border: '1.5px solid var(--gold-primary)',
              padding: '1.1rem',
              display: 'grid',
              gap: '0.85rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem' }}>
              Upload New Cosmetics Product
            </h3>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoPick}
              style={{ display: 'none' }}
            />

            <div
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              style={{
                aspectRatio: '16 / 9',
                borderRadius: '14px',
                border: '2px dashed var(--gold-primary)',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
                display: 'grid',
                placeContent: 'center',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {prodImage ? (
                <img
                  src={prodImage}
                  alt="Preview"
                  style={{ inlineSize: '100%', blockSize: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'grid', gap: '0.35rem', placeItems: 'center', padding: '1rem' }}>
                  <ImagePlus size={26} color="var(--brand-color)" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                    Tap to Take or Choose Product Photo
                  </span>
                </div>
              )}
            </div>

            <input
              type="text"
              required
              placeholder="Product Name *"
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              className="form-input"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <input
                type="number"
                required
                min={0}
                step={500}
                placeholder="Price (Tsh) *"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                className="form-input"
              />
              <input
                type="number"
                required
                min={0}
                placeholder="Stock *"
                value={prodStock}
                onChange={(e) => setProdStock(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <select
                value={prodTag}
                onChange={(e) => setProdTag(e.target.value as ProductTag)}
                className="form-select"
              >
                {PRODUCT_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

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

            <textarea
              rows={2}
              placeholder="Benefits & how to use..."
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              className="form-textarea"
            />

            <button type="submit" className="btn-primary">
              <Camera size={16} />
              <span>Publish &amp; Notify Clients</span>
            </button>
          </form>
        )}

        {/* TAB 4: SHOP CATALOG */}
        {subTab === 'catalog' && (
          <div style={{ display: 'grid', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {products.length} products • {services.length} active treatments
            </div>
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '14px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--gold-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      inlineSize: '52px',
                      blockSize: '52px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--brand-color)', fontWeight: 700 }}>
                      {formatTsh(p.price)} • Stock: {p.stock}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteProduct(p.id)}
                  className="btn-outline"
                  style={{ padding: '0.35rem 0.55rem', color: 'var(--danger)' }}
                  aria-label={`Delete ${p.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

