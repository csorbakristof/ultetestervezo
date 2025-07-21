# Specification for the planting designer

This is the specification for an application which helps an individual to design their garden: the garden has predefined area (beds, rows) which can contain one plant at a time. The application helps to design the planting in terms of locations (what is planted and where) and the timing (when is something planted and what plants follow each other at the same location).

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

## Editing capabilities

Both the map view and the timeline view can be edited by choosing a plant and clicking on a cell of the grid.

In the map view, additional tools allow creating and naming the beds and the slots.

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

# Further functions of the application

The application allows saving and loading of garden setups to/from a file. The file format should be JSON.
