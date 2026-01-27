# Performance Arena Backend

Node.js + Express backend for the gamification platform.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Place Excel data file in `data/raw/gamification_data.xlsx`

3. Start the server:
   ```bash
   npm start
   ```

## Architecture

- **Routes**: API endpoints
- **Controllers**: Request handling
- **Services**: Business logic
- **Data**: Excel processing and JSON storage
- **Utils**: Helpers
- **Config**: Configuration

## Extensibility Notes

### Plugging in a Database
1. Replace `dataService.js` with database queries (e.g., MongoDB)
2. Update `loadData()` to fetch from DB instead of Excel
3. Modify services to use DB models instead of JSON files

### Adding Authentication
1. Install `jsonwebtoken`, `bcrypt`
2. Add auth middleware to routes
3. Implement `/api/auth/login` with JWT
4. Add user session validation

### Adding Caching
1. Install `redis` or `node-cache`
2. Wrap data fetches with cache layers
3. Implement cache invalidation on updates

### WebSocket for Live Updates
1. Install `socket.io`
2. Add WebSocket server in `server.js`
3. Emit events from services (e.g., leaderboard updates)
4. Connect from frontend for real-time feeds

### Scaling
- Add clustering with `cluster` module
- Implement load balancing
- Add database connection pooling
- Use message queues for heavy operations

## API Documentation

See `API_DATA_REQUIREMENTS.md` for complete endpoint specs.