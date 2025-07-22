# Garden Planner

A comprehensive web application for designing and planning your garden layout with intelligent planting suggestions and timeline management.

## Features

- **Garden View**: Visual grid-based garden layout editor
- **Timeline View**: Week-by-week planting schedule visualization
- **Plant Library**: Comprehensive plant database with metadata management
- **Smart Planning**: Conflict detection and companion planting suggestions
- **Drag & Drop Interface**: Intuitive plant placement and rearrangement
- **Data Export**: Save and load garden plans in JSON format

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with custom properties
- **Drag & Drop**: react-dnd library
- **State Management**: React Context with useReducer

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## Installation

1. Clone or download this repository
2. Install Node.js from [nodejs.org](https://nodejs.org/) if not already installed
3. Open a terminal in the project directory
4. Install dependencies:

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── GardenView.tsx  # Garden layout editor
│   ├── TimelineView.tsx # Timeline visualization
│   ├── PlantLibrary.tsx # Plant database management
│   └── Navigation.tsx   # Main navigation
├── context/            # React context providers
│   └── GardenContext.tsx # Garden state management
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── App.css           # Application styles
```

## Garden Data Structure

The application uses a JSON-based data structure for storing garden layouts:

```json
{
  "garden": {
    "name": "My Garden",
    "gridSize": {"width": 10, "height": 8},
    "beds": [...]
  },
  "plants": [...]
}
```

## Contributing

1. Follow TypeScript best practices
2. Use the established component patterns
3. Maintain the existing CSS structure
4. Test drag and drop functionality thoroughly
5. Ensure data validation for plant spacing and timing

## License

This project is for educational and personal use.
