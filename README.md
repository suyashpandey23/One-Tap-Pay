
# Temp Money Transfer Application

A full-stack digital payment application that mimics real-world payment platforms like PayTM. This project demonstrates secure money transfers, user authentication, transaction management, and database transaction handling.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Transaction Management](#transaction-management)
- [Installation & Setup](#installation--setup)
- [API Routes](#api-routes)
- [Frontend Structure](#frontend-structure)
- [How It Mimics a Real Payment App](#how-it-mimics-a-real-payment-app)
- [Security Features](#security-features)

---

## 🎯 Project Overview

**Temp Money** is a simplified yet feature-rich payment application built to understand the core architecture of real payment systems. It allows users to:

- Create accounts with secure authentication
- Maintain account balances
- Transfer money to other users with ACID compliance
- View transaction history with pagination
- Track transaction statistics
- Experience a modern, responsive UI with loading states

The application emphasizes **atomic transactions**, **data consistency**, and **security best practices** commonly found in production payment systems.

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime for server-side development |
| **Express.js** | Web framework for building REST APIs |
| **MongoDB** | NoSQL database for data persistence |
| **Mongoose** | ODM (Object Document Mapper) for MongoDB |
| **MongoDB Sessions** | Handles ACID transactions for money transfers |
| **JWT (jsonwebtoken)** | Secure token-based authentication |
| **bcrypt** | Password hashing for security |
| **Zod** | Schema validation library for input validation |
| **Helmet** | Middleware for setting HTTP security headers |
| **CORS** | Cross-Origin Resource Sharing for frontend-backend communication |
| **dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library for building user interfaces |
| **Vite** | Fast build tool and development server |
| **React Router v6** | Client-side routing and navigation |
| **Redux** | State management for application state |
| **React-Redux** | React bindings for Redux |
| **Axios** | HTTP client for API calls |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **Styled-Components** | CSS-in-JS library for component styling |
| **React Icons** | Icon library for UI elements |
| **React Loading Skeleton** | Skeleton loaders for loading states |
| **js-cookie** | Cookie management utility |

### DevOps & Deployment
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization for MongoDB replica sets |
| **MongoDB Docker Image** | Pre-configured MongoDB with replica set initialization |

---

## ✨ Features

### 1. **User Authentication & Management**
- Email-based user registration with validation
- Secure password hashing using bcrypt (10 salt rounds)
- JWT-based authentication with 1-hour token expiry
- HTTP-only cookies for token storage
- User profile management (update first/last names)
- Automatic account creation on signup

### 2. **Account & Balance Management**
- Automatic balance initialization (₹1 - ₹10,000) on account creation
- Real-time balance retrieval with validation
- Account-to-User relationship via MongoDB ObjectId references

### 3. **Secure Money Transfer**
- ACID-compliant transfers using MongoDB Sessions
- Balance validation before transfer
- Atomic operations: debit sender, credit receiver, log transaction simultaneously
- Transaction rollback on failure
- ObjectId format validation for recipient accounts
- Zod schema validation for transfer requests

### 4. **Transaction History & Analytics**
- Complete transaction log with sender/receiver details
- Pagination support (configurable limit and page)
- Filter options: All transactions, Sent, Received
- Chronological sorting (newest first)
- Transaction summary with aggregated statistics
- Recent transactions preview

### 5. **Frontend User Experience**
- Protected routes for authenticated users
- Redirect authentication redirects (e.g., don't show login to logged-in users)
- Skeleton loaders for loading states
- Real-time notifications for success/error states
- Responsive design (Mobile, Tablet, Desktop)
- User discovery/listing for money transfer

### 6. **Security & Validation**
- Input validation using Zod schemas
- Password strength requirements (min 6 characters)
- Email validation for usernames
- CORS with whitelisted origins
- Helmet.js for HTTP security headers
- HTTP-only cookies to prevent XSS attacks
- Secure password storage with bcrypt

---

## 🏗️ Architecture

### High-Level Flow

```
┌─────────────┐                          ┌─────────────┐
│   Browser   │  ◄────────Requests─────► │  Frontend   │
│             │       (HTTP/JSON)        │   (React)   │
└─────────────┘  ◄────────API────────────┴─────────────┘
                        ▼
            ┌───────────────────────────┐
            │   Authentication Layer    │
            │  (JWT + Cookie Parsing)   │
            └───────────────────────────┘
                        ▼
            ┌───────────────────────────┐
            │   Express Server          │
            │   (Node.js Backend)       │
            │  ┌─────────────────────┐  │
            │  │  API Routes         │  │
            │  │  - /user/*          │  │
            │  │  - /account/*       │  │
            │  └─────────────────────┘  │
            └───────────────────────────┘
                        ▼
            ┌───────────────────────────┐
            │   MongoDB Session         │
            │   (Transaction Handler)   │
            └───────────────────────────┘
                        ▼
            ┌───────────────────────────┐
            │   MongoDB Database        │
            │   (Replica Set)           │
            └───────────────────────────┘
```

### Request Flow for Money Transfer

```
1. User Initiates Transfer (Frontend)
   └─► Validates amount input
   └─► Sends POST /account/transfer

2. Backend Processes (Express)
   └─► Validates JWT token
   └─► Validates input schema (Zod)
   └─► Starts MongoDB session

3. Transaction Execution (MongoDB)
   └─► Fetch sender account (locked)
   └─► Verify balance sufficiency
   └─► Fetch receiver account (locked)
   └─► Debit sender balance
   └─► Credit receiver balance
   └─► Create transaction log
   └─► Commit changes

4. Response to Frontend
   └─► Send transaction ID
   └─► Update UI with success message
   └─► Redirect to dashboard
```

---

## 💾 Database Design

### Database Models

#### **1. User Model**
Stores user credentials and basic information.

```javascript
{
  _id: ObjectId,
  username: String (email, unique, required),
  password: String (hashed with bcrypt, required),
  firstName: String (required, max 50 chars),
  lastName: String (required, max 50 chars),
  createdAt: Date (auto-generated)
}
```

**Indexes:**
- `username` (unique) - Fast login lookups

---

#### **2. Account Model**
Maintains user balances linked to users.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  balance: Number (required, non-negative),
  createdAt: Date (auto-generated)
}
```

**Indexes:**
- `userId` - Fast balance lookups per user

---

#### **3. Transaction Model**
Logs all money transfers between users.

```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User, required),
  receiverId: ObjectId (ref: User, required),
  amount: Number (required, non-negative),
  status: String (enum: ["pending", "completed", "failed"], default: "completed"),
  timestamp: Date (default: Date.now),
  description: String (default: "Money transfer"),
  createdAt: Date (auto-generated)
}
```

**Indexes:**
- `{ senderId: 1, timestamp: -1 }` - Query sent transactions chronologically
- `{ receiverId: 1, timestamp: -1 }` - Query received transactions chronologically

These indexes enable efficient pagination and filtering of transaction history.

---

### Relationships

```
User (1) ────── (1) Account
  │
  ├────────────── (Many) Transaction (as senderId)
  │
  └────────────── (Many) Transaction (as receiverId)
```

---

## 🔄 Transaction Management (The Heart of Payment Systems)

### Why Transactions Matter

Real payment systems cannot afford data inconsistency. If a transfer fails halfway through, you might debit the sender but not credit the receiver (money disappears!). **MongoDB Sessions** solve this problem using ACID properties.

### How Temp Money Handles Transactions

#### **Normal Scenario: Successful Transfer**

```
1. START TRANSACTION
   └─ Create MongoDB session

2. LOCK ACCOUNTS
   └─ Fetch sender account (locks it for this session)
   └─ Fetch receiver account (locks it for this session)

3. VALIDATE
   └─ Check sender has sufficient balance
   └─ Check receiver account exists

4. UPDATE BALANCES
   └─ Debit from sender: { $inc: { balance: -amount } }
   └─ Credit to receiver: { $inc: { balance: +amount } }

5. LOG TRANSACTION
   └─ Save transaction record with all details

6. COMMIT
   └─ All changes are permanently applied to database

7. RESPOND
   └─ Send success message with transaction ID
```

#### **Error Scenario: Transfer Fails (e.g., Insufficient Balance)**

```
1. START TRANSACTION
   └─ Create MongoDB session

2. LOCK ACCOUNTS
   └─ Fetch sender account

3. VALIDATE - FAILS ✗
   └─ Sender balance < transfer amount

4. ABORT TRANSACTION
   └─ All changes are rolled back
   └─ Balances remain unchanged
   └─ No transaction record created

5. RESPOND
   └─ Send error message "Insufficient balance"
```

### Code Implementation: Transfer with Sessions

```javascript
router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    // Step 1: Validate input
    const validation = TransferSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.issues });
    }

    const { amount, to } = req.body;

    // Step 2: Fetch sender account
    const account = await Account.findOne({ userId: req.userId })
      .session(session);
    
    // Step 3: Check balance
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Step 4: Fetch receiver account
    const recipient = await Account.findOne({ userId: to })
      .session(session);
    
    if (!recipient) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid destination" });
    }

    // Step 5: Debit sender (using $inc operator for atomic increment)
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    
    // Step 6: Credit receiver (using $inc operator)
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    // Step 7: Log transaction
    const transaction = new Transaction({
      senderId: req.userId,
      receiverId: to,
      amount: amount,
      status: "completed",
      timestamp: new Date()
    });
    await transaction.save({ session });

    // Step 8: Commit transaction
    await session.commitTransaction();
    
    res.json({
      message: "Transfer Successful!",
      transactionId: transaction._id
    });

  } catch (error) {
    // On any error, abort and rollback
    await session.abortTransaction();
    res.status(500).json({ message: "Internal Server Error" });
  
  } finally {
    // Always end the session
    session.endSession();
  }
});
```

### Key Transaction Concepts Used

| Concept | Explanation |
|---------|------------|
| **Session** | Logical grouping of operations that must succeed together |
| **startTransaction()** | Mark the beginning of a transaction block |
| **session.session()** | Pass session to all database operations |
| **Atomicity** | All-or-nothing: either all operations succeed or none do |
| **Isolation** | Operations don't interfere with each other |
| **Durability** | Once committed, changes are permanent |
| **commitTransaction()** | Permanently apply all changes |
| **abortTransaction()** | Discard all changes and start fresh |
| **endSession()** | Clean up resources |

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB Atlas** account or local MongoDB with replica set support
- **Docker** (optional, for MongoDB replica set)
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cat > .env << EOF
   PORT=3000
   DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/paytm-db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   EOF
   ```

