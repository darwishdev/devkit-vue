<script lang="ts" setup generic="
		TApi extends Record<string, Function>,
		TReq extends Record<string, unknown>,
		TRecord extends Record<string, unknown>,
		TFiltersReq extends Record<string, unknown> | undefined = undefined,
		TApiResponse extends Record<string, unknown> | undefined = undefined,
		TFormSectionsRequest extends Record<string, unknown> | undefined = undefined">

		import { computed, h } from 'vue';
		import DataTable, {
			type DataTableFilterEvent,
			type DataTablePageEvent,
			type DataTableSortEvent,
		} from "primevue/datatable";

		import { useDatalistStoreWithKey } from '../store/DatalistStore';

		import { Column } from "primevue";
		import { DatalistProps, DatalistSlots } from '../types';
		import {AppForm} from '@devkit/form';
		import { ObjectKeys } from '@devkit/apiclient';
		const props = defineProps<DatalistProps<TApi, TReq, TRecord, TFiltersReq, TApiResponse, TFormSectionsRequest>>();
		const datalistStore = useDatalistStoreWithKey(props.context.datalistKey)

		const slots = defineSlots<DatalistSlots<TApi, TReq, TRecord, TFiltersReq, TApiResponse, TFormSectionsRequest>>()
		const currentDataColumns = computed(() => {
			return ObjectKeys(datalistStore.datatableColumnsRef).map((columeKey) => {
				const currentColumn = datalistStore.datatableColumnsRef[columeKey];
				const columnSlot = `column.${columeKey as string}` in slots ? slots[`column.${columeKey as string}`] : undefined
				console.log('columnsslot is ', slots, columnSlot)
				if (currentColumn) {
					return h(
						Column,
						{
							...currentColumn.props,
							pt: {
								headerCell: "transparent",
							},
						},
						{ ...currentColumn.slots, body: columnSlot || currentColumn.slots?.body },
					);
				}
			});
		});

		await datalistStore.init()
		console.log("propsis", props)

</script>
<template>
	<slot name='globalActions.create' v-bind="{ store: datalistStore }" />
	<AppForm
		:context="{ ...datalistStore.filtersFormProps.context, sections: { 'filters': datalistStore.filtersFormSchema } }" />
	<DataTable :rows="10" :value="datalistStore.currenData" :max-height="200"
		:filters="datalistStore.filterFormValue" paginator metaKeySelection
		paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
		:loading="datalistStore.datalistQueryResult.isLoading">
		<Column selection-mode="multiple" :pt="{ headerCell: 'transparent' }">
		</Column>
		<component v-for="column in currentDataColumns" :is="column">

		</component>
		<Column header='actions' :header-style="{ width: '1rem' }" v-if="!context.hideActions">
			<template #body>
				<div class="d-flex">
					<component v-for="actionBtn in datalistStore.rowActions" :is="actionBtn" />
				</div>
			</template>
		</Column>

	</DataTable>
</template>
