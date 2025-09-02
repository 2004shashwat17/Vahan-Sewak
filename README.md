# Vahan Sewak - Vehicle Assistance App

A comprehensive React Native mobile application for connecting users with verified mechanics for vehicle breakdown assistance. Built with Expo, Node.js, Express, and MongoDB.

## Features

### User Features
- **Emergency Service Request**: Quick access to emergency vehicle assistance
- **Problem Selection**: Choose from predefined vehicle problems or describe custom issues
- **Photo/Video Upload**: Attach media to better describe the problem
- **Mobile Verification**: Secure OTP-based phone number verification
- **Payment Processing**: Secure payment for inspection fees and service charges
- **Mechanic Selection**: Choose from nearby verified mechanics
- **Live GPS Tracking**: Real-time tracking of assigned mechanic
- **Service History**: View past service requests and payments
- **User Profile**: Manage personal information and vehicle details

### Technical Features
- **Real-time Updates**: Socket.IO for live service status updates
- **Geolocation Services**: Find nearby mechanics using GPS coordinates
- **Push Notifications**: Real-time notifications for service updates
- **Secure Authentication**: JWT-based authentication with OTP verification
- **Payment Integration**: Support for UPI, cards, and digital wallets
- **Image/Video Handling**: Camera integration for problem documentation

## Tech Stack

### Frontend (React Native + Expo)
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation between screens
- **Expo Camera**: Camera and image picker functionality
- **React Native Maps**: Map integration for location services
- **Socket.IO Client**: Real-time communication

### Backend (Node.js + Express)
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **Express Validator**: Input validation
- **Multer**: File upload handling

### Database (MongoDB)
- **User Management**: User profiles, vehicles, preferences
- **Mechanic Management**: Mechanic profiles, ratings, availability
- **Service Requests**: Problem tracking, status updates, payments
- **Geospatial Indexing**: Location-based queries for nearby mechanics

## Project Structure

```
vahansewak/
├── VahanSewakApp/          # React Native Frontend
│   ├── src/
│   │   ├── screens/        # App screens
│   │   ├── navigation/     # Navigation setup
│   │   ├── constants/      # Colors, data constants
│   │   └── types/          # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js Backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
└── README.md             # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Expo CLI
- Android Studio / Xcode (for mobile development)

### Frontend Setup

1. **Navigate to the React Native app directory:**
   ```bash
   cd VahanSewakApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vahansewak
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Database Setup

1. **Install MongoDB** (if using local database)
2. **Create database:**
   ```bash
   mongosh
   use vahansewak
   ```

3. **Or use MongoDB Atlas** (cloud database):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/vehicles` - Add vehicle
- `GET /api/users/vehicles` - Get user vehicles
- `PATCH /api/users/vehicles/:id` - Update vehicle
- `DELETE /api/users/vehicles/:id` - Delete vehicle

### Services
- `POST /api/services` - Create service request
- `GET /api/services/my-requests` - Get user's service requests
- `GET /api/services/:id` - Get service request details
- `PATCH /api/services/:id/status` - Update service status
- `POST /api/services/:id/rate` - Rate service

### Mechanics
- `GET /api/mechanics/nearby` - Find nearby mechanics
- `GET /api/mechanics/:id` - Get mechanic details
- `GET /api/mechanics/:id/reviews` - Get mechanic reviews
- `GET /api/mechanics/specialization/:type` - Get mechanics by specialization

### Payments
- `POST /api/payments/inspection-fee` - Process inspection fee
- `POST /api/payments/final-payment` - Process final payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/refund` - Request refund

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vahansewak
JWT_SECRET=your-secret-key-here
NODE_ENV=development
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## Deployment

### Frontend (Expo)
1. **Build for production:**
   ```bash
   expo build:android
   expo build:ios
   ```

2. **Deploy to app stores:**
   - Follow Expo's deployment guide
   - Submit to Google Play Store and Apple App Store

### Backend
1. **Deploy to cloud platform:**
   - Heroku, AWS, Google Cloud, or Azure
   - Set environment variables
   - Configure MongoDB connection

2. **Set up domain and SSL:**
   - Configure custom domain
   - Set up SSL certificate
   - Update API base URL in frontend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

### Future Features
- **Mechanic App**: Dedicated app for mechanics
- **Admin Dashboard**: Web dashboard for management
- **Analytics**: Service analytics and reporting
- **Multi-language**: Support for multiple languages
- **Advanced Payments**: More payment gateways
- **Insurance Integration**: Vehicle insurance claims
- **AI Chatbot**: Automated customer support
- **Predictive Maintenance**: Vehicle health monitoring

---

**Vahan Sewak** - Your trusted vehicle assistance partner across India!
=======

# Vahan-Sewak
Vahan Sewak aims to be India’s 24/7 nationwide roadside assistance platform — connecting stranded vehicle owners with verified mechanics, towing partners, and part suppliers through a single mobile application. The mission: “No Indian should ever be standed on the road without reliable help.”



