import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { estimatePrice } from './services/estimationService';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Random Joke Endpoint
app.get('/api/joke', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      'https://v2.jokeapi.dev/joke/Programming?type=twopart'
    );

    if (response.data.error) {
      return res.status(400).json({ error: 'Failed to fetch joke' });
    }

    res.json({
      id: `joke_${Date.now()}`,
      setup: response.data.setup,
      delivery: response.data.delivery,
      category: response.data.category,
      type: response.data.type,
    });
  } catch (error) {
    console.error('Joke API error:', error);
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

// Random Joke with Custom Category
app.get('/api/joke/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const validCategories = ['General', 'Programming', 'Knock-Knock', 'Spooky', 'Dark'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Valid options: ${validCategories.join(', ')}`,
      });
    }

    const response = await axios.get(
      `https://v2.jokeapi.dev/joke/${category}?type=twopart`
    );

    if (response.data.error) {
      return res.status(400).json({ error: 'Failed to fetch joke' });
    }

    res.json({
      id: `joke_${Date.now()}`,
      setup: response.data.setup,
      delivery: response.data.delivery,
      category: response.data.category,
      type: response.data.type,
    });
  } catch (error) {
    console.error('Joke API error:', error);
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

// Main estimation endpoint
app.post('/api/estimate', async (req: Request, res: Response) => {
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
app.get('/api/trends/:itemId', (req: Request, res: Response) => {
  const { itemId } = req.params;
  // TODO: Implement trends fetching from eBay/Vinted API
  res.json({ itemId, trends: [] });
});

// Get item details
app.get('/api/item/:itemId', (req: Request, res: Response) => {
  const { itemId } = req.params;
  // TODO: Implement item details fetching
  res.json({ itemId, details: {} });
});

app.listen(PORT, () => {
  console.log(`🚀 Server je spuštěn na portu ${PORT}`);
});
