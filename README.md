# PixelForge Nexus - Project Management System

A comprehensive project management system designed for game development teams, featuring role-based access control, document management, and team collaboration tools.

## 🚀 Features

### Core Functionality
- **Project Management**: Create, view, and manage game development projects
- **Team Assignment**: Assign developers to projects with role-based permissions
- **Document Management**: Upload and manage project documents with version control
- **User Management**: Admin-only user creation and role management

### Role-Based Access Control
- **Administrator**: Full system access, manage all projects and users
- **Project Lead**: Create projects, assign team members, upload documents
- **Developer**: View assigned projects and access project documents

### Security Features
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Authorization**: Granular permissions based on user roles
- **File Upload Security**: File type validation and size limits

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form handling and validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PixelForge_Nexus
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Start the Backend Server
```bash
cd server
npm run dev
```

The backend server will start on `http://localhost:3001`

### 5. Start the Frontend Development Server
```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

## 🔐 Default Login Credentials

The system comes with a default admin account:

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login for security.

## 📖 Usage Guide

### For Administrators

1. **User Management**
   - Navigate to "User Management" from the navbar
   - Create new users with different roles
   - Manage existing user accounts

2. **Project Management**
   - Create new projects from the dashboard
   - Assign team members to projects
   - Mark projects as completed
   - Upload project documents

3. **System Administration**
   - Monitor all projects and users
   - Manage user roles and permissions
   - Access all project documents

### For Project Leads

1. **Project Creation**
   - Create new projects with descriptions and deadlines
   - Assign developers to your projects
   - Upload project documents

2. **Team Management**
   - Add/remove developers from your projects
   - Manage project documents
   - Track project progress

### For Developers

1. **Project Access**
   - View assigned projects on the dashboard
   - Access project details and documents
   - Download project files

2. **Document Management**
   - View and download project documents
   - Access project information and team details

## 🗂️ Project Structure

```
Pixelforge_Nexus/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard and project management
│   │   ├── projects/       # Project detail views
│   │   ├── admin/          # Admin-specific components
│   │   └── layout/         # Layout components
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   └── App.jsx            # Main application component
├── server/
│   ├── database.js        # Database initialization
│   ├── middleware.js      # Authentication middleware
│   ├── server.js          # Express server
│   └── uploads/           # File upload directory
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
```

### Database

The system uses SQLite for simplicity. The database file (`pixelforge_nexus.db`) will be created automatically when you first start the server.

## 📁 File Upload

The system supports the following file types:
- Images: JPG, JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX, TXT
- Archives: ZIP, RAR

File size limit: 10MB per file

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Granular permissions for different user roles
- **File Validation**: Server-side file type and size validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
```bash
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Future Enhancements

- [ ] Multi-Factor Authentication (MFA)
- [ ] Real-time notifications
- [ ] Project templates
- [ ] Advanced reporting and analytics
- [ ] API rate limiting
- [ ] Email notifications
- [ ] Mobile responsive design improvements
- [ ] Dark mode theme
- [ ] Project time tracking
- [ ] Integration with external tools

---

**PixelForge Nexus** - Empowering game development teams with efficient project management tools.
