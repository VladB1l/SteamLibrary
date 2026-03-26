# Steam Library

Practice project demonstrating full-stack TypeScript development:

**Backend** - Node.js/Express/MongoDB parser that scrapes Steam Store data, saves games to MongoDB, and serves as a complete games catalog API with search, filtering by genre, top ratings, and detailed game info (including Steam Store screenshots).

**Frontend** - Vanilla TypeScript + Vite static site with responsive design, hash-based routing for genre pages, infinite scroll pagination, and Steam-like UI.

## Links

- [UI link](https://steam-library-ui.vercel.app/)
- [API link](https://steam-library-api-sandy.vercel.app/)

## API Reference

### Get all games

```http
GET /api/games
```

**Response:**

```json
{
  "total": 1234,
  "games": [...]
}
```

### Get game by ID

```http
GET /api/game?id=730
```

**Response:**

```json
{
  "sid": 730,
  "name": "CS:GO",
  "screenshots": [...]
}
```

### Get top 20 games

```http
GET /api/top20
```

**Response:**

```json
{
  "total": 20,
  "games": [...]
}
```

### Get games by genre

```http
GET /api/genre?genre=strategy&page=0
```

**Parameters:**

- `genre` - name of genre (strategy, racing, rpg...)
- `page` - number of the page (0, 1, 2...)

**Response:**

```json
{
  "genre": "Strategy",
  "total": 456,
  "page": 0,
  "totalPages": 22,
  "games": [...]
}
```

### Search games

```http
GET /api/search?q=csgo&limit=10
```

Serch game by name (min 2 symbol).

**Parameters:**

- `q` - search query
- `limit` - max results (default 20)

**Response:**

```json
[
  { "sid": 730, "name": "Counter-Strike 2" },
  ...
]
```
