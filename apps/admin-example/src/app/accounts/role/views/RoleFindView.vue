<script setup lang="ts">
import { apiClient } from "@/pkg/api/apiClient";
import { ROUTES, USER_ROW_IDENTIFIER } from "../../constants/UserConstants";
import { DataView, type DataViewProps } from "@devkitvue/dataview";
import type {
  AccountsSchemaUserView,
  UserFindRequest,
  UserFindResponse,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
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
    <template #cardImage="{ data }">
      <AppImage :src="data.userImage" />
    </template>
    <template #cardInfo="{ data }">
      <div><strong>Email:</strong> {{ data.userEmail }}</div>
      <div><strong>Phone:</strong> {{ data.userPhone }}</div>
      <div><strong>Created:</strong> {{ data.createdAt }}</div>
      <div><strong>Deleted:</strong> {{ data.deletedAt || "N/A" }}</div>
      <div><strong>ID:</strong> {{ data.userId }}</div>
    </template>
  </DataView>
</template>
