import { ObjectKeys, StringUnknownRecord } from "@devkit/apiclient"
import { DatalistColumnBase,  DatalistColumnsBase } from "../types"
import { ColumnText } from "../columns/ColumnText"
export const _constructColumns = <TRecord extends StringUnknownRecord>
	(record: TRecord,
		execludedKeys: (keyof TRecord)[] = []): DatalistColumnsBase<TRecord> => {
	const datalistColumns: DatalistColumnsBase<TRecord> = {}
	for (const dataHeaderKey of ObjectKeys(record)) {
		const currentDataHeader = record[dataHeaderKey]
		if (!currentDataHeader || execludedKeys.includes(dataHeaderKey)) {
			continue
		}
		const currentColumn: DatalistColumnBase<TRecord> = new ColumnText(dataHeaderKey, { isSortable: true, isGlobalFilter: true })
		datalistColumns[dataHeaderKey] = currentColumn
	}

	return datalistColumns;
}
