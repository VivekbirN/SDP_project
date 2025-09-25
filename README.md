# Utility Bill Tracker with Energy Bot

A full-stack web application for tracking utility bills with an intelligent energy-saving chatbot.

## Features

- **Bill Management**: Add and track utility bills with month, year, units consumed, and amount
- **Usage Trends**: Visualize energy consumption over time with interactive charts
- **Energy Bot**: AI-powered chatbot that provides personalized energy-saving tips based on consumption
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Dynamic table and chart updates when new bills are added

## Tech Stack

- **Frontend**: React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js
- **Data Storage**: In-memory arrays (no database required)

## Project Structure

```
utility-bill-tracker/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── BillForm.js
│   │   │   ├── BillsTable.js
│   │   │   ├── UsageChart.js
│   │   │   └── ChatBot.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── backend/                   # Express server
│   ├── server.js
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### 2. Frontend Setup

In a new terminal, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `POST /bill` - Add a new bill
- `GET /bills` - Get all bills
- `GET /trends` - Get aggregated monthly trends
- `POST /chat` - Send message to energy bot

## Usage

1. **Add Bills**: Use the form to log your utility bills with month, year, units consumed, and amount
2. **View Trends**: See your energy consumption patterns in the interactive chart
3. **Chat with Energy Bot**: Click the chat button in the bottom-right corner to get personalized energy-saving tips
4. **Track History**: View all your logged bills in the table with cost-per-unit calculations

## Chatbot Logic

The energy bot analyzes your latest bill:
- If monthly consumption > 500 units: Provides energy-saving tips
- If monthly consumption ≤ 500 units: Offers encouragement and efficiency tips

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Development

Both frontend and backend support hot-reload for development:
- Frontend: React development server with automatic reloading
- Backend: Nodemon for automatic server restart on file changes