4. **Start backend server:**
   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

### Docker Setup (MongoDB Replica Set)

1. **Start MongoDB replica set:**
   ```bash
   docker build -t paytm-mongo .
   docker run -d -p 27017:27017 --name paytm-mongo paytm-mongo
   ```

2. **Initialize replica set (inside container):**
   ```bash
   docker exec paytm-mongo mongosh
   > rs.initiate()
   ```

---

## 🔌 API Routes

### User Routes (`/api/v1/user`)

#### **Sign Up**
```http
POST /api/v1/user/signup
Content-Type: application/json

{
  "username": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securepass123"
}
```

**Response (201):**
```json
{
  "message": "user created successfully",
  "user": {
    "_id": "65f4c3a1b2c3d4e5f6g7h8i9",
    "username": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### **Sign In**
```http
POST /api/v1/user/signin
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "65f4c3a1b2c3d4e5f6g7h8i9",
    "username": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### **Get Current User**
```http
GET /api/v1/user/me
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "user": {
    "_id": "65f4c3a1b2c3d4e5f6g7h8i9",
    "username": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### **Get All Users (for selecting transfer recipient)**
```http
GET /api/v1/user/bulk?filter=john
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "users": [
    {
      "_id": "65f4c3a2b2c3d4e5f6g7h8i9",
      "firstName": "John",
      "lastName": "Smith",
      "username": "john.smith@example.com"
    }
  ]
}
```

---

### Account Routes (`/api/v1/account`)

#### **Get Balance**
```http
GET /api/v1/account/balance
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "balance": 5234.50
}
```

#### **Transfer Money**
```http
POST /api/v1/account/transfer
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "to": "65f4c3a2b2c3d4e5f6g7h8i9",
  "amount": 500
}
```

**Response (200):**
```json
{
  "message": "Transfer Successful!",
  "transactionId": "65f4c4d1b2c3d4e5f6g7h8i9"
}
```

**Error Response (400):**
```json
{
  "message": "Insufficient balance"
}
```

#### **Get Transaction History**
```http
GET /api/v1/account/transactions?page=1&limit=10&type=all
Cookie: token=<jwt_token>
```

**Query Parameters:**
- `page` (default: 1) - Page number for pagination
- `limit` (default: 10) - Records per page
- `type` (default: "all") - Filter: "all", "sent", or "received"

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "65f4c4d1b2c3d4e5f6g7h8i9",
      "amount": 500,
      "type": "sent",
      "timestamp": "2024-02-15T10:30:00Z",
      "status": "completed",
      "description": "Money transfer",
      "otherParty": {
        "id": "65f4c3a2b2c3d4e5f6g7h8i9",
        "name": "Jane Smith",
        "username": "jane.smith@example.com"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTransactions": 45,
    "hasMore": true
  }
}
```

