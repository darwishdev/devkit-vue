import { h } from "vue";
import { ColumnBase } from "./ColumnBase";
import { DatalistColumnBase } from "../types";
import { AppIcon } from "@devkit/base-components";

export class ColumnIcon<TRecord extends Record<string, unknown>>
  extends ColumnBase<TRecord>
  implements DatalistColumnBase<TRecord>
{
  renderHtml = (value: TRecord) => {
    try {
      if (this.columnName in value) {
        if (typeof value[this.columnName] == "string") {
          return h(AppIcon, { icon: value[this.columnName] as string });
        }
      }
    } catch (e: unknown) {
      if (e && e instanceof Error) {
        return h("span", e.message);
      }
      if (e && typeof e == "string") {
        return h("span", e);
      }
      return h("span", "error_parsing");
    }

    return h("span", "unable_to_parse");
  };
}
