// import { ref, onBeforeUnmount } from "vue";

// /**
//  * Debounce a function so it's only called after `delay` ms have passed
//  * since the last invocation.
//  *
//  * @param fn - The function to debounce
//  * @param delay - The debounce delay in milliseconds
//  * @returns A debounced version of the function
//  */
// export function useDebounceFn<TArgs extends unkow[]>(
//   fn: (...args: TArgs) => void | Promise<void>,
//   delay = 200,
// ): (...args: TArgs) => void {
//   const timer = ref<ReturnType<typeof setTimeout> | null>(null);
//
//   const debouncedFn = (...args: TArgs) => {
//     if (timer.value) clearTimeout(timer.value);
//     timer.value = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   };
//
//   onBeforeUnmount(() => {
//     if (timer.value) clearTimeout(timer.value);
//   });
//
//   return debouncedFn;
// }
