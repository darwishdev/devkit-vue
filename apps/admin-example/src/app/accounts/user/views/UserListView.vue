<script setup lang="ts">
import { type DatalistProps } from "@devkitvue/datalist";
import { DateStringDigitToDate } from "@devkitvue/form";
import type {
  UserListRow,
  UserListRequest,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import {
  ROUTES,
  KEYS,
  USER_ROW_IDENTIFIER,
  ROUTE_PARAM_NAME,
  userRolesInput,
  TITLE,
  DESCRIPTION,
} from "../../constants/UserConstants.ts";
import { apiClient } from "@/pkg/api/apiClient";
import DataList from "@/pkg/components/DataList.vue";

const tableProps: DatalistProps<
  typeof apiClient,
  UserListRequest,
  UserListRow,
  undefined,
  undefined,
  undefined
> = {
  context: {
    datalistKey: KEYS.DATALIST_KEY,
    rowIdentifier: USER_ROW_IDENTIFIER,
    filters: [
      {
        matchMode: "in",
        input: userRolesInput,
      },
    ],
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
        <div
          class="grid card-content grid-cols-3 glass shadow-sm rounded-lg h-full w-full cursor-pointer gap-4"
        >
          <AppImage
            class="card-image bg-primary/40 rounded-l-lg"
            :useBackgroundImage="true"
            :src="data.userImage"
          />
          <div
            class="card-info flex flex-col justify-center col-span-2 pe-12 py-4"
          >
            <h2 class="font-bold text-2xl">{{ data.userName }}</h2>
            <h3 class="font-bold">{{ data.userEmail }}</h3>
            <h4>{{ data.userSecurityLevel }}</h4>
            <div class="flex justify-between-items-center">
              <span>{{
                DateStringDigitToDate(data.createdAt).toDateString()
              }}</span>
              <span v-if="data.deletedAt">
                {{ DateStringDigitToDate(data.deletedAt).toDateString() }}
              </span>
            </div>
            <ul class="flex gap-2 flex-wrap">
              <li
                v-for="r in data.roles"
                @click="`/accounts/roles/${r.roleId}`"
              >
                {{ r.roleName }}
              </li>
            </ul>
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>
<style>
tr[data-p-selected="true"] .card-content {
  /* Your styles here */
  transition: all 0.3s;

  background-color: color-mix(
    in srgb,
    var(--primary-color) 20%,
    transparent
  ) !important;
  transform: scale(1.02);
  font-weight: bold;
  border: 1px solid var(--primary-color);
}
.formkit-form {
  .p-multiselect,
  .p-inputtext,
  .p-select,
  input {
    --tw-bg-opacity: 0.3;
    --tw-border-opacity: 0.3;
  }
}
</style>
