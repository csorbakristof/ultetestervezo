<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Garden Planner Application

This is a React TypeScript application for garden planning and design.

## Key Architecture Guidelines

- Use TypeScript for all components and maintain strict type safety
- Follow React functional component patterns with hooks
- Use the provided GardenContext for state management
- Implement drag and drop functionality using react-dnd library
- Follow the JSON data structure defined in the specification for garden data

## Component Structure

- Navigation: Main app navigation between views
- GardenView: Grid-based garden layout editor
- TimelineView: Week-by-week timeline for planting schedules
- PlantLibrary: Plant database management
- GardenContext: Central state management for garden data

## Styling Guidelines

- Use CSS modules or styled components for component-specific styles
- Follow the established color scheme and grid-based layout
- Ensure responsive design for desktop and tablet devices
- Use proper accessibility attributes

## Data Management

- All garden data follows the JSON schema defined in the specification
- Use the GardenContext reducer pattern for state updates
- Implement proper validation for plant spacing and timing conflicts
- Support import/export of garden plans in JSON format

## Features to Implement

- Drag and drop plant placement
- Conflict detection for incompatible plants
- Timeline visualization with week-by-week planning
- Plant library with full metadata management
- Smart planting suggestions based on companion planting rules
