# Status Page Frontend

A React-based frontend for the Status Page application. This frontend provides a user-friendly interface for managing services and incidents, with real-time updates via WebSocket.

## Features

- 🔐 User authentication (Login/Register)
- 📊 Dashboard for managing services and incidents
- 🌐 Public status page for end users
- ⚡ Real-time updates using Socket.io
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── IncidentCard.jsx
│   │   └── StatusBadge.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── StatusPage.jsx
│   ├── context/          # React context
│   │   └── AuthContext.jsx
│   ├── services/        # API and Socket services
│   │   ├── api.js
│   │   └── socket.js
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Usage

### Authentication

1. Register a new account at `/register`
2. Login at `/login`
3. Access the dashboard at `/dashboard`

### Dashboard

- **Services Section**: Add, edit, delete, and update service statuses
- **Incidents Section**: Create and manage incidents for your services

### Public Status Page

Access your public status page at `/status/:userId` where `:userId` is your user ID. This page shows:
- Overall system status
- All services and their current status
- Active incidents

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_SOCKET_URL` - Socket.io server URL (default: http://localhost:3000)

## Development

The app uses Vite for fast development with hot module replacement. Changes to files will automatically reload in the browser.

## License

ISC

