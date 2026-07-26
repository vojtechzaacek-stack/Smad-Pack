import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { AppDataSource } from './database';
import { User } from './entities/User';
import { Item } from './entities/Item';
import { AuthService } from './services/authService';
import { authMiddleware, AuthRequest } from './middleware/authMiddleware';
import { estimatePrice } from './services/estimationService';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Initialize Database
AppDataSource.initialize()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.error('❌ Database error:', err));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await AuthService.hashPassword(password);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await userRepository.save(user);

    const token = AuthService.generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await AuthService.comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = AuthService.generateToken({ userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ==================== ESTIMATE ROUTES ====================

// Main estimation endpoint
app.post('/api/estimate', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { image, category } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const result = await estimatePrice(image, category);
    res.json(result);
  } catch (error) {
    console.error('Estimation error:', error);
    res.status(500).json({ error: 'Estimation failed' });
  }
});

// Get trends
app.get('/api/trends/:itemId', authMiddleware, (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  res.json({ itemId, trends: [] });
});

// Get item details
app.get('/api/item/:itemId', authMiddleware, (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  res.json({ itemId, details: {} });
});

app.listen(PORT, () => {
  console.log(`🚀 Server je spuštěn na portu ${PORT}`);
});
