'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  MapPin,
  MessageCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { AVAILABLE_TIME_SLOTS, STUDIO_INFO } from '@/data/initialData';
import { PaymentMethod, ServiceBooking } from '@/types';
import { buildWhatsAppBookingUrl, formatTsh } from '@/utils/format';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'M-Pesa',
  'Tigo Pesa',
  'Airtel Money',
  'HaloPesa',
  'Cash at Studio',
];

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const {
    services,
    selectedServicesForBooking,
    toggleServiceForBooking,
    createBooking,
    currentUser,
  } = useStore();

  const todayStr = new Date().toISOString().split('T')[0];

  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [hostelOrRoom, setHostelOrRoom] = useState(
    currentUser?.hostel || 'Royal Hostel'
  );
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [appointmentTime, setAppointmentTime] = useState(
    AVAILABLE_TIME_SLOTS[1]
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('M-Pesa');
  const [transactionRef, setTransactionRef] = useState('');
  const [skinNotes, setSkinNotes] = useState('');
  const [completedBooking, setCompletedBooking] =
    useState<ServiceBooking | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const totalPrice = selectedServicesForBooking.reduce(
    (sum, s) => sum + s.price,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedServicesForBooking.length === 0) {
      setErrorMsg('Please select at least one facial, massage, or makeup service.');
      return;
    }

    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMsg('Please enter your name and WhatsApp/mobile phone number.');
      return;
    }

    const created = createBooking({
      clientId: currentUser?.id,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      hostelOrRoom: hostelOrRoom.trim() || 'Royal Hostel',
      services: selectedServicesForBooking.map((s) => ({
        serviceId: s.id,
        name: s.name,
        price: s.price,
        duration: s.duration,
      })),
      totalPrice,
      appointmentDate,
      appointmentTime,
      paymentMethod,
      transactionRef: transactionRef.trim() || undefined,
      skinNotes: skinNotes.trim() || undefined,
    });

    setCompletedBooking(created);
  };

  const resetAndClose = () => {
    setCompletedBooking(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={resetAndClose}>
      <div
        className="modal-sheet"
        style={{ maxInlineSize: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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
                letterSpacing: '0.1em',
                color: 'var(--brand-color)',
              }}
            >
              SINYORA GEE • {STUDIO_INFO.location}
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>
              {completedBooking
                ? 'Booking Confirmed!'
                : 'Book Your Spa or Facial Session'}
            </h3>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="btn-outline"
            style={{ padding: '0.45rem 0.65rem' }}
            aria-label="Close booking dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="scrollable-drawer-body"
          style={{ padding: '1.25rem 1.35rem' }}
        >
          {completedBooking ? (
            /* Confirmation View */
            <div style={{ textAlign: 'center', paddingBlock: '1rem' }}>
              <div
                style={{
                  inlineSize: '64px',
                  blockSize: '64px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'grid',
                  placeContent: 'center',
                  marginInline: 'auto',
                  marginBlockEnd: '1rem',
                }}
              >
                <CheckCircle2 size={34} />
              </div>

              <span className="gold-shimmer-badge">
                Booking Reference: {completedBooking.id}
              </span>

              <h4
                style={{
                  fontSize: '1.45rem',
                  marginBlock: '0.65rem 0.35rem',
                }}
              >
                Asante, {completedBooking.clientName}!
              </h4>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  marginBlockEnd: '1.25rem',
                }}
              >
                Your appointment for{' '}
                <strong>{completedBooking.appointmentDate}</strong> at{' '}
                <strong>{completedBooking.appointmentTime}</strong> has been
                logged for management review.
              </p>

              <div
                style={{
                  textAlign: 'left',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.15rem',
                  marginBlockEnd: '1.35rem',
                  fontSize: '0.88rem',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    marginBlockEnd: '0.5rem',
                    color: 'var(--brand-color)',
                  }}
                >
                  Selected Services:
                </div>
                {completedBooking.services.map((s) => (
                  <div
                    key={s.serviceId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlock: '0.25rem',
                      borderBottom: '1px dashed rgba(212, 175, 55, 0.35)',
                    }}
                  >
                    <span>{s.name}</span>
                    <strong>{formatTsh(s.price)}</strong>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.65rem',
                    fontSize: '1.02rem',
                    fontWeight: 800,
                  }}
                >
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--brand-color)' }}>
                    {formatTsh(completedBooking.totalPrice)}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: '0.45rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Payment Method: <strong>{completedBooking.paymentMethod}</strong>{' '}
                  • Location: <strong>{ STUDIO_INFO.location }</strong>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  justifyContent: 'center',
                }}
              >
                <a
                  href={buildWhatsAppBookingUrl({
                    bookingId: completedBooking.id,
                    clientName: completedBooking.clientName,
                    clientPhone: completedBooking.clientPhone,
                    hostel: completedBooking.hostelOrRoom,
                    date: completedBooking.appointmentDate,
                    time: completedBooking.appointmentTime,
                    services: completedBooking.services,
                    total: completedBooking.totalPrice,
                    paymentMethod: completedBooking.paymentMethod,
                    transactionRef: completedBooking.transactionRef,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <MessageCircle size={18} />
                  <span>Send Fast Alert on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="btn-outline"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
              }}
            >
              {errorMsg && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--danger-bg)',
                    color: 'var(--danger)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* Step 1: Selected Treatments + Quick Add */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBlockEnd: '0.65rem',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Sparkles size={15} color="var(--brand-color)" />
                    1. Selected Treatments ({selectedServicesForBooking.length})
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      color: 'var(--brand-color)',
                      fontSize: '0.98rem',
                    }}
                  >
                    Total: {formatTsh(totalPrice)}
                  </span>
                </div>

                {selectedServicesForBooking.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      marginBlockEnd: '0.75rem',
                    }}
                  >
                    {selectedServicesForBooking.map((srv) => (
                      <div
                        key={srv.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'var(--bg-surface)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '10px',
                          border: '1px solid var(--brand-border)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div>
                          <strong>{srv.name}</strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                          }}
                        >
                          <strong style={{ color: 'var(--brand-color)' }}>
                            {formatTsh(srv.price)}
                          </strong>
                          <button
                            type="button"
                            onClick={() => toggleServiceForBooking(srv)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--danger)',
                              display: 'grid',
                              placeContent: 'center',
                            }}
                            aria-label={`Remove ${srv.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Service Picker Dropdown */}
                <label className="form-label" htmlFor="quick-add-service">
                  {selectedServicesForBooking.length === 0
                    ? 'Choose a treatment to start:'
                    : 'Add another service to your visit:'}
                </label>
                <select
                  id="quick-add-service"
                  className="form-select"
                  value=""
                  onChange={(e) => {
                    const found = services.find((s) => s.id === e.target.value);
                    if (found) toggleServiceForBooking(found);
                  }}
                  style={{ marginTop: '0.35rem', fontSize: '0.86rem' }}
                >
                  <option value="">
                    + Tap to add a Facial, Massage, Makeup, or Bridal service...
                  </option>
                  {services.map((srv) => {
                    const already = selectedServicesForBooking.some(
                      (s) => s.id === srv.id
                    );
                    return (
                      <option key={srv.id} value={srv.id}>
                        {already ? '✓ ' : '+ '}
                        {srv.name} — {formatTsh(srv.price)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Step 2: Date & Time Slot */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.85rem',
                }}
              >
                <div className="form-field">
                  <label className="form-label" htmlFor="booking-date">
                    <Calendar
                      size={14}
                      style={{ display: 'inline', marginInlineEnd: '0.3rem' }}
                    />
                    Preferred Date *
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    min={todayStr}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="booking-time">
                    <Clock
                      size={14}
                      style={{ display: 'inline', marginInlineEnd: '0.3rem' }}
                    />
                    Time Slot *
                  </label>
                  <select
                    id="booking-time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="form-select"
                  >
                    {AVAILABLE_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Student / Client Details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.85rem',
                }}
              >
                <div className="form-field">
                  <label className="form-label" htmlFor="booking-client-name">
                    Your Full Name *
                  </label>
                  <input
                    id="booking-client-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="e.g. Amina Juma"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="booking-client-phone">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    id="booking-client-phone"
                    name="tel"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="e.g. 0712 345 678"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="booking-hostel">
                  <MapPin
                    size={14}
                    style={{ display: 'inline', marginInlineEnd: '0.3rem' }}
                  />
                  Your Hostel / Campus Location
                </label>
                <input
                  id="booking-hostel"
                  type="text"
                  placeholder="e.g. Royal Hostel, Block B / Off-Campus"
                  value={hostelOrRoom}
                  onChange={(e) => setHostelOrRoom(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Step 4: Payment Method (Mobile Money or Cash) */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    marginBlockEnd: '0.6rem',
                  }}
                >
                  Choose Payment Option (Mobile Money or Cash):
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBlockEnd: '0.85rem',
                  }}
                >
                  {PAYMENT_METHODS.map((method) => {
                    const active = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        style={{
                          padding: '0.45rem 0.9rem',
                          borderRadius: '999px',
                          border: active
                            ? '1.5px solid var(--brand-color)'
                            : '1px solid var(--gold-border)',
                          background: active
                            ? 'var(--brand-color)'
                            : 'var(--bg-surface)',
                          color: active ? '#fff' : 'var(--text-primary)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>

                {paymentMethod !== 'Cash at Studio' ? (
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--brand-border)',
                      fontSize: '0.83rem',
                    }}
                  >
                    <div style={{ marginBlockEnd: '0.5rem' }}>
                      <Phone
                        size={13}
                        style={{ display: 'inline', marginInlineEnd: '0.3rem' }}
                      />
                      Send <strong>{paymentMethod}</strong> payment to official
                      studio number: <strong>{STUDIO_INFO.phone}</strong>{' '}
                      (SINYORA GEE).
                    </div>
                    <input
                      type="text"
                      placeholder="Optional: Paste Mobile Money Confirmation Code / Name"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.84rem', padding: '0.55rem 0.8rem' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    You will pay <strong>{formatTsh(totalPrice)}</strong> in cash
                    upon arrival at <strong>{STUDIO_INFO.location}</strong>.
                  </div>
                )}
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="booking-notes">
                  Special Skin Notes or Requests (Optional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  placeholder="Any sensitive skin areas, allergies, or bridal event details..."
                  value={skinNotes}
                  onChange={(e) => setSkinNotes(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ inlineSize: '100%', paddingBlock: '0.95rem' }}
              >
                <Plus size={18} />
                <span>
                  Confirm Booking • {formatTsh(totalPrice)}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

