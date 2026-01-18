import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.routes.js';
import freelancerRoutes from './routes/freelancer.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  return res.json({
    message: 'Welcome to the Freelancer Marketplace API',
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/freelancers', freelancerRoutes);

export default app;
