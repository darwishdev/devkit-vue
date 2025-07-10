import { type VNode } from "vue";
import { AppFormSections } from "@devkitvue/config";
import { ApiEndpoint, StringUnknownRecord } from "@devkitvue/apiclient";
import {
  DeleteHandler,
  UpdateHandler,
  ActionButtonProps,
} from "@devkitvue/datalist";

import type { DataTableFilterMetaData } from "primevue";
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
  record: TRecord;
  deletedRecords?: TRecord[];
  options?: ApiFindOptions;
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
  requestMapper?: (req: DataFindRequest) => TReq;
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
> = TRecord | ApiEndpoint<TApi, TReq, ApiResponseFind<TRecord>>;

export type DataViewContext<
  TApi extends Record<string, Function>,
  TRecord extends StringUnknownRecord,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = DataFindMappers<DataFindRequest, TRecord> & {
  title?: string;
  requestValue?: unknown;
  routerParamName?: string;
  listRoute?: string;
  headerKey?: keyof TRecord;
  subHeaderKey?: keyof TRecord;
  imageKey?: keyof TRecord;
  deletedAtKey?: keyof TRecord;
  cretedAtKey?: keyof TRecord;
  record: DataFindRecord<TApi, DataFindRequest, TRecord>;
  options?: ApiFindOptions;
  formSections?: AppFormSections<
    TFormSectionsRequest extends undefined
      ? StringUnknownRecord
      : TFormSectionsRequest
  >;
  execludedColumns?: (keyof TRecord)[];
  debounceInMilliseconds?: number;
  rowIdentifier?: keyof TRecord;
};
export type DataViewProps<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
> = {
  context: DataViewContext<
    TApi,
    TReq,
    TRecord,
    TApiResponse,
    TFormSectionsRequest
  >;
};
export type DataViewActionsSlots<TRecord extends StringUnknownRecord> = {
  [K in keyof DataFindAvailableActions as K extends string
    ? `actions.${K}`
    : never]: (props: { record: TRecord }) => VNode[] | VNode | undefined;
};
export type DataViewSlots<TRecord extends StringUnknownRecord> = {
  card?: (props: { data: TRecord }) => VNode | VNode[];
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
} & DataViewActionsSlots<TRecord>;
export type DataViewEmits = {
  (e: "update:submited", response: StringUnknownRecord): void;
  (e: "update:submit", response: StringUnknownRecord): void;
  (e: "deleteRestore:submited", response: StringUnknownRecord): void;
  (e: "deleteRestore:submit", response: StringUnknownRecord): void;
  (e: "delete:submited", response: StringUnknownRecord): void;
  (e: "delete:submit", response: StringUnknownRecord): void;
  (e: "error", value: string): void;
};
