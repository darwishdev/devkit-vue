import { onBeforeUnmount } from "vue";

/**
 * Creates a memoized version of a pure function.
 *
 * @param fn - The function to memoize
 * @returns The memoized function
 */
export function useMemoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
): T {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;

  // Optional: Clear cache on component unmount
  onBeforeUnmount(() => {
    cache.clear();
  });

  return memoized;
}
