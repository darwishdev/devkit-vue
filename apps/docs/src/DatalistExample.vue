
<script setup lang="ts">
import type { AppFormSections } from "@devkit/form";
import  {
  Datalist,
  ColumnText,
  type DatalistColumnsBase,
  type DatalistProps,
  ColumnImage,
} from "@devkit/datalist";

import { useI18n } from "vue-i18n";
import type { SectionCreateUpdateRequest, SectionListRequest, TenantsSchemaSection } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/tenant_section_pb";
import { apiClient } from "./apiClient";
const { t } = useI18n();



const columns: DatalistColumnsBase<TenantsSchemaSection> = {
	sectionId: new ColumnText("sectionId", {
		isSortable: true,
	}),
	sectionName: new ColumnText("sectionName", {
		isSortable: true,
		isGlobalFilter: true,
		filters: [
			{
				isGlobal: true,
				matchMode: "contains",
				input: {
					$formkit: "text",
					prefixIcon: "search",
					outerClass: "col-12 sm:col-6 md:col-3",
					name: "sectionName",
					label: t("sectionName"),
					placeholder: t("sectionName"),
				},
			},
		],
	}),
	sectionHeader: new ColumnImage("sectionBackground", {
		isSortable: true,
	}),
};

const rowIdentifier = "sectionId" as const;

const tableProps: DatalistProps<
	typeof apiClient,
	SectionListRequest,
	TenantsSchemaSection,
	undefined,
	undefined,
	SectionCreateUpdateRequest
> = {
	context: {
		datalistKey: "tenant-sections",
		title: t("tenantSections"),
		rowIdentifier,
		columns,
		records: apiClient.sectionList,
		viewRouter: {
			name: "tenant_section_find",
			paramName: "id",
			paramColumnName: rowIdentifier,
		},
		isServerSide: false,
		isPresistFilters: true,
		isExportable: false,
		isLazyFilters: true,
		isActionsDropdown: true,
		options: { title: t("tenantSections"), description: t("Manage all tenant homepage sections") },
	},
};
</script>

<template>
  <Suspense>
  <Datalist v-bind="tableProps" />
  </Suspense>
</template>
<style>
.p-datatable img {
  max-width: 200px !important;
}

.p-datatable-header .d-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--gap);
}

.global-actions {
  display: flex;
  gap: var(--gap);
}
</style>
