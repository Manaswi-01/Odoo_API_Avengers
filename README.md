# StockMaster - Inventory Management System

A complete, modern Inventory Management System built with React, Node.js, Express, and MongoDB.

## 🌟 Features

- **Authentication System** - Secure JWT-based authentication with OTP password reset
- **Dashboard** - Real-time inventory statistics and KPIs
- **Operations Management** - Handle receipts, deliveries, transfers, and adjustments
- **Stock Tracking** - Real-time stock levels across multiple warehouses and locations
- **Move History** - Complete audit trail of all stock movements
- **Warehouse Management** - Manage multiple warehouses with locations
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Odoo_API_Avengers
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create/verify `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ims_db
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

6. **Seed sample data (first time only)**
   ```bash
   cd backend
   node seed-data.js
   ```

7. **Start the backend**
   ```bash
   cd backend
   npm start
   ```
   Backend runs on: http://localhost:5000

8. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: http://localhost:3000

9. **Login**
   - Open http://localhost:3000
   - Login with: `admin@stockmaster.com` / `admin123`
   - Or create a new account via signup

## 📚 Documentation

- **[COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)** - Comprehensive guide with all features
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Detailed integration documentation
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Summary of changes

## 🏗️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email

## 📊 Database Schema

- **users** - User accounts and authentication
- **products** - Product catalog
- **warehouses** - Warehouses with locations
- **transactions** - Receipts, deliveries, transfers, adjustments
- **stockitems** - Current stock levels
- **stockledgers** - Complete stock movement history

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- OTP-based password reset
- CORS enabled
- Input validation

## 🎯 Key Features

### Authentication
- User signup with role selection (User, Manager, Admin)
- Secure login with JWT tokens
- OTP-based password reset via email
- Protected routes with automatic redirect
- Persistent sessions

### Dashboard
- Total products count
- Low stock items alert
- Pending receipts count
- Pending deliveries count
- Real-time data updates

### Operations
- **Receipts** - Incoming stock management
- **Deliveries** - Outgoing stock management
- **Transfers** - Internal stock movements
- **Adjustments** - Stock corrections

### Stock Management
- View stock across all warehouses
- Track quantity, reserved, and available stock
- Stock status indicators (In Stock, Low Stock, Out of Stock)
- Real-time updates

### Move History
- Complete audit trail of all stock movements
- Filter by transaction type
- View quantity changes and balances
- User tracking for each movement

### Settings
- Warehouse management (create, view, delete)
- Location management within warehouses
- Real-time synchronization

## 🧪 Testing

Run backend integration tests:
```bash
cd backend
node test-integration.js
```

## 📱 Screenshots

(Add screenshots of your application here)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- Built as part of the Odoo API Avengers project
- Inspired by modern inventory management systems
- Thanks to all contributors

## 📞 Support

For support, email support@stockmaster.com or open an issue in the repository.

---

**Made with ❤️ by the Odoo API Avengers Team**
