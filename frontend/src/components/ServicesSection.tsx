'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Crown,
  Flower2,
  Brush,
  Heart,
  X,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SERVICE_CATEGORIES } from '@/data/initialData';
import { ServiceCategory, ServiceCategoryId, SpaService } from '@/types';
import { formatTsh } from '@/utils/format';

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

const FLYER_SECTION_META: Record<
  ServiceCategoryId,
  {
    layout: 'side' | 'bottom';
    photoSrc: string;
    photoAlt: string;
  }
> = {
  facial: {
    layout: 'side',
    photoSrc: '/flyer/facial-section.jpg',
    photoAlt: 'Facial treatment at Sinyora Gee',
  },
  massage: {
    layout: 'bottom',
    photoSrc: '/flyer/massage-section.jpg',
    photoAlt: 'Massage and aromatherapy at Sinyora Gee',
  },
  bridal: {
    layout: 'side',
    photoSrc: '/flyer/bridal-section.jpg',
    photoAlt: 'Bridal and event package at Sinyora Gee',
  },
  makeup: {
    layout: 'bottom',
    photoSrc: '/flyer/makeup-section.jpg',
    photoAlt: 'Makeup artistry at Sinyora Gee',
  },
  additional: {
    layout: 'bottom',
    photoSrc: '/flyer/additional-section.jpg',
    photoAlt: 'Eyebrow shaping, eyelash extensions and hair care',
  },
};

function CategoryIcon({ id }: { id: ServiceCategoryId }) {
  switch (id) {
    case 'facial':
      return <Flower2 size={15} color="#ffffff" />;
    case 'massage':
      return <Sparkles size={15} color="#ffffff" />;
    case 'bridal':
      return <Crown size={15} color="#ffffff" />;
    case 'makeup':
      return <Brush size={15} color="#ffffff" />;
    case 'additional':
      return <Heart size={15} color="#ffffff" />;
  }
}

function LotusBullet() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#d81b68',
        fontSize: '0.82rem',
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      ❀
    </span>
  );
}

