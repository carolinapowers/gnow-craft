import { reactive, readonly, computed } from 'vue';

export interface Booking {
  id: string;
  courseName: string;
  date: string;
  time: string;
  players: number;
  playerName: string;
  email: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

// Private reactive state
const state = reactive<BookingState>({
  bookings: [],
  isLoading: false,
  error: null
});

/**
 * Simple store pattern for managing bookings
 * This demonstrates state management without Pinia
 * In the interview, you might be asked to implement something similar
 */
export const bookingStore = {
  // Expose readonly state to prevent external mutations
  state: readonly(state),
  
  // Computed getters
  getBookingCount: computed(() => state.bookings.length),
  
  getConfirmedBookings: computed(() => 
    state.bookings.filter(b => b.status === 'confirmed')
  ),
  
  getUpcomingBookings: computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.bookings.filter(b => b.date >= today && b.status !== 'cancelled');
  }),
  
  // Actions
  addBooking(booking: Omit<Booking, 'id' | 'status'>) {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };
    
    state.bookings.push(newBooking);
    
    // Simulate API call to confirm booking
    setTimeout(() => {
      this.confirmBooking(newBooking.id);
    }, 2000);
    
    return newBooking;
  },
  
  confirmBooking(id: string) {
    const booking = state.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'confirmed';
    }
  },
  
  cancelBooking(id: string) {
    const booking = state.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = 'cancelled';
    }
  },
  
  removeBooking(id: string) {
    const index = state.bookings.findIndex(b => b.id === id);
    if (index > -1) {
      state.bookings.splice(index, 1);
    }
  },
  
  getBookingById(id: string) {
    return state.bookings.find(b => b.id === id);
  },
  
  // Simulate loading bookings from API
  async loadBookings() {
    state.isLoading = true;
    state.error = null;
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      state.bookings = [
        {
          id: 'booking-1',
          courseName: 'Pebble Beach',
          date: '2024-09-15',
          time: '08:00',
          players: 4,
          playerName: 'John Doe',
          email: 'john@example.com',
          status: 'confirmed'
        },
        {
          id: 'booking-2',
          courseName: 'Augusta National',
          date: '2024-09-20',
          time: '14:30',
          players: 2,
          playerName: 'Jane Smith',
          email: 'jane@example.com',
          status: 'pending'
        }
      ];
    } catch (error) {
      state.error = 'Failed to load bookings';
      console.error('Error loading bookings:', error);
    } finally {
      state.isLoading = false;
    }
  },
  
  clearAll() {
    state.bookings = [];
    state.error = null;
  }
};

// Example usage in a component:
// import { bookingStore } from '@/stores/bookingStore';
// 
// const { state } = bookingStore;
// const bookingCount = bookingStore.getBookingCount;
// 
// const handleNewBooking = (data) => {
//   bookingStore.addBooking(data);
// };