#### **Get Transaction Summary**
```http
GET /api/v1/account/transaction-summary
Cookie: token=<jwt_token>
```

**Response (200):**
```json
{
  "sentStats": {
    "totalAmount": 2500,
    "count": 5
  },
  "receivedStats": {
    "totalAmount": 7300,
    "count": 12
  },
  "recentTransactions": [
    {
      "id": "65f4c4d1b2c3d4e5f6g7h8i9",
      "amount": 500,
      "otherParty": "Jane Smith",
      "timestamp": "2024-02-15T10:30:00Z"
    }
  ]
}
```

---

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── pages/              # Route-level components
│   │   ├── Index.jsx       # Landing page
│   │   ├── Signin.jsx      # Login page
│   │   ├── Signup.jsx      # Registration page
│   │   ├── Dashboard.jsx   # Main dashboard after login
│   │   ├── Balance.jsx     # View account balance
│   │   ├── SendMoney.jsx   # Transfer money to user
│   │   ├── UpdateAccount.jsx # Update profile info
│   │   └── TransactionHistory.jsx # View all transactions
│   │
│   ├── components/         # Reusable UI components
│   │   ├── AuthProvider.jsx      # Auth context wrapper
│   │   ├── ProtectedRoute.jsx    # Restricts to authenticated users
│   │   ├── RedirectIfAuthenticated.jsx # Redirects logged-in users
│   │   ├── AxiosInstance.jsx     # Configured HTTP client
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   ├── InputBox.jsx
│   │   ├── Users.jsx       # List users for transfer
│   │   └── Balance.jsx     # Display balance widget
│   │
│   ├── skeletons/          # Loading placeholders
│   │   ├── HeaderSkeleton.jsx
│   │   ├── MainSectionSkeleton.jsx
│   │   ├── SigninSkeleton.jsx
│   │   ├── SendMoneySkeleton.jsx
│   │   ├── TransactionHistorySkeleton.jsx
│   │   └── ... (other skeletons)
│   │
│   ├── notify/             # Notification system
│   │   ├── Notification.jsx
│   │   ├── Notification.css
│   │   └── context/
│   │       └── NotificationContext.jsx
│   │
│   ├── App.jsx             # Main app with routes
│   ├── App.css
│   ├── main.jsx            # Entry point
│   └── index.css
│
├── public/                 # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

