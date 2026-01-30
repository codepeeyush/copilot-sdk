import { useRef } from "react";

/**
 * Returns a ref that always contains the most recent value.
 * Useful for avoiding stale closures in callbacks passed to tools.
 *
 * @see Vercel React best practices: `advanced-use-latest`
 */
export function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
