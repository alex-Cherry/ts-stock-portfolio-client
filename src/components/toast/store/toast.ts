import { v4 as uuid } from 'uuid';
import { Toast, ToastOptions } from './types';
import { store } from './ToastStore';

/**
 * => toast()
 * 
 * The function adds the new toast to the global store
 * 
 * @param text - the text of the toast
 * @param options - the additional options for the toast.
 *    These options has more high priority that the properties obtained from the parent component
 */
const toast = (text: string, options?: ToastOptions) => {
  if (!store.getIsContainerActivated()) {
    throw new Error('No one container is activated!');
  }

  // Create a new toast
  const newToast: Toast = {
    id: uuid(),
    text,
    options: options || {}
  };
  // Add the new toast to the store
  store.addToast(newToast);
};

/**
 * => toast.remove()
 * 
 * Thee function removes the toast from the global store by its id
 * 
 * @param id - the id of the toast to remove
 */
toast.remove = (id: string) => {
  store.removeToast(id);
}

/**
 * => activateToastContainer()
 * 
 * The function sets the flag indicating a container is mounted in the system
 */
const activateToastContainer = () => {
  store.setIsContainerActivated(true);
}

export {
  toast,
  activateToastContainer
};
