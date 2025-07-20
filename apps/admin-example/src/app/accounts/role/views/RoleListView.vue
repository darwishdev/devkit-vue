<script setup lang="ts">
import {
  type DatalistColumnsBase,
  type DatalistProps,
} from "@devkitvue/datalist";
import { DateStringDigitToDate } from "@devkitvue/form";
import DataList from "@/pkg/components/DataList.vue";
import type {
  AccountsSchemaRole,
  RoleListRequest,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_role_pb";
import {
  COLUMNS_MAP,
  ROUTES,
  KEYS,
  ROW_IDENTIFIER,
  ROUTE_PARAM_NAME,
  TITLE,
  DESCRIPTION,
} from "../../constants/RoleConstants.ts";
import { apiClient } from "@/pkg/api/apiClient";

const columns: DatalistColumnsBase<AccountsSchemaRole> = COLUMNS_MAP;

const tableProps: DatalistProps<
  typeof apiClient,
  RoleListRequest,
  AccountsSchemaRole
> = {
  context: {
    datalistKey: KEYS.DATALIST_KEY,
    rowIdentifier: ROW_IDENTIFIER,
    columns,
    records: apiClient.roleList,
    viewRouter: {
      name: ROUTES.FIND.name,
      paramName: ROUTE_PARAM_NAME,
      paramColumnName: ROW_IDENTIFIER,
    },
    isActionsDropdown: true,
    isLazyFilters: false,
    displayType: "card",
    options: {
      title: TITLE,
      description: DESCRIPTION,
    },
  },
};
</script>

<template>
  <div class="glass rounded-lg">
    <DataList :context="tableProps.context">
      <template #card="{ data }">
        <div
          class="grid card-content grid-cols-2 glass shadow-sm rounded-lg h-full w-full cursor-pointer gap-4 min-h-[10rem]"
        >
          <div
            class="bg-primary/40 rounded-l-lg flex-col flex justify-center item-center"
          >
            <h3 class="font-bold text-center text-md">PERMISSIONS</h3>
            <h2 class="font-bold text-center text-4xl">86</h2>
            <h3 class="font-bold text-center text-md">USERS</h3>
            <h2 class="font-bold text-center text-4xl">16</h2>
          </div>
          <div class="card-info flex flex-col justify-center pe-12 py-4">
            <h2 class="font-bold mb-4 text-2xl">{{ data.roleName }}</h2>
            <div class="flex justify-between-items-center">
              <span>Created At : {{ data.createdAt }}</span>
            </div>
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>
