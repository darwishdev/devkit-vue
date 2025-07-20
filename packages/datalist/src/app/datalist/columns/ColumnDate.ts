import { h } from "vue";
import { ColumnBase } from "./ColumnBase";
import { DatalistColumnBase } from "../types";
import {
  DateStringDigitToDate,
  NumberToDate,
  TimestampToDateString,
} from "@devkitvue/form";

export class ColumnDate<TRecord extends Record<string, unknown>>
  extends ColumnBase<TRecord>
  implements DatalistColumnBase<TRecord>
{
  renderHtml = (value: TRecord) => {
    try {
      if (this.columnName in value) {
        const currentValue = value[this.columnName];

        if (
          currentValue === undefined ||
          currentValue === null ||
          currentValue == ""
        ) {
          return h("span", "empty");
        }
        if (typeof currentValue == "number") {
          return h("span", NumberToDate(currentValue).toDateString());
        }
        if (typeof currentValue === "string" && /^\d+$/.test(currentValue)) {
          return h("span", DateStringDigitToDate(currentValue).toDateString());
        }
        if (currentValue instanceof Date) {
          return h("span", currentValue.toDateString());
        }
        if (!currentValue || typeof currentValue != "object") {
          return h("span", "");
        }
        if ("seconds" in currentValue && "nanos" in currentValue) {
          return h(
            "span",
            TimestampToDateString({
              seconds: Number(currentValue.seconds),
              nanos: Number(currentValue.nanos),
            }),
          );
        }
        return h("span", "");
      }
    } catch (e: unknown) {
      if (e && e instanceof Error) {
        return h("span", e.message);
      }
      if (e && typeof e == "string") {
        return h("span", e);
      }
      return h("span", "error_parsing_date");
    }

    return h("span", "");
  };
}
