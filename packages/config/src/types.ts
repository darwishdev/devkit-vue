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
export type AppIconProps = {
  icon: string;
  size?: "small" | "medium" | "large";
  iconType?: "primevue" | "svg";
  useReset?: boolean;
  color?: string;
};
export type AppBtnProps = {
  action?: string | Function;
  route?: RouteLocationRaw;
  to?: string;
  command?: Function;
  label?: string;
  labelAr?: string;
  icon?: string | undefined;
  iconPos?: "left" | "right" | "top" | "bottom" | undefined;
  iconClass?: string | object | undefined;
  badge?: string | undefined;
  badgeClass?: string | object | undefined;
  badgeSeverity?:
    | "secondary"
    | "info"
    | "success"
    | "warn"
    | "danger"
    | "contrast"
    | null
    | undefined;
  loading?: boolean | undefined;
  loadingIcon?: string | undefined;
  as?: string | object | undefined;
  asChild?: boolean | undefined;
  disabled?: boolean;
  link?: boolean | undefined;
  severity?:
    | "secondary"
    | "success"
    | "info"
    | "warn"
    | "help"
    | "danger"
    | "contrast"
    | undefined;
  raised?: boolean | undefined;
  rounded?: boolean | undefined;
  text?: boolean | undefined;
  outlined?: boolean | undefined;
  size?: "small" | "large" | undefined;
  plain?: boolean | undefined;
  fluid?: boolean | undefined;
  dt?: any;
  pt?: any;
  key?: string;
  ptOptions?: any;
  unstyled?: boolean;
  variant?: "outlined" | "text" | "link";
} & Partial<AppIconProps>;

export type CacheOptions = {
  cacheKey: string;
  bypassCache?: boolean;
  cacheTimeout?: number;
};

export type FilePreview = { value: string; src: string };
export type ProviderLoginHandler<TApi extends Record<string, Function>> = {
  endpoint: ApiEndpoint<
    TApi,
    AuthLoginProviderRequest,
    AuthLoginProviderResponse
  >;
  callbackEndpoint: ApiEndpoint<
    TApi,
    AuthLoginProviderCallbackRequest,
    AuthLoginResponse
  >;
  callbackRoute: string;
};
export type ResetPasswordHandler<TApi extends Record<string, Function>> = {
  emailEndpoint: ApiEndpoint<
    TApi,
    AuthResetPasswordEmailRequest,
    AuthResetPasswordEmailResponse
  >;
  endpoint: ApiEndpoint<
    TApi,
    AuthResetPasswordRequest,
    AuthResetPasswordResponse
  >;
  emailRoute: string;
  emailRedirectRoute: string;
  route: string;
};
export type AuthHandler<TApi extends Record<string, Function>> = {
  login: ApiEndpoint<TApi, AuthLoginRequest, AuthLoginResponse>;
  allowedProviders?: string[];
  redirectRoute?: string;
  providerLoginCallbackRoute?: string;
  providerLogin?: ProviderLoginHandler<TApi>;
  resetPassword?: ResetPasswordHandler<TApi>;
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

export type GridConfig = {
  columns: number;
  gridType?: "grid" | "columns" | "flex";
  gap?: number;
  smColumns?: number;
  mdColumns?: number;
  lgColumns?: number;
  xlColumns?: number;
};
export type AppFormSection<TFormRequest = StringUnknownRecord> = {
  inputs: (FormKitSchemaNode & { name: keyof TFormRequest })[];
  gridConfig?: GridConfig;
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

export type DeleteRestoreVariant = AppBtnProps & {
  disabled: boolean;
  hasSelectedData: boolean;
  hasDeletedRecords: boolean;
  empty: string;
};
export type CreateHandler = {
  title: string;
  redirectRoute: string;
  routeName: string;
  endpoint: string;
  redirectRouteParamName?: string;
};

export type UpdateHandler = {
  title: string;
  redirectRoute: string;
  redirectRouteParamName?: string;
  routeName: string;
  endpoint: string;
  findEndpoint: string;
  findRequestProperty: string;
  findResponseProperty: string;
};

export type DeleteHandler = {
  endpoint: string;
  requestProperty: string;
};

export type ImportHandler = {
  endpoint: string;
  importTemplateLink: string;
};

export type ApiOptions = {
  title: string;
  description?: string;
  totalCount?: number;
  createHandler?: CreateHandler;
  updateHandler?: UpdateHandler;
  deleteRestoreHandler?: DeleteHandler;
  deleteHandler?: DeleteHandler;
  importHandler?: ImportHandler;
};

export type PaginationParams = {
  sortColumn?: string;
  sortFunction?: string;
  isDeleted?: boolean;
  pageSize?: number;
  pageNumber?: number;
};

export type DisplayType = "card" | "table" | "list";

export type FilterMatchModeValues =
  | "startsWith"
  | "contains"
  | "notContains"
  | "endsWith"
  | "equals"
  | "notEquals"
  | "in"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "between"
  | "dateIs"
  | "dateIsNot"
  | "dateBefore"
  | "dateAfter";
export type DatalistRequest = {
  filters?: Record<string, unknown>;
  paginationParams?: PaginationParams;
};
export type DataRouter<TRecord extends Record<string, unknown>> = {
  name: string;
  paramName: string;
  paramColumnName: keyof TRecord;
};

export type AvailableActions = {
  delete?: ActionButtonProps;
  deleteRestore?: ActionButtonProps;
  create?: ActionButtonProps;
  update?: ActionButtonProps;
  view?: ActionButtonProps;
  export?: ActionButtonProps;
};
export type ActionButtonProps<TAvailableKeys = AvailableActions> = Omit<
  AppBtnProps,
  "action"
> & { actionFn: Function; actionKey: keyof TAvailableKeys };
