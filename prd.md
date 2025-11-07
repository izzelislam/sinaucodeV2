Product Requirements Document (PRD): Blog CMS Pro
=================================================

**Versi:** 1.0**Tanggal:** 7 November 2025

1\. Pendahuluan
---------------

### 1.1. Latar Belakang

Saat ini, kebutuhan akan platform blogging yang fleksibel, SEO-friendly, dan memiliki kemampuan mengelola konten lebih dari sekadar artikel (seperti series dan penjualan produk digital) sangat tinggi. "Blog CMS Pro" dirancang untuk menjadi solusi bagi kreator konten, developer, dan bisnis kecil yang membutuhkan CMS mumpuni dengan kontrol penuh atas struktur konten dan media, serta kemampuan monetisasi dasar.

### 1.2. Masalah yang Diselesaikan

*   Blog standar tidak memiliki fitur untuk mengelompokkan artikel ke dalam "Series" (misal: "Tutorial Belajar Laravel dari A-Z").
    
*   Manajemen media (gambar, file) sering terpisah-pisah.
    
*   Fitur SEO tidak terintegrasi dengan baik pada semua jenis konten.
    
*   Tidak ada cara mudah untuk membuat "etalase" produk digital (seperti template) dengan sistem pembayaran manual yang sederhana.
    

### 1.3. Visi Produk

Menyediakan platform CMS yang terkelola (self-hosted atau SaaS) yang memberikan kebebasan kustomisasi konten, manajemen media terpusat, fitur SEO terbaik di kelasnya, dan jalur monetisasi yang mudah melalui penjualan produk digital.

2\. Tujuan & Sasaran
--------------------

*   **Bagi Kreator:** Menyediakan alat untuk publikasi konten yang terstruktur (Artikel, Series) dan kaya media.
    
*   **Bagi Admin:** Memberikan dashboard yang mudah digunakan untuk mengelola semua aspek (User, Konten, Media, Template).
    
*   **Bagi SEO Specialist:** Memastikan setiap halaman (artikel, kategori, series, template) dapat dioptimasi penuh untuk mesin pencari.
    
*   **Bagi Bisnis:** Membuka peluang pendapatan melalui fitur "Template Listing" dengan pembayaran manual.
    

3\. User Personas
-----------------

1.  **Admin (Anda):** Memiliki akses penuh ke semua fitur, termasuk pengaturan sistem, manajemen user, persetujuan artikel, dan pengelolaan template.
    
2.  **Penulis (Author/Writer):** Dapat membuat, mengedit, dan mengelola artikel, series, dan tag miliknya. Dapat mengunggah media ke Media Library.
    
3.  **Pengunjung (Visitor/Viewer):** Membaca artikel, menjelajahi kategori/series, dan melihat/menanyakan template.
    

4\. Rincian Fitur (Features Breakdown)
--------------------------------------

Ini adalah fitur-fitur utama berdasarkan entitas yang Anda minta.

### 4.1. F1: Manajemen Artikel (Articles)

*   **Deskripsi:** Inti dari CMS. Entitas untuk tulisan/blog post.
    
*   **Fitur:**
    
    *   CRUD (Create, Read, Update, Delete) dengan editor WYSIWYG (Rich Text Editor).
        
    *   Status: Draft, Published, Scheduled.
        
    *   SEO: Custom URL Slug, Meta Title, Meta Description.
        
    *   Relasi:
        
        *   Dapat memilih 1 **Penulis** (dari tabel users).
            
        *   Dapat memilih 1 atau lebih **Kategori** (dari tabel categories).
            
        *   Dapat menambahkan 1 atau lebih **Tag** (dari tabel tags).
            
        *   Dapat (opsional) memilih 1 **Series** (dari tabel series).
            
        *   Dapat memiliki 1 **Gambar Unggulan** (dari tabel media).
            
        *   Dapat memiliki banyak gambar/media di dalam konten (dari tabel media).
            

### 4.2. F2: Manajemen Kategori (Categories)

*   **Deskripsi:** Untuk mengelompokkan artikel berdasarkan topik utama.
    
*   **Fitur:**
    
    *   CRUD (Nama, Slug, Deskripsi).
        
    *   **Fitur Wajib:** Dapat memiliki 1 **Gambar Unggulan** (dari tabel media).
        
    *   Struktur Hirarki (Parent-Child) untuk sub-kategori.
        
    *   SEO: Custom Meta Title & Meta Description.
        

### 4.3. F3: Manajemen Tag (Tags)

*   **Deskripsi:** Untuk mengelompokkan artikel berdasarkan kata kunci spesifik.
    
