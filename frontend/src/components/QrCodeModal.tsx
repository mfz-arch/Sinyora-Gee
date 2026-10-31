'use client';

import React, { useMemo, useState } from 'react';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { generateQrMatrix } from '@/utils/qrGenerator';
import { STUDIO_INFO } from '@/data/initialData';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_WEBAPP_URL = 'https://sinyora-gee.vercel.app';

export default function QrCodeModal({ isOpen, onClose }: QrCodeModalProps) {
  const [targetUrl, setTargetUrl] = useState<string>(DEFAULT_WEBAPP_URL);
  const [copied, setCopied] = useState(false);

  const cleanUrl = targetUrl.trim() || DEFAULT_WEBAPP_URL;

  const matrix = useMemo(() => {
    try {
      return generateQrMatrix(cleanUrl);
    } catch {
      return generateQrMatrix(DEFAULT_WEBAPP_URL);
    }
  }, [cleanUrl]);

  if (!isOpen) return null;

  const size = matrix.length;
  const quietZone = 4;
  const totalModules = size + quietZone * 2;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cleanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback copy
    }
  };

  const handleDownloadPoster = () => {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Luxury dark velvet background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#1e0b16');
    bgGrad.addColorStop(0.5, '#150810');
    bgGrad.addColorStop(1, '#230d1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Gold Frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    ctx.strokeStyle = 'rgba(245, 230, 184, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(66, 66, width - 132, height - 132);

    // 3. Top Header Text
    ctx.fillStyle = '#f5e6b8';
    ctx.font = '700 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO BOOK & SHOP ONLINE', width / 2, 150);

    // 4. SINYORA GEE Title
    ctx.save();
    ctx.font = 'italic 900 78px Georgia, serif';
    const goldGrad = ctx.createLinearGradient(240, 180, 840, 260);
    goldGrad.addColorStop(0, '#fffdf5');
    goldGrad.addColorStop(0.35, '#f5e09b');
    goldGrad.addColorStop(0.7, '#d4af37');
    goldGrad.addColorStop(1, '#fff3c4');
    ctx.fillStyle = goldGrad;
    ctx.fillText('SINYORA GEE', width / 2, 245);
    ctx.restore();

    ctx.fillStyle = '#f9a8d4';
    ctx.font = '700 28px sans-serif';
    ctx.fillText('LUXURY FACIAL, COSMETICS & SPA', width / 2, 298);

    // 5. White Rounded Card for High-Contrast Scannable QR
    const qrBoxSize = 640;
    const qrBoxX = (width - qrBoxSize) / 2;
    const qrBoxY = 350;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 32);
    ctx.fill();

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 5;
    ctx.stroke();

    // 6. Draw QR Modules inside the white box
    const cellSize = qrBoxSize / totalModules;
    ctx.fillStyle = '#14080e';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          const x = qrBoxX + (c + quietZone) * cellSize;
          const y = qrBoxY + (r + quietZone) * cellSize;
          ctx.fillRect(
            Math.floor(x),
            Math.floor(y),
            Math.ceil(cellSize),
            Math.ceil(cellSize)
          );
        }
      }
    }

    // 7. Bottom Studio Info & URL
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 32px sans-serif';
    ctx.fillText(
      'Open Camera or QR Scanner to Visit Webapp',
      width / 2,
      1065
    );

    ctx.fillStyle = '#f5e6b8';
    ctx.font = '600 28px monospace';
    ctx.fillText(cleanUrl, width / 2, 1118);

    ctx.fillStyle = '#dfd6db';
    ctx.font = '700 28px sans-serif';
    ctx.fillText(
      `Location: ${STUDIO_INFO.location}  •  Call/WhatsApp: ${STUDIO_INFO.phone}`,
      width / 2,
      1190
    );

    ctx.fillStyle = '#f9a8d4';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText(
      'Skin Consultation is FREE • Your Beauty, Our Priority ♥',
      width / 2,
      1242
    );

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'SINYORA-GEE-QR-Code-Poster.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-sheet"
        style={{
          maxInlineSize: '500px',
          padding: '1.5rem',
          border: '1.5px solid var(--gold-primary)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBlockEnd: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div
              style={{
                inlineSize: '38px',
                blockSize: '38px',
                borderRadius: '50%',
                background: 'var(--brand-soft)',
                color: 'var(--brand-color)',
                display: 'grid',
                placeContent: 'center',
                border: '1px solid var(--gold-border)',
              }}
            >
              <QrCode size={20} />
            </div>
            <div>
              <h3
                id="qr-modal-title"
                style={{ fontSize: '1.2rem', lineHeight: 1.2 }}
              >
                SINYORA GEE • Official QR Code
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Scan with any phone camera to open the webapp directly
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close QR Code modal"
            style={{
              inlineSize: '34px',
              blockSize: '34px',
              borderRadius: '50%',
              border: '1px solid var(--gold-border)',
              background: 'var(--bg-secondary)',
              display: 'grid',
              placeContent: 'center',
              color: 'var(--text-primary)',
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Luxury QR Card Preview */}
        <div
          style={{
            background:
              'linear-gradient(145deg, #1e0b16 0%, #14070e 60%, #260f1d 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.35rem 1.15rem',
            border: '1.5px solid var(--gold-primary)',
            textAlign: 'center',
            color: '#fffdf9',
            boxShadow: 'var(--shadow-md)',
            marginBlockEnd: '1.1rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: '#f5e6b8',
              fontWeight: 700,
              marginBlockEnd: '0.35rem',
            }}
          >
            <Sparkles size={12} color="#d4af37" /> Scan to Book &amp; Shop Online
          </div>

          <div
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '1.55rem',
              letterSpacing: '0.06em',
              color: '#f5e09b',
              marginBlockEnd: '0.15rem',
            }}
          >
            SINYORA GEE
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#f9a8d4',
              fontWeight: 700,
              marginBlockEnd: '0.9rem',
            }}
          >
            Luxury Facial, Cosmetics &amp; Spa • Royal Hostel
          </div>

          {/* Crisp Scannable SVG QR Code */}
          <div
            style={{
              background: '#ffffff',
              padding: '0.65rem',
              borderRadius: '18px',
              border: '3px solid #d4af37',
              display: 'inline-block',
              boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
            }}
          >
            <svg
              viewBox={`0 0 ${totalModules} ${totalModules}`}
              width="220"
              height="220"
              shapeRendering="crispEdges"
              role="img"
              aria-label={`QR Code for ${cleanUrl}`}
              style={{ display: 'block', maxInlineSize: '100%' }}
            >
              <rect
                x="0"
                y="0"
                width={totalModules}
                height={totalModules}
                fill="#ffffff"
              />
              {matrix.map((row, rIdx) =>
                row.map((cell, cIdx) =>
                  cell ? (
                    <rect
                      key={`${rIdx}-${cIdx}`}
                      x={cIdx + quietZone}
                      y={rIdx + quietZone}
                      width={1}
                      height={1}
                      fill="#14080e"
                    />
                  ) : null
                )
              )}
            </svg>
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              fontSize: '0.78rem',
              color: '#f5e6b8',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}
          >
            {cleanUrl}
          </div>
          <div
            style={{
              fontSize: '0.74rem',
              color: '#dfd6db',
              marginTop: '0.2rem',
            }}
          >
            📞 {STUDIO_INFO.phone} • 📍 {STUDIO_INFO.location}
          </div>
        </div>

        {/* Editable / Selectable Target Link */}
        <div className="form-field" style={{ marginBlockEnd: '1rem' }}>
          <label
            htmlFor="qr-url-input"
            className="form-label"
            style={{ fontSize: '0.78rem' }}
          >
            Direct Webapp Link Encoded in QR Code:
          </label>
          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <input
              id="qr-url-input"
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.84rem', padding: '0.55rem 0.75rem' }}
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn-outline"
              style={{
                padding: '0.55rem 0.85rem',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '0.65rem',
          }}
        >
          <button
            type="button"
            onClick={handleDownloadPoster}
            className="btn-gold"
            style={{
              justifyContent: 'center',
              padding: '0.7rem 1rem',
              fontSize: '0.84rem',
            }}
          >
            <Download size={16} />
            <span>Download QR Poster (PNG)</span>
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `✨ Visit SINYORA GEE Luxury Facial, Cosmetics & Spa at Royal Hostel! Book treatments or shop skincare online: ${cleanUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              justifyContent: 'center',
              padding: '0.7rem 1rem',
              fontSize: '0.84rem',
              textDecoration: 'none',
            }}
          >
            <Share2 size={16} />
            <span>Share on WhatsApp</span>
          </a>
        </div>

        <div
          style={{
            marginTop: '0.75rem',
            textAlign: 'center',
          }}
        >
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              color: 'var(--brand-color)',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={13} /> Open {cleanUrl} in new tab
          </a>
        </div>
      </div>
    </div>
  );
}
