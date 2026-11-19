import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  CinzelDecorative_700Bold,
  CinzelDecorative_900Black,
} from '@expo-google-fonts/cinzel-decorative';

const API_BASE_URL = 'https://sinyora-gee.onrender.com';

interface UserAccount {
  id: string;
  name: string;
  phone: string;
  role: 'client' | 'admin';
  hostel?: string;
}

interface SpaService {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
}

interface SpaProduct {
  id: string;
  name: string;
  tag: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

interface ServiceBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  hostelOrRoom: string;
  services: { name: string; price: number }[];
  totalPrice: number;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: string;
  status: string;
}

const CATEGORIES = [
  { id: 'facial', title: 'FACIAL SERVICES', tagline: 'Clear Skin • Healthy Skin • Happy You' },
  { id: 'massage', title: 'MASSAGE & BODY SERVICES', tagline: 'Relax • Rejuvenate • Restore' },
  { id: 'bridal', title: 'BRIDAL & EVENT PACKAGES', tagline: 'Look Beautiful on Your Special Day' },
  { id: 'makeup', title: 'MAKEUP SERVICES', tagline: 'Enhance Your Natural Beauty' },
  { id: 'additional', title: 'ADDITIONAL SERVICES', tagline: 'Brows • Lashes • Healthy Hair' },
];

