import { h } from "vue"
import { ColumnBase } from "./ColumnBase"
import { DatalistColumnBase } from "../types"
import { AppIcon } from "@devkit/base-components"

export class ColumnIcon<TRecord extends Record<string, unknown>> extends ColumnBase<TRecord> implements DatalistColumnBase<TRecord> {
	renderHtml = (value: TRecord) => {
		try {
			if (this.columnName in value) {
				if (typeof value[this.columnName] == 'string') {
					return h(AppIcon, { icon: value[this.columnName] as string })
				}
			}
		} catch (e) {
			return h('span', 'error_parsing_column')
		}

		return h('span', 'unable_to_parse')
	}
}

