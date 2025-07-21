import { useState, useCallback } from "react";
import { shallowEquals } from "../equals";

export const useShallowState = <T>(initialValue: T) => {
  const [first, setFirst] = useState<T>(initialValue);
  const customSetState = useCallback((next: T) => {
    setFirst((prev) => {
      if (!shallowEquals(prev, next)) {
        return next;
      }
      return prev;
    });
  }, []);
  return [first, customSetState] as const;
};
