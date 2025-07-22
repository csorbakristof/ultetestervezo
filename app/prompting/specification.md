# Specification for the planting designer

This is the specification for an application which helps an individual to design their garden: the garden has predefined area (beds, rows) which can contain one plant at a time. The application helps to design the planting in terms of locat## Temporal Garden Management

### Week-based Navigation
The Garden View provides comprehensive time navigation allowing users to move through the growing season:

#### Navigation Controls
- **Week Display**: Current week prominently displayed in header (Week 1-52)
- **Previous/Next Buttons**: Arrow buttons for sequential week navigation
- **Direct Week Input**: Number input field for jumping to specific weeks
- **Boundary Protection**: Navigation controls disabled at year boundaries (weeks 1 and 52)
- **Visual Feedback**: Disabled states clearly indicated for boundary weeks

#### Time-based Garden Visualization
- **Dynamic Plant Display**: Plants appear/disappear based on their active growing periods
- **Current Week Context**: Only plants within their planting timeframe are visible
- **Temporal Accuracy**: Garden representation reflects actual planting schedules
- **Season Overview**: Navigation provides "time-lapse" view of garden throughout the year

### Planting Period Management
- **Automatic Calculation**: Planting periods calculated from current week + plant growth duration
- **Overlap Prevention**: System blocks conflicting plantings in the same slot with clear error messages
- **Full Period Operations**: Plant removal affects entire growing periods, not just current week
- **Confirmation Dialogs**: Detailed information shown before removing plantings (week range, plant name)

## Data Management and File Operationsons (what is planted and where) and the timing (when is something planted and what plants follow each other at the same location).

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

The visual design of the garden is shown in a grid consisting of 30x30 cm cells. The grid size is configurable by the user within a range of 3-50 cells for both width and height dimensions, allowing for gardens of various sizes from small urban plots to larger suburban gardens.

Rectangular areas represent beds and inside the beds, further rectangular areas called slots (typically rows or columns or squares) represent specific locations filled with the same type of plant.

Each bed has a unique name (editable by clicking on the bed name) and each of its slots has a number (like bed "sunny 1", "row 3").

### Garden Layout Management

The Garden View provides comprehensive tools for creating and managing garden structure:

#### Grid Configuration
- **Configurable Grid Size**: Users can set the garden dimensions from 3x3 to 50x50 cells
- **Grid Size Validation**: Input validation ensures practical garden sizes
- **Plant Preservation**: When reducing grid size, plants outside new bounds are automatically removed
- **Visual Grid**: 30px x 30px cells provide clear visual reference for 30cm x 30cm real-world areas
- **Configuration Interface**: Dedicated panel with apply/cancel buttons for grid size changes

#### Bed and Slot Drawing Tools
- **Drawing Mode Toggle**: Separate modes for drawing beds and slots
- **Interactive Drawing**: Click and drag to create rectangular areas
- **Visual Preview**: Real-time preview shows the area being drawn before release
- **Bed Selection**: Dropdown to select which bed to add slots to
- **Drawing Feedback**: Visual indicators and instructions guide the drawing process
- **Absolute Positioning**: Slots use absolute grid coordinates for consistent placement

#### Editor Mode Control
- **Editor Checkbox**: Toggle to hide/show all editing tools and management interfaces
- **Presentation Mode**: When Editor is unchecked, only the garden grid and plant palette remain visible
- **Interface Simplification**: Non-editor mode provides clean viewing experience for design review

#### Debug Mode Features
- **Debug Checkbox**: Additional debugging tools for development and troubleshooting
- **Cell Information Display**: Shows bed names and slot numbers in every grid cell when enabled
- **Management Panel Debug Info**: Displays position and size coordinates for beds and slots when debug mode is active
- **Visual Overlay**: Semi-transparent debug information overlay on grid cells

#### Bed and Slot Management
- **Inline Name Editing**: Click on any bed name to edit it directly in the interface
- **Deletion with Confirmation**: Right-click or use management panel to delete beds/slots with confirmation dialogs
- **Hierarchical Display**: Management panel shows beds with their contained slots
- **Compact Layout**: Space-efficient display with essential information only
- **Visual Indicators**: Bed names appear in the upper-left corner of each bed area on the grid

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
The garden view provides intuitive drag and drop functionality with temporal planting management and optimized layout:

