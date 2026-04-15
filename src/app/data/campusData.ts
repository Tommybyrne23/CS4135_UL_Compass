// Mock data for UL Campus buildings and rooms
export interface Room {
  id: string;
  name: string;
  building: string;
  buildingFullName: string;
  type: string;
  capacity: number;
  floor: string;
  amenities: string[];
  openingHours: string;
  software?: string[];
  coordinates: { lat: number; lng: number };
}

export interface Building {
  id: string;
  name: string;
  fullName: string;
  type: string;
  coordinates: { lat: number; lng: number };
  description: string;
}

export const buildings: Building[] = [
  {
    id: "CS",
    name: "CSIS",
    fullName: "Computer Science and Information Systems Building",
    type: "Academic",
    coordinates: { lat: 52.673891718601624, lng: -8.575582023281457 },
    description: "Home to the Department of Computer Science and Information Systems",
  },
  {
    id: "KB",
    name: "Kemmy Business School",
    fullName: "Kemmy Business School",
    type: "Academic",
    coordinates: { lat: 52.67259549077003, lng: -8.576767559681779 },
    description: "UL's leading business education facility",
  },
  {
    id: "ER",
    name: "Engineering Research",
    fullName: "Engineering Research Building",
    type: "Academic",
    coordinates: { lat: 52.67504464508122, lng: -8.572743491121834 },
    description: "State-of-the-art engineering research facilities",
  },
  {
    id: "F",
    name: "Foundation",
    fullName: "Foundation Building",
    type: "Academic",
    coordinates: { lat: 52.674260753404866, lng: -8.573226288727376 },
    description: "Central academic building with lecture halls",
  },
  {
    id: "LC",
    name: "Library",
    fullName: "Glucksman Library",
    type: "Library",
    coordinates: { lat: 52.67330842247622, lng: -8.573307724422852 },
    description: "Main campus library and study space",
  },
  {
    id: "SG",
    name: "Stables",
    fullName: "Stables Complex",
    type: "Student Services",
    coordinates: { lat: 52.673062838212054, lng: -8.570872278676017 },
    description: "Student center with cafes and services",
  },
  {
    id: "PE",
    name: "Sports Arena",
    fullName: "UL Sports Arena",
    type: "Sports",
    coordinates: { lat: 52.67338974147296, lng: -8.565317423900703 },
    description: "Indoor sports and fitness facilities",
  },
  {
    id: "IB",
    name: "Irish World Academy",
    fullName: "Irish World Academy of Music and Dance",
    type: "Academic",
    coordinates: { lat: 52.67811736738278, lng: -8.569456072316742 },
    description: "Music and performing arts building",
  },
];

export const rooms: Room[] = [
  {
    id: "CS3004-a",
    name: "CS3004-a",
    building: "CSIS",
    buildingFullName: "Computer Science and Information Systems Building",
    type: "Lecture Hall",
    capacity: 120,
    floor: "3rd Floor",
    amenities: ["Projector", "Whiteboard", "Power outlets", "Air conditioning"],
    openingHours: "8:00 AM - 10:00 PM",
    software: ["Visual Studio", "IntelliJ IDEA", "Python", "MATLAB"],
    coordinates: { lat: 52.6738, lng: -8.5739 },
  },
  {
    id: "CS2011",
    name: "CS2011",
    building: "CSIS",
    buildingFullName: "Computer Science and Information Systems Building",
    type: "Computer Lab",
    capacity: 40,
    floor: "2nd Floor",
    amenities: ["40 Workstations", "Printer", "Scanner", "Water refill station"],
    openingHours: "8:00 AM - 10:00 PM",
    software: ["Microsoft Office", "Visual Studio", "Eclipse", "Git"],
    coordinates: { lat: 52.6738, lng: -8.5739 },
  },
  {
    id: "KB118",
    name: "KB118",
    building: "KB",
    buildingFullName: "Kemmy Business School",
    type: "Lecture Hall",
    capacity: 200,
    floor: "1st Floor",
    amenities: ["Audio system", "Projector", "Whiteboard", "Accessible seating"],
    openingHours: "8:00 AM - 9:00 PM",
    coordinates: { lat: 52.6745, lng: -8.5745 },
  },
  {
    id: "ER2-011",
    name: "ER2-011",
    building: "ER",
    buildingFullName: "Engineering Research Building",
    type: "Research Lab",
    capacity: 25,
    floor: "2nd Floor",
    amenities: ["Lab equipment", "Safety shower", "Fume hoods", "Emergency exits"],
    openingHours: "7:00 AM - 11:00 PM",
    software: ["AutoCAD", "SolidWorks", "ANSYS"],
    coordinates: { lat: 52.6735, lng: -8.5735 },
  },
  {
    id: "A1-050",
    name: "A1-050",
    building: "F",
    buildingFullName: "Foundation Building",
    type: "Lecture Hall",
    capacity: 150,
    floor: "Ground Floor",
    amenities: ["Projector", "Audio system", "Wheelchair access", "Recording equipment"],
    openingHours: "8:00 AM - 9:00 PM",
    coordinates: { lat: 52.6742, lng: -8.5742 },
  },
  {
    id: "LC-G01",
    name: "LC-G01",
    building: "LC",
    buildingFullName: "Glucksman Library",
    type: "Study Room",
    capacity: 8,
    floor: "Ground Floor",
    amenities: ["Whiteboard", "Smart TV", "Bookable", "Quiet space"],
    openingHours: "24/7 during term",
    coordinates: { lat: 52.6740, lng: -8.5740 },
  },
  {
    id: "CS1015",
    name: "CS1015",
    building: "CSIS",
    buildingFullName: "Computer Science and Information Systems Building",
    type: "Tutorial Room",
    capacity: 30,
    floor: "1st Floor",
    amenities: ["Interactive whiteboard", "Tables", "Chairs", "Natural lighting"],
    openingHours: "8:00 AM - 10:00 PM",
    coordinates: { lat: 52.6738, lng: -8.5739 },
  },
  {
    id: "KB201",
    name: "KB201",
    building: "KB",
    buildingFullName: "Kemmy Business School",
    type: "Seminar Room",
    capacity: 50,
    floor: "2nd Floor",
    amenities: ["Projector", "Sound system", "Climate control", "Ergonomic seating"],
    openingHours: "8:00 AM - 9:00 PM",
    coordinates: { lat: 52.6745, lng: -8.5745 },
  },
  {
    id: "ER1-023",
    name: "ER1-023",
    building: "ER",
    buildingFullName: "Engineering Research Building",
    type: "Computer Lab",
    capacity: 35,
    floor: "1st Floor",
    amenities: ["35 Workstations", "3D Printer", "Plotter", "Water refill station"],
    openingHours: "8:00 AM - 10:00 PM",
    software: ["MATLAB", "Python", "AutoCAD", "SolidWorks"],
    coordinates: { lat: 52.6735, lng: -8.5735 },
  },
  {
    id: "A2-110",
    name: "A2-110",
    building: "F",
    buildingFullName: "Foundation Building",
    type: "Lecture Hall",
    capacity: 100,
    floor: "2nd Floor",
    amenities: ["Projector", "Whiteboard", "Audio system", "Tiered seating"],
    openingHours: "8:00 AM - 9:00 PM",
    coordinates: { lat: 52.6742, lng: -8.5742 },
  },
];

