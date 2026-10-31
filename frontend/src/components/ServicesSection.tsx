'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Plus,
  Calendar,
  Search,
  Crown,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SERVICE_CATEGORIES } from '@/data/initialData';
import { ServiceCategoryId, SpaService } from '@/types';
import { formatTsh } from '@/utils/format';

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

export default function ServicesSection({
  onOpenBooking,
}: ServicesSectionProps) {
  const {
    services,
    selectedServicesForBooking,
    toggleServiceForBooking,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<
    ServiceCategoryId | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookDirect = (service: SpaService) => {
    const isAlreadySelected = selectedServicesForBooking.some(
      (s) => s.id === service.id
    );
    if (!isAlreadySelected) {
      toggleServiceForBooking(service);
    }
    onOpenBooking();
  };

  const categoriesToDisplay =
    activeCategory === 'all'
      ? SERVICE_CATEGORIES
      : SERVICE_CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <section
      id="services"
      style={{
        paddingBlock: 'clamp(2.5rem, 6vw, 5rem)',
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
            marginBlockEnd: '2rem',
          }}
        >
          <span
            className="rose-pill-badge"
            style={{ marginBlockEnd: '0.65rem' }}
          >
            <Sparkles size={13} /> Official Studio Menu &amp; Rates
          </span>
          <h2
            className="section-fluid-title"
            style={{
              color: 'var(--text-primary)',
              marginBlockEnd: '0.65rem',
            }}
          >
            Luxury Treatments &amp; Service Menu
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
            Select one or more treatments below to book your private session at{' '}
            <strong>Royal Hostel</strong>. All prices are transparent and
            tailored for university students and brides-to-be.
          </p>
        </div>

        {/* Sticky Filter & Search Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'safe center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBlockEnd: '2.5rem',
            padding: '0.85rem 1rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gold-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Category Filter Pills (Scrollable on Phone, Wrapped on PC) */}
          <div className="horizontal-pills" style={{ flex: '1 1 auto' }}>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.5rem 1.05rem',
                borderRadius: '999px',
                border:
                  activeCategory === 'all'
                    ? '1px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                background:
                  activeCategory === 'all'
                    ? 'var(--brand-color)'
                    : 'var(--bg-secondary)',
                color:
                  activeCategory === 'all' ? '#ffffff' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.84rem',
                whiteSpace: 'nowrap',
              }}
            >
              All Services ({services.length})
            </button>

            {SERVICE_CATEGORIES.map((cat) => {
              const count = services.filter(
                (s) => s.categoryId === cat.id
              ).length;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1.05rem',
                    borderRadius: '999px',
                    border: isSelected
                      ? '1px solid var(--brand-color)'
                      : '1px solid var(--gold-border)',
                    background: isSelected
                      ? 'var(--brand-color)'
                      : 'var(--bg-secondary)',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.title} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 230px',
              maxInlineSize: '320px',
            }}
          >
            <Search
              size={16}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facial, massage, glam..."
              enterKeyHint="search"
              className="form-input"
              style={{
                paddingInlineStart: '2.4rem',
                paddingBlock: '0.55rem',
                borderRadius: '999px',
                fontSize: '0.86rem',
              }}
            />
          </div>
        </div>

        {/* Dedicated Category Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {categoriesToDisplay.map((category) => {
            const categoryServices = services.filter((srv) => {
              const matchesCat = srv.categoryId === category.id;
              const matchesSearch =
                !searchQuery.trim() ||
                srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                srv.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
              return matchesCat && matchesSearch;
            });

            if (categoryServices.length === 0) return null;

            return (
              <div
                key={category.id}
                id={category.id === 'bridal' ? 'bridal' : `section-${category.id}`}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(1.25rem, 3vw, 2.25rem)',
                }}
              >
                {/* Category Header Banner styled after the Flyer's luxury headers */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'safe center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBlockEnd: '1.6rem',
                    paddingBottom: '1.1rem',
                    borderBottom: '1px solid var(--gold-border)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        background:
                          'linear-gradient(90deg, var(--brand-color) 0%, var(--brand-hover) 100%)',
                        color: '#ffffff',
                        padding: '0.35rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBlockEnd: '0.5rem',
                      }}
                    >
                      <Crown size={13} /> {category.badge}
                    </div>
                    <h3
                      style={{
                        fontSize: 'clamp(1.4rem, 2.6vw, 2rem)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {category.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.2rem',
                      }}
                    >
                      {category.description}
                    </p>
                  </div>

                  <div
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontStyle: 'italic',
                      fontWeight: 700,
                      color: 'var(--brand-color)',
                      fontSize: '0.98rem',
                      background: 'var(--bg-surface)',
                      padding: '0.45rem 1rem',
                      borderRadius: '999px',
                      border: '1px solid var(--brand-border)',
                    }}
                  >
                    {category.tagline}
                  </div>
                </div>

                {/* CSS Subgrid Service Cards */}
                <div className="cards-subgrid-container">
                  {categoryServices.map((srv) => {
                    const isSelected = selectedServicesForBooking.some(
                      (s) => s.id === srv.id
                    );

                    return (
                      <article
                        key={srv.id}
                        className="subgrid-card"
                        style={{
                          borderColor: isSelected
                            ? 'var(--brand-color)'
                            : undefined,
                          boxShadow: isSelected
                            ? '0 0 0 2px var(--brand-color), var(--shadow-md)'
                            : undefined,
                        }}
                      >
                        {/* Row 1: Image & Top Badges */}
                        <div
                          style={{
                            position: 'relative',
                            aspectRatio: '16 / 10',
                            background: '#221a20',
                            overflow: 'clip',
                          }}
                        >
                          <img
                            src={srv.image}
                            alt={srv.name}
                            loading="lazy"
                            style={{
                              inlineSize: '100%',
                              blockSize: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '0.75rem',
                              left: '0.75rem',
                              right: '0.75rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            {srv.badge && (
                              <span
                                style={{
                                  background:
                                    srv.price === 0
                                      ? '#15803d'
                                      : 'rgba(20, 17, 21, 0.84)',
                                  color: '#fff',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: '999px',
                                  backdropFilter: 'blur(6px)',
                                }}
                              >
                                {srv.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Row 2: Title & Description */}
                        <div style={{ padding: '1.15rem 1.25rem 0.5rem' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                              marginBlockEnd: '0.45rem',
                            }}
                          >
                            <h4
                              style={{
                                fontSize: '1.18rem',
                                color: 'var(--text-primary)',
                              }}
                            >
                              {srv.name}
                            </h4>
                          </div>
                          <p
                            style={{
                              fontSize: '0.86rem',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {srv.description}
                          </p>
                        </div>

                        {/* Row 3: Price & Action Buttons */}
                        <div
                          style={{
                            padding: '0.9rem 1.25rem 1.2rem',
                            display: 'flex',
                            alignItems: 'safe center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            borderTop: '1px solid rgba(230, 204, 128, 0.45)',
                            marginTop: '0.5rem',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: '0.68rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: 'var(--text-muted)',
                                fontWeight: 600,
                              }}
                            >
                              Service Price
                            </div>
                            <div
                              style={{
                                fontSize: '1.18rem',
                                fontWeight: 800,
                                color:
                                  srv.price === 0
                                    ? 'var(--success)'
                                    : 'var(--brand-color)',
                              }}
                            >
                              {formatTsh(srv.price)}
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => toggleServiceForBooking(srv)}
                              className={
                                isSelected ? 'btn-gold' : 'btn-outline'
                              }
                              style={{
                                padding: '0.5rem 0.85rem',
                                fontSize: '0.8rem',
                              }}
                              title="Add or remove from multi-service booking"
                            >
                              {isSelected ? (
                                <>
                                  <Check size={14} /> Added
                                </>
                              ) : (
                                <>
                                  <Plus size={14} /> Select
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleBookDirect(srv)}
                              className="btn-primary"
                              style={{
                                padding: '0.5rem 0.95rem',
                                fontSize: '0.8rem',
                              }}
                            >
                              <Calendar size={14} /> Book
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Multi-Service Selection Bar when services are selected */}
        {selectedServicesForBooking.length > 0 && (
          <div
            style={{
              position: 'sticky',
              bottom: '4.5rem',
              zIndex: 45,
              marginTop: '2rem',
              background: 'var(--dark-surface)',
              color: '#fffdf9',
              padding: '0.95rem 1.35rem',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--gold-primary)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'safe center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#f5e6b8',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {selectedServicesForBooking.length} Treatment(s) Selected
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                Total Estimate:{' '}
                <span style={{ color: '#f5e6b8' }}>
                  {formatTsh(
                    selectedServicesForBooking.reduce(
                      (sum, s) => sum + s.price,
                      0
                    )
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenBooking}
              className="btn-gold"
              style={{ padding: '0.65rem 1.4rem' }}
            >
              <Calendar size={17} />
              <span>Complete Booking Now</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

