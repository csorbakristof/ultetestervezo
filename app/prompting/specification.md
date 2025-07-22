# Specification for the planting designer

This is the specification for an application which helps an individual to design their garden: the garden has predefined area (beds, rows) which can contain one plant at a time. The application helps to design the planting in terms of locations (what is planted and where) and the timing (when is something planted and what plants follow each other at the same location).

## Application Overview

**Platform**: Web application (browser-based)
**Target Users**: Home gardeners, urban farmers, garden enthusiasts
**Primary Devices**: Desktop computers and tablets (minimum screen size for effective grid visualization)
**Technology Stack**: [To be determined during implementation]

## User Interface Structure

### Main Navigation
- **Garden View**: Default view showing the garden map with current time period
- **Timeline View**: Grid view showing the full year timeline for all slots
- **Plant Library**: Management of plant database and metadata
- **Settings**: Application preferences and garden configuration

### Toolbar Features
- Time navigation controls (current week, date picker)
- Plant selection palette for quick access to frequently used plants
- Zoom controls for detailed grid editing
- View toggle between map and timeline modes

## Configuration of the garden

The visual design of the garden is shown in a grid consisting of 30x30 cm cells. Rectangular areas represent beds and inside the beds, further rectangular areas called slots (typically rows or columns or squares) represent specific locations of filled with the same type of plant.

Each bed has a unique name and each its slots has a number (like bed "sunny 1", "row 3").

For a given point in time, the map of the garden shows the grid, the beds and slots with their identifier, and each slot contains a small image and name of the plant in that slot, in that given time.

Time has the granularity of weeks.

The whole garden can be described similar to the following structure:

- bed name (like "sunny 1")
    - slot (like "1")
        - timeframe (like "week 6 - week 15"), plant (like "carrot")
        - timeframe (like "week 16 - week 30"), plant (like "paprika")
    - slot (like "2")
        - timeframe (like "week 5 - week 35"), plant (like "potato")
- bed name (like "shady 2")
    - slot (like "2")
        - timeframe (like "week 2 - week 40"), plant (like "pumpkin")

An important constratint is that a given slot cannot have overlapping timeframes (as two plants cannot be planted there at the same time).

## Timeline view

Another visualization of the setup is the timeline view where we see a large grid. Every column stands for a single slot in the garden (showing the bed name and the slot number), and each row is a week of the year. Every cell shows the plant (with small image and name) what is planted there at that time.

The timeline view includes:
- Week numbers and corresponding dates for better temporal reference
- Visual indicators for planting and harvesting periods
- Transition markers showing when one crop ends and another begins
- Seasonal markers (frost dates, growing seasons) relevant to the user's location
- Color coding to distinguish between different plant families for crop rotation planning

## Editing capabilities

### Garden View Interaction
The garden view provides intuitive drag and drop functionality:
- **Plant Palette**: Available plants are displayed as draggable cards below the garden grid
- **Drag and Drop Planting**: Users can drag plants from the palette and drop them onto any grid cell
- **Visual Feedback**: Grid cells provide visual feedback during drag operations:
  - Highlight valid drop zones when hovering with a plant
  - Change colors to indicate droppable areas
  - Show blue borders for active drop targets
- **Plant Removal**: Click on planted cells to remove plants from the garden
- **Visual Plant Representation**: Each planted cell shows the plant's emoji icon with hover tooltips

### Timeline View Interaction
The timeline view can be edited by choosing a plant and clicking on a cell of the grid to assign planting schedules.

### Garden Layout Tools
In the map view, additional tools allow creating and naming the beds and the slots.

## Smart Planning Features

### Conflict Detection
The application automatically highlights potential issues:
- Plants placed too close to incompatible plants
- Overlapping timeframes in the same slot
- Plants with conflicting water/sun needs placed adjacent to each other
- Violation of spacing requirements between plants

### Planning Suggestions
The application provides intelligent recommendations:
- Optimal plant placements based on available space and timing
- Companion planting suggestions following established gardening principles
- Crop rotation recommendations to maintain soil health
- Succession planting opportunities to maximize harvest yield
- Warning when planting outside recommended seasonal windows

## User Experience Features

### Interaction Methods
- **Drag and Drop**: Allow dragging plants between slots and time periods for easy rearrangement
- **Copy/Paste**: Duplicate successful planting patterns across different slots or time periods
- **Undo/Redo**: Essential for complex planning sessions, allowing users to experiment freely
- **Search and Filter**: Find plants by properties, compatibility, or seasonal preferences

### Visual Feedback
- Real-time validation indicators showing conflicts or optimal placements
- Hover tooltips displaying plant information and compatibility warnings
- Progress indicators for long operations like conflict analysis

## List of plants and their metadata

Among the settings pages there is a page where the list of plants and the metadata of the plants can be edited.

Each plant in the list has the following properties:

- name
- image (small pictogram)
- month interval when it should be planted
- month interval when it can be harvested
- level of water need (1: few, 2: medium, 3: lot)
- level of sunshine it needs (1-3 with 3 the highest)
- list of plants which should not be near it
- list of plants it definitely likes in its proximity
- growth duration (weeks from planting to harvest)
- spacing requirements (minimum distance between plants in cm)
- plant family (for crop rotation planning - e.g., Brassicaceae, Solanaceae)
- seasonal preference (spring, summer, fall, winter)
- succession planting interval (weeks between successive plantings)

# Data Management and File Operations

## Save and Load Operations
- Save and load garden setups to/from JSON files
- Export garden plans to PDF for printing or sharing
- Import plant databases from external sources (CSV, JSON)

## JSON Data Structure

The garden setup file follows this structure:
```json
{
  "garden": {
    "name": "My Garden",
    "gridSize": {"width": 10, "height": 8},
    "beds": [
      {
        "id": "bed1",
        "name": "sunny 1",
        "position": {"x": 0, "y": 0},
        "size": {"width": 3, "height": 2},
        "slots": [
          {
            "id": "slot1",
            "number": "1",
            "plantings": [
              {
                "plant": "carrot",
                "startWeek": 6,
                "endWeek": 15
              }
            ]
          }
        ]
      }
    ]
  },
  "plants": [
    {
      "name": "carrot",
      "image": "carrot.png",
      "plantingMonths": [3, 4, 5],
      "harvestMonths": [6, 7, 8],
      "waterNeed": 2,
      "sunNeed": 3,
      "incompatiblePlants": ["fennel"],
      "companionPlants": ["lettuce"],
      "growthDuration": 10,
      "spacingCm": 5,
      "plantFamily": "Apiaceae",
      "season": "spring",
      "successionInterval": 2
    }
  ]
}
```
