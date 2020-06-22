import { v4 as uuidv4 } from 'uuid';

// import types
import {
  Toast,
  ToastWithoutId,
  ToastsActionTypes,
  ToastAddAction,
  ToastRemoveAction
} from './types';

// ADD TOAST
export const addToast = (
  toast: ToastWithoutId
): ToastAddAction => {

  const newToast: Toast = { ...toast, id: uuidv4()};

  return {
    type: ToastsActionTypes.TOAST_ADD,
    payload: newToast
  }
}

export const removeToast = (
  id: string
): ToastRemoveAction => {
  return {
    type: ToastsActionTypes.TOAST_REMOVE,
    payload: id
  }
}
