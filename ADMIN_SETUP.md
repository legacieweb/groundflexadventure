# Admin Panel Setup & Integration Guide

## Overview

The admin panel (`admin.html`) provides a comprehensive ticket management system that works like a digital passport scanner. Admins can:

- **View all users** who have made bookings
- **Search users** by name or email
- **Access user details** with all their ticket information
- **Validate tickets** by marking them as "used" (like stamping a passport)
- **Lookup tickets** by ticket ID and email
- **Real-time ticket status display** on the ticket confirmation page

## Accessing the Admin Panel

1. Navigate to `admin.html` in your browser
2. Or add this link to your navigation menu:
   ```html
   <a href="admin.html">Admin Dashboard</a>
   ```

## Features

### 1. User Management

**View All Users**
- Navigate to the "👥 Users Management" tab
- All users who have made bookings appear as cards
- Each card shows:
  - User name with avatar
  - Email address
  - Phone number
  - Number of tickets purchased

**Search Users**
- Use the search box to filter by name or email
- Results update in real-time

**View User Details**
- Click on any user card to see:
  - Full user information
  - All tickets purchased by that user
  - Ticket status (Valid or Used)
  - Option to mark tickets as used

### 2. Ticket Validation (Passport Stamping)

**Marking Tickets as Used**
1. Click on a user from the users list
2. View all their tickets in the tickets table
3. Check the checkbox next to any ticket to mark it as "used"
4. Uncheck to revert to "valid" status
5. Changes are saved automatically

**Ticket Status Indicators**
- 🟢 **Valid** - Ticket is ready to be used
- 🔴 **Used** - Ticket has been validated and marked as used

### 3. Ticket Lookup

**Search Tickets by ID**
1. Navigate to the "🎫 Ticket Lookup" tab
2. Enter the ticket ID and email address
3. Click "🔍 Search"
4. View the ticket status and details

## Integration with Booking System

When customers complete a booking through the main site, you need to save their ticket data. Add this code to your booking completion handler:

```javascript
// Call this function after successful payment
window.saveBookingTicket({
  name: 'Customer Name',
  email: 'customer@email.com',
  phone: '+254 712 345 678',
  eventName: 'THIBA FALLS',
  eventDate: '2024-11-23',
  price: 2000,
  seats: 1,
  paymentType: 'Paid',
  paymentRef: 'PAYSTACK-REF-123'
});
```

### Example Implementation

Add this to your Paystack payment success callback in `index.html`:

```javascript
// In your payment success handler
paymentResponse => {
  // Save ticket to admin system
  window.saveBookingTicket({
    name: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    eventName: eventData.name,
    eventDate: eventData.date,
    price: eventData.price,
    seats: parseInt(formData.get('numberOfSeats')),
    paymentType: 'Paid',
    paymentRef: paymentResponse.reference
  });
  
  // Then show success message, etc.
}
```

## Data Storage

The admin system uses **localStorage** to store all data locally in the browser:

- `groundflex_users` - User information keyed by email
- `groundflex_tickets` - Array of all tickets

This allows the system to work offline and doesn't require a backend server.

### Exported Data Structure

```javascript
{
  id: "GF-ABC123-XYZ789",           // Unique ticket ID
  name: "John Doe",
  email: "john@example.com",
  phone: "+254 712 345 678",
  eventName: "THIBA FALLS",
  eventDate: "2024-11-23T00:00:00Z",
  price: 2000,
  seats: 1,
  paymentType: "Paid",
  status: "valid" | "used",           // 'valid' or 'used'
  createdAt: "2024-11-20T10:30:00Z",
  usedAt: "2024-11-23T14:22:00Z",    // When marked as used
  paymentRef: "PAYSTACK-REF-123"
}
```

## Ticket Confirmation Page Integration

The ticket confirmation page (`ticket-confirmation.html`) automatically:

1. **Checks localStorage** for the ticket first
2. **Displays the ticket status**:
   - 🟢 **Valid** - Ready to use (green badge)
   - 🔴 **Already Used** - Shows warning message with usage date
3. **Falls back to backend API** if ticket not found in localStorage

### How It Works

When a user enters their ticket ID and email on the ticket confirmation page:

1. System searches the local admin database
2. If found, displays ticket with current status
3. If status is "used", shows warning: "⚠️ TICKET ALREADY USED"
4. Shows the date/time when it was marked as used

## Security Considerations

**For Production Use:**
- The current system uses localStorage (browser storage)
- For multi-device support, migrate to a backend database
- Implement proper authentication to protect admin access
- Add password/login system to the admin panel
- Use HTTPS for all admin operations
- Consider implementing role-based access control

## Testing

### Add Sample Data

Uncomment this line in `admin.html` JavaScript to populate sample data:

```javascript
addSampleData(); // Add this to the script section
```

This creates:
- 2 sample users
- 3 sample tickets
- One ticket marked as "used"

### Test Workflow

1. **Open admin.html**
2. **View sample users** in the users grid
3. **Click a user** to see their tickets
4. **Check a ticket box** to mark it as used
5. **Go to ticket-confirmation.html**
6. **Enter the ticket ID and email** to verify status shows as "used"

## Troubleshooting

### Tickets Not Appearing
- Ensure `saveBookingTicket()` is called after successful payment
- Check browser console for errors
- Verify localStorage is enabled in browser

### Admin Panel Not Loading
- Clear browser cache
- Ensure `admin.html` is in the correct directory
- Check browser console for JavaScript errors

### Ticket Status Not Updating
- Refresh the page to reload from localStorage
- Check if another tab has unsaved changes
- Verify checkbox is actually being clicked

## Mobile Optimization

The admin panel includes a **hamburger menu** for mobile:
- Sidebar automatically hides on screens < 768px
- Toggle button in header reveals sidebar
- Clicking a menu item auto-closes the sidebar
- Touch-friendly interface

## Future Enhancements

- [ ] Export ticket list to CSV/Excel
- [ ] Print ticket labels with QR codes
- [ ] Real-time sync with backend database
- [ ] Email notifications to users
- [ ] Ticket analytics and reporting
- [ ] Multiple admin accounts
- [ ] Audit logs for all validations

## Support

For issues or questions about the admin panel, refer to:
- `admin.html` - Main admin interface
- `ticket-confirmation.html` - Ticket lookup page
- `index.html` - Main booking system