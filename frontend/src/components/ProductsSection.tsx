'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Droplets,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
  STUDIO_INFO,
} from '@/data/initialData';
import { ProductCategoryId, ProductTag } from '@/types';
import { formatTsh } from '@/utils/format';

interface ProductsSectionProps {
  onOpenAdminProducts: () => void;
  onOpenClientPortal: () => void;
  onOpenAuth: () => void;
}

export default function ProductsSection({
  onOpenAdminProducts,
  onOpenClientPortal,
  onOpenAuth,
}: ProductsSectionProps) {
  const { products, addToCart, currentUser } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategoryId | 'all'
  >('all');
  const [selectedTag, setSelectedTag] = useState<ProductTag | 'all'>('all');

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchTag = selectedTag === 'all' || p.tag === selectedTag;
    return matchCategory && matchTag;
  });

  return (
    <section
      id="products"
      style={{
        paddingBlock: 'clamp(2.5rem, 6vw, 5rem)',
        background:
          'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderTop: '1px solid var(--gold-border)',
        borderBottom: '1px solid var(--gold-border)',
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
            className="gold-shimmer-badge"
            style={{ marginBlockEnd: '0.65rem' }}
          >
            <Droplets size={14} /> Healthy Skin • Radiant You ♥
          </span>
          <h2
            className="section-fluid-title"
            style={{
              color: 'var(--text-primary)',
              marginBlockEnd: '0.6rem',
            }}
          >
            Skin Care &amp; Cosmetics Boutique
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
            Shop authentic Oils, Masks, Shampoos, Serums, Cleansers, and
            Natural &amp; Organic Skincare curated by{' '}
            <strong>SINYORA GEE</strong> for all skin types.
          </p>
        </div>

        {/* 5 Core Skincare Product Pillars from the Flyer */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '0.85rem',
            marginBlockEnd: '1.5rem',
          }}
        >
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count = products.filter(
              (p) => p.categoryId === cat.id
            ).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(active ? 'all' : cat.id)
                }
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: active
                    ? 'var(--brand-color)'
                    : 'var(--bg-surface)',
                  color: active ? '#ffffff' : 'var(--text-primary)',
                  border: active
                    ? '1.5px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBlockEnd: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                    }}
                  >
                    <CheckCircle2
                      size={15}
                      color={active ? '#f5e6b8' : 'var(--brand-color)'}
                    />
                    {cat.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.5rem',
                      borderRadius: '999px',
                      background: active
                        ? 'rgba(255,255,255,0.2)'
                        : 'var(--brand-soft)',
                      color: active ? '#fff' : 'var(--brand-color)',
                    }}
                  >
                    {count}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.76rem',
                    color: active ? '#f8e6ee' : 'var(--text-muted)',
                  }}
                >
                  {cat.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dedicated Product Type Sections: Oils, Masks, Shampoos, Serums, etc. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'safe center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBlockEnd: '2rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gold-border)',
          }}
        >
          <div className="horizontal-pills">
            <button
              type="button"
              onClick={() => {
                setSelectedTag('all');
                setSelectedCategory('all');
              }}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '999px',
                border:
                  selectedTag === 'all'
                    ? '1px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                background:
                  selectedTag === 'all'
                    ? 'var(--brand-color)'
                    : 'var(--bg-secondary)',
                color:
                  selectedTag === 'all' ? '#ffffff' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                whiteSpace: 'nowrap',
              }}
            >
              All Sections ({products.length})
            </button>

            {PRODUCT_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              const tagCount = products.filter((p) => p.tag === tag).length;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag(isSelected ? 'all' : tag)
                  }
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '999px',
                    border: isSelected
                      ? '1px solid var(--brand-color)'
                      : '1px solid var(--gold-border)',
                    background: isSelected
                      ? 'var(--brand-color)'
                      : 'var(--bg-secondary)',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tag} ({tagCount})
                </button>
              );
            })}
          </div>

          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={onOpenAdminProducts}
              className="btn-gold"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
            >
              <PlusCircle size={15} />
              <span>Add Products in Admin</span>
            </button>
          )}
        </div>

        {/* Blank State (Kept blank by default as requested, ready for Admin uploads) */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1.5px dashed var(--gold-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem',
              textAlign: 'center',
              maxInlineSize: '780px',
              marginInline: 'auto',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                inlineSize: '64px',
                blockSize: '64px',
                borderRadius: '50%',
                background: 'var(--brand-soft)',
                border: '1px solid var(--brand-border)',
                color: 'var(--brand-color)',
                display: 'grid',
                placeContent: 'center',
                marginInline: 'auto',
                marginBlockEnd: '1rem',
              }}
            >
              <Sparkles size={28} />
            </div>

            <h3
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                marginBlockEnd: '0.5rem',
              }}
            >
              {selectedTag !== 'all'
                ? `${selectedTag} Section — Ready for New Arrivals`
                : 'Skincare & Cosmetics Shelves Ready'}
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                maxInlineSize: '54ch',
                marginInline: 'auto',
                fontSize: '0.94rem',
                marginBlockEnd: '1.5rem',
              }}
            >
              Our dedicated sections for <strong>Oils</strong>,{' '}
              <strong>Masks</strong>, <strong>Shampoos</strong>,{' '}
              <strong>Serums</strong>, <strong>Body Care</strong>, and{' '}
              <strong>Organic Skincare</strong> are set up and ready. Management
              can upload products with photos and prices directly from the Admin
              Portal.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.85rem',
              }}
            >
              <a
                href={`https://wa.me/${STUDIO_INFO.whatsappInternational}?text=${encodeURIComponent(
                  'Habari Sinyora Gee! I would like to inquire about available Skincare Products (Oils, Masks, Shampoos).'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <MessageCircle size={17} />
                <span>Ask Available Stock on WhatsApp</span>
              </a>

              {currentUser?.role === 'admin' ? (
                <button
                  type="button"
                  onClick={onOpenAdminProducts}
                  className="btn-gold"
                >
                  <PlusCircle size={17} />
                  <span>Upload First Product Now</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="btn-outline"
                >
                  <ShieldCheck size={17} />
                  <span>Management Login to Add Products</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Live Product Grid when Management adds products */
          <div className="cards-subgrid-container">
            {filteredProducts.map((product) => (
              <article key={product.id} className="subgrid-card">
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4 / 3',
                    background: '#f8f1ec',
                    overflow: 'clip',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
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
                      gap: '0.5rem',
                    }}
                  >
                    <span className="rose-pill-badge">{product.tag}</span>
                    <span
                      style={{
                        background:
                          product.stock > 0
                            ? 'rgba(21, 128, 61, 0.9)'
                            : 'rgba(190, 18, 60, 0.9)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                      }}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1.1rem 1.25rem 0.5rem' }}>
                  <h4
                    style={{
                      fontSize: '1.15rem',
                      marginBlockEnd: '0.35rem',
                    }}
                  >
                    {product.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {product.description}
                  </p>
                </div>

                <div
                  style={{
                    padding: '0.9rem 1.25rem 1.2rem',
                    display: 'flex',
                    alignItems: 'safe center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    borderTop: '1px solid rgba(230, 204, 128, 0.45)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      Price
                    </div>
                    <div
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: 'var(--brand-color)',
                      }}
                    >
                      {formatTsh(product.price)}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={product.stock <= 0}
                    onClick={() => {
                      addToCart(product);
                      onOpenClientPortal();
                    }}
                    className="btn-primary"
                    style={{
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.84rem',
                      opacity: product.stock <= 0 ? 0.5 : 1,
                    }}
                  >
                    <ShoppingBag size={15} />
                    <span>Add to Order</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

