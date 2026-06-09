const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes      = require('./routes/authRoutes');
const shopRoutes      = require('./routes/shopRoutes');
const productRoutes   = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const orderRoutes   = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => res.json({ success: true, message: 'QuickMart API Running 🚀' }));

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/shops',    shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/orders',   orderRoutes);

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
