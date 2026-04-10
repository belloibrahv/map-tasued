// TASUED Campus Navigation Constants

export const CAMPUS_CONFIG = {
  // Campus center coordinates (approximate)
  CENTER_LAT: 6.8505,
  CENTER_LNG: 3.3575,
  
  // Default map zoom level
  DEFAULT_ZOOM: 16,
  
  // Walking speed (meters per minute)
  WALKING_SPEED: 80,
  
  // Map bounds (approximate campus area)
  BOUNDS: {
    NORTH: 6.8520,
    SOUTH: 6.8490,
    EAST: 3.3590,
    WEST: 3.3560
  }
}

export const UI_CONFIG = {
  // Sidebar width
  SIDEBAR_WIDTH: 320,
  
  // Mobile breakpoint
  MOBILE_BREAKPOINT: 768,
  
  // Animation durations
  ANIMATION_DURATION: 300,
  
  // Map marker sizes
  MARKER_SIZE: {
    DEFAULT: 25,
    SELECTED: 35,
    USER: 20
  }
}

export const API_ENDPOINTS = {
  LOCATIONS: '/api/locations',
  ROUTE: '/api/route'
}

export const CONTACT_INFO = {
  PHONE: '+234 (0) 39 243 688',
  EMAIL: 'info@tasued.edu.ng',
  WEBSITE: 'www.tasued.edu.ng',
  ADDRESS: 'Ijagun, Ijebu-Ode, Ogun State, Nigeria'
}

export const UNIVERSITY_INFO = {
  FULL_NAME: 'Tai Solarin University of Education',
  SHORT_NAME: 'TASUED',
  ESTABLISHED: 2005,
  STUDENT_POPULATION: '15,000+',
  CAMPUS_AREA: '2.5 km²',
  MOTTO: 'Excellence in Education'
}