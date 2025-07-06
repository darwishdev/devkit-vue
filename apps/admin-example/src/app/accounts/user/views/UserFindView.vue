<script setup lang="ts">
import { apiClient } from "@/pkg/api/apiClient";
import { ROUTES, USER_ROW_IDENTIFIER } from "../../constants/UserConstants";
import { useDialog } from "primevue";
import { AppDialog } from "@devkit/base-components";
import { DataView, type DataViewProps } from "@devkit/dataview";
import { h } from "vue";
import type {
  AccountsSchemaUserView,
  UserFindRequest,
  UserFindResponse,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
const dialog = useDialog();
const props: DataViewProps<
  typeof apiClient,
  UserFindRequest,
  AccountsSchemaUserView,
  UserFindResponse
> = {
  context: {
    record: apiClient.userFind,
    titleKey: "userName",
    imageKey: "userImage",
    listRouter: ROUTES.LIST.path,
    rowIdentifier: USER_ROW_IDENTIFIER,
  },
};
</script>
<template>
  <DataView v-bind="props">
    <template #cardInfo="{ data }">
      {{ data.userEmail }}
      {{ data.userPhone }}
      {{ data.createdAt }}
      {{ data.deletedAt }}
      {{ data.userId }}
    </template>
  </DataView>
</template>
