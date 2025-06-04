const express = require('express');
const router = express.Router();
require('dotenv').config();

// Create payment endpoint
router.post('/create', async (req, res) => {
    console.log(req.body)
    try {
        const { amount, currency, order_id, user_id } = req.body;

        // Validate input
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Create Tap payload
        const tapPayload = {
            amount: parseFloat(amount),
            currency: currency || 'KWD',
            threeDSecure: true,
            save_card: false,
            description: 'Payment for order',
            statement_descriptor: 'TAP-PAYMENT',
            metadata: {
                order_id: order_id || `order-${Date.now()}`,
                user_id: user_id || 'unknown'
            },
            customer: {
                first_name: "Customer",
                last_name: "Name",
                email: "customer@example.com"
            },
            source: {
                id: "src_all"
            },
            redirect: {
                url: `https://warm-sprinkles-ddbec8.netlify.app/`,
            }
        };

        // Call Tap API
        const tapResponse = await fetch('https://api.tap.company/v2/charges', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer sk_test_XKokBfNWv6FIYuTMg5sLPjhJ`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tapPayload)

        });

        const responseData = await tapResponse.json();
        console.log(responseData,"the response data")

        if (!tapResponse.ok) {
            console.error('Tap API error:', responseData);
            return res.status(tapResponse.status).json({
                error: 'Payment failed',
                details: responseData
            });
        }

        res.json({
            success: true,
            payment_url: responseData.transaction.url
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;