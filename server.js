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
  isValidated: { type: Boolean, default: false },
  validatedAt: { type: Date, default: null },
  validatedBy: { type: String, default: null },
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
 * GET /api/tickets
 * Retrieve all tickets for admin dashboard
 */
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find({}).sort({ timestamp: -1 });
    res.json({
      success: true,
      count: tickets.length,
      tickets: tickets
    });
  } catch (error) {
    console.error('Error retrieving tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tickets',
      message: error.message
    });
  }
});

/**
 * GET /api/users
 * Retrieve all unique users for admin dashboard
 */
app.get('/api/users', async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    const users = {};
    
    tickets.forEach(ticket => {
      if (!users[ticket.email]) {
        users[ticket.email] = {
          name: ticket.name,
          email: ticket.email,
          phone: ticket.phone || 'N/A',
          ticketCount: 0,
          totalSpent: 0,
          firstBooking: ticket.timestamp
        };
      }
      users[ticket.email].ticketCount += ticket.numberOfSeats;
      users[ticket.email].totalSpent += ticket.totalPrice;
      users[ticket.email].lastBooking = ticket.timestamp;
    });

    const userList = Object.values(users);
    res.json({
      success: true,
      count: userList.length,
      users: userList
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
});

/**
 * GET /api/user-tickets/:email
 * Retrieve all tickets for a specific user
 */
app.get('/api/user-tickets/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const tickets = await Ticket.find({ email: email }).sort({ timestamp: -1 });
    
    res.json({
      success: true,
      count: tickets.length,
      tickets: tickets
    });
  } catch (error) {
    console.error('Error retrieving user tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user tickets',
      message: error.message
    });
  }
});

/**
 * POST /api/ticket/:ticketNumber/validate
 * Mark ticket as validated (used)
 */
app.post('/api/ticket/:ticketNumber/validate', async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { validatedBy } = req.body;

    const ticket = await Ticket.findOneAndUpdate(
      { ticketNumber: ticketNumber },
      {
        isValidated: true,
        validatedAt: new Date(),
        validatedBy: validatedBy || 'Admin'
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({
      success: true,
      message: 'Ticket validated successfully',
      ticket: ticket
    });
  } catch (error) {
    console.error('Error validating ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate ticket',
      message: error.message
    });
  }
});

/**
 * POST /api/ticket/:ticketNumber/unvalidate
 * Mark ticket as not validated (undo validation)
 */
app.post('/api/ticket/:ticketNumber/unvalidate', async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const ticket = await Ticket.findOneAndUpdate(
      { ticketNumber: ticketNumber },
      {
        isValidated: false,
        validatedAt: null,
        validatedBy: null
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({
      success: true,
      message: 'Ticket validation removed',
      ticket: ticket
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update ticket',
      message: error.message
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