<script setup lang="ts">
import { type DatalistProps } from "@devkitvue/datalist";
import { DateStringDigitToDate } from "@devkitvue/form";
import type {
  AccountsSchemaUserView,
  UserListRequest,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import {
  COLUMNS_MAP,
  ROUTES,
  KEYS,
  USER_ROW_IDENTIFIER,
  ROUTE_PARAM_NAME,
  TITLE,
  DESCRIPTION,
} from "../../constants/UserConstants.ts";
import { apiClient } from "@/pkg/api/apiClient";
import DataList from "@/pkg/components/DataList.vue";

const tableProps: DatalistProps<
  typeof apiClient,
  UserListRequest,
  AccountsSchemaUserView,
  undefined,
  undefined,
  undefined
> = {
  context: {
    datalistKey: KEYS.DATALIST_KEY,
    rowIdentifier: USER_ROW_IDENTIFIER,
    columns: COLUMNS_MAP,
    records: apiClient.userList,
    viewRouter: {
      name: ROUTES.FIND.name,
      paramName: ROUTE_PARAM_NAME,
      paramColumnName: USER_ROW_IDENTIFIER,
    },
    isActionsDropdown: true,
    displayType: "card",
    isLazyFilters: false,
    options: {
      title: TITLE,
      description: DESCRIPTION,
    },
  },
};
</script>

<template>
  <div class="glass rounded-lg">
    <DataList v-bind="tableProps" :context="tableProps.context">
      <template #card="{ data }">
        <div class="rounded glass p-4">
          <AppImage :src="data.userImage" />
          <div>{{ data.userName }}</div>
          <div>{{ data.userEmail }}</div>
          <div>{{ data.userPhone }}</div>
          <div>{{ data.createdAt }}</div>
          <div v-if="data.deletedAt">
            {{ DateStringDigitToDate(data.deletedAt).toDateString() }}
          </div>
          <div v-for="r in data.roles" @click="`/accounts/roles/${r.roleId}`">
            {{ r.roleName }}
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>
