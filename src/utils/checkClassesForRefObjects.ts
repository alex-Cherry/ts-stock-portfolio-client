import { RefObject, MutableRefObject } from 'react';

export type ElementRef<T extends HTMLElement> = RefObject<T> | MutableRefObject<T> | T;

/**
 * Returns a Boolean value, indicating whether an element has the specified class name.
 * 
 * @param ref - the reference to the element
 * @param {string} name - the class name to check
 */
export const containsClass = <T extends HTMLElement>(arg: ElementRef<T>, name: string): boolean => {

  let result = false;

  if (arg instanceof HTMLElement) {
    result = arg.classList.contains(name);

  // Else "arg" contains a ref.
  //  Check whether the ref is initialized
  } else if (arg.current) {
    result = arg.current.classList.contains(name);

  }
  return result;
}

/**
 * 
 * Adds a class name to an element.
 * 
 * @param ref - the reference to the element
 * @param name - the class name to add
 */
export const setClass = <T extends HTMLElement>(arg: ElementRef<T>, name: string): void => {

  if (containsClass(arg, name) || !name.trim()) {
    return;
  }

  if (arg instanceof HTMLElement) {
    arg.classList.add(name);

  // Else "arg" contains a ref.
  //  Check whether the ref is initialized
  } else if (arg.current) {
    arg.current.classList.add(name);

  }
}

/**
 * 
 * Removes a class name from an element.
 * 
 * @param ref - the reference to the element
 * @param name - the class name to delete
 */
export const removeClass = <T extends HTMLElement>(arg: ElementRef<T>, name: string): void => {

  if (!containsClass(arg, name) || !name.trim()) {
    return;
  }

  if (arg instanceof HTMLElement) {
    arg.classList.remove(name);

  // Else "arg" contains a ref.
  //  Check whether the ref is initialized
  } else if (arg.current) {
    arg.current.classList.remove(name);

  }
}
