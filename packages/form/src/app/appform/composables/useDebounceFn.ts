import { ref, onBeforeUnmount } from "vue";

/**
 * Debounce a function so it's only called after `delay` ms have passed
 * since the last invocation.
 *
 * @param fn - The function to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns A debounced version of the function
 */
export function useDebounceFn<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 200,
): T {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = ((...args: Parameters<T>) => {
    if (timer.value) clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      fn(...args);
    }, delay);
  }) as T;

  // Clean up if the component unmounts
  onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value);
  });

  return debouncedFn;
}
