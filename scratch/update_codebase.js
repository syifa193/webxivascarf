const fs = require('fs');
const path = require('path');
const { img1, img2, img3, img4, img5, img6, img7, img8, heroBannerImg } = require('./generate_images.js');

const rootDir = path.join(__dirname, '..');

// 1. Update js/firebase-config.js
const firebaseConfigPath = path.join(rootDir, 'js', 'firebase-config.js');
let firebaseConfig = fs.readFileSync(firebaseConfigPath, 'utf8');

const newSeedProduk = `    if (!localStorage.getItem(this.KEYS.PRODUK)) {
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
          gambar: '${img1}',
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
          gambar: '${img2}',
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
          gambar: '${img3}',
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
          gambar: '${img4}',
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
          gambar: '${img5}',
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
          gambar: '${img6}',
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
          gambar: '${img7}',
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
          gambar: '${img8}',
          soldCount: 130,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.KEYS.PRODUK, JSON.stringify(initialProduk));
    }`;

// Replace seed data block
firebaseConfig = firebaseConfig.replace(/if \(!localStorage\.getItem\(this\.KEYS\.PRODUK\)\) \{[\s\S]*?localStorage\.setItem\(this\.KEYS\.PRODUK, JSON\.stringify\(initialProduk\)\);\s*\}/, newSeedProduk);

// Bump DATA_VERSION to v4.0
firebaseConfig = firebaseConfig.replace(/const DATA_VERSION = 'v3.0';/, "const DATA_VERSION = 'v4.0';");
firebaseConfig = firebaseConfig.replace(/const DATA_VERSION = 'v2.1';/, "const DATA_VERSION = 'v4.0';");

fs.writeFileSync(firebaseConfigPath, firebaseConfig, 'utf8');
console.log('Updated firebase-config.js with v4.0 and hijab SVG images!');

// 2. Update index.html
const indexPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/<img src="https:\/\/images\.unsplash\.com\/photo-.*?" class="img-fluid rounded-3" alt="XivaScarf Banner">/, `<img src="${heroBannerImg}" class="img-fluid rounded-3 shadow" alt="XivaScarf Banner">`);
fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Updated index.html hero banner!');

// 3. Update admin/tambah-produk.html
const tambahPath = path.join(rootDir, 'admin', 'tambah-produk.html');
let tambahHtml = fs.readFileSync(tambahPath, 'utf8');
tambahHtml = tambahHtml.replace(/<img id="img-preview" src="https:\/\/images\.unsplash\.com\/photo-.*?"/, `<img id="img-preview" src="${img1}"`);
fs.writeFileSync(tambahPath, tambahHtml, 'utf8');

// 4. Update admin/edit-produk.html
const editPath = path.join(rootDir, 'admin', 'edit-produk.html');
let editHtml = fs.readFileSync(editPath, 'utf8');
editHtml = editHtml.replace(/<img id="img-preview" src="https:\/\/images\.unsplash\.com\/photo-.*?"/, `<img id="img-preview" src="${img1}"`);
fs.writeFileSync(editPath, editHtml, 'utf8');

// 5. Update js/produk.js
const produkJsPath = path.join(rootDir, 'js', 'produk.js');
let produkJs = fs.readFileSync(produkJsPath, 'utf8');
produkJs = produkJs.replace(/https:\/\/images\.unsplash\.com\/photo-[^'"]+/g, img1);
fs.writeFileSync(produkJsPath, produkJs, 'utf8');

// 6. Update js/keranjang.js
const keranjangJsPath = path.join(rootDir, 'js', 'keranjang.js');
let keranjangJs = fs.readFileSync(keranjangJsPath, 'utf8');
keranjangJs = keranjangJs.replace(/https:\/\/images\.unsplash\.com\/photo-[^'"]+/g, img1);
fs.writeFileSync(keranjangJsPath, keranjangJs, 'utf8');

console.log('All product catalog images updated to high quality, category-specific Hijab SVGs!');
