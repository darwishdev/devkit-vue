import { h } from "vue";
import { StringUnknownRecord } from "@devkit/config";
import { ColumnBase } from "./ColumnBase";
import {
  DatalistColumnClientSide,
  DatalistColumnServerSide,
  DatalistColumnBase,
} from "../types";
import { RouterLink } from "vue-router";
export class ColumnRouter<TRecord extends Record<string, unknown>>
  extends ColumnBase<TRecord>
  implements DatalistColumnBase<TRecord>
{
  paramName: string = "";
  route: string = "";
  constructor(
    name: keyof TRecord,
    paramName: string,
    route: string,
    params?: (
      | DatalistColumnClientSide<StringUnknownRecord, StringUnknownRecord>
      | DatalistColumnServerSide<StringUnknownRecord, StringUnknownRecord>
    ) & { isSortable?: boolean; isGlobalFilter?: boolean },
  ) {
    super(name, params);
    this.paramName = paramName;
    this.route = route;
  }
  renderHtml = (value: TRecord) => {
    try {
      if (this.columnName in value) {
        const currentValue = value[this.columnName];
        if (typeof currentValue == "string") {
          const params: StringUnknownRecord = {};
          params[this.paramName] = currentValue;
          const routeParams: Record<string, unknown> = {
            path: this.route.includes("/") ? this.route : undefined,
            name: !this.route.includes("/") ? this.route : undefined,
            params,
          };
          return h(RouterLink, { to: routeParams });
        }
      }
      return h("span", "");
    } catch (e: unknown) {
      if (e && e instanceof Error) {
        return h("span", e.message);
      }
      if (e && typeof e == "string") {
        return h("span", e);
      }
      return h("span", "error_parsing");
    }
  };
}
