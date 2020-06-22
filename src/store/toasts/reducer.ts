import {
  ToastsState,
  ToastsActions,
  ToastsActionTypes,
  Toast
} from './types';

const initialState: ToastsState = {
  toasts: []
}

export default function toastsReducer(state: ToastsState = initialState, action: ToastsActions): ToastsState {

  switch (action.type) {
    case ToastsActionTypes.TOAST_ADD:
      
      const toast: Toast = action.payload;
      const toasts1 = [ ...state.toasts ];
      toasts1.push(toast);

      return {
        ...state,
        toasts: toasts1
      };

    case ToastsActionTypes.TOAST_REMOVE:

      const id: string = action.payload;
      const toasts2 = state.toasts.filter(item => item.id !== id);

      return {
        ...state,
        toasts: toasts2
      };

    default:
      return state;
  }

}
