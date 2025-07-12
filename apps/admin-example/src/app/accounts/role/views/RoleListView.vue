<script setup lang="ts">
import {
  Datalist,
  type DatalistColumnsBase,
  type DatalistProps,
} from "@devkitvue/datalist";
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
    options: {
      title: TITLE,
      description: DESCRIPTION,
    },
  },
};
</script>

<template>
  <div class="glass rounded-lg">
    <Datalist :context="tableProps.context"> </Datalist>
  </div>
</template>
