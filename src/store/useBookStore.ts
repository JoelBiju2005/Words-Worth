import { create } from 'zustand';
import type { BookStore, BookState, CameraState, WindowState } from '../types';

export const useBookStore = create<BookStore>((set, get) => ({
  cameraState: 'wide',
  setCameraState: (state: CameraState) => set({ cameraState: state }),

  bookState: 'closed',
  setBookState: (state: BookState) => set({ bookState: state }),

  windowState: 'closed',
  setWindowState: (state: WindowState) => set({ windowState: state }),

  currentPage: 0,
  totalPages: 9,
  isFlipping: false,
  flipDirection: null,

  setIsFlipping: (flipping: boolean, direction = null) =>
    set({ isFlipping: flipping, flipDirection: direction }),

  nextPage: () => {
    const { isFlipping, currentPage, totalPages, bookState } = get();
    if (isFlipping || bookState !== 'open' || currentPage >= totalPages - 1) return;
    set({ isFlipping: true, flipDirection: 'next' });
  },

  prevPage: () => {
    const { isFlipping, currentPage, bookState } = get();
    if (isFlipping || bookState !== 'open' || currentPage <= 0) return;
    set({ isFlipping: true, flipDirection: 'prev' });
  },

  goToPage: (pageIndex: number) => {
    const { isFlipping, currentPage, totalPages, bookState } = get();
    if (
      isFlipping ||
      bookState !== 'open' ||
      pageIndex === currentPage ||
      pageIndex < 0 ||
      pageIndex >= totalPages
    )
      return;
    // Direct rapid bookmark jump: jump directly
    set({ currentPage: pageIndex });
  },

  soundOn: false,
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),

  candleIntensity: 1.0,
  setCandleIntensity: (val: number) => set({ candleIntensity: val }),

  sitAtDesk: () => {
    const { bookState } = get();
    if (bookState === 'closed') {
      set({ cameraState: 'seated' });
    }
  },

  standUp: () => {
    const { bookState } = get();
    if (bookState === 'closed') {
      set({ cameraState: 'wide' });
    }
  },

  openBook: () => {
    const { bookState } = get();
    if (bookState === 'closed') {
      set({ bookState: 'opening' });
    }
  },

  closeBook: () => {
    const { bookState } = get();
    if (bookState === 'open') {
      // Return back to seated desk level view
      set({ cameraState: 'seated', bookState: 'closing' });
    }
  },

  openWindow: () => {
    const { cameraState, bookState, windowState } = get();
    if (cameraState === 'wide' && bookState === 'closed' && windowState === 'closed') {
      set({ cameraState: 'window' });
    }
  },

  closeWindow: () => {
    const { windowState } = get();
    if (windowState === 'open' || windowState === 'opening') {
      set({ windowState: 'closing' });
    }
  },
}));
