import { type VNode } from "vue";
import { ColumnSlots, type ColumnProps } from "primevue/column";
import {
  AppFormSections,
  GridConfig,
  ApiOptions,
  FilterMatchModeValues,
  DataRouter,
  DisplayType,
  AvailableActions,
  PaginationParams,
} from "@devkitvue/config";
import { ApiEndpoint, StringUnknownRecord } from "@devkitvue/apiclient";
import { useDatalistStore } from "./store/DatalistStore";
import type { DataTableFilterMetaData, DataTableProps } from "primevue";
import type { FormKitSchemaNode } from "@formkit/core";
export type DatalistFilter = {
  isGlobal?: boolean;
  input: FormKitSchemaNode;
  matchMode: FilterMatchModeValues;
};
export type DatalistFiltersModel = Record<string, DataTableFilterMetaData>;
//
// export type DeleteRestoreVariant = AppBtnProps & {
//   disabled: boolean;
//   hasSelectedData: boolean;
//   hasDeletedRecords: boolean;
//   empty: string;
// };
// export type CreateHandler = {
//   title: string;
//   redirectRoute: string;
//   routeName: string;
//   endpoint: string;
//   redirectRouteParamName?: string;
// };
//
// export type UpdateHandler = {
//   title: string;
//   redirectRoute: string;
//   redirectRouteParamName?: string;
//   routeName: string;
//   endpoint: string;
//   findEndpoint: string;
//   findRequestProperty: string;
//   findResponseProperty: string;
// };
//
// export type DeleteHandler = {
//   endpoint: string;
//   requestProperty: string;
// };
//
// export type ImportHandler = {
//   endpoint: string;
//   importTemplateLink: string;
// };
//
// export type ApiListOptions = {
//   title: string;
//   description?: string;
//   totalCount?: number;
//   createHandler?: CreateHandler;
//   updateHandler?: UpdateHandler;
//   deleteRestoreHandler?: DeleteHandler;
//   deleteHandler?: DeleteHandler;
//   importHandler?: ImportHandler;
// };
//
// export type ApiResponseList<TRecord extends Record<string, unknown>> = {
//   records: TRecord[];
//   deletedRecords?: TRecord[];
//   options?: ApiListOptions;
// };
//
// export type PaginationParams = {
//   sortColumn?: string;
//   sortFunction?: string;
//   isDeleted?: boolean;
//   pageSize?: number;
//   pageNumber?: number;
// };
//
// export type DisplayType = "card" | "table" | "list";
//
// export type FilterMatchModeValues =
//   | "startsWith"
//   | "contains"
//   | "notContains"
//   | "endsWith"
//   | "equals"
//   | "notEquals"
//   | "in"
//   | "lt"
//   | "lte"
//   | "gt"
//   | "gte"
//   | "between"
//   | "dateIs"
//   | "dateIsNot"
//   | "dateBefore"
//   | "dateAfter";
export type DatalistRequest = {
  filters?: Record<string, unknown>;
  paginationParams?: PaginationParams;
};
export type DatalistMappers<
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
> = {
  requestMapper?: (req: DatalistRequest) => TReq;
  responseMapper?: (response: StringUnknownRecord) => ApiResponseList<TRecord>;
};
// export type DatalistRouter<TRecord extends Record<string, unknown>> = {
//   name: string;
//   paramName: string;
//   paramColumnName: keyof TRecord;
// };
//
// export type ActionButtonProps<TAvailableKeys = DatalistAvailableActions> = Omit<
//   AppBtnProps,
//   "action"
// > & { actionFn: Function; actionKey: keyof TAvailableKeys };
export type DatalistCommonActions = Pick<
  AvailableActions,
  "delete" | "deleteRestore"
>;
export type DatalistGlobalActions = DatalistCommonActions &
  Pick<AvailableActions, "create" | "export">;
export type DatalistRowActions = DatalistCommonActions &
  Pick<AvailableActions, "update" | "view">;

