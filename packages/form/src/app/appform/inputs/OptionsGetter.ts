import type { DBDropdownOptions } from "@/pkg/database/DbTypes";
import { resolveApiEndpoint, StringUnknownRecord } from "@devkit/apiclient";
import { db, DropdownContext } from "@/index";
import { CacheOptions } from "@/pkg/types/types";
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
    if (Array.isArray(options)) return resolve(options);
    resolveApiEndpoint<TApi, TOptionsReq, TOptionsResp>(
      options,
      apiClient,
      request,
    )
      .then((response) => {
        console.log("fetching from api", response);
        if (optionsMapper) {
          return resolve(optionsMapper(response));
        }
        if (Array.isArray(response)) {
          return resolve(response);
        }
        console.log("Asdasdasd", responseOptionsKey);
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
    (fetchParams: OptionGetterParams<TApi, TOptionsReq, TOptionsResp>) =>
      fetchDropdownOptions(fetchParams),
    300, // 300ms debounce delay
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
    console.log("fetching from db");
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
