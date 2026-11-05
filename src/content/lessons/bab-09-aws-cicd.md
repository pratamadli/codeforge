# Docker, AWS, CI/CD di produksi

Nice-to-have di JD Bookipi, tetapi interviewer senior hampir selalu menyinggung: "Bagaimana kamu merilis? Kalau salah, bagaimana rollback?"

Bukan tutorial klik konsol. Ini penilaian apakah kamu pernah **mengantar perubahan ke produksi** tanpa drama.

## Konsep

### Docker yang relevan di interview

- Image reprodusibel: `npm ci`, lockfile di-commit, base pin (`node:22-alpine@sha256:...` jika perlu).
- Multi-stage: builder buang compiler; image jalan hanya `node dist` + deps produksi.
- Satu proses per container. Konfig lewat env. Secret dari store, bukan layer image.
- Healthcheck yang jujur (`/healthz` cek Mongo + queue, bukan hanya `200` kosong) supaya orchestrator tidak kirim trafik ke proses setengah hidup.

### AWS (atau setara) yang cukup disebut

Jangan hafal 200 layanan. Hafal **jalur request** sebuah app MERN:

| Bagian | Pilihan tipikal | Trade-off |
| --- | --- | --- |
| Edge / TLS | CloudFront + ACM, atau ALB | CDN bagus untuk aset; API dinamis hati-hati cache |
| Compute | ECS/Fargate, Elastic Beanstalk, EC2 + compose | Fargate kurang SSH, lebih sedikit ops; EC2 lebih fleksibel, lebih rawan snowflake |
| Data | DocumentDB / Mongo Atlas, RDS jika SQL | Atlas vs self-host: waktu vs kontrol |
| Object | S3 + pre-signed URL | Jangan streaming file lewat Node |
| Rahasia | SSM Parameter / Secrets Manager | Bukan `.env` di repo |
| Observability | CloudWatch + APM (Datadog/Sentry) | Log tanpa trace = tebak-tebakan |

Tergantung ukuran tim. Startup 8 engineer: modular monolith di ECS + Atlas + satu pipeline sering menang. "Kita pecah 12 service di EKS" tanpa alasan adalah utang ops.

### CI/CD yang mereka ingin dengar

Pipeline: lint → typecheck → unit → build image → integration (Mongo memory/container) → deploy staging → smoke → produksi.

Rilis:

- **Rolling** default. Dua versi hidup: migrasi harus expand/contract.
- **Blue-green** jika rollback harus instan (payroll date).
- **Canary / flag** untuk fitur berisiko (mesin pajak baru).

Migrasi Mongo di CI: jangan drop field di deploy yang sama dengan kode yang masih membaca field itu. Expand (tambah) → deploy kode → contract (hapus) belakangan.

Rollback: image tag immutable. `deploy previous-sha` lebih andal daripada "hotfix di server".

## Tips menjawab

"Bagaimana deploy app ini?" — gambar 60 detik: GitHub Actions build image → ECR → ECS service + ALB → Atlas. Sebut healthcheck, secret, dan cara rollback. Kalau ditanya Kubernetes: *"Saya pakai jika kebutuhan penjadwalan/multi-tenant nyata; untuk satu app MERN, ECS/Fargate biasanya cukup."*

## Sudut pandang senior

CI yang hijau tetapi tidak mengetes migrasi atau webhook adalah teater. Senior memasang tes pada **jalur uang** di staging dengan Stripe test clock / fixture, bukan hanya `GET /health`.

Deploy Jumat sore payroll: tidak, kecuali hotfix yang sudah ada rollback teruji.

## Kesalahan umum

- `latest` sebagai tag produksi.
- SSH ke container lalu edit file.
- Secret di GitHub variable yang ikut ke log.
- Migrasi breaking di langkah yang sama dengan kode.
- Tidak bisa menjawab "bagaimana kamu tahu deploy ini jelek dalam 5 menit?"
