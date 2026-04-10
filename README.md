# TASUED Campus Navigator

A comprehensive campus navigation system for Tai Solarin University of Education (TASUED) built with Next.js, featuring interactive maps, route planning, and advanced voice navigation capabilities.

## 🌟 Features

### 🗺️ Interactive Campus Map
- Explore all 21 campus locations with detailed information
- Interactive Leaflet-based mapping with custom markers
- Real-time location tracking and GPS integration
- Zoom and pan controls with mobile-optimized touch gestures

### 🧭 Smart Route Planning
- Find optimal paths between any two locations using Dijkstra's algorithm
- Multiple route options with distance and time estimates
- Step-by-step turn-by-turn directions
- Route sharing and quick route suggestions

### 🎤 Voice Navigation (Phase 1 Complete)
- **Speech Synthesis**: Natural voice announcements for route instructions
- **Voice Controls**: Start, pause, resume, stop, repeat, and skip instructions
- **Route Overviews**: Hear complete route summaries before starting
- **Safety Warnings**: Contextual safety reminders for specific locations
- **Landmark Information**: Audio descriptions of nearby landmarks and buildings
- **Emergency Stop**: Immediate voice navigation termination

### 📱 Mobile-First Design
- 100% responsive design for all device sizes (iPhone SE to iPad Pro)
- Touch-optimized controls and gestures
- Bottom sheet navigation for mobile devices
- Floating panels for desktop and tablet interfaces
- Smart adaptive UI that responds to screen size changes

### 🎨 Modern UI/UX
- Glass morphism design system with backdrop blur effects
- Smooth animations and micro-interactions
- Professional gradient system and color schemes
- Dark/light theme support with system preference detection
- Accessibility-compliant design patterns

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **Maps**: Leaflet.js for interactive mapping
- **Routing**: Custom Dijkstra algorithm implementation
- **Voice**: Web Speech API for voice navigation
- **UI Components**: Custom component library with modern design
- **State Management**: React hooks and context
- **Build Tools**: Webpack, PostCSS, ESLint

## 📍 Campus Locations (21 Total)

### 🎓 Academic Buildings (8)
- **COSIT** - College of Science and Information Technology
- **COVTED** - College of Vocational and Technical Education  
- **COHUM** - College of Humanities
- **COSPED** - College of Specialized and Professional Education
- **COSMAS** - College of Science, Mathematics and Statistics
- **Lecture Theatre** - Main lecture theatre complex
- **Postgraduate** - School of Postgraduate Studies
- **Petrochemical Complex** - Alex Onabanjo Petrochemical Complex

### 🏢 Administrative Buildings (5)
- **Main Gate** - University main entrance
- **Senate** - Senate Building and administrative offices
- **ETF** - Education Trust Fund Building
- **CEPEP** - Centre for Educational Planning and Evaluation
- **University Block** - Central administrative block
- **Admission** - Student admission and registration office

### 🏗️ Facilities (7)
- **ICT Centre** - Information and Communication Technology Centre
- **Auditorium** - University main auditorium
- **Clinic** - Campus medical facility
- **Language Lab** - Foreign language learning facility
- **OGD Hall** - Ogun State Government Hall
- **Auto-Mech Lab** - Adebutu Keshington Auto-Mechanical Laboratory
- **CENVOS** - Centre for Environmental Studies

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/belloibrahv/map-tasued.git
cd map-tasued
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🎤 Voice Navigation Usage

### Getting Started with Voice Navigation

1. **Select Starting Point**: Click any numbered marker (1-21) on the map
2. **Choose Destination**: Click a different numbered marker to set your destination
3. **View Route**: The system calculates and displays the optimal route
4. **Start Voice Navigation**: Click the "Start Voice Navigation" button in the route panel
5. **Listen to Instructions**: Hear route overview and turn-by-turn directions
6. **Use Voice Controls**: Manage playback with pause, resume, repeat, skip, and stop buttons

