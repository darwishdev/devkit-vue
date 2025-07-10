import { DBDropdownOptions } from "@/pkg/database/DbTypes";
import { CacheOptions, FilesHandler } from "@/pkg/types/types";
import { ApiEndpoint, StringUnknownRecord } from "@devkitvue/apiclient";
import type {
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

export type DropdownOption<TValue = string | number> = {
  label: string;
  value: TValue;
  note?: string;
  disabled?: boolean;
  icon?: string;
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
  FormKitInputContext<string | string[]> & {
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
