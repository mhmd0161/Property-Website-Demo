# EstatePro

A full-stack property listing demo app built with React and Node.js/Express.

## Features

- Browse and search property listings
- Filter by status (For Sale / For Rent), type, bedrooms, price range, and location
- View detailed property pages with images, amenities, and agent info
- Featured properties on the home page
- Platform statistics (total listings, cities covered)

## Tech Stack

**Frontend:** React 18, React Router v6, CSS3
**Backend:** Node.js, Express, CORS
**Dev tooling:** Concurrently, Nodemon

## Getting Started

### Install dependencies

```bash
npm run setup
```

### Run the app

```bash
npm run dev
```

This starts both servers concurrently:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Run separately

```bash
npm run start:server   # backend only
npm run start:client   # frontend only
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List all properties (supports filters) |
| GET | `/api/properties/featured` | Featured properties only |
| GET | `/api/properties/:id` | Single property details |
| GET | `/api/stats` | Platform statistics |

### Query Parameters for `/api/properties`

- `status` — `For Sale` or `For Rent`
- `type` — `Apartment`, `House`, `Villa`, `Penthouse`, `Townhouse`
- `city` — city name
- `bedrooms` — minimum number of bedrooms
- `minPrice` / `maxPrice` — price range
- `search` — keyword search

## Project Structure

```
property-demo/
├── client/          # React frontend (Create React App)
│   └── src/
│       ├── components/   # Navbar, Footer, PropertyCard
│       └── pages/        # HomePage, ListingsPage, PropertyDetailPage
├── server/          # Express backend
│   ├── index.js     # API routes
│   └── data.js      # Mock property data
└── package.json     # Root scripts
```

## Notes

- No database required — property data is hardcoded in `server/data.js`
- Backend port defaults to `5000`, overridable via `PORT` environment variable
