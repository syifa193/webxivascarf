/**
 * XivaScarf Firebase & Database Engine
 * Includes automatic seed data & LocalStorage fallback store for instant offline/demo functionality.
 */

// Firebase Configuration (Replace with actual Firebase project credentials if using live Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyXivaScarfDemoKey123456789",
  authDomain: "xivascarf-app.firebaseapp.com",
  projectId: "xivascarf-app",
  storageBucket: "xivascarf-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xivascarfdemo123"
};

// Check if Firebase Compat SDK is loaded
let firebaseApp, firebaseAuth, firebaseDb;
if (typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    firebaseAuth = firebase.auth();
    firebaseDb = firebase.firestore();
  } catch (err) {
    console.warn("Firebase SDK initialization warning, falling back to LocalStorage DBStore:", err);
  }
}

// ----------------------------------------------------
// Local DBStore (Local Storage Fallback & Demo Engine)
// ----------------------------------------------------
const DBStore = {
  KEYS: {
    USERS: 'xiva_users',
    PRODUK: 'xiva_produk',
    KATEGORI: 'xiva_kategori',
    KERANJANG: 'xiva_keranjang',
    PESANAN: 'xiva_pesanan',
    DETAIL_PESANAN: 'xiva_detail_pesanan',
    WISHLIST: 'xiva_wishlist',
    CURRENT_USER: 'xiva_current_user'
  },

  init() {
    // Seed initial data if empty
    if (!localStorage.getItem(this.KEYS.KATEGORI)) {
      const initialKategori = [
        { idKategori: 'kat-1', namaKategori: 'Pashmina', icon: 'bi-box-seam', description: 'Pashmina premium lembut & mudah dibentuk' },
        { idKategori: 'kat-2', namaKategori: 'Segiempat', icon: 'bi-square', description: 'Jilbab segiempat polos & motif mewah' },
        { idKategori: 'kat-3', namaKategori: 'Instant', icon: 'bi-lightning', description: 'Jilbab instan praktis dan modis' },
        { idKategori: 'kat-4', namaKategori: 'Bergo', icon: 'bi-heart', description: 'Bergo harian nyaman & adem' },
        { idKategori: 'kat-5', namaKategori: "Syar'i", icon: 'bi-sun', description: 'Hijab syari menutup dada anggun' }
      ];
      localStorage.setItem(this.KEYS.KATEGORI, JSON.stringify(initialKategori));
    }

        if (!localStorage.getItem(this.KEYS.PRODUK)) {
      const initialProduk = [
        {
          idProduk: 'prod-1',
          nama: 'Pashmina Silk Premium Rose',
          kategori: 'Pashmina',
          harga: 85000,
          stok: 45,
          warna: 'Rose Gold, Mauve, Cream',
          ukuran: '180 x 75 cm',
          deskripsi: 'Pashmina berkilau lembut dengan serat crepe silk mewah, adem dan jatuh sempurna.',
          gambar: '../img/products/prod-1.png',
soldCount: 120,
          createdAt: new Date().toISOString()
        },
        {
          idProduk: 'prod-2',
          nama: 'Segiempat Voal Ultrafine Dust Pink',
          kategori: 'Segiempat',
          harga: 65000,
          stok: 30,
          warna: 'Dusty Pink, Nude, Mocca',
          ukuran: '115 x 115 cm',
          deskripsi: 'Bahan voal ultrafine grade A, tegak di dahi, tidak mudah kusut & sangat nyaman.',
          gambar: '../img/products/prod-2.png',
soldCount: 95,
          createdAt: new Date().toISOString()
        },
        {
          idProduk: 'prod-3',
          nama: 'Bergo Instant Daily Comfort',
          kategori: 'Bergo',
          harga: 49000,
          stok: 50,
          warna: 'Hitam, Navy, Grey',
          ukuran: 'Standard',
          deskripsi: 'Bergo kaos premium adem dengan pet anti tembem, cocok untuk kegiatan harian.',
          gambar: '../img/products/prod-3.png',
soldCount: 210,
          createdAt: new Date().toISOString()
        },
        {
          idProduk: 'prod-4',
          nama: 'Jilbab Syar\'i Layers Chiffon',
          kategori: "Syar'i",
          harga: 125000,
          stok: 20,
          warna: 'Soft Lavender, Sage Green',
          ukuran: 'Jumbo XL',
          deskripsi: 'Jilbab syari 2 layer bahan ceruty babydoll halus, jatuh dan tidak menerawang.',
          gambar: '../img/products/prod-4.png',
soldCount: 40,
          createdAt: new Date().toISOString()
        },
        {
          idProduk: 'prod-5',
          nama: 'Instant Jersey Flowy Plum',
          kategori: 'Instant',
          harga: 55000,
          stok: 35,
          warna: 'Plum, Almond, Camel',
          ukuran: 'All Size',
          deskripsi: 'Hijab instan jersey Korea super lembut, elastis & tidak menerawang.',
          gambar: '../img/products/prod-5.png',
soldCount: 88,
          createdAt: new Date().toISOString()
        },
        {
          idProduk: 'prod-6',
          nama: 'Pashmina Inner 2 in 1 Premium',
          kategori: 'Pashmina',
          harga: 79000,
          stok: 40,
          warna: 'Black, Sand, Taupe',
          ukuran: '180 x 75 cm',
          deskripsi: 'Pashmina praktis yang sudah menyatu dengan inner ciput anti slip, sangat nyaman dan stylish.',
          gambar: '../img/products/prod-6.png',
soldCount: 150,
          createdAt: new Date().toISOString()
        },
        {
          idProduk: 'prod-7',
          nama: 'Segiempat Paris Premium Polos',
          kategori: 'Segiempat',
          harga: 58000,
          stok: 60,
          warna: 'Broken White, Blush, Olive',
          ukuran: '110 x 110 cm',
          deskripsi: 'Bahan Paris Japan original halus, adem, tegak di dahi tanpa perlu diarsir keras.',
          gambar: 'https://images.unsplash.com/photo-1584988713028-eb69d2797e8f?auto=format&fit=crop&w=600&q=80',
soldCount: 175,
          createdAt: new Date().toISOString()
        },
        {
          idProduk: 'prod-8',
          nama: 'Bergo Maryam Diamond Hijab',
          kategori: 'Bergo',
          harga: 42000,
          stok: 45,
          warna: 'Navy, Terracotta, Mustard',
          ukuran: 'All Size (Menutup Dada)',
          deskripsi: 'Bergo non-pet tali dengan bahan Diamond Italiano tekstur jeruk lembut dan jatuh.',
          gambar: 'https://images.unsplash.com/photo-1605333463665-22b9c7b949bc?auto=format&fit=crop&w=600&q=80',
soldCount: 130,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.KEYS.PRODUK, JSON.stringify(initialProduk));
    }

    if (!localStorage.getItem(this.KEYS.USERS)) {
      const initialUsers = [
        {
          uid: 'user-admin-1',
          nama: 'Admin XivaScarf',
          email: 'admin@xivascarf.com',
          password: 'admin123',
          role: 'admin',
          alamat: 'Jl. Boutique Royale No. 1, Jakarta Selatan',
          nohp: '081234567890'
        },
        {
          uid: 'user-cust-1',
          nama: 'Siti Sarah',
          email: 'user@xivascarf.com',
          password: 'user123',
          role: 'user',
          alamat: 'Jl. Bunga Melati No. 45, Bandung',
          nohp: '085712345678'
        }
      ];
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem(this.KEYS.PESANAN)) {
      const initialPesanan = [
        {
          idPesanan: 'ORD-202607-001',
          uid: 'user-cust-1',
          namaPenerima: 'Siti Sarah',
          alamat: 'Jl. Bunga Melati No. 45, Bandung',
          nohp: '085712345678',
          metodePembayaran: 'Transfer Bank BCA',
          catatan: 'Tolong kemas hadiah rapi',
          total: 150000,
          status: 'Selesai',
          tanggal: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
          items: [
            { idProduk: 'prod-1', nama: 'Pashmina Silk Premium Rose', qty: 1, harga: 85000 },
            { idProduk: 'prod-2', nama: 'Segiempat Voal Ultrafine Dust Pink', qty: 1, harga: 65000 }
          ]
        },
        {
          idPesanan: 'ORD-202607-002',
          uid: 'user-cust-1',
          namaPenerima: 'Siti Sarah',
          alamat: 'Jl. Bunga Melati No. 45, Bandung',
          nohp: '085712345678',
          metodePembayaran: 'ShopeePay',
          catatan: '',
          total: 98000,
          status: 'Diproses',
          tanggal: new Date().toISOString().split('T')[0],
          items: [
            { idProduk: 'prod-3', nama: 'Bergo Instant Daily Comfort', qty: 2, harga: 49000 }
          ]
        }
      ];
      localStorage.setItem(this.KEYS.PESANAN, JSON.stringify(initialPesanan));
    }

    if (!localStorage.getItem(this.KEYS.DETAIL_PESANAN)) {
      const initialDetailPesanan = [
        { idDetail: 'dtl-1', pesananId: 'ORD-202607-001', produkId: 'prod-1', qty: 1, harga: 85000 },
        { idDetail: 'dtl-2', pesananId: 'ORD-202607-001', produkId: 'prod-2', qty: 1, harga: 65000 },
        { idDetail: 'dtl-3', pesananId: 'ORD-202607-002', produkId: 'prod-3', qty: 2, harga: 49000 }
      ];
      localStorage.setItem(this.KEYS.DETAIL_PESANAN, JSON.stringify(initialDetailPesanan));
    }

    if (!localStorage.getItem(this.KEYS.KERANJANG)) {
      localStorage.setItem(this.KEYS.KERANJANG, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.KEYS.WISHLIST)) {
      localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify([]));
    }
  },

  getCollection(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  setCollection(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
  },

  generateId(prefix = 'id') {
    return prefix + '-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString().slice(-4);
  },

  resetDemo() {
    // Clear all xiva_ keys and re-initialize fresh seed data
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    this.init();
    console.log('XivaScarf demo data berhasil direset.');
  }
};

// Version-based force reinit: if data version mismatch, reset & reseed
const DATA_VERSION = 'v4.1';
if (localStorage.getItem('xiva_data_version') !== DATA_VERSION) {
  // Clear product data only to refresh image URLs
  localStorage.removeItem(DBStore.KEYS.PRODUK);
  localStorage.removeItem(DBStore.KEYS.USERS);
  localStorage.setItem('xiva_data_version', DATA_VERSION);
}

// Initialize DBStore on load
DBStore.init();
