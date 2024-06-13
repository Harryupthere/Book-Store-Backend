const express = require('express');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
