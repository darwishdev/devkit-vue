import { h } from "vue"
import { ColumnBase } from "./ColumnBase"
import { DatalistColumnBase } from "../types"
import { TimestampToDateString } from "@/pkg/utils/DateUtils"

export class ColumnDate<TRecord extends Record<string, unknown>> extends ColumnBase<TRecord> implements DatalistColumnBase<TRecord> {
	renderHtml = (value: TRecord) => {
		try {
			if (this.columnName in value) {
				const currentValue = value[this.columnName]
				if (currentValue instanceof Date) {
					return h('span', currentValue.toDateString())
				}
				if (!currentValue || typeof currentValue != 'object') {
					return h('span', '')
				}
				if ('seconds' in currentValue && 'nanos' in currentValue) {
					return h('span', TimestampToDateString({ seconds: Number(currentValue.seconds), nanos: Number(currentValue.nanos) })
					)
				}
				return h('span', '')

			}
		} catch (e) {
			return h('span', 'error_parsing_date')
		}

		return h('span', '')
	}
}

