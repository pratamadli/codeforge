# Testing: unit sampai E2E

Tes yang baik melindungi perilaku, bukan isi fungsi. Kalau tes pecah hanya karena refactor nama variabel, tesnya yang salah.

## Konsep

### Piramida

| Jenis | Menguji | Jumlah | Alat |
| --- | --- | --- | --- |
| Unit | Satu fungsi/komponen | Banyak, cepat | Jest / Vitest |
| Integration | Beberapa bagian bersama | Cukup | Supertest, Testing Library, DB uji |
| E2E | Alur pengguna browser → backend | Sedikit, alur kritis | Playwright, Cypress |

Semakin ke atas: makin realistis, makin lambat dan rapuh.

Prinsip: uji perilaku bukan implementasi; AAA (Arrange, Act, Assert); satu tes satu alasan gagal; deterministik (fake timer, mock jaringan); mock hanya batas sistem; coverage indikator bukan tujuan; flaky test lebih berbahaya daripada tidak ada tes.

### React Testing Library

Uji seperti pengguna. Query: `getByRole` > `getByLabelText` > `getByText` > `getByTestId` (terakhir). Elemen yang muncul belakangan: `findBy` / `waitFor`.

```js
test("menambah item ke keranjang", async () => {
  const user = userEvent.setup();
  render(<ProductCard product={{ id: 1, name: "Phone", price: 500 }} />);
  await user.click(screen.getByRole("button", { name: /tambah ke keranjang/i }));
  expect(await screen.findByText(/1 item/i)).toBeInTheDocument();
});
```

### Backend

Tes: tanpa login → 401. Dengan token → 201 dan **total dihitung di server**. DB uji terpisah atau `mongodb-memory-server`. Service dipisah dari Express agar logika bisa dites tanpa HTTP.

TDD: Red → Green → Refactor. Tidak wajib selalu, sangat efektif untuk diskon/harga/aturan booking.

## Tips menjawab

Klasik: "Apa yang kamu tes dan tidak?", "Unit vs integration?", "Mock vs stub vs spy?", "Flaky test?", "Kode async/timer?"

Jawaban senior: *"Saya menguji perilaku dan jalur kritis (pembayaran, otorisasi), memock hanya batas sistem, mengejar tes cepat dan stabil — bukan angka coverage."*

## Tes sebagai pencegahan insiden

Setelah RCA, tes yang berharga adalah yang **mengunci regresi jalur uang**: webhook dobel tidak men-credit dua kali, `Idempotency-Key` mengembalikan invoice yang sama, stok tidak negatif. Tes itu lebih senior daripada 90% coverage komponen tombol.

## Sudut pandang senior

Piramida terbalik (banyak E2E, sedikit unit) membuat CI lambat dan rapuh. E2E untuk *happy path* checkout/login. Sisanya unit + integration. Contract test berguna saat tim FE dan BE terpisah.

Tergantung blast radius: setelah insiden pembayaran, tulis tes reproduksi **sebelum** menutup tiket — bukan "nanti kita monitor".

## Kesalahan umum

- Tes yang mengunci struktur DOM/class CSS.
- Mock semua sampai tes tidak menguji apa-apa.
- Ketergantungan waktu nyata / jaringan asli.
- Membiarkan tes flaky "kadang gagal, klik ulang".
- Mengejar 100% coverage dengan tes kosong.
