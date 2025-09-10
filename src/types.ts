export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
}

export interface Booking {
  id: string;
  facility: string;
  date: string;
  userId: string;
}

declare global {
  interface Window {
    eventBus: {
      subscribe: (type: string, callback: (event: { payload: User }) => void) => () => void;
      emit: (type: string, payload: any) => void;
    };
  }
}
