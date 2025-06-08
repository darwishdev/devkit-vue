
// import type { ApiEndpoint, EndpointFunction, ExternalLink } from "@/pkg/types/types";
// /**
//  * Asserts if a value is a key of TApi.
//  * @param value - The value to check.
//  * @param apiClient - The API client object of type TApi.
//  * @returns True if the value is a key of TApi, otherwise false.
//  */
// export function isKeyOfApi<TApi extends Record<string, Function>>(
//   value: ApiEndpoint<TApi, any, any>,
// ): value is keyof TApi {
//   return typeof value === 'string';
// }

// /**
//  * Asserts if a value is an Endpoint.
//  * @param value - The value to check.
//  * @returns True if the value is an Endpoint (function), otherwise false.
//  */
// export function isEndpointFunction<
//   TReq extends Record<string, unknown> = {},
//   TResp extends Record<string, unknown> = {}
// >(value: ApiEndpoint<any, TReq, TResp>): value is EndpointFunction<TReq, TResp> {
//   return typeof value === 'function';
// }
// /**
//  * Asserts if a value is a Promise.
//  * @param value - The value to check.
//  * @returns True if the value is a Promise, otherwise false.
//  */
// export function isPromise<TResp extends Record<string, unknown>>(
//   value: unknown
// ): value is Promise<TResp> {
//   return value instanceof Promise;
// }

// /**
//  * Resolves an ApiEndpoint to a Promise.
//  * @param value - The value to resolve (keyof TApi, EndpointFunction, or Promise).
//  * @param apiClient - The API client object of type TApi.
//  * @param request - Optional request object to pass to the EndpointFunction.
//  * @returns A Promise resolving to the result.
//  * @throws Error if the value is not a valid ApiEndpoint.
//  */

