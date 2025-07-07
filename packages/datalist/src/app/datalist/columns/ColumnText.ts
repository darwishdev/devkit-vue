import { h } from "vue";
import { ColumnBase } from "./ColumnBase";
import { DatalistColumnBase } from "../types";

export class ColumnText<TRecord extends Record<string, unknown>>
  extends ColumnBase<TRecord>
  implements DatalistColumnBase<TRecord>
{
  renderHtml = (value: TRecord) => {
    try {
      if (this.columnName in value) {
        if (typeof value[this.columnName] == "string") {
          return h("span", value[this.columnName] as string);
        }
        if (typeof value[this.columnName] == "number") {
          return h("span", value[this.columnName] as string);
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
