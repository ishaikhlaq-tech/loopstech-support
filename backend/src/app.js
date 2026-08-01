import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index.js';
import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import slaRoutes from './routes/sla.js';
import companySettingsRoutes from './routes/company-settings.js';
import cannedResponsesRoutes from './routes/canned-responses.js';
import notificationsRoutes from './routes/notifications.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true 
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', router);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sla', slaRoutes);
app.use('/api/company-settings', companySettingsRoutes);
app.use('/api/canned-responses', cannedResponsesRoutes);
app.use('/api/notifications', notificationsRoutes);

// Test route to verify the frontend connection
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend connected successfully!' });
});

// Protected test endpoint
app.get('/api/protected-test', requireAuth, (req, res) => {
  res.json({
    message: 'Access granted to protected route!',
    userId: req.user.id,
    email: req.user.email,
  });
});

// backend route to receive payload
app.post('/api/echo', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  res.json({
    message: 'Data received successfully on the backend!',
    data: { name, email }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
