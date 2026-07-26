import { create } from 'zustand';

interface Item {
  id: string;
  name: string;
  estimatedPrice: number;
  condition: string;
  rarity: string;
  priceTrend: 'up' | 'down' | 'stable';
  description: string;
  timestamp: number;
}

interface Store {
  items: Item[];
  addItem: (item: Item) => void;
  clearItems: () => void;
}

export const useStore = create<Store>((set) => ({
  items: [],
  addItem: (item: Item) => set((state) => ({ items: [...state.items, item] })),
  clearItems: () => set({ items: [] }),
}));