#### Time Navigation and Control
- **Week Navigation**: Previous/Next arrow buttons for step-by-step week progression
- **Direct Week Selection**: Number input field for jumping to specific weeks (1-52)
- **Current Week Display**: Prominent display of current week in the header
- **Temporal Boundaries**: Navigation controls disabled at week boundaries (1 and 52)
- **Real-time Garden Updates**: Garden visualization automatically updates to show plants active during the selected week

#### Temporal Planting System
- **Time-aware Planting**: When dropping plants on slots, planting starts at current week
- **Growth Duration Integration**: Planting period calculated using plant's growthDuration property
- **Overlap Prevention**: System prevents overlapping planting periods within the same slot
- **Conflict Detection**: Clear error messages when attempting overlapping plantings
- **Temporal Removal**: Clicking planted slots removes entire planting periods with confirmation
- **Week-based Visualization**: Plants only visible during their active growing periods

### Garden View Interaction
The garden view provides intuitive drag and drop functionality with optimized layout:

#### Interface Layout (Top to Bottom)
1. **Header Section**: Time navigation controls, drawing tools, grid configuration, and mode toggles
2. **Garden Grid**: Visual representation of the garden with drag-drop capability  
3. **Plant Palette**: Available plants displayed as draggable cards for immediate access
4. **Bed and Slot Management**: Compact management interface for editing and organizing garden structure

#### Plant Interaction
- **Plant Palette**: Available plants are displayed as draggable cards positioned directly below the garden grid for easy access
- **Temporal Drag and Drop Planting**: 
  - Users can drag plants from the palette and drop them onto slots for time-based planting
  - Slot planting creates temporal plantings from current week through harvest period
  - Individual cell planting (outside slots) creates temporary visual-only placements
- **Smart Slot Filling**: Dropping plants on slots fills the entire slot area with the plant
- **Visual Feedback**: Grid cells provide visual feedback during drag operations:
  - Highlight valid drop zones when hovering with a plant
  - Change colors to indicate droppable areas (blue for beds, green for slots)
  - Show blue borders for active drop targets
- **Temporal Plant Removal**: 
  - Click on planted slots to remove entire planting periods with confirmation dialog
  - Shows planting period details before removal (week range and plant name)
  - Individual cell removal for non-slot plantings
- **Visual Plant Representation**: Each planted cell shows the plant's emoji icon with hover tooltips
- **Week-based Display**: Plants only appear when the current week falls within their planting period

#### Bed and Slot Operations
- **Drawing Tools**: Toggle between "Draw Bed" and "Draw Slot" modes
- **Interactive Creation**: Click and drag on the grid to create rectangular beds or slots
- **Real-time Preview**: Visual feedback shows the area being drawn
- **Name Management**: Click on bed names in the grid or management panel to edit them inline
- **Deletion Options**: Right-click on beds/slots in the grid or use management panel delete buttons
- **Confirmation Dialogs**: All deletion operations require user confirmation

#### Grid Configuration
- **Size Adjustment**: Configure grid dimensions through a dedicated interface
- **Range Validation**: Grid size limited to practical ranges (3-50 cells per dimension)
- **Responsive Layout**: Interface adjusts to accommodate various grid sizes
- **Scrollable Content**: Automatic scrolling when content exceeds viewport height

#### Visual Design Elements
- **Color Coding**: 
  - Regular cells: Light gray background
  - Bed areas: Light blue background with blue borders for bed boundaries only
  - Slot areas: Light green background with green borders for slot boundaries only
  - Planted cells: Green background indicating successful planting
- **Border Visualization**: Only bed and slot boundaries show bold borders, not internal cell divisions
- **Bed Labels**: Bed names displayed only in the upper-left corner to minimize visual clutter
- **Slot Numbers**: Slot identifiers shown in the bottom-right corner of slot areas
- **Smart Border Detection**: Adjacent cell comparison ensures proper boundary visualization

### Timeline View Interaction
The timeline view can be edited by choosing a plant and clicking on a cell of the grid to assign planting schedules.

### Garden Layout Tools
In the Garden View, comprehensive tools allow creating, editing, and managing beds and slots:

