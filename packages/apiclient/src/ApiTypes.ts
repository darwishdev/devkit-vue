export type StringUnknownRecord = Record<string, unknown>;
export type EndpointFunction<
  TReq extends Record<string, unknown> = {},
  TResp extends Record<string, unknown> = {},
> = (req: TReq) => Promise<TResp>;

export { Code, ConnectError, type Interceptor } from "@connectrpc/connect";
export type ApiEndpoint<
  TApi extends Record<string, Function>,
  TReq extends Record<string, unknown> = {},
  TResp extends Record<string, unknown> = {},
> = keyof TApi | EndpointFunction<TReq, TResp> | Promise<TResp>;
