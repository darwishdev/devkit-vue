import type { VNode } from "vue";

import type { RefetchOptions, QueryObserverResult } from "@tanstack/vue-query";
import type {
  AppFormSections,
  DeleteHandler,
  UpdateHandler,
  ActionButtonProps,
} from "@devkitvue/config";
import type { ApiEndpoint, StringUnknownRecord } from "@devkitvue/apiclient";
import type { DataTableFilterMetaData } from "primevue";
import type { CardSlots, DataCardProps } from "@devkitvue/datalist";
export type DatalistFiltersModel = Record<string, DataTableFilterMetaData>;
export type ApiFindOptions = {
  title: string;
  description?: string;
  totalCount?: number;
  updateHandler?: UpdateHandler;
  deleteRestoreHandler?: DeleteHandler;
  deleteHandler?: DeleteHandler;
};
export type ApiResponseFind<TRecord extends Record<string, unknown>> = {
  record?: TRecord;
  options?: ApiFindOptions;
  logs?: ({ statusCode?: string; actionType?: string } & Record<
    string,
    unknown
  >)[];
};
export type DataFindRequest<
  TKey extends string = "recordId",
  TValue = unknown,
> = {
  [k in TKey]: TValue;
};
export type DataFindMappers<
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
> = {
  requestMapper?: (req: TReq) => TReq;
  responseMapper?: (response: StringUnknownRecord) => ApiResponseFind<TRecord>;
};
export type DataFindAvailableActions = {
  delete?: ActionButtonProps;
  deleteRestore?: ActionButtonProps;
  update?: ActionButtonProps;
};
export type DataFindRecord<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TResp extends StringUnknownRecord | undefined = undefined,
> =
  | TRecord
  | ApiEndpoint<
      TApi,
      TReq,
      TResp extends undefined ? ApiResponseFind<TRecord> : TResp
    >;
export type DataViewContext<
  TApi extends Record<string, Function>,
  TRequest extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TResp extends StringUnknownRecord,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = DataFindMappers<TRequest, TRecord> & {
  viewKey: string;
  title?: string;
  requestValue?: unknown;
  listRoute?: string;
  routerParamName?: string;
  datalistKey?: string;
  pt: { endFieldsWrapper?: string; startFieldsWrapper?: string };
  requestKey?: keyof TRequest;
  record: DataFindRecord<TApi, TRequest, TRecord, TResp>;
  options?: ApiFindOptions;
  formSections?: AppFormSections<
    TFormSectionsRequest extends undefined
      ? StringUnknownRecord
      : TFormSectionsRequest
  >;
  rowIdentifier?: keyof TRecord;
  cardConfig?: Omit<DataCardProps<TRecord>, "data">;
  startFields?: {
    [K in keyof TRecord]?: {
      props?: Omit<DataFieldProps<TRecord, K>, "data" | "field">;
      slots?: DataFieldSlots<TRecord, K>;
    };
  };
  endFields?: {
    [K in keyof TRecord]?: {
      props?: Omit<DataFieldProps<TRecord, K>, "data" | "field">;
      slots?: DataFieldSlots<TRecord, K>;
    };
  };
};
export type DataViewProps<
  TApi extends Record<string, Function>,
  TRequest extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TResp extends StringUnknownRecord,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = {
  context: DataViewContext<
    TApi,
    TRequest,
    TRecord,
    TResp,
    TFormSectionsRequest
  >;
};
export type DataViewActionsSlots<TRecord extends StringUnknownRecord> = {
  [K in keyof DataFindAvailableActions as K extends string
    ? `actions.${K}`
    : never]: (props: { record: TRecord }) => VNode[] | VNode | undefined;
};
type FieldSlotMap<
  TRecord extends StringUnknownRecord,
  TPrefix extends string,
> = {
  [K in keyof TRecord as `${TPrefix}.${Extract<K, string>}`]?: (props: {
    data: TRecord;
    value: TRecord[K];
  }) => VNode | VNode[];
};
export type DataViewSlots<
  TRecord extends StringUnknownRecord,
  TResp extends StringUnknownRecord,
> = CardSlots<TRecord> & {
  card?: (props: { data: TRecord }) => VNode | VNode[];
  logs?: (props: { data: TRecord; response: TResp }) => VNode | VNode[];
  footer?: (props: {
    data: TRecord;
    response: TResp;
    refetch: (
      options?: RefetchOptions,
    ) => Promise<QueryObserverResult<ApiResponseFind<TRecord>, Error>>;
  }) => VNode | VNode[];
  pt: {
    endFieldsWrapper: string;
    startFieldsWrapper: string;
  };
  cardImage?: (props: { data: TRecord }) => VNode | VNode[];
  cardTitle?: (props: { data: TRecord }) => VNode | VNode[];
  cardInfo?: (props: { data: TRecord }) => VNode | VNode[];
  cardStart?: (props: { data: TRecord }) => VNode | VNode[];
  cardEnd?: (props: { data: TRecord }) => VNode | VNode[];
  actions?: (props: { data: TRecord }) => VNode[] | VNode;
  actionsPrepend?: (props: { data: TRecord }) => VNode[] | VNode;
  actionsAppend?: (props: { data: TRecord }) => VNode[] | VNode;
  loading?: () => VNode[] | VNode;
  empty?: () => VNode | VNode[];
  header?: (props: { data: TRecord }) => VNode[] | VNode;
  dropdownActions?: (props: { data: TRecord }) => VNode[] | VNode;
} & DataViewActionsSlots<TRecord> &
  FieldSlotMap<TRecord, "startField"> &
  FieldSlotMap<TRecord, "endField">;
export type DataViewEmits = {
  (e: "update:submited", response: StringUnknownRecord): void;
  (e: "update:submit", response: StringUnknownRecord): void;
  (e: "deleteRestore:submited", response: StringUnknownRecord): void;
  (e: "deleteRestore:submit", response: StringUnknownRecord): void;
  (e: "delete:submited", response: StringUnknownRecord): void;
  (e: "delete:submit", response: StringUnknownRecord): void;
  (e: "error", value: string): void;
};
export type DataFieldProps<
  TData extends Record<string, unknown>,
  TField extends keyof TData = keyof TData,
  TValue = TData[TField],
> = {
  data: TData;
  field: TField;
  useCardStyle?: boolean;
  title?: string;
  icon?: string;
  label?: string;
  valueTag?: string;
  layoutVariant?: "column" | "column-reverse" | "row" | "row-reverse";
  labelTag?: string;
  defaultValue?: string;
  hrefPrefix?: string;
  tooltip?: boolean | string;
  valueAdapter?: (value: TValue) => string;
  onLabelClick?: () => void;
  onValueClick?: () => void;
  pt?: {
    block?: string;
    label?: string;
    value?: string;
    valueWrapper?: string;
  };
};
export type DataFieldSlots<
  TData extends Record<string, unknown>,
  TField extends keyof TData = keyof TData,
  TValue = TData[TField],
> = {
  value?: (props: {
    hasValue: boolean;
    value: TValue;
    displayValue: string;
  }) => any;
  displayValue?: (props: { displayValue: string; value: TValue }) => any;
};
