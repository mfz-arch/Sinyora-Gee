'use client';

import React, { useRef, useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Droplets,
  ShieldCheck,
  MessageCircle,
  Camera,
  ImagePlus,
  Trash2,
  X,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
  STUDIO_INFO,
} from '@/data/initialData';
import { ProductCategoryId, ProductTag } from '@/types';
import { formatTsh } from '@/utils/format';
import { compressProductImage } from '@/utils/imageUpload';

interface ProductsSectionProps {
  onOpenAdminProducts: () => void;
  onOpenClientPortal: () => void;
  onOpenAuth: () => void;
}

const DEFAULT_SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1608248597359-0e6d526a6828?auto=format&fit=crop&w=900&q=80';

export default function ProductsSection({
  onOpenAdminProducts,
  onOpenClientPortal,
  onOpenAuth,
}: ProductsSectionProps) {
  const {
    products,
    addToCart,
    currentUser,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategoryId | 'all'
  >('all');
  const [selectedTag, setSelectedTag] = useState<ProductTag | 'all'>('all');

  // Inline Admin Quick-Upload Drawer inside Cosmetics Shop
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] =
    useState<ProductCategoryId>('facial-products');
  const [prodTag, setProdTag] = useState<ProductTag>('Oils');
  const [prodPrice, setProdPrice] = useState('15000');
  const [prodStock, setProdStock] = useState('10');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState<string>('');
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchTag = selectedTag === 'all' || p.tag === selectedTag;
    return matchCategory && matchTag;
  });

  const handleSelectNewPhoto = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImg(true);
    try {
      const compressed = await compressProductImage(file);
      setProdImage(compressed);
    } finally {
      setIsUploadingImg(false);
    }
  };

  const handleReplaceCardPhoto = async (
    productId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressProductImage(file);
    updateProduct(productId, { image: compressed });
  };

  const handleQuickPublishProduct = (e: React.FormEvent) => {
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
      image: prodImage.trim() || DEFAULT_SAMPLE_IMAGE,
    });
    setProdName('');
    setProdDesc('');
    setProdImage('');
    setShowQuickAdd(false);
  };

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

        {/* Unified Single-Row Product Section Filter Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'safe center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBlockEnd: '1.5rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gold-border)',
            boxShadow: 'var(--shadow-sm)',
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
                  selectedTag === 'all' && selectedCategory === 'all'
                    ? '1px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                background:
                  selectedTag === 'all' && selectedCategory === 'all'
                    ? 'var(--brand-color)'
                    : 'var(--bg-secondary)',
                color:
                  selectedTag === 'all' && selectedCategory === 'all'
                    ? '#ffffff'
                    : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                whiteSpace: 'nowrap',
              }}
            >
              All Products
              {products.length > 0 ? ` (${products.length})` : ''}
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
                  {tag}
                  {tagCount > 0 ? ` (${tagCount})` : ''}
                </button>
              );
            })}
          </div>

          {isAdmin && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowQuickAdd((prev) => !prev)}
                className="btn-gold"
                style={{ padding: '0.48rem 0.95rem', fontSize: '0.82rem' }}
              >
                <Camera size={15} />
                <span>
                  {showQuickAdd
                    ? 'Close Upload Form'
                    : '+ Add Product (Picture & Price)'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Inline Admin Quick-Upload Form with Live Product Picture Preview */}
        {isAdmin && showQuickAdd && (
          <form
            onSubmit={handleQuickPublishProduct}
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid var(--gold-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(1.15rem, 3vw, 1.75rem)',
              marginBlockEnd: '2rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginBlockEnd: '1rem',
              }}
            >
              <div>
                <span className="gold-shimmer-badge">
                  Admin Cosmetics Shop • Cloudinary Ready
                </span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '0.3rem' }}>
                  Add New Product with Picture, Name &amp; Price
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                aria-label="Close product form"
                style={{
                  inlineSize: '32px',
                  blockSize: '32px',
                  borderRadius: '50%',
                  border: '1px solid var(--gold-border)',
                  background: 'var(--bg-secondary)',
                  display: 'grid',
                  placeContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                alignItems: 'start',
              }}
            >
              {/* Left Column: Interactive Picture Upload Box */}
              <div>
                <label className="form-label" style={{ marginBlockEnd: '0.4rem' }}>
                  Product Picture (Phone Camera / Gallery / PC) *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSelectNewPhoto}
                  style={{ display: 'none' }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRef.current?.click();
                    }
                  }}
                  style={{
                    position: 'relative',
                    aspectRatio: '4 / 3',
                    borderRadius: 'var(--radius-md)',
                    border: '2px dashed var(--gold-primary)',
                    background: 'var(--bg-secondary)',
                    overflow: 'clip',
                    cursor: 'pointer',
                    display: 'grid',
                    placeContent: 'center',
                    textAlign: 'center',
                    padding: prodImage ? '0' : '1.25rem',
                  }}
                >
                  {prodImage ? (
                    <>
                      <img
                        src={prodImage}
                        alt="Product preview"
                        style={{
                          inlineSize: '100%',
                          blockSize: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0.6rem',
                          right: '0.6rem',
                          background: 'rgba(20, 8, 14, 0.85)',
                          color: '#f5e6b8',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid var(--gold-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Camera size={13} /> Change Photo
                      </span>
                    </>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.45rem', placeItems: 'center' }}>
                      <div
                        style={{
                          inlineSize: '48px',
                          blockSize: '48px',
                          borderRadius: '50%',
                          background: 'var(--brand-soft)',
                          color: 'var(--brand-color)',
                          display: 'grid',
                          placeContent: 'center',
                        }}
                      >
                        <ImagePlus size={22} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        {isUploadingImg
                          ? 'Optimizing Photo...'
                          : 'Tap to Select or Take Product Photo'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Auto-compressed for fast loading &amp; Cloudinary storage
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '0.55rem' }}>
                  <input
                    type="url"
                    placeholder="Or paste an image URL..."
                    value={prodImage.startsWith('data:') ? '' : prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.7rem' }}
                  />
                </div>
              </div>

              {/* Right Column: Product Name, Price, Section, Stock */}
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                <div className="form-field">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vitamin C Brightening Facial Serum"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                  }}
                >
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
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                  }}
                >
                  <div className="form-field">
                    <label className="form-label">Shop Section Tag *</label>
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
                </div>

                <div className="form-field">
                  <label className="form-label">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Skin benefits, key ingredients, or how to use..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.65rem',
                    marginTop: '0.25rem',
                  }}
                >
                  <button type="submit" className="btn-primary">
                    <PlusCircle size={17} />
                    <span>Publish Product to Cosmetics Shop</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAdminProducts}
                    className="btn-outline"
                  >
                    <span>Open Full Admin Catalog</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

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
              Our curated shelves for <strong>Oils</strong>,{' '}
              <strong>Masks</strong>, <strong>Shampoos</strong>,{' '}
              <strong>Serums</strong>, <strong>Body Care</strong>, and{' '}
              <strong>Organic Skincare</strong> are ready at{' '}
              <strong>Royal Hostel</strong>. Message us on WhatsApp to ask about
              today&apos;s available stock!
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

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(true)}
                  className="btn-gold"
                >
                  <Camera size={17} />
                  <span>Upload Product (Picture + Name + Price)</span>
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

                  {/* Admin Direct Photo Replacement & Delete Overlay */}
                  {isAdmin && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0.6rem',
                        left: '0.6rem',
                        right: '0.6rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <label
                        style={{
                          background: 'rgba(20, 8, 14, 0.86)',
                          color: '#f5e6b8',
                          padding: '0.32rem 0.7rem',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          border: '1px solid var(--gold-primary)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Camera size={12} />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleReplaceCardPhoto(product.id, e)
                          }
                          style={{ display: 'none' }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        title="Remove product"
                        style={{
                          background: 'rgba(190, 18, 60, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '0.32rem 0.6rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
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
