export type CameraState = 'wide' | 'seated' | 'zooming' | 'reading' | 'window';
export type BookState = 'closed' | 'opening' | 'open' | 'closing';
export type WindowState = 'closed' | 'opening' | 'open' | 'closing';

export interface RibbonTabInfo {
  index: number;
  numeral: string;
  color: string;
  label: string;
}

export interface BookStore {
  // Camera & book state machine
  cameraState: CameraState;
  setCameraState: (state: CameraState) => void;

  bookState: BookState;
  setBookState: (state: BookState) => void;

  // Window state machine
  windowState: WindowState;
  setWindowState: (state: WindowState) => void;

  // Pages
  currentPage: number;
  totalPages: number;
  isFlipping: boolean;
  flipDirection: 'next' | 'prev' | null;
  setIsFlipping: (flipping: boolean, direction?: 'next' | 'prev' | null) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (pageIndex: number) => void;

  // Audio toggle
  soundOn: boolean;
  toggleSound: () => void;

  // Candle light sync
  candleIntensity: number;
  setCandleIntensity: (val: number) => void;

  // High-level triggers
  openBook: () => void;
  closeBook: () => void;
  sitAtDesk: () => void;
  standUp: () => void;
  openWindow: () => void;
  closeWindow: () => void;
}