### Key Components Explained

#### **AuthProvider.jsx**
Manages user authentication state globally:
- Checks auth status on app load
- Provides `signup()` and `login()` methods
- Stores current user in React Context
- Handles token expiration

#### **ProtectedRoute.jsx**
Wrapper component that:
- Checks if user is authenticated
- Redirects to login if not
- Shows component if authenticated

#### **AxiosInstance.jsx**
Preconfigured HTTP client:
- Includes credentials by default
- Handles auth token in cookies
- Sets up base URL for API calls

#### **Notification System**
Toast-based notifications for:
- Success messages
- Error alerts
- Info updates
- Uses React Context for global state

---

## 💳 How It Mimics a Real Payment App

### 1. **User Authentication (Like Real Banking)**
- Email-based signup/signin (not just username)
- Password hashing prevents unauthorized access
- JWT tokens with expiration ensure session security
- HTTP-only cookies prevent XSS attacks

### 2. **Account Management**
- Each user gets one account with a balance
- Balance is checked before allowing transfers
- Account creation is automatic and seamless

### 3. **Atomic Money Transfers**
Real payment apps CANNOT allow data inconsistency:
- If transfer fails halfway, money shouldn't disappear
- Temp Money uses **MongoDB Sessions** for ACID guarantees
- Just like real banks: "All or Nothing" principle

### 4. **Transaction History & Audit Trail**
- Every transfer is logged with timestamp
- Users can filter by sent/received
- Full sender/receiver details are recorded
- Enables dispute resolution and fraud detection

### 5. **Balance Validation**
Real apps check:
- ✅ Sufficient balance before transfer
- ✅ Valid recipient account exists
- ✅ Positive amounts only
- ✅ Correct ObjectId format

### 6. **Real-Time Balance Updates**
- Balance is updated immediately
- Pagination for transaction history
- Summary statistics for user insights

