import cors from 'cors';
import express from 'express';

import { HTTP_STATUS } from './constants/index.js';
import freelancerRoutes from './routes/freelancer.routes.js';
import userRoutes from './routes/user.routes.js';
import { ApiError } from './utils/ApiHelper.js';

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

app.all('*', (req, res) => {
  return res
    .status(HTTP_STATUS.BAD_REQUEST)
    .json(new ApiError(HTTP_STATUS.BAD_REQUEST, `${req.path} is not found`));
});

export default app;
