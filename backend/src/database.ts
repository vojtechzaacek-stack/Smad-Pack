import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Item } from './entities/Item';
import { Estimate } from './entities/Estimate';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'smad_pack',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Item, Estimate],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
