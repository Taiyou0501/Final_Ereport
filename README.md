# E-Report System

A comprehensive emergency reporting and management system designed to facilitate quick and efficient emergency response coordination between citizens, emergency responders, police units, and barangay officials.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The E-Report System is a full-stack web application that enables citizens to report emergencies in real-time, with automatic notification and dispatch to the nearest available emergency responders. The system supports multiple user roles, each with specific permissions and functionalities to ensure efficient emergency response management.

## ✨ Features

### For Citizens (Users)
- **Emergency Reporting**: Submit emergency reports with photos, location data, and detailed information
- **Multiple Emergency Types**: Support for individual emergencies, vehicular accidents, victim incidents, and other emergency types
- **Real-time Location**: Automatic GPS location capture for accurate emergency reporting
- **Photo Upload**: Attach photos to provide visual context for emergency situations
- **Report Tracking**: View submission status and receive confirmations

### For Administrators
- **Dashboard**: Comprehensive overview of all emergency reports and system statistics
- **Account Management**: Create and manage accounts for units, barangay officials, and other administrators
- **Report Management**: View, filter, and manage all emergency reports
- **System Administration**: Full system control and configuration

### For Emergency Units
- **Account Management**: Create and manage responder and police accounts
- **Report Monitoring**: View and track emergency reports assigned to their unit
- **Responder Coordination**: Manage active responders and their availability

### For Responders
- **Real-time Notifications**: Receive instant notifications for new emergency reports
- **Report Assignment**: Accept and manage assigned emergency reports
- **Location-based Dispatch**: Automatic assignment based on proximity to emergency location
- **Status Updates**: Update report status and provide response details

### For Police Units
- **Emergency Monitoring**: View and respond to emergency reports requiring police intervention
- **Notification System**: Receive alerts for relevant emergency situations
- **Report Management**: Update and track police-related emergency reports

### For Barangay Officials
- **Local Emergency Monitoring**: View emergency reports within their jurisdiction
- **Community Management**: Monitor and respond to community emergencies
- **Notification System**: Receive alerts for emergencies in their area

## 🛠 Technology Stack

### Frontend
- **React 18.3.1**: Modern UI library for building interactive user interfaces
- **Vite 5.4.1**: Fast build tool and development server
- **React Router DOM 6.26.1**: Client-side routing and navigation
- **Axios 1.7.7**: HTTP client for API communication
- **Leaflet & React-Leaflet**: Interactive maps and location visualization
- **React Webcam**: Camera integration for photo capture
- **Moment.js**: Date and time manipulation
- **Font Awesome**: Icon library
- **SCSS**: Enhanced CSS with variables and nesting

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js 4.19.2**: Web application framework
- **MySQL 2.18.1 / MySQL2 3.11.4**: Relational database management
- **Multer 1.4.5**: File upload handling
- **Express Session**: Session management
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 📁 Project Structure

```
Final_Ereport/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── Components/     # React components organized by feature
│   │   │   ├── Admin/      # Admin dashboard and management components
│   │   │   ├── User/       # User emergency reporting components
│   │   │   ├── Responder/  # Responder dashboard components
│   │   │   ├── Police/     # Police unit components
│   │   │   ├── Barangay/   # Barangay official components
│   │   │   ├── Unit/       # Emergency unit management components
│   │   │   ├── LoginRegister/ # Authentication components
│   │   │   └── CSS/        # Stylesheet files
│   │   ├── auth/           # Authentication context and protected routes
│   │   ├── config/         # Configuration files (Axios setup)
│   │   └── App.jsx         # Main application component with routing
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Backend Express application
    ├── server.js           # Main server file with all API endpoints
    ├── upload/             # Directory for uploaded images
    ├── package.json
    └── clevercloud/        # Deployment configuration
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **MySQL** (v5.7 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Final_Ereport
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env.development` file in the `server/` directory:

```env
# Database Configuration (Development)
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=ereport_db
DB_PORT=3306

# Session Configuration
SESSION_SECRET=your-secret-session-key-here

# Server Configuration
PORT=8081
NODE_ENV=development
```

2. For production, create a `.env.production` file:

