import { RefObject, MutableRefObject } from 'react';

export type ElementRef<T extends HTMLElement> = RefObject<T> | MutableRefObject<T>;

/**
 * Returns a Boolean value, indicating whether an element has the specified class name.
 * 
 * @param ref - the reference to the element
 * @param {string} name - the class name to check
 */
export const containsClass = <T extends HTMLElement>(ref: ElementRef<T>, name: string): boolean => {
  // Check whether the ref is initialized
  if (!ref.current) {
    return false;
  }
  // 
  return ref.current.classList.contains(name);
}

/**
 * 
 * Adds a class name to an element.
 * 
 * @param ref - the reference to the element
 * @param name - the class name to add
 */
export const setClass = <T extends HTMLElement>(ref: ElementRef<T>, name: string): void => {
  // Check whether the ref is initialized
  if (!ref.current) {
    return;
  }
  // 
  if (!containsClass(ref, name)) {
    ref.current?.classList.add(name);
  }
}

/**
 * 
 * Removes a class name from an element.
 * 
 * @param ref - the reference to the element
 * @param name - the class name to delete
 */
export const removeClass = <T extends HTMLElement>(ref: ElementRef<T>, name: string): void => {
  // Check whether the ref is initialized
  if (!ref.current) {
    return;
  }
  // 
  if (containsClass(ref, name)) {
    ref.current?.classList.remove(name);
  }
}
