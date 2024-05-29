const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;


const initializePayment = async (req, res) => {
    const { email, amount } = req.body;
    const config = {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    };
    const data = {
        email,
        amount: amount * 100 
    };

    try {
        const response = await axios.post('https://api.paystack.co/transaction/initialize', data, config);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Payment initialization failed', error: error.response.data });
    }
};


const verifyPayment = async (req, res) => {
    const { reference } = req.query;
    const config = {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
    };

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, config);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Payment verification failed', error: error.response.data });
    }
};

module.exports = { initializePayment, verifyPayment };
