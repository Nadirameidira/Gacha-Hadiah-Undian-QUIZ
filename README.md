# PENJELASAN END POINT 
#### MEISA PUTRI NADIRA 535250066

## Gacha System API QUIZZ BACKEND 

## Daftar Endpoint yang Tersedia

### Melakukan Spin Gacha

- Endpoint: `POST /api/gacha/spin`
- Route : `route.post('/spin', gachaController.spin)`
- Deskripsi: untuk spin gacha undian
- Parameter: id 
- Contoh Request di echo API:
POST http://localhost:5000/api/gacha/spin

{
  "id": "65a1b2c3d4e5f67890abcdef"
}
 // ini di raw body

### MELIHAT HISTORI GACHA SI USER
<img width="1918" height="1016" alt="Image" src="https://github.com/user-attachments/assets/7213a8a4-1447-40f6-b65d-e11021b8291f" />

- Endpoint: `GET /api/gacha/history/:id`
- Route: `  route.get('/history/:id', gachaController.history);`
- Deskripsi: Menampilkan riwayat spin yang sudah dilakukan oleh user/client
- Parameter : Id dengan tipe string
GET http://localhost:5000/api/gacha/history/69e07ba96bde80b90082b3f2

### MELIHAT SISA KUOTA HADIAH UNDIAN
<img width="1902" height="1014" alt="Image" src="https://github.com/user-attachments/assets/48e5783a-9ac3-4424-bd95-96d6cb186253" />

- Endpoint: `GET /api/gacha/quota`
- Deskripsi: Menampilkan sisa kuota pemenang untuk setiap hadiah yang ada untuk undian 
- Parameter Input: Tidak ada
GET http://localhost:5000/api/gacha/quota

### MELIHAT DAFTAR PEMENANG
<img width="1891" height="994" alt="Image" src="https://github.com/user-attachments/assets/46117bce-5d8f-4903-97a7-372f307ec41f" />

- Endpoint : `GET api/gacha/winners`
- Deskripsi : Untuk mengetahui history gacha winnersnya yang sudah di sensor seperti contoh: (1) J*** *oe; atau (2) *oh* D*e.
- Contoh Request di echo API "
GET http://localhost:5000/api/gacha/winners

# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.
