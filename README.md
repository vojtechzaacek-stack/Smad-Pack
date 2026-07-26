# SMAD PACK 📱

Mobilní aplikace pro odhad cen předmětů pomocí AI a fotografie.

## Funkce
- 📸 Fotografie předmětů
- 💰 Odhad ceny pomocí AI
- 📈 Trend cen (vzestup/sestup)
- 🎯 Vyhodnocení stavu
- ✨ Určení vzácnosti

## Technologie

### Frontend
- React Native + Expo
- TypeScript
- NativeWind (Tailwind CSS)

### Backend
- Node.js + Express
- Python (AI odhady)
- PostgreSQL / Firebase

### API
- Google Vision API (rozpoznání objektů)
- eBay API (ceny, trendy)
- Vinted API (dodatečné data)
- OpenAI API (analýza)

## Setup

### Requirements
- Node.js 18+
- Python 3.9+
- Expo CLI

### Frontend
```bash
cd frontend
npm install
npx expo start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Python AI Service
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

## API Endpoints

### POST /api/estimate
Odhad ceny na základě fotky
```json
{
  "image": "base64_encoded_image",
  "category": "optional_category"
}
```

### GET /api/trends/:itemId
Trendy cen pro item

### GET /api/item/:itemId
Detaily o položce (stav, vzácnost, cena)

## Autor
Vojtěch Žáček
