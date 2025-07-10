import type { FormKitSchemaNode } from "@formkit/core";
import type { DatalistColumnsBase } from "@devkitvue/datalist";
import { StringUnknownRecord } from "@devkitvue/apiclient";
import { CommandPallete } from "@devkitvue/config";
import { AppMenuItem } from "@devkitvue/base-components";
export type AppHeaderProps<SUPPORTE_LOCALES_TYPE> = {
  setLanguage?: (
    locale: SUPPORTE_LOCALES_TYPE,
  ) => Promise<Record<string, string> | undefined>;
};
export type AppHeaderEmits<SUPPORTE_LOCALES_TYPE> = {
  (e: "localeChanged", locale: SUPPORTE_LOCALES_TYPE): void;
  (e: "loggedOut"): void;
  (e: "sidebarToggled"): void;
  (e: "searchToggled"): void;
  (e: "searchSelected", item: CommandPallete): void;
};

// Define the component's slots for full customization
export type AppHeaderSlots = {
  logo?: (props: {}) => any;
  "sidebar-toggler"?: (props: { toggle: () => void }) => any;
  search?: (props: {
    isSearching: boolean;
    toggle: () => void;
    suggestions: CommandPallete[];
  }) => any;
  "theme-toggler"?: (props: {}) => any;
  "locale-toggler"?: (props: {
    toggle: (locale: string) => Promise<void>;
  }) => any;
  "profile-menu"?: (props: {
    toggle: (event?: Event) => void;
    items: AppMenuItem[];
  }) => any;
  breadcrumb?: (props: {}) => any;
};
export interface FeatureConstants<
  TApi extends Record<string, Function>,
  TView extends StringUnknownRecord,
> {
  ROUTE_PARAM_NAME: string;
  FIND_REQUEST_PROP_NAME: string;
  FIND_RESPONSE_PROP_NAME: string;
  TITLE: string;
  DESCRIPTION: string;

  ROUTES: {
    LIST: RouteConfig;
    CREATE: RouteConfig;
    FIND: RouteConfig;
    UPDATE: RouteConfig;
  };

  ENDPOINTS: {
    list?: keyof TApi;
    create?: keyof TApi;
    update?: keyof TApi;
    findForUpdate?: keyof TApi;
    deleteRestore?: keyof TApi;
    delete?: keyof TApi;
  };
  KEYS: Record<string, string>;

  FORM_INPUTS: {
    baseInputs: FormKitSchemaNode[];
    [key: string]: FormKitSchemaNode | FormKitSchemaNode[];
  };

  COLUMNS: DatalistColumnsBase<TView>;
  ROW_IDENTIFIER: keyof TView & string;
}

interface RouteConfig {
  path: string;
  name: string;
  breadcrumbs: { label: string; icon?: string; route?: string }[];
}
