<script setup lang="ts">
import {
  Datalist,
  type DatalistColumnsBase,
  type DatalistProps,
} from "@devkitvue/datalist";
import type {
  AccountsSchemaUserView,
  UserListRequest,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import {
  USER_COLUMNS_MAP,
  ROUTES,
  KEYS,
  USER_ROW_IDENTIFIER,
  ROUTE_PARAM_NAME,
  USER_TITLE,
  USER_DESCRIPTION,
} from "../../constants/UserConstants.ts";
import { apiClient } from "@/pkg/api/apiClient";

const columns: DatalistColumnsBase<AccountsSchemaUserView> = USER_COLUMNS_MAP;

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
    columns,
    records: apiClient.userList,
    viewRouter: {
      name: ROUTES.FIND.name,
      paramName: ROUTE_PARAM_NAME,
      paramColumnName: USER_ROW_IDENTIFIER,
    },
    isActionsDropdown: true,
    isLazyFilters: true,
    options: {
      title: USER_TITLE,
      description: USER_DESCRIPTION,
    },
  },
};
</script>

<template>
  <div class="glass rounded-lg">
    <Datalist :context="tableProps.context"> </Datalist>
  </div>
</template>
