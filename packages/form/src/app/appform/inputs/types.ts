import { DBDropdownOptions } from "@/pkg/database/DbTypes";
import { CacheOptions, FilesHandler } from "@devkitvue/config";
import { ApiEndpoint, StringUnknownRecord } from "@devkitvue/apiclient";
import type {
  DataTableProps,
  DatePickerProps,
  MultiSelectProps,
  MultiSelectSlots,
  SelectButtonProps,
  SelectPassThroughOptions,
  SelectProps,
  SelectSlots,
} from "primevue";
import { FormKitInputContext } from "../types";
import { Body, UppyOptions } from "@uppy/core";
import { DashboardOptions } from "@uppy/dashboard";
import { TusBody, TusOptions } from "@uppy/tus";
import { GalleryPluginOptions } from "../plugins/GallerySelector";
import { ImageEditorOptions } from "@uppy/image-editor";
import { VNode } from "vue";

export type DropdownOption<TValue = string | number> = {
  label: string;
  value: TValue;
  note?: string;
  group?: string;
  disabled?: boolean;
  icon?: string;
};
export type DropdownOptionWithGroup<TValue = string | number> = {
  groupName: string;
  items: DropdownOption<TValue>[];
};

export type DropdownOptionsWithGroup<
  TValue = string | number,
  TGroupOptions = DropdownOptionWithGroup<TValue>,
> = {
  options: TGroupOptions[];
};
export type DropdownOptions<TValue = string | number> = {
  options: DropdownOption<TValue>[];
};

export type DependantDropdown<TReq extends StringUnknownRecord> = {
  dependsOn: string;
  requestMapper?: (value: unknown) => TReq;
  requestPropertyName?: keyof TReq;
};
export type DropdownContext<
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TOptionsResp extends StringUnknownRecord = DropdownOptions,
  TComponentType extends "single" | "multi" | "button" = "single",
> = (TComponentType extends "button"
  ? Omit<SelectButtonProps, "options" | "multiple">
  : TComponentType extends "multi"
    ? Omit<MultiSelectProps, "options">
    : Omit<SelectProps, "options">) &
  FormKitInputContext &
  Partial<DependantDropdown<TOptionsReq>> &
  Partial<CacheOptions> & {
    options:
      | ApiEndpoint<TApi, TOptionsReq, TOptionsResp>
      | StringUnknownRecord[];
    multiple?: TComponentType extends "single" ? false : true;
    useButtons?: boolean;
    responseOptionsKey?: keyof TOptionsResp;
    iconKey?: string;
    convertToFlat?: boolean;
    pt?: SelectPassThroughOptions;
    hideReload?: boolean;
    debounceInMilliSeconds?: number;
    createRoute?: string;
    useLazy?: boolean;
    optionsMapper?: (options: TOptionsResp) => DBDropdownOptions;
  };
export type InputDropdownProps<
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TOptionsResp extends StringUnknownRecord = DropdownOptions,
  TComponentType extends "single" | "multi" | "button" = "single",
> = {
  context: DropdownContext<TApi, TOptionsReq, TOptionsResp, TComponentType>;
};
export type InputDropdownSlots<
  TComponentType extends "single" | "multi" | "button" = "single",
> = TComponentType extends "button"
  ? SelectButtonProps
  : TComponentType extends "multi"
    ? MultiSelectSlots
    : SelectSlots;

export type DatepickerContext<
  TApi extends Record<string, Function>,
  TDisabledDatesReq extends Record<string, unknown> = Record<string, unknown>,
  TDisabledDatesResp extends Record<string, unknown> = Record<string, unknown>,
> = FormKitInputContext<
  Date | Date[] | number | number[] | Array<Date | null> | undefined | null
> &
  DatePickerProps & {
    disabledDates?: ApiEndpoint<TApi, TDisabledDatesReq, TDisabledDatesResp>;
    disabledDatesDependsOn?: string;
    convertToNumber?: boolean;
    disabledDatesRequestPropertyName?: string;
    disabledDatesResponsePropertyName?: string;
    dsiabledDatesRequestMapper?: (req: unknown) => TDisabledDatesReq;
    dsiabledDatesResponseMapper?: (resp: unknown) => TDisabledDatesResp;
  };
export type InputDatepickerProps<
  TApi extends Record<string, Function>,
  TReq extends Record<string, unknown> = Record<string, unknown>,
  TResp extends Record<string, unknown> = Record<string, unknown>,
> = {
  context: DatepickerContext<TApi, TReq, TResp>;
};
export type InputUploadMeta = {
  bucketName: string;
  objectName: string;
  contentType: string;
  isGallery?: boolean;
  isInitial?: boolean;
};

export type InputUploadContext<TApi extends Record<string, Function>> =
  FormKitInputContext<string | string[]> &
    Partial<DependantDropdown<StringUnknownRecord>> &
    Partial<CacheOptions> & {
      bucketName: string;
      hideSelectFromGallery?: boolean;
      isMultiple?: boolean;
      baseUrl?: string;
      fallbackImageUrl?: string;
      uppyOptions?: UppyOptions<InputUploadMeta, TusBody>;
      dashboardOptions?: Partial<
        Omit<DashboardOptions<InputUploadMeta, Body>, "inline">
      >;
      filesHandler?: FilesHandler<TApi>;
      tusOptions?: Partial<TusOptions<InputUploadMeta, Body>>;
      galleryOptions?: Partial<GalleryPluginOptions>;
      imageEditorOptions?: Partial<ImageEditorOptions>;
    };

