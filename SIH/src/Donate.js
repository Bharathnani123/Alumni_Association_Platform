// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    screenshot: { type: String, required: true }, // Store the filename or path of the uploaded file
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