### Voice Features

- **Route Overview**: "Route from Main Gate to COSIT, the Science Complex. The route is 127 meters and will take approximately 2 minutes with 3 intermediate stops."
- **Turn Instructions**: "Continue to COSIT, the Science Complex. Watch for pedestrian traffic."
- **Approach Warnings**: "You are approaching COSIT, the Science Complex."
- **Arrival Confirmation**: "You have arrived at COSIT, the Science Complex. Navigation complete."

### Voice Controls

| Control | Function |
|---------|----------|
| ▶️ **Start** | Begin voice navigation |
| ⏸️ **Pause** | Pause current instruction |
| ▶️ **Resume** | Resume paused navigation |
| ⏹️ **Stop** | End voice navigation |
| 🔄 **Repeat** | Repeat last instruction |
| ⏭️ **Skip** | Skip to next instruction |
| 🚨 **Emergency Stop** | Immediate termination |

## 🗺️ Route Planning Features

### Pathfinding Algorithm
- **Dijkstra's Algorithm**: Guarantees shortest path between any two locations
- **Bidirectional Edges**: Routes work in both directions
- **Real Distance Data**: Based on actual campus measurements
- **Walking Time Estimates**: Calculated at average walking speed

### Route Information
- **Distance**: Precise measurements in meters
- **Walking Time**: Estimated time in minutes
- **Number of Stops**: Intermediate waypoints
- **Step-by-Step Path**: Complete route breakdown

### Popular Routes
- **Main Gate → COSIT**: 127m, 2 minutes
- **Main Gate → Senate**: 203m, 3 minutes  
- **ETF → COSMAS**: 187m, 2 minutes
- **COSIT → Clinic**: 245m, 3 minutes

## 📱 Mobile Experience

### Responsive Breakpoints
- **Mobile**: < 768px (iPhone SE to iPhone Pro Max)
- **Tablet**: 768px - 1024px (iPad, Android tablets)
- **Desktop**: > 1024px (Laptops, desktops)

### Mobile-Specific Features
- **Bottom Sheet Navigation**: Swipe-up panels for navigation options
- **Touch-Optimized Controls**: Large touch targets and gesture support
- **Adaptive Typography**: Font sizes adjust to screen size
- **Mobile Quick Actions**: Streamlined interface for small screens

### Tablet Features
- **Floating Panels**: Side panels for navigation and search
- **Multi-Column Layouts**: Efficient use of screen real estate
- **Enhanced Touch Targets**: Optimized for finger navigation

## 🎨 UI/UX Design System

### Design Principles
- **Glass Morphism**: Translucent panels with backdrop blur
- **Micro-Interactions**: Smooth hover states and transitions
- **Accessibility First**: WCAG compliant color contrasts and keyboard navigation
- **Performance Optimized**: Lazy loading and efficient rendering

