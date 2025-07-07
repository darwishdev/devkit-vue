import type { FormKitSchemaNode } from "@formkit/core";
import { ColumnSlots, type ColumnProps } from "primevue/column";
import {
  DatalistColumnClientSide,
  DatalistColumnServerSide,
  DatalistFilter,
} from "../types";
import { DataRouter, StringUnknownRecord } from "@devkit/config";

export class ColumnBase<TRecord extends Record<string, unknown>> {
  props: ColumnProps = {};
  columnName: keyof TRecord;
  router?: DataRouter<TRecord>;
  editInput?: FormKitSchemaNode;
  slots?: ColumnSlots;
  isGlobalFilter?: boolean;
  isSortable?: boolean;
  filters?: (FormKitSchemaNode | DatalistFilter)[];
  constructor(
    name: keyof TRecord,
    params?: (
      | DatalistColumnClientSide<StringUnknownRecord, StringUnknownRecord>
      | DatalistColumnServerSide<StringUnknownRecord, StringUnknownRecord>
    ) & { isSortable?: boolean; isGlobalFilter?: boolean },
  ) {
    this.columnName = name;
    this.props.field = this.props.field || (name as string);
    this.props.header = this.props.header || (name as string);
    if (params) {
      this.slots = params.slots;
      this.editInput = params.editInput;
      this.isSortable = params.isSortable;
      this.props.sortable = params.isSortable;
      this.filters = params.filters;
      this.isGlobalFilter = params.isGlobalFilter;
      this.router = params.router;
    }
  }
}
