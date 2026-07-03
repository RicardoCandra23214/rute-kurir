# Optimasi Rute Kurir JNT Express

Sistem optimasi rute pengiriman untuk kurir **JNT Express Gajah Mada Pontianak** berbasis website. Dibuat untuk memenuhi tugas skripsi.

---

## 📌 Fitur Utama

- **Optimasi Rute** menggunakan algoritma Nearest Neighbor
- **Scan Resi Otomatis** dengan OCR (Google Vision)
- **Pencarian Lokasi** menggunakan Geocoding
- **Visualisasi Peta** dengan Leaflet + Routing Machine
- **Manajemen Paket** (Tambah, Edit, Hapus, Urutkan Manual)
- **Autentikasi** (Login & Register)
- **Responsive Design** dengan Tailwind CSS

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** + **Express**
- **MySQL** (Database)
- **JWT** untuk autentikasi
- **Google Cloud Vision** (OCR)
- **Google Maps Geocoding**

### Frontend
- **React.js** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Leaflet** + **Leaflet Routing Machine**
- **React Router**

---

## 🚀 Cara Install & Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/RicardoCandra23214/rute-kurir.git
cd rute-kurir

cd rute-kurir-backend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
# Isi .env sesuai konfigurasi database & API key
npm run dev

cd ../rute-kurir-frontend

# Install dependencies
npm install
npm run dev

rute-kurir/
├── rute-kurir-backend/      # Backend (Node.js + Express)
├── rute-kurir-frontend/     # Frontend (React + Vite)
├── .gitignore
└── README.md