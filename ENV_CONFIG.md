# Frontend Environment Configuration

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Socket.io Configuration
VITE_SOCKET_URL=http://localhost:3000

# Frontend Port (used by Vite dev server)
VITE_PORT=3001

# Application Name
VITE_APP_NAME=Status Page

# Application URL (for email links and sharing)
VITE_APP_URL=http://localhost:3001
```

## Variable Descriptions

### VITE_API_URL
- **Description**: Backend API base URL
- **Default**: `http://localhost:3000`
- **Example**: `https://api.yourdomain.com`

### VITE_SOCKET_URL
- **Description**: WebSocket server URL (usually same as API URL)
- **Default**: `http://localhost:3000`
- **Example**: `https://api.yourdomain.com`

### VITE_PORT
- **Description**: Port for Vite development server
- **Default**: `3001`
- **Note**: Only used in development

### VITE_APP_NAME
- **Description**: Display name for the application
- **Default**: `Status Page`

### VITE_APP_URL
- **Description**: Full URL of the frontend application
- **Used for**: Email links, sharing, public status page URLs
- **Default**: `http://localhost:3001`
- **Production Example**: `https://status.yourdomain.com`

## Production Configuration

For production, update your `.env` file:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
VITE_PORT=3001
VITE_APP_NAME=Status Page
VITE_APP_URL=https://status.yourdomain.com
```

## Important Notes

1. **Vite Prefix**: All environment variables must start with `VITE_` to be accessible in the frontend code
2. **Restart Required**: After changing `.env` file, restart the Vite dev server
3. **Build Time**: Environment variables are embedded at build time, not runtime
4. **Security**: Never commit `.env` file to git (already in `.gitignore`)

## Quick Start

1. Copy `.env.example` to `.env` (if available)
2. Update the values according to your setup
3. Start the development server: `npm run dev`

The frontend will automatically use these environment variables.