// export type DatalistAvailableActions = DatalistGlobalActions &
//   DatalistRowActions;
// export type PaginatedQueryRequest = {
//   filters: Record<string, unknown>;
//   paginationParams: PaginationParams;
// };
export type ApiResponseList<TRecord extends Record<string, unknown>> = {
  records: TRecord[];
  deletedRecords?: TRecord[];
  options?: ApiOptions;
};
export type DatalistRecords<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
> =
  | TRecord[]
  | ApiResponseList<TRecord>
  | ApiEndpoint<
      TApi,
      TFiltersReq extends undefined ? TReq : TFiltersReq,
      TApiResponse extends undefined ? ApiResponseList<TRecord> : TApiResponse
    >;

export type DatalistClientFilter<TRecord> = {
  matchMode: FilterMatchModeValues;
  input: FormKitSchemaNode & { name: keyof TRecord; value?: unknown };
};
export type DatalistFlags = {
  isPresistFilters?: boolean;
  hideShowDeleted?: boolean;
  isLazy?: boolean;
  hideActions?: boolean;
  isLazyFilters?: boolean;
  isFilterPersist?: boolean;
  isActionsDropdown?: boolean;
  isExportable?: boolean;
};
export type DatalistColumnBase<TRecord extends Record<string, unknown>> = {
  props?: ColumnProps;
  slots?: ColumnSlots;
  isGlobalFilter?: boolean;
  router?: DataRouter<TRecord>;
  editInput?: FormKitSchemaNode;
  renderHtml?: (value: TRecord) => VNode;
};

export type DatalistColumnClientSide<TRecord extends Record<string, unknown>> =
  DatalistColumnBase<TRecord> & {
    filters?: (DatalistFilter | FormKitSchemaNode)[];
  };
export type DatalistColumnServerSide<TRecord extends Record<string, unknown>> =
  DatalistColumnBase<TRecord> & {
    filters?: FormKitSchemaNode[];
  };

export type DatalistColumnsClientSide<TRecord extends StringUnknownRecord> =
  Partial<Record<keyof TRecord, DatalistColumnClientSide<TRecord>>>;
export type DatalistColumnsServerSide<TRecord extends StringUnknownRecord> =
  Partial<Record<keyof TRecord, DatalistColumnServerSide<TRecord>>>;
export type DatalistColumnsBase<TRecord extends StringUnknownRecord> = Partial<
  Record<keyof TRecord, DatalistColumnBase<TRecord>>
>;

export type DatalistContext<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = DatalistFlags &
  DatalistMappers<TReq, TRecord> & {
    datalistKey: string;
    title?: string;
    gridConfig?: GridConfig;
    records: DatalistRecords<TApi, TReq, TRecord, TFiltersReq, TApiResponse>;
    options?: ApiOptions;
    formSections?: AppFormSections<
      TFormSectionsRequest extends undefined
        ? StringUnknownRecord
        : TFormSectionsRequest
    >;
    execludedColumns?: (keyof TRecord)[];
    datatableProps?: DataTableProps;
    displayType?: DisplayType;
    isSelectionHidden?: boolean;
    debounceInMilliseconds?: number;
    rowIdentifier?: keyof TRecord;
    viewRouter?: DataRouter<TRecord>;
    initiallySelectedItems?: TRecord[];
  } & (
    | {
        isServerSide?: true;
        columns?: DatalistColumnsServerSide<TRecord>;
        filters?: FormKitSchemaNode[];
      }
    | {
        isServerSide?: false;
        columns?: DatalistColumnsClientSide<TRecord>;
        filters?: FormKitSchemaNode[];
      }
  );

export type DatalistProps<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = {
  context: DatalistContext<
    TApi,
    TReq,
    TRecord,
    TFiltersReq,
    TApiResponse,
    TFormSectionsRequest
  >;
};
//slots
export type DatalistStore<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = ReturnType<
  ReturnType<
    typeof useDatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >
  >
>;
export type DatalistGlobalActionSlots<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = {
  [K in keyof DatalistGlobalActions as K extends string
    ? `globalActions.${K}`
    : never]: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode | undefined;
};

export type DatalistColumnSlots<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = Partial<{
  [K in keyof TRecord as `column.${Extract<K, string>}`]: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
    data: TRecord;
  }) => VNode[] | VNode | undefined;
}>;