### 7. **Security Best Practices**
| Feature | Implementation |
|---------|----------------|
| Password Security | Bcrypt hashing with 10 salt rounds |
| Authentication | JWT tokens with 1-hour expiry |
| Authorization | Protected routes via middleware |
| Input Validation | Zod schema validation |
| SQL Injection Prevention | Mongoose ORM prevents DB injection |
| XSS Prevention | HTTP-only cookies |
| CORS | Whitelisted origins only |
| HTTP Headers | Helmet.js security middleware |

### 8. **Scalability Considerations**
- Database indexes on frequently queried fields
- Pagination for large transaction lists
- Session-based transactions support multiple concurrent users
- Stateless backend for horizontal scaling

---

## 🔐 Security Features

### Password Security
```javascript
// Passwords are hashed with bcrypt
const hashedPassword = await bcrypt.hash(plainPassword, 10);
// Salt rounds = 10 (higher = more secure but slower)
```

### JWT Authentication
```javascript
// Token includes userId, expires in 1 hour
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```

### Input Validation
```javascript
// All inputs validated with Zod before processing
const TransferSchema = z.object({
  amount: z.number().positive(),
  to: z.string()
});
```

### Database Transaction Safety
```javascript
// All-or-nothing transfers ensure consistency
session.startTransaction();
// ... debit/credit operations ...
await session.commitTransaction(); // or abortTransaction()
```

### Middleware Security
- **Helmet.js** - Sets secure HTTP headers
- **CORS** - Restricts requests to whitelisted origins
- **cookieParser** - Safely parses cookies
- **authMiddleware** - Validates JWT on protected routes

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Production Build

**Backend:**
```bash
cd backend
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Outputs to dist/ folder
npm run preview # Preview production build locally
```

### Docker Deployment

```bash
# Build and run MongoDB
docker build -t paytm-mongo .
docker run -d -p 27017:27017 paytm-mongo

# Backend container
docker run -d -p 3000:3000 \
  -e DB_URL=mongodb://mongo:27017/paytm \
  -e JWT_SECRET=your-secret-key \
  paytm-backend

# Frontend container (nginx)
docker run -d -p 80:80 paytm-frontend
```

---

## 📊 Example User Flow

### New User Journey

```
1. User visits app → Landing page (/)
   ↓
2. Click "Sign Up" → /signup
   ├─ Enter email, name, password
   ├─ Backend creates user (bcrypt hashed password)
   ├─ Backend creates account (random balance ₹1-10,001)
   ├─ JWT token generated and stored in cookie
   └─ Redirect to dashboard
   ↓
3. User on Dashboard (/dashboard)
   ├─ View balance
   ├─ See list of other users
   └─ Choose user to send money
   ↓
4. Click user → /send?id=...&first_name=...&last_name=...
   ├─ Enter amount
   ├─ Backend starts transaction session
   ├─ Validates balance
   ├─ Updates both accounts atomically
   ├─ Creates transaction record
   └─ Shows success notification
   ↓
5. View Transaction History → /transaction-history
   ├─ See all transfers (sent/received)
   ├─ Paginated results
   └─ Filter by transaction type
```

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
- Ensure MongoDB is running
- Check DB_URL in .env
- Verify network connectivity to MongoDB Atlas
```

**JWT Token Invalid**
```
Error: Token verification failed

Solution:
- Ensure JWT_SECRET in .env is set
- Check token hasn't expired
- Clear cookies and login again
```

### Frontend Issues

**CORS Error**
```
Error: Access to XMLHttpRequest blocked

Solution:
- Backend CORS origin includes http://localhost:5173
- Check backend is running on correct port
- Restart both frontend and backend
```

**Session Storage Issues**
```
Solution:
- Clear browser cache and cookies
- Use incognito/private mode
- Check browser console for errors
```

---

## 📝 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/paytm-db

# Security
JWT_SECRET=your-very-secure-secret-key-here

# Frontend Origin (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env - if needed)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

---

## 🎓 Learning Outcomes

This project teaches:

✅ Full-stack development with Node.js, React, and MongoDB
✅ ACID transactions and database consistency
✅ JWT-based authentication and authorization
✅ RESTful API design principles
✅ Frontend state management with Redux
✅ Real-world payment system architecture
✅ Security best practices (bcrypt, helmet, CORS)
✅ Error handling and validation
✅ Component reusability in React
✅ Responsive UI design with Tailwind CSS

---

## 📄 License

This project is created for educational purposes.

---

**Happy Learning! 🚀**
