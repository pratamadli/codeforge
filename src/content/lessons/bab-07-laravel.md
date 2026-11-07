# Laravel: request, Eloquent, API, queue

Laravel adalah framework PHP *batteries-included*: routing, ORM, validasi, auth, queue, scheduler, mail, dan testing sudah seragam. Struktur folder berbeda antar versi (11/12 lebih ramping) — sebut versi yang kamu pakai saat interview.

## 7.1 Cara Laravel menangani sebuah request

```
Browser/Client
   |
   v
Nginx/Apache --> PHP-FPM --> public/index.php
                                |
                    bootstrap app + Service Providers
                                |
                         Middleware (auth, throttle, ...)
                                |
                    Router --> Controller / Action
                                |
              Service / Eloquent --> Database / Cache / Queue
                                |
                    Response (JSON / HTML) --> kembali ke client
```

**PHP-FPM** bersifat *shared-nothing*: tiap request proses PHP terpisah yang mulai, bekerja, lalu selesai. State di memori tidak bertahan antar request. Kelebihan: sederhana dan aman (tidak bocor state). Kekurangan: biaya bootstrap tiap request.

**Laravel Octane** (Swoole, RoadRunner, FrankenPHP) menjaga aplikasi di memori — jauh lebih cepat. Harganya: hati-hati state global/static dan kebocoran memori antar request.

**OPcache** menyimpan bytecode PHP agar file tidak dikompilasi ulang tiap request. Wajib aktif di produksi.

Bandingkan dengan Node: Node satu proses yang hidup terus + event loop; PHP-FPM satu proses per request. Dua model, trade-off berbeda (lihat 7.9).

## 7.2 Konsep inti

| Konsep | Penjelasan sederhana |
| --- | --- |
| Routes | `routes/web.php` (halaman) dan `routes/api.php` (API). URL → controller. |
| Controller | Terima request, panggil logika, kembalikan response. Sebaiknya tipis. |
| Form Request | Validasi + otorisasi input, terpisah dari controller. |
| Eloquent Model | Tabel sebagai objek (ORM, Active Record). |
| Migration | Skrip berversi untuk skema database (seperti git untuk DB). |
| Seeder / Factory | Data awal / data palsu untuk development dan tes. |
| Service Container & DI | Laravel membuat objek dan menyuntikkan dependensi lewat constructor. Dasar kode yang mudah dites. |
| Service Provider | Daftar service dan konfigurasi saat aplikasi menyala. |
| Middleware | Auth, throttle, CORS — konsepnya sama dengan Express. |
| Facade | Akses "statis" ke container (`Cache::get`, `DB::table`). Nyaman, bisa menyembunyikan dependensi. |
| Artisan | CLI: `make:model`, `migrate`, `queue:work`, `tinker`. |
| `.env` + `config/` | Baca `env()` **hanya** di `config/`, bukan di kode aplikasi (agar `config:cache` berfungsi). |

## 7.3 Eloquent ORM

```php
class Order extends Model {
    protected $fillable = ['user_id', 'status', 'amount'];
    protected $casts = ['paid_at' => 'datetime'];
    public function user()  { return $this->belongsTo(User::class); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function scopePaid($q) { return $q->where('status', 'paid'); }
}

$orders = Order::paid()->with(['user:id,name', 'items'])->latest()->paginate(20);
```

- Relasi: `hasOne`, `hasMany`, `belongsTo`, `belongsToMany` (pivot), polymorphic.
- Mass assignment: `$fillable` (whitelist) atau `$guarded` — cegah user menyisipkan `is_admin`.
- Soft deletes: `deleted_at`, data tidak benar-benar hilang.
- Accessor/mutator dan casts: ubah format saat baca/tulis.
- **N+1** adalah jebakan Eloquent paling terkenal: relasi di dalam loop = 1 query per baris. Solusi: eager loading `with()`. Detail di bab 8.

## 7.4 Membangun API

```php
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('orders', OrderController::class);
});

public function rules(): array {
    return [
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.qty' => 'required|integer|min:1',
    ];
}

public function store(StoreOrderRequest $request, OrderService $service) {
    $order = $service->create($request->user(), $request->validated());
    return (new OrderResource($order))->response()->setStatusCode(201);
}
```

| Fitur | Fungsi |
| --- | --- |
| API Resource | Bentuk JSON: hanya field yang perlu, format konsisten. |
| Sanctum | Auth ringan: cookie session untuk SPA atau token pribadi untuk mobile/API. |
| Passport | Server OAuth2 penuh — pihak ketiga. |
| Policies & Gates | "Apakah user ini boleh mengubah order ini?" Wajib dicek di server. |
| Rate limiting | `RateLimiter::for('api', ...)` + `throttle`. Cache-backed (Redis multi-server). |
| Pagination | `paginate()` (offset, ada total) atau `cursorPaginate()` (lebih cepat untuk data besar). |
| Exception handler | Ubah exception jadi JSON konsisten. |

## 7.5 Queue, Job, Event, Scheduler

Pekerjaan lama atau boleh ditunda (email, PDF, webhook keluar) **jangan** di dalam request. Masukkan ke queue; worker `php artisan queue:work` yang memproses.

```php
class SendInvoice implements ShouldQueue {
    use Queueable;
    public $tries = 5;
    public $backoff = [10, 60, 300];
    public function __construct(public int $orderId) {}
    public function handle(InvoiceMailer $mailer): void {
        $order = Order::findOrFail($this->orderId);
        if ($order->invoice_sent_at) return; // idempoten
        $mailer->send($order);
        $order->update(['invoice_sent_at' => now()]);
    }
}

SendInvoice::dispatch($order->id)->afterCommit();
```

- Driver: Redis (umum), database, atau SQS. Horizon = dashboard worker Redis.
- Retry + backoff + `failed_jobs`.
- Job harus **idempoten**. `ShouldBeUnique` bila perlu.
- `afterCommit`: jika job dikirim sebelum transaksi commit, worker bisa jalan sebelum datanya ada.
- Scheduler: satu cron `schedule:run` mengatur semua tugas berkala di kode.
- Events & Listeners: `OrderPaid` memicu email, stok, analitik — pisahkan "apa yang terjadi" dari "apa yang dilakukan sesudahnya".

## Tips menjawab

Lifecycle: *"`index.php` → bootstrap + service provider → middleware → router → controller → response."*

N+1: *"Relasi di dalam loop. Saya `with()`, lalu `preventLazyLoading` di dev agar tidak terulang."*

## Sudut pandang senior

Controller tipis, Form Request untuk validasi, Service/Action untuk bisnis. Queue setelah `afterCommit`. Sanctum untuk SPA; Passport hanya jika OAuth2 pihak ketiga benar-benar perlu.

## Kesalahan umum

- `Order::all()` pada tabel besar — pakai `paginate`, `chunkById`, atau `lazy`.
- Logika bisnis di controller atau model gemuk.
- `env()` di luar folder `config/`.
- Job dikirim di dalam transaksi sebelum commit.
