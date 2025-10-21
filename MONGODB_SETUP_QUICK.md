# MongoDB Integration - Quick Setup Guide

## ✅ What Was Done

Your admin panel has been completely updated to work with MongoDB!

**Changes:**
- ✅ `server.js` - Added 5 new API endpoints for MongoDB operations
- ✅ `admin.html` - Replaced localStorage with MongoDB API calls
- ✅ All data now syncs in real-time across the system

---

## 🚀 Quick Test (3 Steps)

### Step 1: Start the Server
```bash
npm start
```
You should see:
```
╔════════════════════════════════════════╗
║   Groundflex Adventures Server         ║
║   🚐 Running on port 3000              ║
╚════════════════════════════════════════╝
```

### Step 2: Open Admin Panel
Open in your browser:
```
http://localhost:3000/admin.html
```

### Step 3: Test Lookup
1. Open browser console (F12)
2. Paste this code:
```javascript
// Check if server is running
const result = await AdminAPI.getAllTickets();
console.log('Tickets:', result);
```
3. You should see your tickets from MongoDB!

---

## 📝 Common Tasks

### ✅ Add Test Ticket
In browser console:
```javascript
await AdminAPI.saveTicket({
  name: 'Test User',
  email: 'test@example.com',
  phone: '+254 700 000 000',
  eventName: 'TEST EVENT',
  eventDate: '2024-11-23',
  numberOfSeats: 1,
  price: 5000,
  paymentRef: 'TEST-001'
});
```
Then reload admin panel - you'll see the new user!

### ✅ Search for Users
In browser:
1. Type in the search box "test@example.com"
2. Users appear instantly from MongoDB

### ✅ Validate a Ticket
In browser console:
```javascript
// First, get a ticket number from the database
const tickets = await AdminAPI.getAllTickets();
const ticketNumber = tickets[0].ticketNumber;

// Mark it as used
await AdminAPI.markTicketAsUsed(ticketNumber);
console.log('Ticket validated!');
```

### ✅ Quick Ticket Lookup
1. Click "🎫 Search Ticket" in admin panel
2. Enter ticket ID and email
3. See instant results from MongoDB

---

## 🔗 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tickets` | GET | Get all tickets |
| `/api/users` | GET | Get all users |
| `/api/user-tickets/:email` | GET | Get user's tickets |
| `/api/ticket/:id/validate` | POST | Mark as used |
| `/api/ticket/:id/unvalidate` | POST | Undo mark |
| `/api/store-ticket` | POST | Save new ticket |

---

## 🐛 Troubleshooting

### ❌ "Cannot find module" error
```bash
npm install
npm start
```

### ❌ "Connection refused" error
- MongoDB not running? Check `.env` file
- Server not started? Run `npm start`
- Port 3000 in use? Kill it: `netstat -ano | findstr :3000`

### ❌ Admin panel shows "No users"
- Check server is running
- Open console (F12) for errors
- Verify MongoDB is connected

### ❌ Lookup not working
- Ticket must exist in MongoDB first
- Email must match exactly (case-sensitive)
- Check browser console for errors

---

## 📊 Data Flow

```
Admin Panel
    ↓
API Calls (fetch)
    ↓
Node.js Server (server.js)
    ↓
MongoDB
    ↓
Returns Data
    ↓
Admin Panel Updates
```

---

## 🎯 Next Steps

1. **✅ Verify it's working** - Test the 3 steps above
2. **✅ Add test data** - Use the API to add test tickets
3. **✅ Test lookup** - Search for tickets by ID and email
4. **✅ Validate a ticket** - Click checkbox to mark as used
5. **✅ Check real-time sync** - Open admin in two browser tabs

---

## 📋 Checklist

- [ ] Server running with `npm start`
- [ ] MongoDB connected (check `.env`)
- [ ] Admin panel opens at `http://localhost:3000/admin.html`
- [ ] API health check passes
- [ ] Can view users in admin panel
- [ ] Search works instantly
- [ ] Can mark tickets as used
- [ ] Data persists in MongoDB

---

## 🔑 Key Files Updated

| File | Changes |
|------|---------|
| `server.js` | Added 5 new endpoints |
| `admin.html` | Replaced localStorage with API |
| `.env` | MongoDB connection (already set up) |

---

## 💡 Pro Tips

**Tip 1:** Check real-time sync by opening admin in 2 tabs
- Make change in Tab 1
- Tab 2 updates instantly!

**Tip 2:** Use browser console to debug
- Check API responses
- Test functions manually
- View error messages

**Tip 3:** MongoDB data is permanent
- Data survives server restart
- No more localStorage loss
- Team can access same data

---

## 📞 Need Help?

**Server issues?**
- Check `npm start` output
- Look for MongoDB error messages

**Admin panel not loading?**
- Refresh page (Ctrl+R)
- Clear browser cache (Ctrl+Shift+Delete)
- Check console errors (F12)

**Data not showing?**
- Verify MongoDB connection
- Check if tickets were saved
- Restart server

---

## ✨ You're All Set!

Your system is now using MongoDB for real-time ticket management!

**What works now:**
✅ View all users and tickets  
✅ Real-time search  
✅ Ticket validation (mark as used)  
✅ Quick lookup by ID and email  
✅ Instant data sync  
✅ Permanent data storage  

**Try it now:**
1. Start server: `npm start`
2. Open admin: `http://localhost:3000/admin.html`
3. Test a lookup or add test data
4. Watch real-time updates!

---

**Questions?** Check the full guide: `MONGODB_INTEGRATION.md`