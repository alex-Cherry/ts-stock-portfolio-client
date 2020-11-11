import { useRef, useCallback } from 'react';

type SimpleRefType = string | number | boolean | {};

/**
 * => useValueRef()
 */
function useValueRef<T extends SimpleRefType>(value: T): [T, (arg: T) => void] {

  const ref = useRef<T>(value);
  const setValue = useCallback((arg: T) => {
    ref.current = arg;
  }, []);

  return [ ref.current, setValue ];
}

export {
  useValueRef
};