export const services = [
  {
    id: "stables-cafe",
    name: "Stables Cafe",
    type: "Cafe",
    building: "SG",
    openingHours: "8:00 AM - 6:00 PM",
    coordinates: { lat: 52.6748, lng: -8.5748 },
  },
  {
    id: "courtyard-cafe",
    name: "Courtyard Cafe",
    type: "Cafe",
    building: "KB",
    openingHours: "8:00 AM - 5:00 PM",
    coordinates: { lat: 52.6745, lng: -8.5745 },
  },
  {
    id: "library-cafe",
    name: "Library Cafe",
    type: "Cafe",
    building: "LC",
    openingHours: "7:30 AM - 11:00 PM",
    coordinates: { lat: 52.6740, lng: -8.5740 },
  },
  {
    id: "sports-arena",
    name: "UL Sports Arena",
    type: "Sports Facility",
    building: "PE",
    openingHours: "6:00 AM - 11:00 PM",
    coordinates: { lat: 52.6730, lng: -8.5730 },
  },
];

export function searchRooms(query: string): Room[] {
  const lowerQuery = query.toLowerCase();
  return rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(lowerQuery) ||
      room.building.toLowerCase().includes(lowerQuery) ||
      room.buildingFullName.toLowerCase().includes(lowerQuery) ||
      room.type.toLowerCase().includes(lowerQuery)
  );
}

export function searchBuildings(query: string): Building[] {
  const lowerQuery = query.toLowerCase();
  return buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(lowerQuery) ||
      building.fullName.toLowerCase().includes(lowerQuery) ||
      building.type.toLowerCase().includes(lowerQuery)
  );
}

export function getRoomById(id: string): Room | undefined {
  return rooms.find((room) => room.id === id);
}

export function getBuildingById(id: string): Building | undefined {
  return buildings.find((building) => building.id === id);
}

export function getRoomsByBuilding(buildingId: string): Room[] {
  return rooms.filter((room) => room.building === buildingId);
}

// Simple route calculation (mock implementation)
export function calculateRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): { distance: number; duration: number; steps: string[] } {
  // Mock route calculation - in production, this would use actual pathfinding
  const distance = Math.sqrt(
    Math.pow(to.lat - from.lat, 2) + Math.pow(to.lng - from.lng, 2)
  ) * 1000; // Convert to approximate meters
  
  const duration = Math.ceil(distance / 80); // Assume 80m/min walking speed
  
  return {
    distance: Math.round(distance),
    duration,
    steps: [
      "Start at current location",
      "Head towards the main pathway",
      "Continue straight past the Living Bridge",
      "Turn right at the main courtyard",
      "Destination will be on your left",
    ],
  };
}