export default function ServicesSection({
  onOpenBooking,
}: ServicesSectionProps) {
  const { services, clearBookingSelection, toggleServiceForBooking } =
    useStore();

  // Step 1 popup state: when user clicks a specific service section, its subservices pop up
  const [activePopupCategory, setActivePopupCategory] =
    useState<ServiceCategory | null>(null);

  // Step 2: when user selects a subservice inside the popup, proceed immediately to BookingModal
  const handleSelectSubserviceToBook = (subservice: SpaService) => {
    clearBookingSelection();
    toggleServiceForBooking(subservice);
    setActivePopupCategory(null);
    onOpenBooking();
  };

  const popupSubservices = activePopupCategory
    ? services.filter((s) => s.categoryId === activePopupCategory.id)
    : [];

  return (
    <section
      id="services"
      style={{
        paddingBlock: 'clamp(2.25rem, 5vw, 4rem)',
        background: 'var(--bg-primary)',
      }}
    >
      <div className="page-shell">
        {/* Section Heading */}
        <div
          className="section-header-container"
          style={{
            textAlign: 'center',
            maxInlineSize: '760px',
            marginInline: 'auto',
            marginBlockEnd: '1.5rem',
          }}
        >
          <span
            className="rose-pill-badge"
            style={{ marginBlockEnd: '0.55rem' }}
          >
            <Sparkles size={13} /> Interactive Studio Price Flyer
          </span>
          <h2
            className="section-fluid-title"
            style={{
              color: 'var(--text-primary)',
              marginBlockEnd: '0.5rem',
            }}
          >
            Luxury Treatments &amp; Service Menu
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Tap any service section below to view its treatments and book your
            session at <strong>Royal Hostel</strong>.
          </p>
        </div>

        {/* Quick Section Selector Pills */}
        <div
          className="horizontal-pills"
          style={{
            justifyContent: 'center',
            marginBlockEnd: '1.5rem',
          }}
        >
          {SERVICE_CATEGORIES.map((cat) => {
            const count = services.filter(
              (s) => s.categoryId === cat.id
            ).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActivePopupCategory(cat)}
                style={{
                  padding: '0.48rem 1rem',
                  borderRadius: '999px',
                  border: '1px solid var(--gold-border)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <span style={{ color: '#d81b68' }}>❀</span>
                <span>
                  {cat.title} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Price Flyer Grid (5 Sections matching the exact Flyer boxes, photos & prices) */}
        <div className="flyer-sections-grid">
          {SERVICE_CATEGORIES.map((category) => {
            const categoryServices = services.filter(
              (srv) => srv.categoryId === category.id
            );
            const meta = FLYER_SECTION_META[category.id];
            const sectionDomId =
              category.id === 'bridal' ? 'bridal' : `section-${category.id}`;

            return (
              <article
                key={category.id}
                id={sectionDomId}
                className="flyer-section-card"
                role="button"
                tabIndex={0}
                aria-label={`Open ${category.title} subservices`}
                onClick={() => setActivePopupCategory(category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePopupCategory(category);
                  }
                }}
              >
                {/* Top Header Row: Exact Flyer Magenta Pill + Interactive Tap Hint */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div className="flyer-pill-header">
                    <span className="flyer-pill-icon">
                      <CategoryIcon id={category.id} />
                    </span>
                    <span>{category.title}</span>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      color: '#b51053',
                      background: 'rgba(216, 27, 104, 0.09)',
                      border: '1px solid rgba(216, 27, 104, 0.25)',
                      padding: '0.24rem 0.65rem',
                      borderRadius: '999px',
                    }}
                  >
                    <span>Select</span>
                    <ChevronRight size={13} />
                  </span>
                </div>

                {/* Section Body: Side-by-Side (Facial & Bridal) or Top-List + Bottom-Photos (Massage, Makeup, Additional) */}
                {meta.layout === 'side' ? (
                  <div className="flyer-side-by-side-body">
                    {/* Left: Exact Service Names & Exact Prices */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {categoryServices.map((srv) => (
                        <div key={srv.id} className="flyer-service-row">
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontWeight: 600,
                              color: '#23141b',
                            }}
                          >
                            <LotusBullet />
                            <span>{srv.name}</span>
                          </span>
                          <strong
                            style={{
                              color: '#c2185b',
                              fontWeight: 800,
                              whiteSpace: 'nowrap',
                              fontSize: '0.86rem',
                            }}
                          >
                            {formatTsh(srv.price)}
                          </strong>
                        </div>
                      ))}
                    </div>

                    {/* Right: Exact Picture from the Flyer */}
                    <div
                      style={{
                        borderRadius: '16px',
                        overflow: 'clip',
                        border: '1.5px solid rgba(212, 175, 55, 0.55)',
                        boxShadow: '0 6px 16px rgba(32, 16, 24, 0.12)',
                        background: '#f6ebe2',
                        alignSelf: 'stretch',
                        display: 'flex',
                      }}
                    >
                      <img
                        src={meta.photoSrc}
                        alt={meta.photoAlt}
                        style={{
                          inlineSize: '100%',
                          blockSize: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      marginBlock: '0.65rem 0.35rem',
                    }}
                  >
                    {/* Top: Exact Service Names & Exact Prices */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {categoryServices.map((srv) => (
                        <div key={srv.id} className="flyer-service-row">
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontWeight: 600,
                              color: '#23141b',
                            }}
                          >
                            <LotusBullet />
                            <span>{srv.name}</span>
                          </span>
                          <strong
                            style={{
                              color: '#c2185b',
                              fontWeight: 800,
                              whiteSpace: 'nowrap',
                              fontSize: '0.88rem',
                            }}
                          >
                            {formatTsh(srv.price)}
                          </strong>
                        </div>
                      ))}
                    </div>

                    {/* Bottom: Exact 3-Photo Strip from the Flyer */}
                    <div
                      style={{
                        borderRadius: '12px',
                        overflow: 'clip',
                        border: '1.5px solid rgba(212, 175, 55, 0.5)',
                        background: '#f6ebe2',
                      }}
                    >
                      <img
                        src={meta.photoSrc}
                        alt={meta.photoAlt}
                        style={{
                          inlineSize: '100%',
                          blockSize: 'auto',
                          display: 'block',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Cursive Script Tagline from the Flyer */}
                <div className="flyer-script-tagline">{category.tagline}</div>
              </article>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          STEP 1 POPUP MODAL: Subservices Popup when a Service Section is clicked
          ===================================================================== */}
      {activePopupCategory && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subservices-popup-title"
          onClick={() => setActivePopupCategory(null)}
        >
          <div
            className="modal-sheet"
            style={{
              maxInlineSize: '560px',
              background: 'linear-gradient(180deg, #fffdfa 0%, #f9efe7 100%)',
              border: '2px solid #d4af37',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid rgba(212, 175, 55, 0.45)',
                background: 'rgba(255, 250, 245, 0.9)',
              }}
            >
              <div>
                <div className="flyer-pill-header" style={{ fontSize: '0.82rem' }}>
                  <span className="flyer-pill-icon">
                    <CategoryIcon id={activePopupCategory.id} />
                  </span>
                  <span id="subservices-popup-title">
                    {activePopupCategory.title}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.35rem',
                    fontWeight: 600,
                  }}
                >
                  Select the specific treatment you want to book:
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePopupCategory(null)}
                className="btn-outline"
                style={{ padding: '0.4rem 0.6rem' }}
                aria-label="Close subservices popup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Popup Body: Interactive List of Subservices */}
            <div
              className="scrollable-drawer-body"
              style={{
                padding: '1rem 1.25rem 1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              {popupSubservices.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectSubserviceToBook(sub)}
                  style={{
                    inlineSize: '100%',
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '1.5px solid rgba(212, 175, 55, 0.55)',
                    boxShadow: '0 4px 12px rgba(32, 16, 24, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontWeight: 800,
                        fontSize: '0.98rem',
                        color: '#23141b',
                        marginBlockEnd: '0.2rem',
                      }}
                    >
                      <LotusBullet />
                      <span>{sub.name}</span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                      }}
                    >
                      {sub.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '0.35rem',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.96rem',
                        color: sub.price === 0 ? 'var(--success)' : '#c2185b',
                      }}
                    >
                      {formatTsh(sub.price)}
                    </span>

                    <span
                      className="btn-primary"
                      style={{
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.76rem',
                        pointerEvents: 'none',
                      }}
                    >
                      <Calendar size={13} />
                      <span>Book</span>
                    </span>
                  </div>
                </button>
              ))}

              <div className="flyer-script-tagline" style={{ marginTop: '0.4rem' }}>
                {activePopupCategory.tagline}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