#### Drawing and Creation Tools
- **Bed Creation**: Select "Draw Bed" mode and click-drag on the grid to create rectangular bed areas
- **Slot Creation**: Select a bed from the dropdown, choose "Draw Slot" mode, and draw within the selected bed
- **Visual Preview**: Real-time feedback shows the area being created before finalizing
- **Automatic Naming**: New beds receive default names that can be immediately edited

#### Management Interface
- **Compact Layout**: Bed and slot management panel positioned below the garden visualization
- **Space Efficiency**: Simplified display showing only essential information (names, slot counts)
- **Inline Editing**: Click on bed names to edit them directly in place
- **Hierarchical Organization**: Beds displayed with their contained slots in an organized grid

#### Editing Capabilities
- **Name Editing**: Click on any bed name to enter edit mode with save/cancel options
- **Keyboard Shortcuts**: Enter to save, Escape to cancel editing operations
- **Deletion Workflows**: Confirmation dialogs prevent accidental deletion of beds and slots
- **Grid-based Deletion**: Right-click on beds or slots directly in the garden grid for quick deletion

#### Layout Optimization
- **Scrollable Interface**: Full content scrolling when garden layouts extend beyond viewport
- **Responsive Design**: Interface adapts to different garden sizes and screen dimensions
- **Visual Hierarchy**: Garden grid prioritized at top, management tools below for logical workflow
- **Interface Order**: Controls at top, garden grid below, plant palette directly under grid, management panel at bottom
- **Editor Mode Toggle**: Complete interface simplification with Editor checkbox
- **Debug Capabilities**: Optional debug mode for displaying technical information about beds and slots

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

### Plant Library Management Interface

The Plant Library provides comprehensive CRUD (Create, Read, Update, Delete) operations for plant management:

#### Plant Display and Editing
- **Plant Cards**: Each plant is displayed as a card showing all its properties in a readable format
- **Edit Mode**: Clicking "Edit" on any plant card opens an inline editing interface
- **Form Layout**: The editing interface uses a responsive grid layout optimized for desktop use
- **Field Organization**: Related fields are grouped together (timing, requirements, relationships)
- **Input Validation**: Appropriate input controls for each data type (dropdowns for levels, number inputs for durations)

#### Editing Interface Features
- **Wide Form Layout**: Editor width of 600px to accommodate all fields without horizontal scrolling
- **Scrollable Content**: Form fields are contained in a scrollable area with fixed header and action buttons
- **Fixed Header**: Shows "Editing: [Plant Name]" to maintain context during editing
- **Sticky Action Buttons**: Save and Cancel buttons remain visible at the bottom of the form
- **Array Input Fields**: Comma-separated input for lists (planting months, companion plants, etc.)
- **Responsive Design**: Maximum width of 90% viewport width for smaller screens

#### Plant Operations
- **Add New Plant**: Button to create a new plant with default values that can be immediately edited
- **Edit Existing**: Modify any plant property including the plant name
- **Delete Plant**: Remove plants with confirmation dialog
- **Cancel Changes**: Revert all unsaved modifications
- **Save Changes**: Persist updates to the plant database

#### Data Validation and Handling
- **Name Change Support**: System handles plant name changes by tracking original names during editing
- **Array Parsing**: Automatic conversion of comma-separated values to arrays for storage
- **Input Constraints**: Appropriate min/max values for numeric fields (growth duration, spacing, etc.)
- **Dropdown Options**: Predefined choices for categorical fields (water need, sun need, season)

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
    "gridSize": {"width": 20, "height": 15},
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
            "position": {"x": 2, "y": 1},
            "size": {"width": 2, "height": 1},
            "plantings": [
              {
                "plant": "carrot",
                "startWeek": 6,
                "endWeek": 16
              },
              {
                "plant": "lettuce", 
                "startWeek": 20,
                "endWeek": 28
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
      "image": "🥕",
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

**Note**: 
- Slot positions use absolute grid coordinates, not relative coordinates within beds. This ensures consistent positioning regardless of bed location.
- Planting periods are automatically calculated: startWeek = currentWeek when planted, endWeek = startWeek + plant.growthDuration
- The system prevents overlapping plantings within the same slot to maintain realistic growing constraints
- Plants are only visible in the garden view when the current week falls within their planting period (startWeek ≤ currentWeek ≤ endWeek)
