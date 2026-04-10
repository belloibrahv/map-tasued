export interface CampusLocation {
  id: number
  name: string
  shortName: string
  description: string
  coordinates: [number, number] // [latitude, longitude]
  category: 'academic' | 'administrative' | 'facility' | 'entrance'
  icon: string
  color: string
}

export interface Route {
  from: number
  to: number
  distance: number // in meters
  walkingTime: number // in minutes
}

// TASUED Campus Locations based on the research paper
export const campusLocations: CampusLocation[] = [
  {
    id: 1,
    name: "University Main Gate",
    shortName: "Main Gate",
    description: "Primary entrance to TASUED campus",
    coordinates: [6.8496, 3.3569], // Approximate coordinates for TASUED
    category: 'entrance',
    icon: 'gate',
    color: '#ef4444'
  },
  {
    id: 2,
    name: "COSIT (Science Complex)",
    shortName: "COSIT",
    description: "College of Science and Information Technology",
    coordinates: [6.8501, 3.3574],
    category: 'academic',
    icon: 'building',
    color: '#3b82f6'
  },
  {
    id: 3,
    name: "Alex Onabanjo Petrochemical Complex",
    shortName: "PETCHEM",
    description: "Petrochemical Engineering Complex",
    coordinates: [6.8498, 3.3571],
    category: 'academic',
    icon: 'factory',
    color: '#8b5cf6'
  },
  {
    id: 4,
    name: "CEPEP Building",
    shortName: "CEPEP",
    description: "Centre for Educational Planning and Evaluation",
    coordinates: [6.8493, 3.3566],
    category: 'administrative',
    icon: 'building-2',
    color: '#f59e0b'
  },
  {
    id: 5,
    name: "OGD Hall",
    shortName: "OGD Hall",
    description: "Ogun State Government Hall",
    coordinates: [6.8495, 3.3568],
    category: 'facility',
    icon: 'presentation',
    color: '#10b981'
  },
  {
    id: 6,
    name: "University Auditorium",
    shortName: "Auditorium",
    description: "Main university auditorium for events",
    coordinates: [6.8497, 3.3570],
    category: 'facility',
    icon: 'theater',
    color: '#f97316'
  },
  {
    id: 7,
    name: "University Block",
    shortName: "Uni Block",
    description: "Central administrative block",
    coordinates: [6.8499, 3.3572],
    category: 'administrative',
    icon: 'building',
    color: '#6366f1'
  },
  {
    id: 8,
    name: "COVTED Building",
    shortName: "COVTED",
    description: "College of Vocational and Technical Education",
    coordinates: [6.8500, 3.3573],
    category: 'academic',
    icon: 'wrench',
    color: '#ec4899'
  },
  {
    id: 9,
    name: "CENVOS Office Complex",
    shortName: "CENVOS",
    description: "Centre for Environmental Studies",
    coordinates: [6.8502, 3.3575],
    category: 'academic',
    icon: 'leaf',
    color: '#22c55e'
  },
  {
    id: 10,
    name: "Senate Building",
    shortName: "Senate",
    description: "University Senate and administrative offices",
    coordinates: [6.8503, 3.3576],
    category: 'administrative',
    icon: 'landmark',
    color: '#dc2626'
  },
  {
    id: 11,
    name: "ICT Centre",
    shortName: "ICT Centre",
    description: "Information and Communication Technology Centre",
    coordinates: [6.8504, 3.3577],
    category: 'facility',
    icon: 'computer',
    color: '#0ea5e9'
  },
  {
    id: 12,
    name: "Lecture Theatre",
    shortName: "Lecture Theatre",
    description: "Main lecture theatre complex",
    coordinates: [6.8505, 3.3578],
    category: 'academic',
    icon: 'presentation',
    color: '#7c3aed'
  },
  {
    id: 13,
    name: "School of Postgraduate Studies",
    shortName: "Postgraduate",
    description: "Postgraduate studies administration",
    coordinates: [6.8506, 3.3579],
    category: 'academic',
    icon: 'graduation-cap',
    color: '#059669'
  },
  {
    id: 14,
    name: "ETF Building",
    shortName: "ETF",
    description: "Education Trust Fund Building",
    coordinates: [6.8507, 3.3580],
    category: 'administrative',
    icon: 'banknote',
    color: '#d97706'
  },
  {
    id: 15,
    name: "COHUM Building",
    shortName: "COHUM",
    description: "College of Humanities",
    coordinates: [6.8508, 3.3581],
    category: 'academic',
    icon: 'book-open',
    color: '#be185d'
  },
  {
    id: 16,
    name: "Adebutu Keshington Auto-Mechanical Laboratory",
    shortName: "Auto-Mech Lab",
    description: "Automotive and Mechanical Engineering Laboratory",
    coordinates: [6.8509, 3.3582],
    category: 'facility',
    icon: 'car',
    color: '#7c2d12'
  },
  {
    id: 17,
    name: "Admission Office",
    shortName: "Admission",
    description: "Student admission and registration office",
    coordinates: [6.8510, 3.3583],
    category: 'administrative',
    icon: 'file-text',
    color: '#1d4ed8'
  },
  {
    id: 18,
    name: "COSPED Building",
    shortName: "COSPED",
    description: "College of Specialized and Professional Education",
    coordinates: [6.8511, 3.3584],
    category: 'academic',
    icon: 'users',
    color: '#9333ea'
  },
  {
    id: 19,
    name: "University Clinic",
    shortName: "Clinic",
    description: "Campus medical facility",
    coordinates: [6.8512, 3.3585],
    category: 'facility',
    icon: 'heart-pulse',
    color: '#dc2626'
  },
  {
    id: 20,
    name: "Language Laboratory",
    shortName: "Language Lab",
    description: "Foreign language learning facility",
    coordinates: [6.8513, 3.3586],
    category: 'facility',
    icon: 'languages',
    color: '#0891b2'
  },
  {
    id: 21,
    name: "COSMAS Building",
    shortName: "COSMAS",
    description: "College of Science, Mathematics and Statistics",
    coordinates: [6.8514, 3.3587],
    category: 'academic',
    icon: 'calculator',
    color: '#16a34a'
  }
]

