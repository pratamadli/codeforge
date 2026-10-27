# Layering: controller, service, repository

Aplikasi backend yang rapi biasanya dipotong tiga lapis. Bukan dogma, tapi cara menjelaskan *siapa mengurus apa* di interview.

1. **Controller / route** — terima HTTP, validasi input kasar, panggil service, tulis status code.
2. **Service** — aturan bisnis. “User boleh daftar jika email belum ada.” Tidak peduli Express atau Mongo.
3. **Repository / model** — bicara ke database.

```txt
Request → Controller → Service → Repository → MongoDB
                ↓
              Response
```

## Analogi

Restoran.

- Pelayan (controller) terima pesanan, tidak masak.
- Koki (service) putuskan resep dan urutan.
- Gudang (repository) ambil bahan.

Kalau pelayan ikut ke gudang dan koki menerima JSON mentah dari internet, satu perubahan schema merembet ke mana-mana.

## Kalimat interview

“Saya jaga *business logic* di service supaya handler HTTP tipis. Repository menyembunyikan query Mongo — index dan bentuk dokumen tidak bocor ke controller.”