const PAYMENT_OPTIONS = ['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'HaloPesa', 'Cash'];

const formatTsh = (val: number) =>
  val === 0 ? 'FREE' : `Tsh ${val.toLocaleString()}`;

export default function App() {
  const [fontsLoaded] = useFonts({
    CinzelDecorative_700Bold,
    CinzelDecorative_900Black,
  });

  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [tab, setTab] = useState<'home' | 'shop' | 'bookings' | 'admin' | 'account'>('home');

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [services, setServices] = useState<SpaService[]>([]);
  const [products, setProducts] = useState<SpaProduct[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<SpaService | null>(null);
  const [location, setLocation] = useState('Royal Hostel');
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
  const [slotTime, setSlotTime] = useState('10:00 AM');

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const loadRemoteState = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/state`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.services)) setServices(data.services);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.bookings)) setBookings(data.bookings);
    } catch {
      // Ignore transient network errors
    }
  };

  useEffect(() => {
    if (user) {
      loadRemoteState();
    }
  }, [user]);

  const handleSignIn = async () => {
    if (!phone.trim() || !password) {
      Alert.alert('Missing Details', 'Enter your phone number and password.');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        Alert.alert('Sign In Failed', data.message || 'Invalid credentials.');
        return;
      }
      setUser(data.user);
      setLocation(data.user.hostel || 'Royal Hostel');
    } catch {
      Alert.alert('Network Error', 'Unable to reach SINYORA GEE server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!user || !selectedService) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: user.id,
          clientName: user.name,
          clientPhone: user.phone,
          hostelOrRoom: location || 'Royal Hostel',
          services: [{ id: selectedService.id, name: selectedService.name, price: selectedService.price }],
          totalPrice: selectedService.price,
          appointmentDate: today,
          appointmentTime: slotTime,
          paymentMethod,
        }),
      });
      if (res.ok) {
        Alert.alert('Booking Confirmed!', `${selectedService.name} booked for ${today} at ${slotTime}.`);
        setSelectedService(null);
        loadRemoteState();
        setTab('bookings');
      }
    } catch {
      Alert.alert('Error', 'Could not submit booking.');
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadRemoteState();
  };

  const titleFont = fontsLoaded ? 'CinzelDecorative_900Black' : undefined;

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar style="light" />
        <Text style={styles.splashTop}>WELCOME TO</Text>
        <Text style={[styles.splashTitle, titleFont ? { fontFamily: titleFont } : null]}>
          SINYORA GEE
        </Text>
        <Text style={styles.splashSub}>luxury facials and spa</Text>
      </View>
    );
  }

  // Sign-In Only Screen (No Sign Up in the mobile app)
  if (!user) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar style="light" />
        <View style={styles.authCard}>
          <Image source={require('./assets/icon.png')} style={styles.authIcon} />
          <Text style={[styles.authTitle, titleFont ? { fontFamily: titleFont } : null]}>
            SINYORA GEE
          </Text>
          <Text style={styles.authSub}>Sign in with your website account</Text>

          <TextInput
            style={styles.input}
            placeholder="Phone Number (e.g. 0712345678)"
            placeholderTextColor="#9e8e95"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9e8e95"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn} disabled={authLoading}>
            {authLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.appShell}>
      <StatusBar style="light" />
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source={require('./assets/icon.png')} style={styles.topIcon} />
          <View>
            <Text style={[styles.topBrand, titleFont ? { fontFamily: titleFont } : null]}>
              SINYORA GEE
            </Text>
            <Text style={styles.topGreeting}>Hi, {user.name.split(' ')[0]} • Royal Hostel</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
        {tab === 'home' && (
          <View style={{ gap: 12 }}>
            <Text style={[styles.sectionTitle, titleFont ? { fontFamily: titleFont } : null]}>
              Service &amp; Price Menu
            </Text>
            {CATEGORIES.map((cat) => {
              const items = services.filter((s) => s.categoryId === cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.flyerCard}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <View style={styles.flyerPill}>
                    <Text style={styles.flyerPillText}>{cat.title}</Text>
                  </View>
                  {items.map((srv) => (
                    <View key={srv.id} style={styles.flyerRow}>
                      <Text style={styles.flyerItemName}>❀ {srv.name}</Text>
                      <Text style={styles.flyerItemPrice}>{formatTsh(srv.price)}</Text>
                    </View>
                  ))}
                  <Text style={styles.flyerTagline}>{cat.tagline}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {tab === 'shop' && (
          <View style={{ gap: 12 }}>
            <Text style={[styles.sectionTitle, titleFont ? { fontFamily: titleFont } : null]}>
              Cosmetics Boutique
            </Text>
            {products.length === 0 ? (
              <Text style={styles.mutedText}>Skincare shelves ready at Royal Hostel.</Text>
            ) : (
              products.map((p) => (
                <View key={p.id} style={styles.flyerCard}>
                  <Text style={styles.flyerItemName}>{p.name}</Text>
                  <Text style={styles.flyerItemPrice}>{formatTsh(p.price)}</Text>
                  <Text style={styles.mutedText}>{p.description}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {tab === 'bookings' && (
          <View style={{ gap: 12 }}>
            <Text style={[styles.sectionTitle, titleFont ? { fontFamily: titleFont } : null]}>
              My Bookings
            </Text>
            {bookings
              .filter((b) => b.clientPhone === user.phone)
              .map((b) => (
                <View key={b.id} style={styles.flyerCard}>
                  <Text style={styles.flyerItemName}>
                    {b.id} • {b.appointmentDate} ({b.appointmentTime})
                  </Text>
                  <Text style={styles.flyerItemPrice}>
                    {b.status} • {formatTsh(b.totalPrice)}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {tab === 'admin' && user.role === 'admin' && (
          <View style={{ gap: 12 }}>
            <Text style={[styles.sectionTitle, titleFont ? { fontFamily: titleFont } : null]}>
              Admin Appointments ({bookings.length})
            </Text>
            {bookings.map((b) => (
              <View key={b.id} style={styles.flyerCard}>
                <Text style={styles.flyerItemName}>
                  {b.clientName} • {b.clientPhone}
                </Text>
                <Text style={styles.mutedText}>
                  {b.services.map((s) => s.name).join(', ')} ({b.status})
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  {b.status === 'Pending' && (
                    <TouchableOpacity
                      style={styles.smallBtn}
                      onPress={() => updateBookingStatus(b.id, 'Confirmed')}
                    >
                      <Text style={styles.smallBtnText}>Confirm Slot</Text>
                    </TouchableOpacity>
                  )}
                  {b.status === 'Confirmed' && (
                    <TouchableOpacity
                      style={[styles.smallBtn, { backgroundColor: '#d4af37' }]}
                      onPress={() => updateBookingStatus(b.id, 'Completed')}
                    >
                      <Text style={[styles.smallBtnText, { color: '#150b10' }]}>
                        Mark Completed
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === 'account' && (
          <View style={styles.flyerCard}>
            <Text style={[styles.sectionTitle, titleFont ? { fontFamily: titleFont } : null]}>
              {user.name}
            </Text>
            <Text style={styles.mutedText}>Phone: {user.phone}</Text>
            <Text style={styles.mutedText}>Location: {user.hostel || 'Royal Hostel'}</Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 14 }]}
              onPress={() => Linking.openURL('https://wa.me/255616806679')}
            >
              <Text style={styles.primaryBtnText}>WhatsApp SINYORA GEE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallBtn, { marginTop: 10, backgroundColor: '#4b1c30' }]}
              onPress={() => setUser(null)}
            >
              <Text style={styles.smallBtnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomNav}>
        {(['home', 'shop', 'bookings', ...(user.role === 'admin' ? ['admin'] : []), 'account'] as const).map(
          (t) => (
            <TouchableOpacity key={t} onPress={() => setTab(t as typeof tab)} style={styles.navItem}>
              <Text style={[styles.navText, tab === t ? styles.navTextActive : null]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Subservices Popup */}
      <Modal visible={Boolean(activeCategory)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.sectionTitle, titleFont ? { fontFamily: titleFont } : null]}>
              Select Treatment
            </Text>
            <ScrollView style={{ maxHeight: 340 }}>
              {services
                .filter((s) => s.categoryId === activeCategory)
                .map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.flyerRow}
                    onPress={() => {
                      setActiveCategory(null);
                      setSelectedService(s);
                    }}
                  >
                    <Text style={styles.flyerItemName}>{s.name}</Text>
                    <Text style={styles.flyerItemPrice}>{formatTsh(s.price)}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.smallBtn} onPress={() => setActiveCategory(null)}>
              <Text style={styles.smallBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Quick Auto-Filled Booking Modal */}
      <Modal visible={Boolean(selectedService)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.sectionTitle, titleFont ? { fontFamily: titleFont } : null]}>
              Complete Booking
            </Text>
            <Text style={styles.mutedText}>
              {selectedService?.name} ({formatTsh(selectedService?.price || 0)})
            </Text>
            <Text style={styles.mutedText}>
              Client: {user.name} • {user.phone}
            </Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Royal Hostel or Domicile address"
            />
            <TextInput
              style={styles.input}
              value={slotTime}
              onChangeText={setSlotTime}
              placeholder="Preferred Time (e.g. 10:00 AM)"
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 }}>
              {PAYMENT_OPTIONS.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPaymentMethod(p)}
                  style={[
                    styles.smallBtn,
                    { backgroundColor: paymentMethod === p ? '#b81d5b' : '#3a222d' },
                  ]}
                >
                  <Text style={styles.smallBtnText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleConfirmBooking}>
              <Text style={styles.primaryBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallBtn, { marginTop: 8 }]}
              onPress={() => setSelectedService(null)}
            >
              <Text style={styles.smallBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#150b10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashTop: { color: '#f5cdd8', letterSpacing: 4, fontSize: 12, marginBottom: 10 },
  splashTitle: { color: '#f7df8b', fontSize: 34, fontStyle: 'italic' },
  splashSub: { color: '#fce8ee', fontSize: 16, fontStyle: 'italic', marginTop: 8 },
  authContainer: {
    flex: 1,
    backgroundColor: '#150b10',
    justifyContent: 'center',
    padding: 20,
  },
  authCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#d4af37',
    alignItems: 'center',
    gap: 10,
  },
  authIcon: { width: 72, height: 72, borderRadius: 16 },
  authTitle: { fontSize: 22, color: '#23141b', fontStyle: 'italic' },
  authSub: { fontSize: 13, color: '#6b5b63', marginBottom: 6 },
  appShell: { flex: 1, backgroundColor: '#faf5f0' },
  topBar: {
    backgroundColor: '#1b0d14',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#d4af37',
  },
  topIcon: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#d4af37' },
  topBrand: { color: '#f7df8b', fontSize: 16, fontStyle: 'italic' },
  topGreeting: { color: '#f5cdd8', fontSize: 11, fontWeight: '600' },
  sectionTitle: { fontSize: 18, color: '#23141b', marginBottom: 8 },
  flyerCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e6cc80',
    gap: 6,
  },
  flyerPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#c2185b',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 4,
  },
  flyerPillText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  flyerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e7df',
  },
  flyerItemName: { fontWeight: '700', color: '#23141b', fontSize: 14 },
  flyerItemPrice: { fontWeight: '800', color: '#c2185b', fontSize: 14 },
  flyerTagline: { textAlign: 'center', color: '#b51053', fontStyle: 'italic', marginTop: 6 },
  mutedText: { color: '#6b5b63', fontSize: 13 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 10,
    padding: 11,
    backgroundColor: '#fff',
    color: '#23141b',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#b81d5b',
    padding: 13,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  smallBtn: {
    backgroundColor: '#23141b',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    alignItems: 'center',
  },
  smallBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#160b10',
    borderTopWidth: 1,
    borderTopColor: '#d4af37',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  navItem: { paddingHorizontal: 8 },
  navText: { color: '#b7a9b0', fontSize: 11, fontWeight: '700' },
  navTextActive: { color: '#f7df8b' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 6, 11, 0.72)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#d4af37',
    gap: 8,
  },
});