*   **Fitur:**
    
    *   CRUD (Nama, Slug).
        
    *   (Biasanya non-hirarki dan tanpa gambar).
        

### 4.4. F4: Manajemen Series (Series)

*   **Deskripsi:** Fitur unggulan untuk mengelompokkan beberapa artikel menjadi satu rangkaian/serial (misal: "Belajar Laravel 1: Instalasi", "Belajar Laravel 2: Routing", dst.)
    
*   **Fitur:**
    
    *   CRUD (Nama, Slug, Deskripsi).
        
    *   Dapat memiliki 1 **Gambar Unggulan** (dari tabel media).
        
    *   Fitur untuk **mengurutkan** artikel di dalam series (Part 1, Part 2, ...).
        
    *   SEO: Halaman series akan menampilkan daftar artikel yang terurut.
        

### 4.5. F5: Manajemen User (Users)

*   **Deskripsi:** Mengelola siapa yang dapat mengakses dan membuat konten di CMS.
    
*   **Fitur:**
    
    *   CRUD (Nama, Email, Password, Bio).
        
    *   Peran (Roles): Admin, Penulis.
        
    *   Dapat memiliki 1 **Foto Profil** (dari tabel media).
        

### 4.6. F6: Manajemen Media (Media)

*   **Deskripsi:** Pustaka terpusat untuk semua file yang diunggah.
    
*   **Fitur:**
    
    *   **Fitur Wajib:** Satu tabel media untuk menyimpan semua file (gambar, pdf, dll).
        
    *   Upload, Delete, View.
        
    *   Menyimpan metadata: filename, path, mime\_type, alt\_text, caption.
        
    *   **Relasi:** Menggunakan relasi **Polymorphic (Morph One / Morph Many)** untuk terhubung ke entitas lain (Articles, Categories, Users, Series, Templates).
        

### 4.7. F7: Manajemen Templates (Templates)

*   **Deskripsi:** Etalase untuk listing/menjual template.
    
*   **Fitur:**
    
    *   CRUD (Nama, Deskripsi, Versi, Tipe).
        
    *   **Fitur Wajib:** Listing saja. Tidak ada proses checkout otomatis.
        
    *   Kolom untuk **Harga** (misal: "Rp 200.000" atau "$15").
        
    *   Kolom untuk **Info Pembayaran Manual**:
        
        *   paypal\_info (misal: email PayPal).
            
        *   bank\_transfer\_info (misal: "Bank BCA: 123456 a/n Admin").
            
    *   Dapat memiliki 1 **Gambar Unggulan** (dari tabel media).
        
    *   Dapat memiliki banyak **Gambar Galeri** (dari tabel media).
        
    *   SEO: Setiap template memiliki halaman detail sendiri yang SEO-friendly.
        

### 4.8. F8: Pelacakan Pengunjung (Viewers)

*   **Deskripsi:** Fitur analitik dasar untuk melacak tampilan artikel.
    
*   **Fitur:**
    
    *   Tabel viewers akan mencatat setiap kali artikel diakses.
        
    *   Data yang disimpan: article\_id, ip\_address (dianonimkan/hash), user\_agent.
        
    *   Menampilkan jumlah total view pada setiap artikel (di backend dan/atau frontend).
        
    *   Dashboard sederhana untuk "Top 10 Artikel Populer".
        

### 4.9. F9: SEO & Fitur Umum

*   **Deskripsi:** Kebutuhan non-fungsional untuk memastikan CMS kompetitif.
    
*   **Fitur:**
    
    *   **Clean URL:** Semua konten (artikel, kategori, series, template) harus memiliki slug yang _human-readable_.
        
    *   **Sitemap:** Auto-generate sitemap.xml.
        
    *   **Robots.txt:** Menyediakan robots.txt default (bisa di-edit oleh Admin).
        
    *   **Metadata:** Kemampuan menambah Meta Title & Description di semua entitas utama.
        
    *   **Alt Text:** Mewajibkan/mendorong pengisian alt\_text untuk gambar (dari tabel media).
        

5\. Struktur Database (Susunan Tabel)
-------------------------------------

Ini adalah desain skema database yang disarankan berdasarkan kebutuhan Anda.

### 1\. users

*   id (PK, BigInt)
    
*   name (String)
    
*   email (String, Unique)
    
*   password (String, Hashed)
    
*   bio (Text, Nullable)
    
*   role (String, Enum: 'admin', 'penulis', Default: 'penulis')
    
*   created\_at, updated\_at
    

### 2\. articles

*   id (PK, BigInt)
    
*   title (String)
    
*   slug (String, Unique)
    
*   content (LongText)
    
*   excerpt (Text, Nullable)
    
*   status (String, Enum: 'draft', 'published', 'scheduled', Default: 'draft')
    
