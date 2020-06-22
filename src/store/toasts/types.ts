
export enum ToastsActionTypes {
  TOAST_ADD = 'TOAST_ADD',
  TOAST_REMOVE = 'TOAST_REMOVE'
}

export type ToastWithoutId = {
  caption?: string,
  text: string
}

export type Toast = ToastWithoutId &{
  id: string
};

export interface ToastsState {
  toasts: Toast[]
}

export interface ToastAddAction {
  type: ToastsActionTypes.TOAST_ADD,
  payload: Toast
}

export interface ToastRemoveAction {
  type: ToastsActionTypes.TOAST_REMOVE,
  payload: string
}

export type ToastsActions = ToastAddAction
  & ToastRemoveAction;
