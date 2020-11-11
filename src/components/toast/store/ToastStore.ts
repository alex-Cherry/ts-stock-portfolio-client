import { Toast, ToastCallback } from './types';

class ToastStore {

  // The data of the store
  private data: {
    isContainerActivated: boolean,
    toasts: Toast[];
  }
  // The field stores callbacks that must be executed
  //  when data in the store changes
  private subscriptions: Set<ToastCallback>;


  // Constructor
  constructor() {
    this.subscriptions = new Set();
    this.data = {
      isContainerActivated: false,
      toasts: []
    };
  }

  
  /**
   * The function adds a callback to the subscriptions
   * 
   * @param callback - the added callback
   */
  subscribe(callback: any): void {
    this.subscriptions.add(callback)
  }
  /**
   * The function removes a callback from the subscriptions
   * 
   * @param callback - the being removed callback
   */
  unsubscribe(callback: any): void {
    this.subscriptions.delete(callback)
  }


  /**
   * => addToast()
   * 
   * The function adds the toast to the store
   * 
   * @param toast - the new toast
   */
  addToast(toast: Toast) {
    this.data.toasts.push(toast);
    this.subscriptions.forEach(callback => callback(this.data.toasts));
  }

  /**
   * => removeToast()
   * 
   * The function removes the toast from the store
   *  by the specified id
   * 
   * @param id - id of the toast to remove
   */
  removeToast(id: string) {
    const idx = this.data.toasts.findIndex(toast => id === toast.id);
    if (idx !== -1) {
      this.data.toasts.splice(idx, 1);
    }
    this.subscriptions.forEach(callback => callback(this.data.toasts));
  }

  /**
   * => getIsContainerActivated()
   */
  getIsContainerActivated(): boolean {
    return this.data.isContainerActivated;
  }

  /**
   * => setIsContainerActivated()
   */
  setIsContainerActivated(value: boolean): void {
    this.data.isContainerActivated = value;
  }

}

// Create the new store
const store = new ToastStore();

export { store };
