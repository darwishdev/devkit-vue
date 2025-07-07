import type { FormKitSchemaNode } from "@formkit/core";
import type { DatalistColumnsBase } from "@devkit/datalist";
import { StringUnknownRecord } from "@devkit/apiclient";

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
