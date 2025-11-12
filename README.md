# User Management System

Full-stack web application with user authentication, role-based access control, and admin management features.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: Angular 20
- **UI Library**: Angular Material
- **Language**: TypeScript
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS

## 📁 Project Structure

```
Usermngt/
├── backend/
│   ├── config/              # Database & JWT configuration
│   ├── controllers/         # Business logic (auth, user)
│   ├── middleware/          # JWT verification, role check
│   ├── models/              # Sequelize models (User)
│   ├── routes/              # API routes
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js            # Entry point
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Shared components
    │   │   ├── guards/      # Route guards
    │   │   ├── interceptors/# HTTP interceptors
    │   │   ├── models/      # TypeScript interfaces
    │   │   ├── modules/     # Feature modules (auth, admin, user)
    │   │   └── services/    # API services
    │   └── environments/    # Environment configs
    ├── angular.json
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

**Configure `.env` file:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=user_management
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
PORT=8080
```

**Setup Database:**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE user_management;
exit
```

**Start Backend:**
```bash
npm start
# Server runs on http://localhost:8080
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
ng serve
# App runs on http://localhost:4200
```

## 🎯 Features

### User Registration & Approval
- New users register with basic info (no password initially)
- Status: "Awaiting Approval"
- Admin must approve before login
- System generates temporary password: `{firstname}#2021`

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (Admin/User)
- Token expiration: 24 hours
- Force password change on first login

### Admin Features
- View all users with search/filter
- Approve pending registrations
- Edit user details
- Delete users
- Real-time user status management

### User Features
- Login/Logout
- Set custom password (first login)
- View personal dashboard
- Secure password policy enforcement

## 📋 API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login (returns JWT) |

### Protected Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/set-password` | Set new password | JWT |
| GET | `/api/user/profile` | Get current user | JWT |
| GET | `/api/users` | Get all users | JWT + Admin |
| GET | `/api/users/:id` | Get user by ID | JWT + Admin |
| PUT | `/api/users/:id` | Update user | JWT + Admin |
| PUT | `/api/users/:id/approve` | Approve user | JWT + Admin |
| DELETE | `/api/users/:id` | Delete user | JWT + Admin |

## 🔐 Security Features

### Backend Security
✅ **Password Hashing**: bcrypt with 10 salt rounds  
✅ **JWT Authentication**: Stateless token-based auth  
✅ **SQL Injection Prevention**: Sequelize parameterized queries  
✅ **Input Validation**: Email, phone, password policies  
✅ **Role-Based Access Control**: Admin vs User permissions  
✅ **CORS Configuration**: Restricted origins  

### Frontend Security
✅ **Route Guards**: Auth, Admin, ForcePasswordReset  
✅ **HTTP Interceptors**: Auto-attach JWT tokens  
✅ **XSS Protection**: Angular automatic sanitization  
✅ **Form Validation**: Reactive forms with validators  
✅ **Type Safety**: TypeScript interfaces  

### Password Policy
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

## 🚦 Default Credentials

**Admin Account** (auto-seeded on first run):
```
Email: admin@example.com
Password: Admin#2021
```

⚠️ **Important**: Change admin password in production!

## 🔄 User Flow

### New User Registration
```
1. User fills registration form (firstname, lastname, email, phone)
2. Status: "Awaiting Approval"
3. Admin approves user
4. System generates temp password: {firstname}#2021
5. User logs in with temp password
6. Forced to set new password
7. Access granted to user dashboard
```

### Admin Workflow
```
1. Login as admin
2. Navigate to /admin/users
3. View pending/active users
4. Search by name, email, phone
5. Filter by status
6. Approve/Edit/Delete users
```

## 🗄️ Database Schema

```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status ENUM('Awaiting Approval', 'Active') DEFAULT 'Awaiting Approval',
  role ENUM('user', 'admin') DEFAULT 'user',
  isFirstLogin BOOLEAN DEFAULT true,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

## 🎨 Frontend Routes

### Public Routes
- `/auth/login` - Login page
- `/auth/register` - Registration page

### User Routes (Protected)
- `/user/home` - User dashboard
- `/user/set-password` - First-time password setup

### Admin Routes (Admin Only)
- `/admin/users` - User management dashboard

## 🧪 Testing the Application

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstname":"John","lastname":"Doe","email":"john@example.com","phone":"1234567890"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin#2021"}'
```

**Get Users (with token):**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "x-access-token: YOUR_JWT_TOKEN"
```

### Using Browser

1. Start both backend and frontend
2. Open `http://localhost:4200`
3. Login with admin credentials
4. Test user registration and approval workflow

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check .env file configuration
```

**Port Already in Use:**
```bash
# Kill process on port 8080
npx kill-port 8080
```

### Frontend Issues

**CORS Error:**
- Verify backend CORS settings allow `http://localhost:4200`
- Check `backend/server.js` corsOptions

**Port Already in Use:**
```bash
# Kill process on port 4200
npx kill-port 4200

# Or use different port
ng serve --port 4201
```

**Token Issues:**
- Clear localStorage: Open DevTools → Application → Local Storage → Clear
- Check token expiration (24 hours)

## 📦 Dependencies

### Backend
```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.19.2",
  "jsonwebtoken": "^9.0.2",
  "mysql2": "^3.10.1",
  "sequelize": "^6.37.3"
}
```

### Frontend
```json
{
  "@angular/core": "^20.3.0",
  "@angular/material": "^20.2.12",
  "@angular/router": "^20.3.0",
  "@auth0/angular-jwt": "^5.2.0",
  "rxjs": "~7.8.0"
}
```

## 🚀 Production Deployment

### Backend

1. **Set environment variables:**
```env
NODE_ENV=production
DB_HOST=your-production-db-host
JWT_SECRET=strong-random-secret-key
```

2. **Update CORS:**
```javascript
var corsOptions = {
  origin: 'https://yourdomain.com'
};
```

3. **Build & Run:**
```bash
npm start
```

### Frontend

1. **Update environment:**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-api-domain.com/api'
};
```

2. **Build:**
```bash
ng build --configuration production
```

3. **Deploy `dist/` folder** to your hosting service

## 📊 Project Highlights

- **Secure Authentication**: JWT-based with bcrypt password hashing
- **Role-Based Access**: Admin and User roles with protected routes
- **Modern UI**: Angular Material design components
- **Reactive Forms**: Client-side validation with Angular Reactive Forms
- **RESTful API**: Clean REST API architecture
- **Type Safety**: TypeScript for better code quality
- **Modular Architecture**: Lazy-loaded modules for performance
- **Responsive Design**: Works on desktop and mobile

## 🔮 Future Enhancements

- [ ] Email notifications for approval
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] User profile image upload
- [ ] Activity logs and audit trail
- [ ] Rate limiting for API endpoints
- [ ] Refresh token mechanism
- [ ] Account lockout after failed attempts

## 📝 Scripts

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm start          # Start dev server
npm run build      # Production build
npm test           # Run tests
```

## 📄 License

MIT License

## 👨‍💻 Author

Akshay Pawar ([@akshay2001p](https://github.com/akshay2001p))

---

**Repository**: [User-Management-System](https://github.com/akshay2001p/User-Management-System)
