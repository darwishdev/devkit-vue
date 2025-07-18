<script setup lang="ts">
import { DataList, type DatalistProps } from "@devkitvue/datalist";
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
import { h } from "vue";

const tableProps: DatalistProps<
  typeof apiClient,
  UserListRequest,
  AccountsSchemaUserView
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
const RenderedDataList = () =>
  h(
    DataList<typeof apiClient, UserListRequest, AccountsSchemaUserView>,
    tableProps,
    {
      card: () => null,
      asdasd: () => null,
    },
  );
</script>

<template>
  <div class="glass rounded-lg">
    <component :is="RenderedDataList" />
    <!-- <DataList v-bind="tableProps"> -->
    <!--   <template v-slot:card="{ data }"> -->
    <!--     <div class="rounded glass p-4"> -->
    <!--       <AppImage :src="data.userImage" /> -->
    <!--     </div> -->
    <!--   </template> -->
    <!-- </DataList> -->
  </div>
</template>