// Routes based on the research paper's adjacency data
export const campusRoutes: Route[] = [
  { from: 1, to: 2, distance: 27, walkingTime: 0.3 },
  { from: 1, to: 3, distance: 25, walkingTime: 0.3 },
  { from: 2, to: 3, distance: 12, walkingTime: 0.1 },
  { from: 1, to: 4, distance: 50, walkingTime: 0.6 },
  { from: 3, to: 4, distance: 75, walkingTime: 0.9 },
  { from: 3, to: 5, distance: 45, walkingTime: 0.5 },
  { from: 4, to: 5, distance: 132, walkingTime: 1.6 },
  { from: 5, to: 6, distance: 91, walkingTime: 1.1 },
  { from: 6, to: 7, distance: 70, walkingTime: 0.8 },
  { from: 3, to: 8, distance: 29, walkingTime: 0.3 },
  { from: 7, to: 8, distance: 85, walkingTime: 1.0 },
  { from: 2, to: 9, distance: 18, walkingTime: 0.2 },
  { from: 3, to: 9, distance: 20, walkingTime: 0.2 },
  { from: 8, to: 9, distance: 110, walkingTime: 1.3 },
  { from: 8, to: 10, distance: 125, walkingTime: 1.5 },
  { from: 9, to: 10, distance: 20, walkingTime: 0.2 },
  { from: 8, to: 11, distance: 50, walkingTime: 0.6 },
  { from: 10, to: 11, distance: 76, walkingTime: 0.9 },
  { from: 6, to: 12, distance: 50, walkingTime: 0.6 },
  { from: 7, to: 12, distance: 35, walkingTime: 0.4 },
  { from: 11, to: 12, distance: 43, walkingTime: 0.5 },
  { from: 11, to: 13, distance: 90, walkingTime: 1.1 },
  { from: 12, to: 13, distance: 77, walkingTime: 0.9 },
  { from: 10, to: 14, distance: 20, walkingTime: 0.2 },
  { from: 13, to: 14, distance: 6, walkingTime: 0.1 },
  { from: 10, to: 15, distance: 27, walkingTime: 0.3 },
  { from: 14, to: 15, distance: 32, walkingTime: 0.4 },
  { from: 13, to: 16, distance: 45, walkingTime: 0.5 },
  { from: 15, to: 16, distance: 26, walkingTime: 0.3 },
  { from: 12, to: 17, distance: 40, walkingTime: 0.5 },
  { from: 13, to: 17, distance: 55, walkingTime: 0.7 },
  { from: 16, to: 17, distance: 100, walkingTime: 1.2 },
  { from: 17, to: 18, distance: 70, walkingTime: 0.8 },
  { from: 16, to: 19, distance: 18, walkingTime: 0.2 },
  { from: 18, to: 19, distance: 40, walkingTime: 0.5 },
  { from: 15, to: 20, distance: 37, walkingTime: 0.4 },
  { from: 19, to: 20, distance: 48, walkingTime: 0.6 },
  { from: 18, to: 21, distance: 55, walkingTime: 0.7 },
  { from: 19, to: 21, distance: 50, walkingTime: 0.6 },
  { from: 20, to: 21, distance: 27, walkingTime: 0.3 }
]

// Create adjacency list for pathfinding
export function createAdjacencyList(): Map<number, Array<{to: number, distance: number, time: number}>> {
  const adjacencyList = new Map<number, Array<{to: number, distance: number, time: number}>>()
  
  // Initialize all nodes
  campusLocations.forEach(location => {
    adjacencyList.set(location.id, [])
  })
  
  // Add bidirectional edges
  campusRoutes.forEach(route => {
    adjacencyList.get(route.from)?.push({
      to: route.to,
      distance: route.distance,
      time: route.walkingTime
    })
    adjacencyList.get(route.to)?.push({
      to: route.from,
      distance: route.distance,
      time: route.walkingTime
    })
  })
  
  return adjacencyList
}