### Color System
- **Primary**: Blue gradient (#3b82f6 to #1d4ed8)
- **Success**: Green gradient (#10b981 to #059669)
- **Warning**: Yellow gradient (#f59e0b to #d97706)
- **Error**: Red gradient (#ef4444 to #dc2626)

### Typography
- **Headings**: Inter font family, bold weights
- **Body Text**: Inter font family, regular weights
- **Monospace**: JetBrains Mono for coordinates and technical data

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # Base UI components (buttons, cards, inputs)
│   ├── modern-ui/        # Advanced UI (floating panels, glass cards)
│   └── voice-navigation/ # Voice navigation components
├── lib/                  # Utility libraries and business logic
│   ├── voice/           # Voice navigation system
│   │   ├── types.ts     # TypeScript interfaces
│   │   ├── feature-flags.ts # Feature flag management
│   │   ├── speech-synthesizer.ts # Speech API wrapper
│   │   └── direction-narrator.ts # Instruction generation
│   ├── campus-data.ts   # Campus location and route data
│   ├── dijkstra.ts      # Route calculation algorithm
│   └── utils.ts         # Utility functions
├── public/              # Static assets
│   └── leaflet/         # Leaflet marker icons
└── .kiro/               # Kiro AI specifications
    └── specs/voice-navigation/ # Voice navigation spec files
```

### Key Components

#### Core Navigation
- **CampusMap**: Main interactive map with Leaflet integration
- **RoutePlanner**: Route selection and planning interface
- **LocationSearch**: Smart location search and filtering
- **AdvancedNavigation**: Turn-by-turn navigation display

#### Voice Navigation
- **VoiceController**: Main orchestration and state management
- **VoiceControlButtons**: UI controls for voice navigation
- **VoiceStatusIndicator**: Real-time status display
- **SpeechSynthesizer**: Web Speech API wrapper
- **DirectionNarrator**: Natural language instruction generation

#### Modern UI
- **NavigationHeader**: Main navigation bar with status indicators
- **FloatingPanel**: Desktop/tablet navigation panels
- **BottomSheet**: Mobile navigation interface
- **GlassCard**: Glass morphism card component
- **AnimatedButton**: Interactive button with animations

### Voice Navigation Architecture

#### Phase 1 (Complete)
- ✅ Core voice navigation components
- ✅ Speech synthesis integration
- ✅ Direction narrator with natural language
- ✅ Voice control UI components
- ✅ Integration with existing navigation system

#### Phase 2 (Planned)
- 🔄 Audio Manager for device handling
- 🔄 Voice Settings management
- 🔄 Enhanced voice control features
- 🔄 Background operation support

#### Phase 3 (Planned)
- 🔄 Accessibility and safety features
- 🔄 Enhanced instruction generation
- 🔄 Performance optimization
- 🔄 Comprehensive error handling

#### Phase 4 (Planned)
- 🔄 Advanced features and background operation
- 🔄 Service worker integration
- 🔄 Advanced audio features
- 🔄 Final integration and testing

### Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Testing Voice Navigation
# 1. Select ETF (location 14) as start
# 2. Select COSMAS (location 21) as destination  
# 3. Click "Start Voice Navigation"
# 4. Test voice controls
```

## 🌐 Browser Compatibility

### Recommended Browsers
- **Chrome 80+**: Full feature support including voice navigation
- **Firefox 75+**: Full feature support
- **Safari 13+**: Full feature support (iOS Safari supported)
- **Edge 80+**: Full feature support

### Voice Navigation Requirements
- **Speech Synthesis API**: Required for voice announcements
- **Audio Context**: Required for advanced audio features (Phase 2+)
- **Geolocation API**: Optional for GPS tracking

### Fallback Support
- **No Voice Support**: Visual-only navigation with full functionality
- **Older Browsers**: Graceful degradation with core features intact
- **Offline Mode**: Core navigation works without internet connection

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Test voice navigation features across browsers
- Update documentation for new features
- Follow the existing code style and patterns

### Voice Navigation Development
- Test speech synthesis across different browsers
- Ensure graceful fallback for unsupported browsers
- Validate instruction generation with real campus data
- Test voice controls with keyboard and screen readers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TASUED**: Campus layout and location data
- **Research Paper**: "Usmanpaper-AICTTRA2017.pdf" for campus route data
- **Leaflet**: Open-source mapping library
- **Next.js Team**: Amazing React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Web Speech API**: Browser voice synthesis capabilities

## 📞 Support & Contact

- **GitHub Issues**: [Create an issue](https://github.com/belloibrahv/map-tasued/issues)
- **Email**: [belloibrahv@gmail.com](mailto:belloibrahv@gmail.com)
- **Documentation**: Check the `/docs` folder for detailed guides

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Docker
```bash
docker build -t tasued-navigator .
docker run -p 3000:3000 tasued-navigator
```

---

**Built with ❤️ for the TASUED community**

*Empowering students and visitors with intelligent campus navigation*