import { STUDIO_INFO } from '@/data/initialData';

export function formatTsh(amount: number): string {
  if (amount <= 0) return 'FREE';
  return `Tsh ${amount.toLocaleString('en-US')}`;
}

export function buildWhatsAppBookingUrl(params: {
  bookingId: string;
  clientName: string;
  clientPhone: string;
  hostel: string;
  date: string;
  time: string;
  services: { name: string; price: number }[];
  total: number;
  paymentMethod: string;
  transactionRef?: string;
}): string {
  const serviceLines = params.services
    .map((s) => `• ${s.name} (${formatTsh(s.price)})`)
    .join('\n');

  const message =
    `✨ *NEW BOOKING — SINYORA GEE* ✨\n` +
    `*Booking Ref:* ${params.bookingId}\n` +
    `*Client:* ${params.clientName}\n` +
    `*Phone:* ${params.clientPhone}\n` +
    `*Location/Hostel:* ${params.hostel}\n` +
    `*Date & Time:* ${params.date} at ${params.time}\n\n` +
    `*Selected Treatments:*\n${serviceLines}\n\n` +
    `*Total:* ${formatTsh(params.total)}\n` +
    `*Payment Method:* ${params.paymentMethod}` +
    (params.transactionRef ? `\n*Ref/SMS:* ${params.transactionRef}` : '');

  return `https://wa.me/${STUDIO_INFO.whatsappInternational}?text=${encodeURIComponent(
    message
  )}`;
}

