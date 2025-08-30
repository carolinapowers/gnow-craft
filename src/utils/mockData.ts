export interface TeeTime {
  id: string
  courseName: string
  courseImage: string
  time: string
  date: string
  price: number
  originalPrice?: number
  players: number
  holes: number
  isHotDeal: boolean
  rating: number
  reviews: number
  amenities: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  distance: string
}

export interface Course {
  id: string
  name: string
  location: string
  rating: number
  image: string
}

const courseNames = [
  'Pebble Beach Golf Links',
  'Augusta National Golf Club',
  'St. Andrews Links',
  'Pinehurst Resort',
  'TPC Sawgrass',
  'Bethpage Black',
  'Torrey Pines',
  'Whistling Straits',
  'Kiawah Island Ocean Course',
  'Bandon Dunes'
]

const amenities = [
  'Cart Included',
  'Range Balls',
  'GPS Cart',
  'Caddie Available',
  'Pro Shop',
  'Restaurant',
  'Practice Green',
  'Club Rental'
]

export function generateMockTeeTimes(): TeeTime[] {
  const teeTimes: TeeTime[] = []
  const today = new Date()
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today)
    date.setDate(date.getDate() + dayOffset)
    const dateStr = date.toISOString().split('T')[0]
    
    for (let hour = 6; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (Math.random() > 0.3) { // 70% availability
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          const basePrice = 50 + Math.floor(Math.random() * 200)
          const isHotDeal = Math.random() > 0.8
          
          teeTimes.push({
            id: `${dateStr}-${timeStr}-${Math.random().toString(36).substr(2, 9)}`,
            courseName: courseNames[Math.floor(Math.random() * courseNames.length)],
            courseImage: `https://picsum.photos/seed/${Math.random()}/400/300`,
            time: timeStr,
            date: dateStr,
            price: isHotDeal ? Math.floor(basePrice * 0.7) : basePrice,
            originalPrice: isHotDeal ? basePrice : undefined,
            players: Math.floor(Math.random() * 4) + 1,
            holes: Math.random() > 0.5 ? 18 : 9,
            isHotDeal,
            rating: 3.5 + Math.random() * 1.5,
            reviews: Math.floor(Math.random() * 500) + 50,
            amenities: amenities.filter(() => Math.random() > 0.5).slice(0, 4),
            difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard',
            distance: `${Math.floor(Math.random() * 20) + 1} miles`
          })
        }
      }
    }
  }
  
  return teeTimes
}

export function generateMockCourses(): Course[] {
  return courseNames.map((name, index) => ({
    id: `course-${index}`,
    name,
    location: `Location ${index + 1}`,
    rating: 3.5 + Math.random() * 1.5,
    image: `https://picsum.photos/seed/${index}/400/300`
  }))
}