<script setup lang="ts">
import { DataCard, type DatalistProps } from "@devkitvue/datalist";
import { DateStringDigitToDate } from "@devkitvue/base-components";

import type {
  UserListRow,
  UserListRequest,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";

import {
  FILTERS,
  ROUTES,
  KEYS,
  USER_ROW_IDENTIFIER,
  ROUTE_PARAM_NAME,
  TITLE,
  DESCRIPTION,
} from "../../constants/UserConstants.ts";

// import AppCardGrid from "../../role/views/AppCardGrid.vue";
import { apiClient } from "@/pkg/api/apiClient";
import DataList from "@/pkg/components/DataList.vue";
import { useI18n } from "vue-i18n";

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
    filters: FILTERS,
    records: apiClient.userList,
    viewRouter: {
      name: ROUTES.FIND.name,
      paramName: ROUTE_PARAM_NAME,
      paramColumnName: USER_ROW_IDENTIFIER,
    },
    cardConfig: {
      deletedAtKey: "deletedAt",
      createdAtKey: "createdAt",
      badgeKey: "userSecurityLevel",
      imageHeight: "10rem",
      pt: { title: "me-[3rem]" },
      // layout: "vertical",
      imageKey: "userImage",
      titleRouter: "/accounts/user/",
      titleKey: "userName",
      dateAdapter: DateStringDigitToDate,
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
const { t } = useI18n();
</script>

<template>
  <div class="glass rounded-lg">
    <DataList v-bind="tableProps" :context="tableProps.context">
      <template #cardSubtitle="{ data }">
        <a
          class="font-bold flex items-center"
          v-if="data.userEmail"
          :title="`${t('userEmail')} : ${data.userEmail}`"
          :href="`mailto:${data.userEmail}`"
        >
          <AppIcon icon="mail-open-line" class="custom-icon w-4 h-4 me-2" />
          <span class="line-clamp-1">{{ data.userEmail }}</span>
        </a>
        <a
          class="font-bold flex items-center line-clamp-1"
          v-if="data.userPhone"
          :title="`${t('userPhone')} : ${data.userPhone}`"
          :href="`tel:${data.userPhone}`"
        >
          <AppIcon icon="phone-line" class="custom-icon w-4 h-4 me-2" />
          {{ data.userPhone }}
        </a>

        <AppBtn
          :action="`/tenants/tenant/${data.tenantId}`"
          justify="start"
          icon="building-line"
          :label="data.tenantName"
          v-tooltip="data.tenantName"
          class="max-w-[200px] text-left"
          v-if="data.tenantName"
        />
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
