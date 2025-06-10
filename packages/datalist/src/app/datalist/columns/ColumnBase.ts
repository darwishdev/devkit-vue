
import type { FormKitSchemaNode } from '@formkit/core'
import { ColumnSlots, type ColumnProps } from 'primevue/column';
import { DatalistColumnClientSide, DatalistColumnServerSide, DatalistFilter, DatalistFilterInput, DatalistRouter } from '../types';
import { StringUnknownRecord } from '@devkit/config';

export class ColumnBase<TRecord extends Record<string, unknown>> {
	props: ColumnProps = {}
	columnName: keyof TRecord
	router?: DatalistRouter<TRecord>
	editInput?: FormKitSchemaNode
	slots?: ColumnSlots
	isGlobalFilter?: boolean
	isSortable?: boolean
	filters?: DatalistFilterInput<StringUnknownRecord>[] | DatalistFilter<StringUnknownRecord>[]
	constructor(name: keyof TRecord, params?: (DatalistColumnClientSide<StringUnknownRecord, StringUnknownRecord> | DatalistColumnServerSide<StringUnknownRecord, StringUnknownRecord>) & { isSortable?: boolean, isGlobalFilter?: boolean }) {
		this.columnName = name
		this.props.field = this.props.field || name as string
		this.props.header = this.props.header || name as string
		if (params) {
			this.slots = params.slots
			this.editInput = params.editInput
			this.isSortable = params.isSortable
			this.props.sortable = params.isSortable
			this.filters = params.filters
			this.isGlobalFilter = params.isGlobalFilter
			this.router = params.router
		}
	}
}

