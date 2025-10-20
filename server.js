const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✓ Connected to MongoDB'))
.catch(err => console.error('✗ MongoDB connection error:', err));

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventLocation: { type: String, required: true },
  numberOfSeats: { type: Number, required: true },
  pricePerSeat: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  depositAmount: { type: Number },
  amountPaid: { type: Number, required: true },
  paymentType: { type: String, required: true },
  paymentReference: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./'));

// ===== API ENDPOINTS =====

/**
 * POST /api/store-ticket
 * Store ticket data after successful payment
 */
app.post('/api/store-ticket', async (req, res) => {
  try {
    const {
      ticketNumber,
      name,
      email,
      phone,
      eventName,
      eventDate,
      eventLocation,
      numberOfSeats,
      pricePerSeat,
      totalPrice,
      depositAmount,
      amountPaid,
      paymentType,
      paymentReference,
      paymentMethod,
      isPaid,
      timestamp
    } = req.body;

    // Validate required fields
    if (!ticketNumber || !email || !eventName || !paymentReference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new ticket document
    const ticket = new Ticket({
      ticketNumber,
      name,
      email,
      phone,
      eventName,
      eventDate,
      eventLocation,
      numberOfSeats,
      pricePerSeat,
      totalPrice,
      depositAmount,
      amountPaid,
      paymentType,
      paymentReference,
      paymentMethod,
      isPaid,
      timestamp
    });

    // Save to MongoDB
    await ticket.save();

    console.log(`✓ Ticket stored: ${ticketNumber}`);

    res.json({
      success: true,
      message: 'Ticket stored successfully',
      ticketNumber: ticketNumber
    });

  } catch (error) {
    console.error('Error storing ticket:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Ticket number already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to store ticket',
      message: error.message
    });
  }
});

/**
 * GET /api/ticket/:ticketNumber
 * Retrieve ticket details using ticket number and email
 */
app.get('/api/ticket/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { email } = req.query;

    if (!ticketNumber || !email) {
      return res.status(400).json({ error: 'Ticket number and email are required' });
    }

    // Find ticket in MongoDB
    const ticket = await Ticket.findOne({ ticketNumber: ticketNumber });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Verify email matches
    if (ticket.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Email does not match this ticket' });
    }

    res.json({
      success: true,
      ticket: ticket
    });

  } catch (error) {
    console.error('Error retrieving ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve ticket',
      message: error.message
    });
  }
});

/**
 * POST /api/verify-payment
 * Verify payment with payment gateway (for backend verification)
 */
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { reference, method } = req.body;

    if (!reference || !method) {
      return res.status(400).json({ error: 'Missing reference or method' });
    }

    // TODO: Implement payment verification based on method
    // For Paystack: Use Paystack API to verify
    // For PayPal: Use PayPal API to verify
    // For M-Pesa: Use M-Pesa API to verify

    console.log(`Verifying payment: ${reference} via ${method}`);

    res.json({
      success: true,
      verified: true,
      reference
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Groundflex Adventures Server         ║
║   🚐 Running on port ${PORT}            ║
╚════════════════════════════════════════╝
  `);
});