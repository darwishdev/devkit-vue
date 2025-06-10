import { h } from "vue"
import { ColumnBase } from "./ColumnBase"
import { DatalistColumnBase } from "../types"
import Badge from 'primevue/badge';

export class ColumnFlag<TRecord extends Record<string, unknown>> extends ColumnBase<TRecord> implements DatalistColumnBase<TRecord> {
	renderHtml = (value: TRecord) => {
		try {
			if (this.columnName in value) {
				const flagValue = value[this.columnName]
				if (typeof flagValue == 'boolean') {
					return h(Badge, { value: flagValue ? 'yes' : 'no', severity: flagValue ? 'success' : 'danger' })
				}
			}
		} catch (e) {
			return h('span', 'error_parsing_column')
		}

		return h('span', 'unable_to_parse')
	}
}

