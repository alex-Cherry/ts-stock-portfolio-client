import { RefObject, MutableRefObject } from 'react';

export type ElementRef<T extends HTMLElement> = RefObject<T> | MutableRefObject<T>;

export const containsClass = <T extends HTMLElement>(ref: ElementRef<T>, name: string) => {
  return ref.current?.classList.contains(name);
}

export const setClass = <T extends HTMLElement>(ref: ElementRef<T>, name: string) => {
  if (!containsClass(ref, name)) {
    ref.current?.classList.add(name);
  }
}

export const removeClass = <T extends HTMLElement>(ref: ElementRef<T>, name: string) => {
  if (containsClass(ref, name)) {
    ref.current?.classList.remove(name);
  }
}
