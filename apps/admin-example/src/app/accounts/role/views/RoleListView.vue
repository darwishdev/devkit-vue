<script setup lang="ts">
import { type DatalistProps } from "@devkitvue/datalist";

import Badge from "primevue/badge";
import DataList from "@/pkg/components/DataList.vue";
import type {
  RoleListRow,
  RoleListRequest,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_role_pb";
import {
  ROUTES,
  KEYS,
  ROW_IDENTIFIER,
  ROUTE_PARAM_NAME,
  TITLE,
  DESCRIPTION,
  FILTERS,
} from "../../constants/RoleConstants.ts";
import { apiClient } from "@/pkg/api/apiClient";
import { DateStringDigitToDate } from "@devkitvue/form";
import { AppBtn } from "@devkitvue/base-components";

const tableProps: DatalistProps<
  typeof apiClient,
  RoleListRequest,
  RoleListRow
> = {
  context: {
    datalistKey: KEYS.DATALIST_KEY,
    rowIdentifier: ROW_IDENTIFIER,
    filters: FILTERS,
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
          class="grid card-content grid-cols-5 glass shadow-sm rounded-lg h-full w-full gap-4 min-h-[10rem]"
        >
          <div
            class="bg-primary/40 rounded-l-lg col-span-2 min-h-[12rem] flex-col flex justify-center item-center"
          >
            <h3 class="font-bold text-center text-md">
              {{ $t("permissions") }}
            </h3>
            <h2 class="font-bold text-center text-4xl">
              {{ data.permissionCount }}
            </h2>
            <h3 class="font-bold text-center text-md">{{ $t("USERS") }}</h3>
            <h2 class="font-bold text-center text-4xl">{{ data.userCount }}</h2>
          </div>
          <div
            class="card-info flex flex-col col-span-3 justify-between pt-14 pb-2"
          >
            <div class="top">
              <AppBtn
                :label="data.roleName"
                :action="`/accounts/role/${data.roleId}`"
                justify="start"
                class="font-bold mb-1 text-2xl max-w-[200px]"
              />

              <AppBtn
                :action="`/tenants/tenant/${data.tenantId}`"
                justify="start"
                icon="building-line"
                :label="data.tenantName"
                class="max-w-[200px] text-left"
                v-if="data.tenantName"
              />
              <h3 class="max-w-[200px] font-bold flex gap-2 text-left" v-else>
                <AppIcon icon="building-line" />
                {{ $t("General") }}
              </h3>
            </div>

            <div class="flex justify-between">
              <span class="">
                {{ DateStringDigitToDate(data.createdAt).toDateString() }}
              </span>
              <span>
                {{ $t("Sec Level") }} :
                <Badge>
                  {{ data.permissionCount }}
                </Badge>
              </span>
            </div>
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>
