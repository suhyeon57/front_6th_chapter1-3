import { useState, useCallback } from "react";
import { shallowEquals } from "../equals";

export const useShallowState = <T>(initialValue: Parameters<typeof useState<T>>[0]) => {
  const [first, setFirst] = useState(initialValue);
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
