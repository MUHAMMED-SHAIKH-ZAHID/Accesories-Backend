require('dotenv').config();
const express = require('express');
const cors = require('cors');
const paymentRouter = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
    origin: '*'
}));



// Routes
app.use('/api/payment', paymentRouter);

// Health check
app.get('/', (req, res) => {
    res.send('Tap Payment API is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Endpoint: POST http://localhost:${PORT}/api/payment/create`);
});