*   user\_id (FK ke users.id) - _Penulis_
    
*   series\_id (FK ke series.id, Nullable) - _Jika bagian dari series_
    
*   series\_order (Integer, Nullable) - _Urutan di dalam series_
    
*   meta\_title (String, Nullable)
    
*   meta\_description (String, Nullable)
    
*   published\_at (Timestamp, Nullable)
    
*   created\_at, updated\_at
    

### 3\. categories

*   id (PK, BigInt)
    
*   name (String)
    
*   slug (String, Unique)
    
*   description (Text, Nullable)
    
*   parent\_id (FK ke categories.id, Nullable) - _Untuk sub-kategori_
    
*   meta\_title (String, Nullable)
    
*   meta\_description (String, Nullable)
    
*   created\_at, updated\_at
    

### 4\. tags

*   id (PK, BigInt)
    
*   name (String)
    
*   slug (String, Unique)
    
*   created\_at, updated\_at
    

### 5\. series

*   id (PK, BigInt)
    
*   name (String)
    
*   slug (String, Unique)
    
*   description (Text, Nullable)
    
*   created\_at, updated\_at
    

### 6\. templates

*   id (PK, BigInt)
    
*   name (String)
    
*   slug (String, Unique)
    
*   description (LongText)
    
*   version (String, Nullable)
    
*   type (String, Nullable) - _Misal: "HTML", "WordPress", "Laravel"_
    
*   price (String) - _Fleksibel untuk "Rp 100.000" atau "$10"_
    
*   paypal\_info (String, Nullable)
    
*   bank\_transfer\_info (Text, Nullable)
    
*   status (String, Enum: 'draft', 'published', Default: 'draft')
    
*   meta\_title (String, Nullable)
    
*   meta\_description (String, Nullable)
    
*   created\_at, updated\_at
    

### 7\. media (Pustaka Media Terpusat)

*   id (PK, BigInt)
    
*   filename (String) - _Nama file asli_
    
*   path (String) - _Path di server/storage_
    
*   mime\_type (String) - _Misal: "image/jpeg"_
    
*   alt\_text (String, Nullable) - _Penting untuk SEO_
    
*   caption (String, Nullable)
    
*   created\_at, updated\_at
    

### 8\. Tabel Pivot & Relasi (Sangat Penting)

Tabel-tabel ini menghubungkan semuanya.

#### 8.1. article\_category (Pivot Many-to-Many)

*   article\_id (FK ke articles.id)
    
*   category\_id (FK ke categories.id)
    

#### 8.2. article\_tag (Pivot Many-to-Many)

*   article\_id (FK ke articles.id)
    
*   tag\_id (FK ke tags.id)
    

#### 8.3. mediables (Tabel Polymorphic Morph-to-Many)

Ini adalah inti dari permintaan "morph one or many".

*   media\_id (FK ke media.id)
    
*   mediable\_id (BigInt) - _ID dari item (misal: 1)_
    
*   mediable\_type (String) - _Nama model (misal: "App\\Models\\Article")_
    
*   tag (String, Nullable) - _Untuk membedakan jenis gambar, misal: "featured\_image", "profile\_picture", "gallery"._
    

**Contoh Penggunaan mediables:**

1.  **Gambar Unggulan Artikel #5:**
    
    *   media\_id: 101
        
    *   mediable\_id: 5
        
    *   mediable\_type: "App\\Models\\Article"
        
    *   tag: "featured\_image"
        
2.  **Foto Profil User #1:**
    
    *   media\_id: 102
        
    *   mediable\_id: 1
        
    *   mediable\_type: "App\\Models\\User"
        
    *   tag: "profile\_picture"
        
3.  **Gambar Galeri Template #3 (Gambar 1):**
    
    *   media\_id: 103
        
    *   mediable\_id: 3
        
    *   mediable\_type: "App\\Models\\Template"
        
    *   tag: "gallery"
        
4.  **Gambar Galeri Template #3 (Gambar 2):**
    
    *   media\_id: 104
        
    *   mediable\_id: 3
        
    *   mediable\_type: "App\\Models\\Template"
        
    *   tag: "gallery"
        
5.  **Gambar Unggulan Kategori #2:**
    
    *   media\_id: 105
        
    *   mediable\_id: 2
        
    *   mediable\_type: "App\\Models\\Category"
        
    *   tag: "featured\_image"
        

### 9\. viewers (Analytics)

*   id (PK, BigInt)
    
*   article\_id (FK ke articles.id, Nullable)
    
*   ip\_address\_hash (String) - _Hash dari IP untuk privasi_
    
*   user\_agent (String)
    
*   timestamp (Timestamp)