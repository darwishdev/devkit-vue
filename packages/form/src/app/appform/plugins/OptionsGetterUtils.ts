import type { DBDropdownOptions } from "@/pkg/database/DbTypes";
import { resolveApiEndpoint, StringUnknownRecord } from "@devkitvue/apiclient";
import { db, DropdownContext } from "@/index";
import { CacheOptions } from "@devkitvue/config";
import { useDebounceFn, useMemoize } from "@vueuse/core";

export type OptionGetterParams<
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TOptionsResp extends StringUnknownRecord,
> = Pick<
  DropdownContext<TApi, TOptionsReq, TOptionsResp>,
  "responseOptionsKey" | "optionsMapper" | "options" | "bypassCache"
> & {
  request?: TOptionsReq;
  apiClient?: TApi;
};
export const optionsErrorMessages = (key: string) => ({
  not_array: new Error(
    `The value of "${key}" in the API response is not an array.`,
  ),
  not_defined: new Error(`The key "${key}" is missing in the API response.`),
});
export const fetchDropdownOptions = <
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TOptionsResp extends StringUnknownRecord,
>({
  options,
  optionsMapper,
  apiClient,
  request = {} as TOptionsReq,
  responseOptionsKey = "options",
}: OptionGetterParams<TApi, TOptionsReq, TOptionsResp>) =>
  new Promise<DBDropdownOptions>((resolve, reject) => {
    if (!options) {
      console.log("error happebs", options);
      return resolve([]);
    }
    if (Array.isArray(options)) return resolve(options);
    resolveApiEndpoint<TApi, TOptionsReq, TOptionsResp>(
      options,
      apiClient,
      request,
    )
      .then((response) => {
        if (!response) {
          return resolve([]);
        }
        console.log("fetching from api", response);
        if (optionsMapper) {
          return resolve(optionsMapper(response));
        }
        if (Array.isArray(response)) {
          return resolve(response);
        }
        console.log(
          "Asdasdasd",
          responseOptionsKey,
          responseOptionsKey in response,
        );
        if (responseOptionsKey in response) {
          if (Array.isArray(response[responseOptionsKey])) {
            return resolve(response[responseOptionsKey]);
          }
          return reject(
            optionsErrorMessages(responseOptionsKey as string)["not_array"],
          );
        }
        return reject(
          optionsErrorMessages(responseOptionsKey as string)["not_defined"],
        );
      })
      .catch(reject);
  });
export const clearOptionsCache = (key: string) => {
  db.dropdownHelper.bulkDelete([key]);
};

export const useDebouncedOptionsFetcher = <
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TOptionsResp extends StringUnknownRecord,
>() => {
  const debouncedFetchOptions = useDebounceFn(
    (fetchParams: OptionGetterParams<TApi, TOptionsReq, TOptionsResp>) => {
      return fetchDropdownOptions(fetchParams);
    },
    300,
  );
  return debouncedFetchOptions;
};

export const fetchCachedDropdownOptions = <
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TOptionsResp extends StringUnknownRecord,
>(
  { cacheKey, cacheTimeout = 100000, bypassCache }: Partial<CacheOptions>,
  fetchParams: OptionGetterParams<TApi, TOptionsReq, TOptionsResp>,
) =>
  new Promise<DBDropdownOptions>((resolve, reject) => {
    console.log("fetching from db", cacheKey);
    if (!cacheKey || bypassCache) {
      console.log("fetch from api only");
      return fetchDropdownOptions(fetchParams).then(resolve).catch(reject);
    }
    db.dropdownHelper.find(cacheKey).then(async (options) => {
      if (options) {
        resolve(options);
        return;
      }
      const apiFetcher = useDebouncedOptionsFetcher<
        TApi,
        TOptionsReq,
        TOptionsResp
      >();
      apiFetcher(fetchParams)
        .then((apiOptions) => {
          console.log("apioptiosn", apiOptions);
          if (apiOptions.length) {
            db.dropdownHelper
              .create(cacheKey, apiOptions, cacheTimeout)
              .catch((err) =>
                console.warn("Failed to create cache entry", err),
              );
          }
          return resolve(apiOptions);
        })
        .catch(reject);
    });
  });
// Debounced version of fetchDropdownOptions
export const useMemoizedDropdownOptions = <
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TOptionsResp extends StringUnknownRecord,
>() => {
  const memoizedFetchOptions = useMemoize(
    (
      cacheKey: string | undefined,
      cacheTimeout: number,
      fetchParams: OptionGetterParams<TApi, TOptionsReq, TOptionsResp>,
    ) =>
      fetchCachedDropdownOptions(
        { cacheKey, cacheTimeout, bypassCache: fetchParams.bypassCache },
        fetchParams,
      ),
  );
  return memoizedFetchOptions;
};
