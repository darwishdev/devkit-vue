import type { FormKitSchemaNode } from "@formkit/core";
import type {
  StringUnknownRecord,
  AuthLoginProviderCallbackRequest,
  AuthLoginProviderRequest,
  AuthLoginProviderResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthResetPasswordEmailRequest,
  AuthResetPasswordEmailResponse,
  AuthResetPasswordRequest,
  AuthResetPasswordResponse,
  BucketCreateUpdateRequest,
  BucketCreateUpdateResponse,
  BucketListRequest,
  BucketListResponse,
  DeleteRequest,
  FileUploadUrlFindRequest,
  FileUploadUrlFindResponse,
  GalleryListRequest,
  GalleryListResponse,
} from "./api_types";
import type { RouteLocationRaw } from "vue-router";
import { ApiEndpoint } from "@devkit/apiclient";
export type CacheOptions = {
  cacheKey: string;
  bypassCache?: boolean;
  cacheTimeout?: number;
};

export type FilePreview = { value: string; src: string };
export type AuthHandler<TApi extends Record<string, Function>> = {
  login: ApiEndpoint<TApi, AuthLoginRequest, AuthLoginResponse>;
  allowedProviders?: string[];
  providerLogin?: ApiEndpoint<
    TApi,
    AuthLoginProviderRequest,
    AuthLoginProviderResponse
  >;
  redirectRoute?: string;
  providerLoginCallback?: ApiEndpoint<
    TApi,
    AuthLoginProviderCallbackRequest,
    AuthLoginResponse
  >;
  resetPasswordEmail?: ApiEndpoint<
    TApi,
    AuthResetPasswordEmailRequest,
    AuthResetPasswordEmailResponse
  >;
  resetPassword?: ApiEndpoint<
    TApi,
    AuthResetPasswordRequest,
    AuthResetPasswordResponse
  >;
};

export type FilesHandler<TApi extends Record<string, Function>> = {
  bucketList: ApiEndpoint<TApi, BucketListRequest, BucketListResponse>;
  fileUploadUrlFind: ApiEndpoint<
    TApi,
    FileUploadUrlFindRequest,
    FileUploadUrlFindResponse
  >;
  galleryListEndpoint: ApiEndpoint<
    TApi,
    GalleryListRequest,
    GalleryListResponse
  >;
  defauleBucketName?: string;
  bucketCreateUpdate?: ApiEndpoint<
    TApi,
    BucketCreateUpdateRequest,
    BucketCreateUpdateResponse
  >;
  fileDelete?: ApiEndpoint<TApi, DeleteRequest<"records", string, "bulk">, any>;
  fileDeleteByBucket?: ApiEndpoint<
    TApi,
    { records: string[]; bucketName: string },
    any
  >;
  bucketDelete?: ApiEndpoint<
    TApi,
    DeleteRequest<"records", string, "bulk">,
    any
  >;
};
export type DevkitFormConfig<TApi extends Record<string, Function>> = {
  apiClient: TApi;
  filesHandler?: FilesHandler<TApi>;
  authHandler?: AuthHandler<TApi>;
};

export type AppFormSections<TFormRequest> = Record<
  string,
  | AppFormSection<TFormRequest>
  | (FormKitSchemaNode & { name: keyof TFormRequest })[]
>;
export type AppFormProps<
  TApi extends Record<string, Function>,
  TFormRequest extends StringUnknownRecord = StringUnknownRecord,
  TApiRequest extends StringUnknownRecord = StringUnknownRecord,
  TApiResponse extends StringUnknownRecord = StringUnknownRecord,
  TFindRequestPropName extends string = "recordId",
  TFindResponsePropName extends string = "request",
  TFindCallbakResponse = unknown,
  TCallbakResponse = unknown,
> = {
  context: {
    title: string;
    formKey: string;
    useClear?: boolean;
    usePresist?: boolean;
    useReset?: boolean;
    resetOnSuccess?: boolean;
    syncWithUrl?: boolean;
    isLazy?: boolean;
    invalidateCachesOnChage?: string[];
    invalidateCaches?: string[];
    options?: AppFormOptions;
    submitHandler: SubmitHandler<
      TApi,
      TFormRequest,
      TApiRequest,
      TApiResponse,
      TCallbakResponse
    >;
    findHandler?: FindHandler<
      TApi,
      TFormRequest,
      TFindRequestPropName,
      TFindResponsePropName,
      TFindCallbakResponse
    >;
    sections: AppFormSections<TFormRequest>;
  };
};
export type SubmitHandlerFn<TApiRequest, TApiResponse> = (
  req: TApiRequest,
) => Promise<TApiResponse>;
export type SubmitHandler<
  TApi extends Record<string, Function>,
  TFormRequest extends StringUnknownRecord = StringUnknownRecord,
  TApiRequest extends StringUnknownRecord = TFormRequest,
  TApiResponse extends StringUnknownRecord = StringUnknownRecord,
  TCallbakResponse = unknown,
> = {
  endpoint: ApiEndpoint<TApi, TApiRequest, TApiResponse>;
  hideActions?: boolean;
  mapFunction?: (formReq: TFormRequest) => TApiRequest;
  callback?: (formResp: TApiResponse) => TCallbakResponse;
  redirectRoute?: string | RouteLocationRaw;
};

export type FindHandlerEndpointFn<TFindPropName extends string, TReq> = (
  req: Record<TFindPropName, unknown>,
) => TReq;
export type FindHandlerEndpoint<TFindPropName extends string, TReq> =
  | FindHandlerEndpointFn<TFindPropName, TReq>
  | string;

export type FindHandler<
  TApi extends Record<string, Function>,
  TFormRequest extends StringUnknownRecord,
  TFindRequestPropName extends string = "recordId",
  TFindResponsePropName extends string = "request",
  TFindCallbakResponse = unknown,
> = {
  endpoint: ApiEndpoint<
    TApi,
    Record<TFindRequestPropName, unknown>,
    Record<TFindResponsePropName, TFormRequest>
  >;
  requestPropertyName: TFindRequestPropName;
  responsePropertyName: TFindResponsePropName;
  requestValue?: unknown;
  routerParamName?: string;
  callback?: TFindResponsePropName extends string
    ? (
        formResp: Record<TFindResponsePropName, TFormRequest>,
      ) => TFindCallbakResponse
    : (formResp: TFormRequest) => TFindCallbakResponse;
};

export type AppFormSection<TFormRequest = StringUnknownRecord> = {
  inputs: (FormKitSchemaNode & { name: keyof TFormRequest })[];
  isTitleHidden?: boolean;
  isTransparent?: boolean;
};

export type AppFormOptions = {
  isBulkCreateHidden?: boolean;
  isHeaderSubmitHidden?: boolean;
  successMessageSummary?: string;
  successMessageDetail?: string;
  isSuccessNotificationHidden?: boolean;
  isFormTransparent?: boolean;
};

export type GridConfig = {
  columns: number;
  gridType?: "grid" | "columns" | "flex";
  gap?: number;
  smColumns?: number;
  mdColumns?: number;
  lgColumns?: number;
  xlColumns?: number;
};
