import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

import { connectDatabase, disconnectDatabase } from './database.js';
import { authenticateToken, requireRole, requireProjectAccess, JWT_SECRET } from './middleware.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Document from './models/Document.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Connect to MongoDB
connectDatabase().then(() => {
  console.log('Database connected successfully');
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User management routes
app.get('/api/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const user = new User({
      username,
      email,
      password,
      role
    });
    
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Project routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    
    let projects;
    if (role === 'admin') {
      projects = await Project.find()
        .populate('createdBy', 'username')
        .populate('teamMembers', 'username')
        .sort({ createdAt: -1 });
    } else if (role === 'project_lead') {
      projects = await Project.find({ createdBy: userId })
        .populate('createdBy', 'username')
        .populate('teamMembers', 'username')
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ teamMembers: userId })
        .populate('createdBy', 'username')
        .populate('teamMembers', 'username')
        .sort({ createdAt: -1 });
    }

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/projects', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, description, deadline } = req.body;
    
    const project = new Project({
      name,
      description,
      deadline,
      createdBy: req.user.id
    });
    
    await project.save();
    res.status(201).json({ message: 'Project created successfully', projectId: project._id });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/projects/:projectId/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;
    
    await Project.findByIdAndUpdate(projectId, { status });
    res.json({ message: 'Project status updated successfully' });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Project assignment routes
app.get('/api/projects/:projectId/assignments', authenticateToken, requireProjectAccess, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('teamMembers', 'username email role');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project.teamMembers);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/projects/:projectId/assignments', authenticateToken, requireRole(['admin', 'project_lead']), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ error: 'User is already assigned to this project' });
    }
    
    project.teamMembers.push(userId);
    await project.save();
    
    res.status(201).json({ message: 'User assigned to project successfully' });
  } catch (error) {
    console.error('Assign user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/projects/:projectId/assignments/:userId', authenticateToken, requireRole(['admin', 'project_lead']), async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    
    await Project.findByIdAndUpdate(projectId, {
      $pull: { teamMembers: userId }
    });
    
    res.json({ message: 'User removed from project successfully' });
  } catch (error) {
    console.error('Remove user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Document routes
app.get('/api/projects/:projectId/documents', authenticateToken, requireProjectAccess, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const documents = await Document.find({ project: projectId })
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/projects/:projectId/documents', authenticateToken, requireRole(['admin', 'project_lead']), upload.single('file'), async (req, res) => {
  try {
    const { projectId } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const document = new Document({
      project: projectId,
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: req.user.id
    });
    
    await document.save();
    res.status(201).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/documents/:documentId', authenticateToken, requireRole(['admin', 'project_lead']), async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(documentId);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available users for assignment
app.get('/api/users/available', authenticateToken, requireRole(['admin', 'project_lead']), async (req, res) => {
  try {
    const users = await User.find({ role: 'developer' }, 'username email role').sort({ username: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get available users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get project details
app.get('/api/projects/:projectId', authenticateToken, requireProjectAccess, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('createdBy', 'username')
      .populate('teamMembers', 'username email role');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
}); 