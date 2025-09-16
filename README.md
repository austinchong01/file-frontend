# File Uploader Application

A full-stack file management application that allows users to upload, organize, and manage files in folders with secure authentication.

---
## **Project Purpose**

This application serves as a demonstration of core full-stack development skills and fundamental technologies required to build, deploy, and maintain modern web applications. While the functionality is intentionally straightforward, it showcases proficiency in essential development practices including authentication, database management, cloud storage integration, and responsive UI design.
---


🔗 **Live Demo**: [https://file-frontend-lnuo.onrender.com/](https://file-frontend-lnuo.onrender.com/)
- The website may take time to register a user
- Test Account:
   - Username: test@gmail.com | Password: asdfasdf
- Please do not upload more than 10mb of files on one account, I am using a free Cloudinary account :)
- Please do not create an unncecessary amount of users, I am using a free Aiven database :)

## Features

### User Authentication
- User registration and login
- JWT-based authentication
- Protected routes and secure sessions
- Automatic token management

### File Management
- Upload multiple file types (images, videos, PDFs)
- File preview functionality
- Download files
- Rename files with custom display names
- Delete files with confirmation

### Folder Organization
- Create folders for file organization
- Rename folders
- Delete empty folders
- Navigate through folder contents
- Upload files directly to specific folders

### User Interface
- Clean, responsive design with Tailwind CSS
- Real-time feedback and status messages
- Mobile-friendly interface
- Intuitive file and folder management

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Cloudinary** - File storage and management
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware

### Deployment
- **Frontend**: Render
- **Backend**: Render
- **Database**: PostgreSQL (hosted)
- **File Storage**: Cloudinary

## 📁 Project Structure

```
file-uploader/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── passport.js
│   ├── controllers/
│   ├── middleware/
│   │   └── jwtAuth.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── files.js
│   │   ├── folders.js
│   │   └── index.js
│   ├── utils/
│   │   └── jwt.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── File.jsx
│   │   │   ├── Folder.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── public/
└── README.md
```

## Devloping your own:

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account for file storage

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd file-uploader/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/fileuploader"
   JWT_SECRET="your-super-secure-jwt-secret"
   JWT_EXPIRES_IN="24h"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   FRONTEND_URL="http://localhost:5173"
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_BACKEND_URL="http://localhost:3000"
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 📖 API Documentation

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### File Management Endpoints
- `GET /dashboard` - Get user's files and folders
- `POST /files/upload` - Upload a file
- `GET /files/:id/download` - Download a file
- `POST /files/rename` - Rename a file
- `DELETE /files/:id` - Delete a file

### Folder Management Endpoints
- `POST /folders/create` - Create a new folder
- `GET /folders/:id` - Get folder contents
- `POST /folders/rename` - Rename a folder
- `DELETE /folders/:id` - Delete an empty folder

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- CORS configuration
- Input validation and sanitization
- Secure file upload with type restrictions


### File Upload Limits
- Maximum file size: 10MB
- Supported formats: Images (JPEG, PNG, GIF, WebP), Videos (MP4, MOV), Documents (PDF)

### Database Schema
The application uses Prisma with the following main models:
- **User**: User authentication and profile
- **File**: File metadata and Cloudinary references
- **Folder**: Folder organization and hierarchy


## Known Issues

- File preview may not work for all file types
- Large file uploads may timeout on slower connections
- Prone to code injection
- No drag-and-drop functionality
- No nested folder functionality
