export type ToastAnimation =
  | 'Slide'
  | 'Zoom';

type UpdateToastsCallback = (toasts: Toast[]) => void;

// The type defines the callback types
//  that can be added to the subscriptions in the store
export type ToastCallback = 
  | UpdateToastsCallback;


// The extra options for toasts
//  
export type ToastOptions = {
  // Duration of a toast activity.
  // If the duration = 0, the toast is infinite,
  //  and the progress bar isn't added to a toast
  duration?: number,
  // Durtion of an enter-animation
  timeIn?: number,
  // Durtion of an exit-animation
  timeOut?: number,
  // 
  animation?: ToastAnimation
};


// 
export type Toast = {
  id: string,
  text: string,
  options: ToastOptions
};
