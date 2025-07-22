# Garden Planning Application - User Guide

Welcome to the Garden Planning Application! This comprehensive tool helps you design, plan, and manage your garden throughout the year with temporal planting schedules, bed management, and plant library features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Navigation](#navigation)
3. [Plant Library](#plant-library)
4. [Garden View](#garden-view)
5. [Timeline View](#timeline-view)
6. [Storage & Data Management](#storage--data-management)
7. [Tips and Best Practices](#tips-and-best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Application Overview
The Garden Planning Application provides four main views:
- **Garden View**: Visual garden layout with beds, slots, and temporal planting
- **Timeline View**: Year-long planting schedule visualization
- **Plant Library**: Manage your plant database
- **Storage**: Import/export garden configurations and plant data

### Key Concepts
- **Beds**: Rectangular areas in your garden that group related plantings
- **Slots**: Subdivisions within beds for specific plant assignments
- **Temporal Planting**: Time-aware planting with automatic growth period calculation
- **Current Week**: The active week (1-52) that determines what plants are visible

---

## Navigation

Use the navigation bar at the top to switch between views:
- **Garden View**: Design and manage your garden layout
- **Timeline View**: View and edit planting schedules
- **Plant Library**: Add, edit, and manage plants
- **Storage**: Save, load, and share garden data

---

## Plant Library

### Viewing Plants
- Browse all available plants in your library
- Each plant shows: name, image (emoji), growing season, and key characteristics
- Use the search and filter features to find specific plants

### Adding New Plants
1. Click the **"Add New Plant"** button
2. Fill in all required information:
   - **Name**: Unique plant identifier
   - **Image**: Emoji or symbol representing the plant
   - **Planting Months**: When to plant (1-12)
   - **Harvest Months**: When to harvest (1-12)
   - **Water Need**: Low (1), Medium (2), High (3)
   - **Sun Need**: Low (1), Medium (2), High (3)
   - **Growth Duration**: Weeks from planting to harvest
   - **Spacing**: Centimeters between plants
   - **Plant Family**: Botanical family for rotation planning
   - **Season**: Primary growing season
   - **Succession Interval**: Weeks between successive plantings
   - **Companion Plants**: Plants that grow well together
   - **Incompatible Plants**: Plants to avoid nearby

### Editing Plants
1. Click the **"Edit"** button on any plant card
2. Modify the information in the expanded editor
3. Click **"Save"** to confirm changes or **"Cancel"** to discard
4. **Note**: Changing a plant name will update all existing plantings

### Deleting Plants
1. Click the **"Delete"** button on any plant card
2. Confirm the deletion when prompted
3. **Warning**: This will remove the plant from all garden plantings

---

## Garden View

### Grid Configuration
- **Grid Size Controls**: Set the width and height of your garden grid
- **Week Navigation**: Use Previous/Next buttons or direct week input (1-52)
- **Current Week Display**: Shows which week you're currently viewing/editing

### Editor and Debug Modes
- **Editor Checkbox**: Toggle to show/hide editing tools
  - Checked: Full editing interface with bed/slot management
  - Unchecked: Clean view showing only garden map and available plants
- **Debug Checkbox**: Toggle development information
  - Shows bed names and slot numbers in each grid cell
  - Displays position and size information for beds and slots

### Creating Beds
1. Ensure **Editor** mode is enabled
2. Click **"Draw Bed"** button
3. Click and drag on the grid to create a rectangular bed
4. Enter a name for the bed when prompted
5. Bed boundaries will appear with bold borders

### Managing Beds
- **Edit Name**: Click the bed name to edit it inline
- **Delete Bed**: Click the "Delete" button next to the bed name
- **Visual Indicators**: Bed names appear in the upper-left corner of each bed

### Creating Slots
1. Select a bed from the **"Select Bed"** dropdown
2. Click **"Draw Slot"** button
3. Click and drag within the selected bed to create a slot
4. Slots are automatically numbered sequentially within each bed
5. Slot boundaries appear with bold borders

### Managing Slots
- **Delete Slot**: Click the "Delete" button next to the slot in the management panel
- **Visual Indicators**: Slot numbers appear in the bottom-right corner when in Debug mode

### Temporal Planting System

#### Planting Plants
1. **Select Current Week**: Use navigation controls to set the planting week
2. **Drag and Drop**: Drag a plant from the "Available Plants" section onto:
   - **Slot**: Plants entire slot with the selected plant
   - **Individual Cell**: Plants only that specific grid cell
3. **Automatic Calculation**: Planting period is calculated automatically:
   - Start Week = Current Week
   - End Week = Start Week + Plant's Growth Duration - 1

#### Planting Rules and Constraints
- **Overlap Prevention**: Cannot plant in slots that already have active plantings
- **Conflict Detection**: Clear error messages when attempting overlapping plantings
- **Realistic Periods**: Planting periods respect actual plant growth times
- **Visual Feedback**: Green highlighting shows successfully planted areas

#### Removing Plants
- **Right-click** on any planted cell to remove the plant
- **Slot-wide Removal**: Right-clicking in a slot removes plants from the entire slot
- **Individual Removal**: Right-clicking on non-slot cells removes only that cell

#### Visual Indicators
- **Green Cells**: Show areas with active plantings for the current week
- **Bold Borders**: Mark bed and slot boundaries (not internal cell divisions)
- **Plant Display**: Shows plant emoji and name in planted areas
- **Empty Cells**: Available for planting (light background)

---

## Timeline View

### Grid Layout
- **Rows**: Represent weeks of the year (1-52)
- **Columns**: Represent individual slots in your garden
- **Headers**: Show week numbers with approximate dates and slot information

### Viewing Planting Schedules
- **Plant Visualization**: Active plantings show plant emoji and name
- **Period Boundaries**: Thick borders mark start and end of planting periods
- **Green Background**: Indicates planted periods
- **Hover Information**: Detailed tooltips show planting period and plant details

### Interactive Planting
1. **Select Plant**: Choose a plant from the dropdown menu
2. **Click to Plant**: Click any timeline cell to plant starting at that week
3. **Click to Remove**: Click existing plantings to remove them
4. **Automatic Periods**: Growth duration automatically calculated
5. **Conflict Prevention**: System prevents overlapping plantings with error messages

### Timeline Features
- **Scrollable Interface**: Horizontal and vertical scrolling for large gardens
- **Week Navigation**: Easy identification of specific time periods
- **Slot Comparison**: Compare planting schedules across all garden slots
- **Annual Overview**: See complete year-long garden planning at a glance

---

## Storage & Data Management

### Exporting Data

#### Complete Garden Setup (JSON)
1. Select **"Complete Garden Setup (JSON)"** from Export Format
2. Click **"Export Garden Setup (JSON)"** button
3. File downloads with your garden name and timestamp
4. **Includes**: Garden layout, beds, slots, plantings, plant library, current week
5. **Format**: Complete JSON structure suitable for full garden backup

#### Plants Database (CSV)
1. Select **"Plants Database (CSV)"** from Export Format
2. Click **"Export Plants Database (CSV)"** button
3. File downloads as "plants_database.csv"
4. **Includes**: Only plant library data in spreadsheet format
5. **Use Case**: Sharing plant collections or importing into other applications

### Importing Data

#### JSON Data Import (Garden Setup or Plants)
1. Select **"Garden Setup or Plants (JSON)"** from Import Format
2. **Upload File**: Use file browser to select .json file, OR
3. **Paste Data**: Copy and paste JSON data into text area
4. Click **"Import JSON Data"** button

**Smart Import Detection**:
- **Complete Garden Setup**: JSON with "garden" and "plants" properties replaces entire garden
- **Plant-Only Database**: JSON with only "plants" array adds plants to existing library
- **Automatic Detection**: System determines import type based on JSON structure

#### Plants Database (CSV)
1. Select **"Plants Database (CSV)"** from Import Format
2. **Upload File**: Use file browser to select .csv file, OR
3. **Paste Data**: Copy and paste CSV data (with headers) into text area
4. Click **"Import Plants Database (CSV)"** button
5. **Note**: This adds plants to your existing library

### Garden Maintenance

#### Clear All Plant Assignments
For starting fresh planting seasons or cleaning up experimental gardens:

1. Navigate to the **"Garden Maintenance"** section
2. Click the **"🧹 Clear All Plant Assignments"** button
3. **Confirmation Required**: System will prompt to confirm this destructive action
4. **Structure Preservation**: This removes all plantings but keeps your garden layout:
   - ✅ **Preserved**: Garden grid size, beds, slots, and plant library
   - ❌ **Removed**: All temporal plantings across all weeks
5. **Use Cases**: 
   - Start planning for a new growing season
   - Clean up after experimental garden designs
   - Reset garden state while keeping infrastructure

**⚠️ Important**: This action cannot be undone. Export your garden setup before clearing if you want to preserve your planting history.

### Data Safety
- **Backup Recommendation**: Export your garden before importing new data or clearing plantings
- **Validation**: System checks data format and shows clear error messages
- **Success Confirmation**: Clear feedback when operations complete successfully
- **Destructive Actions**: Garden maintenance operations require explicit confirmation

### Current Data Summary
The bottom panel shows your current garden statistics:
- Garden name and grid size
- Number of beds and slots
- Plant library count
- Current week setting

### Using Plant Databases
**Hungarian Plants Database**: The application includes a comprehensive database of 20 common Hungarian plants with local names and growing information optimized for Central European conditions.

**Example Import Workflow**:
1. Download or locate the `hungarian_plants_database.json` file
2. Go to Storage → Import Data
3. Select "Garden Setup or Plants (JSON)"
4. Upload the file or paste the JSON content
5. Click "Import JSON Data"
6. All 20 Hungarian plants will be added to your library

**Plant Database Benefits**:
- Local plant names and varieties
- Climate-appropriate planting and harvest schedules
- Companion planting recommendations
- Realistic growth durations for Hungarian conditions

---

## Tips and Best Practices

### Garden Planning
1. **Start with Beds**: Create logical bed divisions before adding slots
2. **Use Meaningful Names**: Name beds by location or purpose (e.g., "Sunny Border", "Herb Garden")
3. **Plan Slot Sizes**: Consider mature plant size when creating slots
4. **Check Growth Duration**: Verify plant growth periods before planting

### Temporal Planning
1. **Succession Planting**: Use Timeline View to plan multiple harvests
2. **Crop Rotation**: Plan different plant families in rotation
3. **Seasonal Awareness**: Consider your local growing season
4. **Companion Planting**: Use plant compatibility information

### Data Management
1. **Regular Backups**: Export your garden setup regularly
2. **Version Control**: Use descriptive filenames with dates
3. **Share Libraries**: Export plant databases to share with others
4. **Import Gradually**: Test imports with copies of your data first
5. **Garden Maintenance**: Use Clear All Plant Assignments for fresh starts while preserving garden structure

### Interface Usage
1. **Editor Mode**: Turn off for clean presentation views
2. **Debug Mode**: Use for troubleshooting slot positions
3. **Week Navigation**: Use direct input for quick jumps to specific weeks
4. **Timeline Overview**: Use for annual planning and conflict detection

---

## Troubleshooting

### Common Issues

#### "Cannot plant here - overlaps with existing planting period"
- **Cause**: Trying to plant in a slot that already has an active planting
- **Solution**: Choose a different week or remove existing planting first
- **Check**: Use Timeline View to see all existing plantings

#### Plants not visible in Garden View
- **Cause**: Current week is outside the plant's growing period
- **Solution**: Navigate to a week within the plant's growth period
- **Check**: Verify the planting start and end weeks

#### Cannot see all editing controls
- **Cause**: Editor mode is disabled
- **Solution**: Check the "Editor" checkbox in Garden View
- **Alternative**: Some controls may be scrolled out of view

#### Accidentally cleared all plantings
- **Cause**: Used "Clear All Plant Assignments" function
- **Solution**: Restore from exported garden backup if available
- **Prevention**: Always export garden setup before using maintenance functions
- **Note**: Garden structure (beds, slots, plant library) remains intact

#### Import fails with "Invalid garden setup format"
- **Cause**: JSON data has incorrect structure for complete garden import
- **Solution**: For complete garden setup, ensure JSON has both "garden" and "plants" properties
- **Alternative**: Use plant-only JSON format with just "plants" array for library import
- **Check**: Validate JSON format using online JSON validators
- **Note**: System automatically detects and handles both complete and plant-only JSON formats

#### Bed/slot boundaries not showing correctly
- **Cause**: Drawing outside valid grid area or overlapping existing areas
- **Solution**: Ensure drawing stays within grid bounds and doesn't overlap
- **Check**: Use Debug mode to see exact positions

### Performance Tips
1. **Large Gardens**: Use reasonable grid sizes for better performance
2. **Many Plants**: Consider organizing plant library with good naming
3. **Timeline Scrolling**: Use keyboard navigation for faster timeline browsing
4. **Data Size**: Large plant libraries may slow CSV operations

### Browser Compatibility
- Modern browsers with JavaScript enabled
- File download/upload capabilities required for Storage features
- Local storage for temporary data retention

---

## Support and Feedback

This application is designed to be intuitive and user-friendly. If you encounter issues not covered in this guide:

1. Check the browser console for error messages
2. Ensure you're using a modern, supported browser
3. Try refreshing the page to reset the application state
4. Export your data before troubleshooting to prevent data loss

For the best experience, we recommend:
- Chrome, Firefox, Safari, or Edge (latest versions)
- Screen resolution of 1024x768 or higher
- JavaScript and local storage enabled

---

*Happy gardening! 🌱*

