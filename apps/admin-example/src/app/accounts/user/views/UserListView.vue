<script setup lang="ts">
import {
  Datalist,
    ColumnText,
	ColumnDate,
	type DatalistColumnsBase,
	type DatalistProps,
    ColumnImage,
} from "@devkit/datalist";
import type {  AccountsSchemaUserView, UserListRequest } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import { useI18n } from "vue-i18n";
import { apiClient } from "@/pkg/api/apiClient";

const { t } = useI18n();

const columns: DatalistColumnsBase<AccountsSchemaUserView> = {
	userId: new ColumnText("userId", {
		isSortable: true,
	}),
	userName: new ColumnText("userName", {
		isSortable: true,
		isGlobalFilter: true,
		filters: [
			{
				isGlobal: true,
				matchMode: "contains",
				input: {
					$formkit: "text",
					prefixIcon: "search",
					name: "userName",
					label: t("userName"),
					placeholder: t("userName"),
				},
			},
		],
	}),
	userEmail: new ColumnText("userEmail", {
		isSortable: true,
    filters: [
			{
				isGlobal: true,
				matchMode: "contains",
				input: {
					$formkit: "text",
					prefixIcon: "search",
					name: "userEmail",
					label: t("userEmail"),
					placeholder: t("userEmail"),
				},
			},
		]
	}),
  userTypeName: new ColumnText("userTypeName", {
		isSortable: true,
    filters: [
			{
				isGlobal: true,
				matchMode: "in",
				input: {
					$formkit: "devkitDropdown",
          fluid: true,
          name: "userTypeId",
          size: 'small',
          multiple: true,
          options: 'userTypeListInput',
          label: t("userType"),
          placeholder: t("userType"),
        },
      },
    ]
  }),
 userImage: new ColumnImage("userImage", {
    isSortable: false,
  }),

  userPhone: new ColumnText("userPhone", {
    isSortable: true,
    filters: [
      {
        isGlobal: true,
        matchMode: "contains",
        input: {
          $formkit: "text",
          prefixIcon: "search",
          name: "userPhone",
          label: t("userPhone"),
          placeholder: t("userPhone"),
        },
      },
    ]
  }),
  createdAt: new ColumnDate("createdAt", {
    isSortable: true,
    filters: [
      {
        isGlobal: false,
        matchMode: "between",
        input: {
					outerClass: "col-span-2",
          $formkit: "devkitDatepicker",
          fluid:true,
          size:'small',
          selectionMode: 'range',
          name: "createdAt",
          label: t("createdAt"),
          convertToNumber: true,
          placeholder: t("createdAt"),
        },
      },
    ]
  }),
  updatedAt: new ColumnDate("updatedAt", {
    isSortable: true,
    filters: [
      {
        isGlobal: false,
        matchMode: "between",
        input: {
          $formkit: "devkitDatepicker",
					outerClass: "col-span-2",
          selectionMode: 'range',
          fluid:true,
          name: "updatedAt",
          label: t("updatedAt"),
          showTime : true,
          convertToNumber: true,
          placeholder: t("updatedAt"),
        },
      },
    ]
  }),
  deletedAt: new ColumnDate("deletedAt", {
    isSortable: true,
    filters: [
      {
        isGlobal: false,
        matchMode: "between",
        input: {
          $formkit: "devkitDatepicker",
          outerClass: "basis-1/3",
          selectionMode: 'range',
          name: "deletedAt",
          label: t("deletedAt"),
          showTime : true,
          convertToNumber: true,
          placeholder: t("deletedAt"),
        },
      },
    ]
  }),

};
const rowIdentifier = "userId" as const;

const tableProps: DatalistProps<
  typeof apiClient,
  UserListRequest,
  AccountsSchemaUserView,
  undefined,
  undefined,
  undefined
  > = {
    context: {
      datalistKey: "tenant-pages",
      datatableProps: {
        pt: {
          header: 'transparent',
          thead: 'transparent',
          foorer: 'transparent',
          paginator: 'transparent',
        },

      },
      title: t("tenantPages"),
      rowIdentifier,
      columns,
      records: apiClient.userList,
      viewRouter: {
        name: "tenant_page_find",
        paramName: "id",
        paramColumnName: rowIdentifier,
      },
      isServerSide: false,
      isPresistFilters: false,
      isExportable: true,
      isLazyFilters: true,
      isActionsDropdown: true,
      options: {
        title: 'user_list',
        description: 'user_list_description',
      },
    },
  };
</script>

<template>
  <div class="glass rounded-lg">
  <Datalist  :context="tableProps.context" />
  </div>
</template>
