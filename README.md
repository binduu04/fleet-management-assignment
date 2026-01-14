# Fleet Maintenance & Service Management System

A full-stack web application for managing vehicle maintenance, service schedules, and service history with role-based access control.

## 🎯 Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin, Technician, User)
- Secure password hashing with bcrypt
- Protected routes on frontend and backend

### Admin Dashboard

- Manage users (Create, Read, Update, Delete)
- Manage vehicles and assign to users
- Schedule and assign services to technicians
- View all service records
- Data visualization with charts (Service status distribution, Service type frequency)

### Technician Dashboard

- View assigned services
- Update service status (Pending → In Progress → Completed)
- Add service notes and completion details
- Track service progress with status counts

### User Dashboard

- View assigned vehicles
- View upcoming service schedules
- View completed service history
- Service timeline visualization

### Data Visualization

- Service status distribution (Pie Chart)
- Service type frequency (Bar Chart)
- Service history timeline (Line Chart)

## 🛠️ Technology Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs for password hashing
- **API:** RESTful architecture

### Frontend

- **Framework:** React 18 with Vite
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **HTTP Client:** Axios
- **State Management:** React Context API

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/binduu04/fleet-management-assignment>
cd <fleet-management-assignment>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (choose the FREE tier)
3. Create a database user with username and password
4. Whitelist your IP address (or allow access from anywhere for development)
5. Get your connection string from the "Connect" button

### 4. Configure Environment Variables

Edit `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/fleet-maintenance?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

Replace `username`, `password`, and cluster details with your actual MongoDB Atlas credentials.

### 5. Seed Database with Sample Data

```bash
npm run seed
```

This creates:

- 5 sample users (admin, technicians, users)
- 4 sample vehicles
- 4 sample services

### 6. Start Backend Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 7. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 🔐 Demo Credentials

After seeding the database, use these credentials to login:

| Role           | Email           | Password | Access Level                        |
| -------------- | --------------- | -------- | ----------------------------------- |
| **Admin**      | admin@fleet.com | admin123 | Full access to all features         |
| **Technician** | tech@fleet.com  | tech123  | View and update assigned services   |
| **User**       | user@fleet.com  | user123  | View assigned vehicles and services |

## 📁 Project Structure

```
<repository-root>/
├── backend/
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Auth & authorization
│   ├── models/                # Database schemas (User, Vehicle, Service)
│   ├── routes/                # API routes
│   ├── .env                   # Environment variables
│   ├── server.js              # Entry point
│   ├── seed.js                # Database seeding script
│   ├── API_DOCUMENTATION.md   # Complete API reference
│   ├── README.md              # Backend documentation
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components (Navbar, ProtectedRoute)
│   │   ├── context/           # Auth context for state management
│   │   ├── pages/             # Page components (Login, Dashboards)
│   │   ├── services/          # API service layer with Axios
│   │   ├── App.jsx            # Main app component with routing
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── package.json
│
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Users (Admin Only)

- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/role/:role` - Get users by role

### Vehicles

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/my/vehicles` - Get user's vehicles
- `POST /api/vehicles` - Create vehicle (Admin)
- `PUT /api/vehicles/:id` - Update vehicle (Admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin)
- `PUT /api/vehicles/:id/assign` - Assign vehicle to user (Admin)

### Services

- `GET /api/services` - Get all services
- `GET /api/services/technician/my-services` - Get technician's services
- `GET /api/services/user/my-services` - Get user's vehicle services
- `GET /api/services/stats` - Get service statistics
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `PUT /api/services/:id/status` - Update service status (Technician/Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

**Full API Documentation:** See `backend/API_DOCUMENTATION.md`

## 🎨 Features Demonstration

### Admin Features

1. **User Management:** Create technicians and users, assign roles
2. **Vehicle Management:** Add vehicles, assign to users
3. **Service Scheduling:** Create service schedules, assign to technicians
4. **Analytics:** View service statistics and distribution charts

### Technician Features

1. **Service Queue:** View all assigned services
2. **Status Updates:** Update service status (Pending → In Progress → Completed)
3. **Service Notes:** Add detailed notes about work performed
4. **Dashboard Stats:** Quick view of pending, in-progress, and completed services

### User Features

1. **Vehicle Overview:** View all assigned vehicles with details
2. **Upcoming Services:** Track scheduled maintenance
3. **Service History:** View completed services with costs and notes
4. **Timeline Chart:** Visual representation of service frequency over time

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication (30-day expiration)
- Role-based access control middleware
- Protected API routes
- Input validation
- CORS enabled for frontend communication

## 📊 Database Schema

### User Schema

- name, email, password (hashed), role (admin/technician/user), phone

### Vehicle Schema

- vehicleNumber, make, model, year, type, assignedTo, mileage, status

### Service Schema

- vehicle, serviceType, description, scheduledDate, completedDate
- status (pending/in-progress/completed/cancelled)
- assignedTechnician, cost, notes, createdBy

## 🎯 Assignment Requirements Checklist

### Backend

- JWT Authentication with role-based access control
- User Management APIs (Admin Only)
- Vehicle Management APIs (Admin Only)
- Service/Maintenance APIs
- Service Status Update (Technician Only)
- User APIs (User Role)
- Secure password hashing
- Input validation and error handling
- Proper HTTP status codes
- Modular code structure

### Frontend 

- Login with role-based routing
- JWT token stored securely
- Admin Dashboard (manage vehicles, users, services)
- Technician Dashboard (view & update assigned services)
- User Dashboard (view vehicles and service history)
- Data Visualization (charts for service frequency, timeline, distribution)
- Protected routes
- Role-based UI rendering
- State management with Context API
- Loading and error handling
- Responsive UI with Tailwind CSS

### Documentation 

- README with setup steps 
- MongoDB setup guide

---


