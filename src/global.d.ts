declare global {
  interface Window {
    eventBus: {
      subscribe: (type: string, callback: (event: { payload: any }) => void) => () => void;
      emit: (type: string, payload: any) => void;
    };
  }
}