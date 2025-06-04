require('dotenv').config();
const express = require('express');
const cors = require('cors');
const paymentRouter = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const allowedOrigins = ['https://your-frontend.netlify.app',"http://localhost:5173/"];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
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