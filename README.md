# TASUED Campus Navigator

A modern web-based navigation system for Tai Solarin University of Education (TASUED) campus, built with Next.js and implementing Dijkstra's algorithm for optimal pathfinding.

## Features

- **Interactive Campus Map**: Explore the TASUED campus with an interactive map powered by OpenStreetMap
- **Smart Route Planning**: Find the shortest path between any two locations using Dijkstra's algorithm
- **Location Search**: Search for buildings, facilities, and points of interest
- **Real-time Navigation**: Get walking directions with distance and time estimates
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **User Location**: Detect and use your current location for navigation

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Maps**: React Leaflet with OpenStreetMap tiles
- **Icons**: Lucide React
- **Algorithm**: Custom Dijkstra's implementation for pathfinding

## Campus Locations

The system includes 21 major campus locations:

### Academic Buildings
- COSIT (Science Complex)
- Alex Onabanjo Petrochemical Complex
- COVTED Building
- CENVOS Office Complex
- COHUM Building
- COSPED Building
- COSMAS Building

### Administrative Buildings
- University Block
- Senate Building
- ETF Building
- Admission Office

### Facilities
- University Auditorium
- ICT Centre
- Lecture Theatre
- Auto-Mechanical Laboratory
- University Clinic
- Language Laboratory

### Entrances
- University Main Gate

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tasued-campus-navigator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Select Starting Point**: Choose your starting location from the dropdown or search
2. **Select Destination**: Choose where you want to go
3. **View Route**: The system will calculate and display the optimal path
4. **Follow Directions**: Use the step-by-step directions to navigate

## Algorithm Implementation

The navigation system uses Dijkstra's algorithm to find the shortest path between locations. The algorithm considers:

- **Distance**: Physical distance between locations in meters
- **Walking Time**: Estimated time to walk between locations
- **Path Optimization**: Finds the most efficient route through campus

## Research Foundation

This project is based on the research paper "Determination of the Shortest Path of a Nigerian University Map Using Dijkstra's Algorithm" (AICTTRA, 2017) by Usman Opeyemi Lateef et al.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, contact:
- Email: info@tasued.edu.ng
- Phone: +234 (0) 39 243 688
- Address: Ijagun, Ijebu-Ode, Ogun State, Nigeria