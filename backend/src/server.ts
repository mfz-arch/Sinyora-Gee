import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getActiveDbMode, initDatabase, loadState, saveState } from './db';
import {
  BookingStatus,
  ColorThemeId,
  OrderStatus,
  ProductOrder,
  ServiceBooking,
  SpaProduct,
  SpaService,
  UserAccount,
} from './types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

function sanitizeUser(user: UserAccount) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    hostel: user.hostel,
    title: user.title,
    createdAt: user.createdAt,
  };
}

// 1. Health & Database Status
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'SINYORA GEE Shared Backend API',
    databaseMode: getActiveDbMode(),
    timestamp: new Date().toISOString(),
  });
});

// 2. Full State Endpoint (Used by both Website frontend/ and Mobile App app/)
app.get('/api/state', async (_req, res) => {
  const state = await loadState();
  res.json(state);
});

// 3. Authentication: Login (Supports GHARIBA ABDURAHMAN 0616806679 & AIM'FIZ AHMED 0612509403)
app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body as { phone?: string; password?: string };
  if (!phone || !password) {
    res.status(400).json({ ok: false, message: 'Phone and password required.' });
    return;
  }

  const normalizedPhone = phone.replace(/\s+/g, '');
  const state = await loadState();
  const matched = state.users.find(
    (u) =>
      u.phone.replace(/\s+/g, '') === normalizedPhone &&
      u.password === password
  );

  if (!matched) {
    res.status(401).json({
      ok: false,
      message: 'Invalid phone number or password.',
    });
    return;
  }

  res.json({
    ok: true,
    message: `Welcome back, ${matched.name}!`,
    user: sanitizeUser(matched),
  });
});

// 4. Authentication: Client Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, password, hostel } = req.body as {
    name?: string;
    phone?: string;
    password?: string;
    hostel?: string;
  };

  if (!name || !phone || !password) {
    res
      .status(400)
      .json({ ok: false, message: 'Name, phone, and password are required.' });
    return;
  }

  const normalizedPhone = phone.replace(/\s+/g, '');
  const state = await loadState();
  const exists = state.users.some(
    (u) => u.phone.replace(/\s+/g, '') === normalizedPhone
  );

  if (exists) {
    res.status(409).json({
      ok: false,
      message: 'This phone number is already registered. Please sign in.',
    });
    return;
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    phone: normalizedPhone,
    password,
    role: 'client',
    hostel: hostel?.trim() || 'Royal Hostel',
    createdAt: new Date().toISOString(),
  };

  state.users.unshift(newUser);
  await saveState(state);

  res.status(201).json({
    ok: true,
    message: 'Account created! Welcome to SINYORA GEE.',
    user: sanitizeUser(newUser),
  });
});

// 5. Services CRUD
app.get('/api/services', async (_req, res) => {
  const state = await loadState();
  res.json(state.services);
});

app.post('/api/services', async (req, res) => {
  const payload = req.body as Omit<SpaService, 'id'>;
  const state = await loadState();
  const created: SpaService = {
    ...payload,
    id: `srv-${Date.now()}`,
  };
  state.services.push(created);
  await saveState(state);
  res.status(201).json(created);
});

app.put('/api/services/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body as Partial<SpaService>;
  const state = await loadState();
  state.services = state.services.map((s) =>
    s.id === id ? { ...s, ...updates } : s
  );
  await saveState(state);
  res.json({ ok: true });
});

app.delete('/api/services/:id', async (req, res) => {
  const { id } = req.params;
  const state = await loadState();
  state.services = state.services.filter((s) => s.id !== id);
  await saveState(state);
  res.json({ ok: true });
});

// 6. Products CRUD (Photo, Name, Price, Stock, Benefits/Description)
app.get('/api/products', async (_req, res) => {
  const state = await loadState();
  res.json(state.products);
});

app.post('/api/products', async (req, res) => {
  const payload = req.body as Omit<SpaProduct, 'id' | 'createdAt'>;
  const state = await loadState();
  const created: SpaProduct = {
    ...payload,
    id: `prd-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  state.products.unshift(created);
  await saveState(state);
  res.status(201).json(created);
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body as Partial<SpaProduct>;
  const state = await loadState();
  state.products = state.products.map((p) =>
    p.id === id ? { ...p, ...updates } : p
  );
  await saveState(state);
  res.json({ ok: true });
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const state = await loadState();
  state.products = state.products.filter((p) => p.id !== id);
  await saveState(state);
  res.json({ ok: true });
});

// 7. Bookings (Appointments at Royal Hostel or Domicile)
app.get('/api/bookings', async (_req, res) => {
  const state = await loadState();
  res.json(state.bookings);
});

app.post('/api/bookings', async (req, res) => {
  const payload = req.body as Omit<ServiceBooking, 'id' | 'status' | 'createdAt'> & {
    id?: string;
  };
  const state = await loadState();
  const created: ServiceBooking = {
    ...payload,
    id: payload.id || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  state.bookings.unshift(created);
  await saveState(state);
  res.status(201).json(created);
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status: BookingStatus };
  const state = await loadState();
  state.bookings = state.bookings.map((b) =>
    b.id === id ? { ...b, status } : b
  );
  await saveState(state);
  res.json({ ok: true, id, status });
});

// 8. Skincare Product Orders
app.get('/api/orders', async (_req, res) => {
  const state = await loadState();
  res.json(state.orders);
});

app.post('/api/orders', async (req, res) => {
  const payload = req.body as Omit<ProductOrder, 'id' | 'status' | 'createdAt'> & {
    id?: string;
  };
  const state = await loadState();
  const created: ProductOrder = {
    ...payload,
    id: payload.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    status:
      payload.paymentMethod === 'Cash' ? 'Pending' : 'Paid',
    createdAt: new Date().toISOString(),
  };
  state.orders.unshift(created);
  await saveState(state);
  res.status(201).json(created);
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status: OrderStatus };
  const state = await loadState();
  state.orders = state.orders.map((o) =>
    o.id === id ? { ...o, status } : o
  );
  await saveState(state);
  res.json({ ok: true, id, status });
});

// 9. Website & App Color Theme Sync
app.patch('/api/settings/theme', async (req, res) => {
  const { colorTheme } = req.body as { colorTheme: ColorThemeId };
  const state = await loadState();
  state.colorTheme = colorTheme;
  await saveState(state);
  res.json({ ok: true, colorTheme });
});

initDatabase().then((dbLabel) => {
  app.listen(PORT, () => {
    console.log(
      `🚀 SINYORA GEE Shared Backend running on http://localhost:${PORT} [${dbLabel}]`
    );
  });
});