export type DatalistRowSlots<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = Partial<{
  [K in keyof DatalistRowActions as K extends string
    ? `rowActions.${K}`
    : never]: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
    data: TRecord;
  }) => VNode[] | VNode | undefined;
}>;
export type DatalistSlots<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = {
  card?: (props: { data: TRecord }) => VNode | VNode[];
  cardStart?: (props: { data: TRecord }) => VNode | VNode[];
  cardEnd?: (props: { data: TRecord }) => VNode | VNode[];
  expansion?: (props: { data: TRecord }) => VNode[] | VNode;
  globalActions?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  globalActionsStartPrepend?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;

  title?: () => VNode[] | VNode;
  globalActionsStartAppend?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  globalActionsEndPrepend?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  globalActionsEndAppend?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;

  loading?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  paginatorcontainer?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  paginatorstart?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  paginatorend?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;

  empty?: () => VNode | VNode[];

  filtersPanel?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  filtersPresist?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  filtersReset?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  filtersForm?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  filtersFormAppend?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  filtersFormPrepend?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;

  header?: (props: {
    store: DatalistStore<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >;
  }) => VNode[] | VNode;
  dropdownActions?: (props: { data: TRecord }) => VNode[] | VNode;
  actions?: (props: { data: TRecord }) => VNode[] | VNode;
  actionsPrepend?: (props: { data: TRecord }) => VNode[] | VNode;
  actionsAppend?: (props: { data: TRecord }) => VNode[] | VNode;
} & DatalistGlobalActionSlots<
  TApi,
  TReq,
  TRecord,
  TFiltersReq,
  TApiResponse,
  TFormSectionsRequest
> &
  DatalistRowSlots<
    TApi,
    TReq,
    TRecord,
    TFiltersReq,
    TApiResponse,
    TFormSectionsRequest
  > &
  DatalistColumnSlots<
    TApi,
    TReq,
    TRecord,
    TFiltersReq,
    TApiResponse,
    TFormSectionsRequest
  >;
export type DatalistRowActionsSlots<
  TApi extends Record<string, Function>,
  TRecord extends StringUnknownRecord,
> = {
  actionsPrepend?: (props: { data: TRecord }) => VNode[] | VNode;
  dropdownActions?: (props: { data: TRecord }) => VNode[] | VNode;
  actionsAppend?: (props: { data: TRecord }) => VNode[] | VNode;
} & {
  [K in keyof DatalistRowActions as K extends string
    ? `rowActions.${K}`
    : never]: (props: {
    store: DatalistStore<
      TApi,
      Record<string, unknown>,
      TRecord,
      Record<string, unknown>
    >;
    data: TRecord;
  }) => VNode[] | VNode | undefined;
};

export type DatalistEmits<
  TRecord extends StringUnknownRecord,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
> = {
  (e: "create:submited", response: StringUnknownRecord): void;
  (e: "create:submit", request: StringUnknownRecord): void;
  (e: "update:submited", response: StringUnknownRecord): void;
  (e: "update:submit", response: StringUnknownRecord): void;
  (e: "deleteRestore:submited", response: StringUnknownRecord): void;
  (e: "deleteRestore:submit", response: StringUnknownRecord): void;
  (e: "deleteRestore:toggle", value: boolean): void;
  (
    e: "listed",
    response: TApiResponse extends undefined
      ? ApiResponseList<TRecord>
      : TApiResponse,
  ): void;
  (e: "error", value: string): void;
  (e: "displayTypeChanged", value: DisplayType): void;
};
export type DatalistRowActionsEmits = {
  (e: "create:submited", response: StringUnknownRecord): void;
  (e: "create:submit", request: StringUnknownRecord): void;
  (e: "update:submited", response: StringUnknownRecord): void;
  (e: "update:submit", response: StringUnknownRecord): void;
  (e: "deleteRestore:submited", response: StringUnknownRecord): void;
  (e: "deleteRestore:submit", response: StringUnknownRecord): void;
};
export type DatalistRowActionsProps<TRecord> = {
  data: TRecord;
  storeKey: string;
  rowIdentifier: keyof TRecord;
  hideShowDeleted?: boolean;
  isActionsDropdown?: boolean;
};