```env
# Database Configuration (Production)
MYSQL_ADDON_HOST=your_production_host
MYSQL_ADDON_USER=your_production_user
MYSQL_ADDON_PASSWORD=your_production_password
MYSQL_ADDON_DB=your_production_database
MYSQL_ADDON_PORT=3306

# Session Configuration
SESSION_SECRET=your-production-secret-key

# Server Configuration
PORT=8081
NODE_ENV=production
```

### Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE ereport_db;
```

2. The application will automatically create necessary tables using the MySQL session store and through API endpoints.

### Frontend Configuration

The frontend is configured to proxy API requests to `http://localhost:8081` during development. For production, update the API base URL in `client/src/config/axios.js` if needed.

## 🏃 Running the Application

### Development Mode

1. **Start the Backend Server**:

```bash
cd server
npm start
```

The server will run on `http://localhost:8081`

2. **Start the Frontend Development Server** (in a new terminal):

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the Frontend**:

```bash
cd client
npm run build
```

2. **Start the Production Server**:

```bash
cd server
npm run start:prod
```

## 👥 User Roles

The system supports the following user roles with distinct permissions:

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **User** | General public | Submit emergency reports, view own reports |
| **Admin** | System administrator | Full system access, account management, report oversight |
| **Unit** | Emergency unit manager | Manage responder/police accounts, view unit reports |
| **Responder** | Emergency responder | Receive notifications, accept reports, update status |
| **Police** | Police officer | View police-related reports, update status |
| **Barangay** | Barangay official | View local reports, community management |

## 🔌 API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /checkSession` - Check current session status

### Reports
- `POST /api/reports` - Create a new emergency report
- `GET /api/reports/latest` - Get the latest report
- `GET /api/reports/:id` - Get a specific report by ID
- `GET /api/full_reports/all` - Get all full reports
- `GET /api/full_reports/locations` - Get all report locations
- `POST /api/full_report` - Create a full emergency report
- `PUT /api/full_report/:id/status` - Update report status
- `POST /api/full_reports/closestResponder` - Find closest responder

### File Upload
- `POST /upload` - Upload an image file
- `GET /images` - Get all images
- `GET /images/:id` - Get a specific image by ID
- `GET /latest-image-id` - Get the latest uploaded image ID

### Account Management
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:table/:id` - Get a specific account
- `PUT /api/account/status` - Update account status
- `POST /a-add-unit` - Admin: Add unit account
- `POST /u-add-police` - Unit: Add police account
- `POST /a-add-barangay` - Admin: Add barangay account
- `POST /u-add-responder` - Unit: Add responder account

### Responders
- `GET /api/responders/active` - Get active responders
- `PUT /api/responders/:id/report` - Update responder report assignment

### User Details
- `GET /api/user_details` - Get user details
- `GET /api/user-upload-id` - Get user upload ID
- `POST /api/update-victim-name` - Update victim name in report

## 🚢 Deployment

### Frontend Deployment (Vercel)

The project includes a `vercel.json` configuration file. To deploy:

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the client directory: `cd client`
3. Deploy: `vercel`

### Backend Deployment

The server can be deployed to any Node.js hosting platform (Heroku, Clever Cloud, AWS, etc.). The project includes Clever Cloud configuration in `server/clevercloud/`.

**Environment Variables**: Ensure all production environment variables are set in your hosting platform.

## 🔒 Security Considerations

- Session-based authentication with secure cookies
- CORS configuration for allowed origins
- SQL injection protection through parameterized queries
- File upload validation and storage
- Environment variable management for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Development

### Code Structure
- Frontend follows React component-based architecture
- Backend uses Express.js with RESTful API design
- Database uses MySQL with connection pooling
- File uploads are handled using Multer

### Key Features Implementation
- **Real-time Location**: Uses browser Geolocation API and Leaflet for mapping
- **Photo Capture**: React Webcam for camera access and photo capture
- **Session Management**: Express sessions with MySQL store
- **Responsive Design**: SCSS for styling with mobile-first approach

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Note**: This is a production-ready emergency reporting system. Ensure proper security measures and testing before deploying to a production environment.

