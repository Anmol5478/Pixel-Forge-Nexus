import jwt from 'jsonwebtoken';
import Project from './models/Project.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export async function requireProjectAccess(req, res, next) {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is admin, project creator, or team member
    const hasAccess = req.user.role === 'admin' || 
                     project.createdBy.toString() === userId ||
                     project.teamMembers.some(member => member.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this project' });
    }

    next();
  } catch (error) {
    console.error('Project access check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

export { JWT_SECRET }; 