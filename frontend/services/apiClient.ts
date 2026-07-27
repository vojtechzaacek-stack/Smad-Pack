import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
  };
}

export interface EstimateResponse {
  price: number;
  condition: string;
  rarity: string;
  confidence: number;
  aiAnalysis: string;
}

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  async saveToken(token: string) {
    try {
      this.token = token;
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  async clearToken() {
    try {
      this.token = null;
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  // Auth endpoints
  async register(email: string, password: string, firstName: string, lastName?: string): Promise<AuthResponse> {
    const response = await this.client.post('/api/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    await this.saveToken(response.data.token);
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post('/api/auth/login', {
      email,
      password,
    });
    await this.saveToken(response.data.token);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  async logout() {
    await this.clearToken();
  }

  // Estimation endpoint
  async estimatePrice(image: string, category?: string): Promise<EstimateResponse> {
    const response = await this.client.post('/api/estimate', {
      image,
      category,
    });
    return response.data;
  }

  // Trends endpoint
  async getTrends(itemId: string) {
    const response = await this.client.get(`/api/trends/${itemId}`);
    return response.data;
  }

  // Item details endpoint
  async getItemDetails(itemId: string) {
    const response = await this.client.get(`/api/item/${itemId}`);
    return response.data;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.token !== null;
  }
}

export const apiClient = new APIClient();
