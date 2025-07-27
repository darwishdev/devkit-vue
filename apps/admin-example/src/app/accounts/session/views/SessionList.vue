<script setup lang="ts">
import { type DatalistProps } from "@devkitvue/datalist";
import { DateStringDigitToDate } from "@devkitvue/base-components";

import type {
  UserListRow,
  UserListRequest,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";

import {
  COLUMNS_MAP,
  ROUTES,
  KEYS,
  ROW_IDENTIFIER,
  ROUTE_PARAM_NAME,
  TITLE,
  DESCRIPTION,
} from "../../constants/SessionConstants.ts";

import { apiClient } from "@/pkg/api/apiClient";
import DataList from "@/pkg/components/DataList.vue";
import { useI18n } from "vue-i18n";
import type {
  AuthSession,
  AuthSessionListRequest,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_auth_pb";

const tableProps: DatalistProps<
  typeof apiClient,
  AuthSessionListRequest,
  AuthSession
> = {
  context: {
    datalistKey: KEYS.DATALIST_KEY,
    rowIdentifier: ROW_IDENTIFIER,
    columns: COLUMNS_MAP,
    records: apiClient.authSessionList,
    viewRouter: {
      name: ROUTES.FIND.name,
      paramName: ROUTE_PARAM_NAME,
      paramColumnName: ROW_IDENTIFIER,
    },
    options: {
      title: TITLE,
      description: DESCRIPTION,
    },
  },
};
const { t } = useI18n();
</script>

<template>
  <div class="glass rounded-lg">
    <DataList v-bind="tableProps"> </DataList>
  </div>
</template>