export type InputUploadProps<TApi extends Record<string, Function>> = {
  context: InputUploadContext<TApi>;
};

export type ToggleType = "checkbox" | "switch";

export type InputToggleCollectionContext<
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TValue extends string | number | StringUnknownRecord,
  TOption extends StringUnknownRecord = DropdownOption<TValue>,
  TUseGroup extends boolean = false,
  TGroupOption extends StringUnknownRecord | undefined = TUseGroup extends true
    ? DropdownOptionWithGroup<TValue>
    : undefined,
  TOptionsResp extends StringUnknownRecord = TUseGroup extends true
    ? DropdownOptionsWithGroup<TGroupOption, TValue>
    : DropdownOptions<TValue>,
> = FormKitInputContext &
  Partial<DependantDropdown<TOptionsReq>> &
  Partial<CacheOptions> & {
    useGroup: TUseGroup;
    options:
      | ApiEndpoint<TApi, TOptionsReq, TOptionsResp>
      | StringUnknownRecord[];
    label?: string;
    toggleType?: ToggleType;
    groupByKey?: keyof TOption;
    useCheckBox?: boolean;
    responseOptionsKey?: keyof TOptionsResp;
    labelKey?: keyof TOption;
    dataTableProps?: DataTableProps;
    groupNameKey?: keyof TGroupOption;
    groupNoteKey?: keyof TGroupOption;
    groupItemsKey?: keyof TGroupOption;
    valueKey?: keyof TOption;
    noteKey?: keyof TOption;
    iconKey?: keyof TOption;
    hideReload?: boolean;
    debounceInMilliSeconds?: number;
    createRoute?: string;
    useLazy?: boolean;
    dependsOn?: string;
    optionsMapper?: (options: StringUnknownRecord) => TOptionsResp;
    help?: string;
  };
export type InputToggleCollectionProps<
  TApi extends Record<string, Function>,
  TOptionsReq extends StringUnknownRecord,
  TValue extends string | number | StringUnknownRecord,
  TOption extends StringUnknownRecord = DropdownOption<TValue>,
  TUseGroup extends boolean = false,
  TGroupOption extends StringUnknownRecord | undefined = TUseGroup extends true
    ? DropdownOptionWithGroup<TValue>
    : undefined,
  TOptionsResp extends StringUnknownRecord = TUseGroup extends true
    ? DropdownOptionsWithGroup<TGroupOption, TValue>
    : DropdownOptions<TValue>,
> = {
  context: InputToggleCollectionContext<
    TApi,
    TOptionsReq,
    TValue,
    TOption,
    TUseGroup,
    TGroupOption,
    TOptionsResp
  >;
};
export type ToggleGroupProps<
  TValue extends string | number | StringUnknownRecord,
  TOption extends StringUnknownRecord = DropdownOption<TValue>,
> = {
  groupName: string;
  groupNote?: string;
  labelKey?: keyof TOption;
  valueKey?: keyof TOption;
  noteKey?: keyof TOption;
  iconKey?: keyof TOption;
  useCheckBox?: boolean;
  modelValue: Set<TValue>;
  items: TOption[];
};
export type ToggleGroupSlots<
  TValue extends string | number | StringUnknownRecord,
  TOption extends StringUnknownRecord = DropdownOption<TValue>,
> = {
  header?: (props: {
    groupNote: string;
    groupName: string;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[] | VNode;
  note?: (props: { groupNote: string }) => VNode[] | VNode;

  "select-all"?: (props: {
    groupName: string;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[] | VNode;
  option?: (props: {
    option: TOption;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[] | VNode;
};
export type ToggleCollectionSlots<
  TValue extends string | number | StringUnknownRecord,
  TOption extends StringUnknownRecord = DropdownOption<TValue>,
> = {
  expanstion?: (props: ToggleGroupProps<TValue, TOption>) => VNode[] | VNode;
  "group-header"?: (props: {
    groupNote: string;
    groupName: string;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
  "group-note"?: (props: { groupNote: string }) => VNode[] | VNode;

  "group-select-all"?: (props: {
    groupName: string;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
  "group-option"?: (props: {
    option: TOption;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];

  /** Custom content in the header actions area (wraps all the buttons and input) */
  "header-actions"?: (props: {
    expandAll: () => void;
    collapseAll: () => void;
    modelValue: string | null | undefined;
    "onUpdate:modelValue": (val: string | null) => void;
  }) => VNode[];

  /** Custom button to expand all groups */
  "expand-all"?: (props: { expandAll: () => void }) => VNode[];

  /** Custom button to collapse all groups */
  "collapse-all"?: (props: { collapseAll: () => void }) => VNode[];

  /** Custom checkbox to toggle "select all" */
  "select-all"?: (props: {
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];

  /** Custom input for the global search filter */
  "search-input"?: (props: {
    modelValue: string | null | undefined;
    "onUpdate:modelValue": (val: string | null) => void;
  }) => VNode[];

  /** Custom toggle control (checkbox or switch) per row */
  option?: (props: {
    data: TOption;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
};
