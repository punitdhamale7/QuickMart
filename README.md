# QuickMart 🛒

A full-stack grocery pickup platform that connects local retailers with customers. Retailers manage their shop, products, and orders — customers browse shops, place orders, and pick up using a QR code.

---

## Features

**Customer**
- Browse nearby shops and their product catalog
- Add items to cart and place orders
- Real-time order status tracking (Pending → Accepted → Packing → Ready For Pickup → Completed)
- QR code generated on order confirmation — shown at pickup
- View order history

**Retailer**
- Create and manage shop profile
- Add, edit, and delete products with images
- Manage inventory with low-stock alerts
- Accept/decline orders and set estimated pickup time
- QR scanner to verify customer pickup and auto-complete order
- Analytics dashboard — real revenue, top products, daily/monthly sales charts

**System**
- JWT-based authentication (customer & retailer roles)
- Stock automatically reduced when an order is placed
- Fully protected routes per role

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4     |
| Backend   | Node.js, Express.js                 |
| Database  | MySQL (single master SQL schema)    |
| Auth      | JWT (jsonwebtoken + bcryptjs)       |
| File Upload | Multer                            |
| QR Code   | qrcode.react (display), html5-qrcode (scan) |

---

## Project Structure

```
QuickMart/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── database/        # quickmart_master.sql (single schema file)
│   ├── middleware/       # Auth middleware
│   ├── routes/          # Express routers
│   ├── uploads/         # Product & shop images
│   ├── .env.example     # Environment variable template
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Retailer & customer UI components
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Retailer & customer pages
│   │   └── services/    # Axios API service layer
│   ├── .env.example
│   └── vite.config.js
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/quickmart.git
cd quickmart
```

### 2. Database Setup

Open MySQL and run the master schema:

```bash
mysql -u root -p < backend/database/quickmart_master.sql
```

This creates the `quickmart` database with all tables:
- `users`, `shops`, `products`, `orders`, `order_items`

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=quickmart
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=1d
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start the backend:
```bash
npm run dev        # development (nodemon)
npm run start      # production
```

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

### Backend (`backend/.env`)

| Variable     | Description                     |
|--------------|---------------------------------|
| PORT         | Server port (default 5000)      |
| DB_HOST      | MySQL host                      |
| DB_USER      | MySQL username                  |
| DB_PASSWORD  | MySQL password                  |
| DB_NAME      | Database name (`quickmart`)     |
| JWT_SECRET   | Secret key for signing tokens   |
| JWT_EXPIRE   | Token expiry (e.g. `1d`)        |

### Frontend (`frontend/.env.local`)

| Variable      | Description              |
|---------------|--------------------------|
| VITE_API_URL  | Backend API base URL     |

---

## API Overview

| Method | Endpoint                          | Description                  |
|--------|-----------------------------------|------------------------------|
| POST   | /api/auth/register                | Register user                |
| POST   | /api/auth/login                   | Login                        |
| GET    | /api/shops                        | List all shops               |
| POST   | /api/products                     | Add product (retailer)       |
| GET    | /api/products/shop/:id            | Get shop products (public)   |
| POST   | /api/orders                       | Place order (customer)       |
| GET    | /api/orders/retailer              | Get retailer orders          |
| PUT    | /api/orders/:id/status            | Update order status          |
| GET    | /api/orders/verify-qr/:token      | Verify QR pickup             |
| GET    | /api/dashboard/analytics          | Retailer analytics data      |

---

## Screenshots

> Add screenshots of your app here

| Customer — Shop Browse | Retailer — Orders |
|------------------------|-------------------|
| _(screenshot)_         | _(screenshot)_    |

| Customer — QR Code | Retailer — QR Scanner |
|--------------------|-----------------------|
| _(screenshot)_     | _(screenshot)_        |

---

## Future Enhancements

- [ ] Push notifications (Socket.io real-time updates)
- [ ] Customer address management & delivery option
- [ ] Payment gateway integration (Razorpay)
- [ ] Admin panel
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

## Author

**Punit Jagdish Dhamale**

---

## License

MIT
