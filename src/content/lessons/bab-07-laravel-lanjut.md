# Transaksi, tes, frontend, dan kapan pilih Laravel

## 7.6 Transaksi dan konsistensi data

```php
DB::transaction(function () use ($user, $items) {
    $order = Order::create(['user_id' => $user->id, 'status' => 'pending']);
    foreach ($items as $i) {
        $ok = Product::where('id', $i['product_id'])
                     ->where('stock', '>=', $i['qty'])
                     ->decrement('stock', $i['qty']);
        if (! $ok) throw new OutOfStockException($i['product_id']);
        $order->items()->create($i);
    }
}, 3); // retry otomatis saat deadlock

$wallet = Wallet::where('user_id', $id)->lockForUpdate()->first();
```

- Unique index menjamin keunikan (satu pembayaran per `idempotency_key`). Tangkap error duplikat, kembalikan hasil yang sudah ada.
- `firstOrCreate` bisa balapan (dua request sama-sama tidak menemukan, lalu sama-sama insert). Pasangkan unique index + tangani exception, atau `upsert`.
- Transaksi **singkat**: jangan panggil API eksternal atau kerja lama di dalamnya — menahan lock.
- Padanan Mongoose: `findOneAndUpdate` atomic + `session.withTransaction` (bab 6).

## 7.7 Testing di Laravel

```php
it('menolak membuat order tanpa login', function () {
    $this->postJson('/api/orders', [])->assertUnauthorized();
});

it('mengurangi stok saat order dibuat', function () {
    $user = User::factory()->create();
    $p = Product::factory()->create(['stock' => 5]);
    Http::fake();
    $this->actingAs($user)->postJson('/api/orders', [
        'items' => [['product_id' => $p->id, 'qty' => 2]],
    ])->assertCreated();
    expect($p->fresh()->stock)->toBe(3);
});
```

Alat: PHPUnit atau Pest. Trait `RefreshDatabase`. `Queue::fake()`, `Mail::fake()`, `Http::fake()` untuk mengisolasi efek samping. Judge Codexercise **tidak** menjalankan PHP — latihan ini materi + pembahasan.

## 7.8 Frontend di ekosistem Laravel

| Pilihan | Apa itu | Cocok untuk | Trade-off |
| --- | --- | --- | --- |
| Blade | Template HTML di server | Situs konten, admin sederhana, SEO | Interaktivitas tinggi butuh JS tambahan |
| Livewire | Komponen reaktif di PHP | Tim backend ingin UI interaktif cepat | Tiap interaksi round-trip ke server |
| Inertia.js | Laravel + React/Vue tanpa API terpisah | SPA satu repo | Terikat pola Inertia; kurang cocok banyak client berbeda |
| API murni + Next.js/React | Laravel hanya API | Banyak client, tim FE/BE terpisah | Dua proyek, auth dan CORS harus rapi |

Vite adalah bundler bawaan (`@vite` di Blade). Untuk yang kuat di React/Next: Laravel sebagai API + Next.js, atau Inertia + React.

## 7.9 Laravel vs Express (Node)

| Aspek | Laravel | Express / Node |
| --- | --- | --- |
| Filosofi | Opinionated, batteries-included | Minimalis, rakit sendiri |
| Model eksekusi | Proses per request (FPM) atau app di memori (Octane) | Satu proses, event loop non-blocking |
| Kekuatan | CRUD/bisnis, ekosistem lengkap, konvensi seragam | Realtime, banyak koneksi I/O, satu bahasa dengan frontend |
| Kelemahan | Overhead bootstrap (tanpa Octane); WebSocket tidak natural | Struktur bergantung disiplin tim |
| Pekerjaan berat | Queue + worker (bawaan) | BullMQ + worker / `worker_threads` (rakit sendiri) |
| ORM | Eloquent (Active Record) | Prisma, TypeORM, Sequelize, Mongoose (pilih sendiri) |

Jangan fanatik. *"Aplikasi bisnis banyak CRUD, validasi, queue, tim butuh konvensi → Laravel mempercepat. Realtime atau FE+BE satu bahasa (TypeScript) → Node nyaman."* Performa jarang ditentukan bahasa — bottleneck biasanya query dan desain (bab 8).

## 7.10 Pertanyaan yang sering muncul

| Pertanyaan | Jawaban singkat |
| --- | --- |
| Lifecycle request? | `index.php` → bootstrap + service provider → middleware → router → controller → response. |
| Service container? | Pengelola dependensi: membuat objek dan menyuntikkannya (DI). |
| N+1 dan solusinya? | Query relasi dalam loop. Eager loading `with()`. |
| Beda `with` dan `load`? | `with` eager load saat query awal. `load` setelah model sudah ada. |
| Mass assignment? | Pengisian banyak field sekaligus. Lindungi `$fillable` / `$guarded`. |
| Queue vs scheduler? | Queue = pekerjaan ditunda dari request. Scheduler = tugas berkala (cron). |
| Sanctum vs Passport? | Sanctum: SPA/token sederhana. Passport: OAuth2 penuh. |
| Mengamankan Laravel? | Form Request, Policies, `$fillable`, CSRF (web), rate limit, hash password, `APP_DEBUG=false`, jaga `.env`. |
| Optimasi? | Eager loading, index, cache, queue, `php artisan optimize`, OPcache, Octane. Detail bab 8. |
| Transaksi dan race? | `DB::transaction`, update atomic bersyarat, `lockForUpdate`, unique index, job idempoten. |

## Tips menjawab

*"Kenapa Laravel / Node?"* mulai dari kebutuhan, bukan preferensi. Tambah: bottleneck hampir selalu database, bukan framework.

## Sudut pandang senior

Kebenaran stok dijamin database (`decrement` bersyarat / unique index), bukan `if` di PHP. Job idempoten. Tes jalur uang: stok berkurang, unauthorized ditolak, HTTP palsu.

## Kesalahan umum

- `firstOrCreate` tanpa unique index.
- API eksternal di dalam transaksi.
- `APP_DEBUG=true` di produksi.
- Mengira Octane "gratis" — state static bocor antar request.
