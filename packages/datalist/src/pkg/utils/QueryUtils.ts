import { StringUnknownRecord } from "@devkitvue/config";

const parseURI = () => {
  const [currentPath, currentQueryString] = history.state.current.split("?");
  const currentQueryParams = new URLSearchParams(currentQueryString || "");
  return { currentPath, currentQueryParams };
};
const pushState = (currentPath: string, params: URLSearchParams) => {
  const newParamsString = params.toString();
  const updatedUrl = `${currentPath}?${newParamsString}`;
  const state = { ...history.state };
  state.current = updatedUrl;
  history.pushState(state, "", updatedUrl);
};

export const RouteQueryAppend = (key: string, value: StringUnknownRecord) => {
  const { currentPath, currentQueryParams } = parseURI();
  currentQueryParams.set(key, value.toString());
  pushState(currentPath, currentQueryParams);
};

/**
 * Remove specified parameters from the current URL's query string and update the browser's history.
 *
 */
export const RouteQueryRemove = (paramName: string) => {
  const { currentPath, currentQueryParams } = parseURI();
  // if (!currentQueryParams.has(paramName)) return
  currentQueryParams.delete(paramName);
  pushState(currentPath, currentQueryParams);
  return currentQueryParams;
};
export const RouteQueryFind = (queryKey: string): string | null => {
  const { currentQueryParams } = parseURI();
  console.log("cuirreeen params", currentQueryParams);
  return currentQueryParams.get(queryKey);
};

