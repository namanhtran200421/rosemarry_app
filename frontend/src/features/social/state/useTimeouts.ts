import { useCallback, useEffect, useRef } from "react";

/** Schedules callbacks that are cancelled automatically on unmount. */
export function useTimeouts() {
  const handles = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = handles.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  return useCallback((callback: () => void, delayMs: number) => {
    const handle = setTimeout(() => {
      handles.current.delete(handle);
      callback();
    }, delayMs);
    handles.current.add(handle);
  }, []);
}
