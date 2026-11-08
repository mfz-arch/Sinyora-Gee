'use client';

import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Calendar,
  LogOut,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  User,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { STUDIO_INFO } from '@/data/initialData';
import { PaymentMethod } from '@/types';
import { formatTsh } from '@/utils/format';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'M-Pesa',
  'Tigo Pesa',
  'Airtel Money',
  'HaloPesa',
  'Cash at Studio',
];

export default function ClientPortalModal({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenAdmin,
}: ClientPortalModalProps) {
  const {
    currentUser,
    logout,
    cart,
    updateCartQuantity,
    removeFromCart,
    createProductOrder,
    bookings,
    orders,
  } = useStore();

  const [tab, setTab] = useState<'cart' | 'history'>('cart');
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [deliveryLocation, setDeliveryLocation] = useState(
    currentUser?.hostel || 'Royal Hostel'
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('M-Pesa');
  const [transactionRef, setTransactionRef] = useState('');
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [orderWhatsappUrl, setOrderWhatsappUrl] = useState<string>('');

  if (!isOpen) return null;

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const myBookings = currentUser
    ? bookings.filter(
        (b) =>
          b.clientId === currentUser.id ||
          b.clientPhone.replace(/\s+/g, '') ===
            currentUser.phone.replace(/\s+/g, '')
      )
    : bookings;

  const myOrders = currentUser
    ? orders.filter(
        (o) =>
          o.clientId === currentUser.id ||
          o.clientPhone.replace(/\s+/g, '') ===
            currentUser.phone.replace(/\s+/g, '')
      )
    : orders;

  const handleCheckoutProducts = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const finalName =
      clientName.trim() || currentUser?.name || 'Student Client';
    const finalPhone = clientPhone.trim() || currentUser?.phone || '';
    const finalLocation = deliveryLocation.trim() || 'Royal Hostel';
    const itemsSnapshot = cart.map((c) => ({
      productId: c.product.id,
      name: c.product.name,
      tag: c.product.tag,
      price: c.product.price,
      quantity: c.quantity,
    }));

    const order = createProductOrder({
      clientId: currentUser?.id,
      clientName: finalName,
      clientPhone: finalPhone,
      deliveryLocation: finalLocation,
      items: itemsSnapshot,
      totalPrice: cartTotal,
      paymentMethod,
      transactionRef: transactionRef.trim() || undefined,
    });

    const itemsListText = itemsSnapshot
      .map(
        (i) =>
          `• ${i.name} x${i.quantity} (${formatTsh(i.price * i.quantity)})`
      )
      .join('\n');

    const waText = [
      `✦ *NEW PRODUCT ORDER — SINYORA GEE* ✦`,
      `*Order Ref:* ${order.id}`,
      `*Client:* ${finalName}`,
      `*Phone:* ${finalPhone}`,
      `*Delivery / Pickup:* ${finalLocation}`,
      ``,
      `*Ordered Products:*`,
      itemsListText,
      ``,
      `*Total:* ${formatTsh(cartTotal)}`,
      `*Payment Method:* ${paymentMethod}`,
      transactionRef.trim() ? `*Ref/SMS:* ${transactionRef.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const waUrl = `https://wa.me/${STUDIO_INFO.whatsappInternational}?text=${encodeURIComponent(waText)}`;
    setOrderWhatsappUrl(waUrl);
    setOrderSuccessId(order.id);

    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        style={{ maxInlineSize: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.1rem 1.35rem',
            borderBottom: '1px solid var(--gold-border)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--brand-color)',
              }}
            >
              {currentUser
                ? `${currentUser.name} (${currentUser.phone})`
                : 'Guest Bag & Activity'}
            </div>
            <h3 style={{ fontSize: '1.22rem' }}>
              Skincare Bag &amp; My Bookings
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            style={{ padding: '0.4rem 0.6rem' }}
            aria-label="Close portal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Account Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.6rem',
            padding: '0.75rem 1.35rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--gold-border)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                setTab('cart');
                setOrderSuccessId(null);
              }}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '999px',
                border:
                  tab === 'cart'
                    ? '1px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                background:
                  tab === 'cart' ? 'var(--brand-color)' : 'var(--bg-secondary)',
                color: tab === 'cart' ? '#fff' : 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <ShoppingBag size={14} /> Shopping Bag ({cart.length})
            </button>

            <button
              type="button"
              onClick={() => setTab('history')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '999px',
                border:
                  tab === 'history'
                    ? '1px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                background:
                  tab === 'history'
                    ? 'var(--brand-color)'
                    : 'var(--bg-secondary)',
                color: tab === 'history' ? '#fff' : 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Calendar size={14} /> Bookings ({myBookings.length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem' }}>
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="btn-gold"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
              >
                <ShieldCheck size={14} /> Admin Portal
              </button>
            )}

            {currentUser ? (
              <button
                type="button"
                onClick={logout}
                className="btn-outline"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="btn-outline"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
              >
                <User size={14} /> Sign In / Sign Up
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className="scrollable-drawer-body"
          style={{ padding: '1.25rem 1.35rem' }}
        >
          {tab === 'cart' ? (
            orderSuccessId ? (
              <div style={{ textAlign: 'center', paddingBlock: '1.5rem' }}>
                <CheckCircle2
                  size={42}
                  color="var(--success)"
                  style={{ marginInline: 'auto', marginBlockEnd: '0.75rem' }}
                />
                <h4 style={{ fontSize: '1.35rem', marginBlockEnd: '0.4rem' }}>
                  Order {orderSuccessId} Placed!
                </h4>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    marginBlockEnd: '1.25rem',
                  }}
                >
                  Management at <strong>{STUDIO_INFO.location}</strong> has
                  received your skincare product order.
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '0.65rem',
                  }}
                >
                  {orderWhatsappUrl && (
                    <a
                      href={orderWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold"
                    >
                      <MessageCircle size={16} />
                      <span>Resend Order on WhatsApp</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderSuccessId(null);
                      setTab('history');
                    }}
                    className="btn-primary"
                  >
                    View Order Status
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div style={{ textAlign: 'center', paddingBlock: '2rem' }}>
                <ShoppingBag
                  size={36}
                  color="var(--text-muted)"
                  style={{ marginInline: 'auto', marginBlockEnd: '0.75rem' }}
                />
                <h4 style={{ fontSize: '1.15rem', marginBlockEnd: '0.35rem' }}>
                  Your Skincare Bag is Empty
                </h4>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Browse our Oils, Masks, Shampoos, and Serums in the Skincare
                  Shop section to add items.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleCheckoutProducts}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--gold-border)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        {item.product.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--brand-color)',
                          fontWeight: 600,
                        }}
                      >
                        {formatTsh(item.product.price)} each
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="btn-outline"
                        style={{ padding: '0.2rem 0.6rem' }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="btn-outline"
                        style={{ padding: '0.2rem 0.6rem' }}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--danger)',
                        }}
                        aria-label="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="form-input"
                  />
                </div>

                <input
                  type="text"
                  required
                  placeholder="Hostel / Room for Pickup or Delivery *"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="form-input"
                />

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.45rem',
                  }}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '999px',
                        border:
                          paymentMethod === m
                            ? '1.5px solid var(--brand-color)'
                            : '1px solid var(--gold-border)',
                        background:
                          paymentMethod === m
                            ? 'var(--brand-color)'
                            : 'var(--bg-surface)',
                        color:
                          paymentMethod === m ? '#fff' : 'var(--text-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {paymentMethod !== 'Cash at Studio' && (
                  <input
                    type="text"
                    placeholder={`Send ${paymentMethod} to ${STUDIO_INFO.phone} & paste SMS ref (Optional)`}
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="form-input"
                  />
                )}

                <button type="submit" className="btn-primary">
                  Place Product Order • {formatTsh(cartTotal)}
                </button>
              </form>
            )
          ) : (
            /* History Tab: Bookings & Orders */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: '1.05rem',
                    marginBlockEnd: '0.6rem',
                    color: 'var(--brand-color)',
                  }}
                >
                  My Booked Treatments ({myBookings.length})
                </h4>
                {myBookings.length === 0 ? (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    No appointments booked yet.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    {myBookings.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--gold-border)',
                          fontSize: '0.84rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBlockEnd: '0.35rem',
                          }}
                        >
                          <strong>
                            {b.id} • {b.appointmentDate} ({b.appointmentTime})
                          </strong>
                          <span className="rose-pill-badge">{b.status}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          {b.services.map((s) => s.name).join(', ')}
                        </div>
                        <div
                          style={{
                            marginTop: '0.35rem',
                            fontWeight: 700,
                            color: 'var(--brand-color)',
                          }}
                        >
                          {formatTsh(b.totalPrice)} ({b.paymentMethod})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4
                  style={{
                    fontSize: '1.05rem',
                    marginBlockEnd: '0.6rem',
                    color: 'var(--brand-color)',
                  }}
                >
                  My Skincare Product Orders ({myOrders.length})
                </h4>
                {myOrders.length === 0 ? (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    No product orders yet.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    {myOrders.map((o) => (
                      <div
                        key={o.id}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--gold-border)',
                          fontSize: '0.84rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBlockEnd: '0.35rem',
                          }}
                        >
                          <strong>{o.id}</strong>
                          <span className="gold-shimmer-badge">{o.status}</span>
                        </div>
                        <div>
                          {o.items
                            .map((i) => `${i.name} x${i.quantity}`)
                            .join(', ')}
                        </div>
                        <div
                          style={{
                            marginTop: '0.35rem',
                            fontWeight: 700,
                            color: 'var(--brand-color)',
                          }}
                        >
                          {formatTsh(o.totalPrice)} • {o.paymentMethod}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

