# Penjelasan Lazy Loading di Aplikasi Angular GMF

Dokumen ini menjelaskan konsep Lazy Loading (Pemuatan Lambat) dan bagaimana kita mengimplementasikannya dalam proyek frontend Angular GMF. Tujuannya adalah untuk memberikan pemahaman yang jelas mengenai perubahan struktur yang dilakukan dan manfaat yang diharapkan.

## 1. Apa itu Eager Loading (Pemuatan Sigap)?

Secara default, aplikasi Angular menggunakan Eager Loading. Ini berarti:
- Semua modul dan komponen aplikasi dimuat saat aplikasi pertama kali dijalankan.
- Pengguna harus menunggu seluruh kode aplikasi diunduh dan diproses sebelum bisa berinteraksi, bahkan untuk fitur yang mungkin tidak akan mereka gunakan.
- **Kelemahan**: Waktu muat awal (initial load time) bisa menjadi sangat lama, terutama untuk aplikasi besar.

## 2. Apa itu Lazy Loading (Pemuatan Lambat)?

Lazy Loading adalah teknik di mana kita hanya memuat bagian-bagian aplikasi (modul fitur) ketika bagian tersebut benar-benar dibutuhkan oleh pengguna.
- Saat pengguna pertama kali membuka aplikasi, hanya modul inti dan komponen yang diperlukan untuk halaman awal yang dimuat.
- Ketika pengguna menavigasi ke suatu fitur (misalnya, halaman "Participants" atau "Users"), barulah modul untuk fitur tersebut diunduh dan diproses oleh browser.
- **Manfaat Utama**:
    - **Waktu Muat Awal Lebih Cepat**: Aplikasi terasa lebih responsif karena ukuran *bundle* awal jauh lebih kecil.
    - **Pengalaman Pengguna Lebih Baik**: Pengguna bisa mulai menggunakan fungsionalitas dasar lebih cepat.
    - **Optimalisasi Sumber Daya**: Menghemat *bandwidth* dan memori karena pengguna hanya mengunduh kode yang relevan dengan aksi mereka.
    - **Struktur Kode Lebih Modular**: Mendorong pemisahan fitur yang lebih baik.

## 3. Bagaimana Kita Mengimplementasikan Lazy Loading?

Proses implementasi melibatkan beberapa langkah utama untuk setiap fitur yang ingin kita buat *lazy-loaded*:

### a. Restrukturisasi Direktori
   - Komponen-komponen yang sebelumnya berada di `src/app/pages/<nama-fitur>/` dipindahkan ke direktori baru yang lebih terstruktur: `src/app/features/<nama-fitur>/pages/`.
   - Contoh: Komponen untuk fitur "Auth" dipindahkan dari `src/app/pages/auth/` ke `src/app/features/auth/pages/`.

### b. Pembuatan Modul Fitur (`<nama-fitur>.module.ts`)
   - Untuk setiap fitur, kita membuat sebuah `NgModule` baru (misalnya, `AuthModule`, `UsersModule`).
   - Modul ini akan:
     - Mengimpor `CommonModule` dan modul Angular lain yang dibutuhkan (seperti `FormsModule`, `ReactiveFormsModule`).
     - Mengimpor modul routing khusus fitur tersebut (lihat poin c).
     - Mengimpor komponen-komponen *standalone* yang menjadi bagian dari fitur tersebut.
     - (Opsional) Mengimpor modul Angular Material atau modul bersama lainnya yang digunakan oleh komponen dalam fitur ini.

   Contoh (`auth.module.ts`):
   ```typescript
   import { NgModule } from '@angular/core';
   import { CommonModule } from '@angular/common';
   // ... import lain
   import { AuthRoutingModule } from './auth-routing.module';
   import { LoginComponent } from './pages/login/login.component';
   // ... import komponen auth lainnya

   @NgModule({
     imports: [
       CommonModule,
       AuthRoutingModule,
       LoginComponent, // Komponen standalone diimpor langsung
       // ...
     ]
   })
   export class AuthModule { }
   ```

### c. Pembuatan Modul Routing Fitur (`<nama-fitur>-routing.module.ts`)
   - Setiap fitur juga memiliki modul routingnya sendiri (misalnya, `AuthRoutingModule`, `UsersRoutingModule`).
   - Modul ini mendefinisikan rute-rute (URL *paths*) spesifik untuk fitur tersebut.
   - Semua *guards* (seperti `AuthGuard`, `RoleGuard`) dan data peran (`data: { roles: [...] }`) yang sebelumnya ada di `app.routes.ts` untuk rute-rute ini, dipindahkan ke sini.
   - Rute didefinisikan menggunakan `RouterModule.forChild(routes)`.

   Contoh (`auth-routing.module.ts`):
   ```typescript
   import { NgModule } from '@angular/core';
   import { RouterModule, Routes } from '@angular/router';
   import { LoginComponent } from './pages/login/login.component';
   // ... import guard jika ada

   const routes: Routes = [
     { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
     // ... rute auth lainnya
   ];

   @NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
   })
   export class AuthRoutingModule { }
   ```

### d. Pembaruan `app.routes.ts` (Routing Utama)
   - Di file routing utama (`src/app/app.routes.ts`):
     - Hapus impor langsung ke komponen-komponen yang sudah dipindahkan ke modul fitur.
     - Ganti definisi rute yang sebelumnya menunjuk langsung ke komponen dengan sintaks `loadChildren`.
     - `loadChildren` akan menunjuk ke file modul fitur yang baru dibuat.

   Contoh perubahan di `app.routes.ts` untuk fitur "Auth":
   ```typescript
   // Hapus: import { LoginComponent } from './pages/auth/login/login.component';

   export const routes: Routes = [
     // ... rute lain
     {
       path: 'auth', // Path dasar untuk fitur auth
       loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
       // Guards yang berlaku untuk semua child route di AuthModule bisa diletakkan di sini,
       // atau lebih spesifik di auth-routing.module.ts
     },
     // ... rute lain
   ];
   ```
   Dengan `loadChildren`, Angular tidak akan memuat `AuthModule` sampai pengguna mencoba mengakses *path* yang dimulai dengan `/auth`.

## 4. Dampak dan Verifikasi

- **Fungsionalitas**: Perubahan ini seharusnya **tidak mengubah fungsionalitas** aplikasi yang sudah ada. Semua logika bisnis, tampilan, dan alur pengguna tetap sama. Yang berubah adalah cara kode diorganisir dan dimuat.
- **Path URL**: Semua *path* URL yang bisa diakses pengguna sebelum refaktorisasi ini akan tetap bisa diakses dengan *path* yang sama.
- **Verifikasi**: Setelah setiap modul direfaktor, penting untuk menjalankan aplikasi (`npm run start` atau `pnpm start`) dan menguji navigasi ke fitur-fitur tersebut untuk memastikan semuanya berjalan seperti yang diharapkan. Perhatikan juga *console* browser untuk melihat apakah ada *error* terkait pemuatan modul atau rute.

## 5. Keuntungan Jangka Panjang

- **Performa Optimal**: Aplikasi akan lebih cepat dimuat dan lebih responsif.
- **Kode Lebih Terstruktur**: Memudahkan pengembangan dan pemeliharaan di masa depan.
- **Skalabilitas**: Lebih mudah menambahkan fitur baru tanpa membebani ukuran *bundle* awal aplikasi.

Dengan menerapkan Lazy Loading secara konsisten, kita membangun fondasi yang lebih kuat dan efisien untuk aplikasi GMF.
