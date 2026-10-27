# API design, caching, dan scaling

Interviewer sistem desain jarang minta kamu bangun Twitter. Mereka ingin melihat **urutan berpikir**.

## 1. API dulu, database kemudian

- Resource jelas: `/users`, `/submissions`.
- HTTP verb sesuai arti: GET baca, POST buat, PATCH ubah.
- Error konsisten: `{ error: "..." }` + status 4xx/5xx.
- Idempotensi: retry POST pembayaran tidak boleh double-charge (pakai `Idempotency-Key`).

## 2. Caching

Cache adalah **fotokopi** data mahal. Analoginya: papan menu di depan kafe. Cepat dibaca, tapi bisa basi kalau resep berubah.

- Cache di mana? Browser, CDN, Redis, `Cache-Control`.
- Invalidation lebih sulit daripada *set*. Tanyakan: “data ini boleh terlambat 30 detik?”

## 3. Scaling

- **Vertical**: mesin lebih gemuk. Cepat, ada batas.
- **Horizontal**: banyak instance di belakang load balancer. Butuh session stateless (JWT/cookie yang tidak tersimpan hanya di RAM satu server).
- Database: index dulu sebelum *shard*. Shard itu mahal secara operasional.

## Kerangka jawaban 5 menit

1. Kebutuhan + angka kasar (QPS, ukuran data).
2. API dan model.
3. Bottleneck (read vs write).
4. Cache / queue / replica sesuai bottleneck.
5. Kegagalan: timeout, retry, *poison message*.
