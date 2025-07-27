import { ObjectKeys, StringUnknownRecord } from "@devkitvue/apiclient";
import { DatalistColumnBase, DatalistColumnsBase } from "../types";
import { ColumnText } from "../columns/ColumnText";
import { ColumnDate } from "../columns/ColumnDate";
const DATE_HEADER_KEYS = [
  "createdAt",
  "updatedAt",
  "deletedAt",
  "accessTokenExpiresAt",
  "refreshTokenExpiresAt",
];
export const _constructColumns = <TRecord extends StringUnknownRecord>(
  record: TRecord,
  execludedKeys: (keyof TRecord)[] = [],
): DatalistColumnsBase<TRecord> => {
  const datalistColumns: DatalistColumnsBase<TRecord> = {};
  for (const dataHeaderKey of ObjectKeys(record)) {
    if (dataHeaderKey == "$typeName") continue;
    const currentDataHeader = record[dataHeaderKey];
    if (!currentDataHeader || execludedKeys.includes(dataHeaderKey)) {
      continue;
    }
    console.log(currentDataHeader, "header is ");
    if (DATE_HEADER_KEYS.includes(String(dataHeaderKey))) {
      datalistColumns[dataHeaderKey] = new ColumnDate(dataHeaderKey, {
        isSortable: true,
      });
      continue;
    }
    const currentColumn: DatalistColumnBase<TRecord> = new ColumnText(
      dataHeaderKey,
      { isSortable: true, isGlobalFilter: true },
    );
    datalistColumns[dataHeaderKey] = currentColumn;
  }

  return datalistColumns;
};
