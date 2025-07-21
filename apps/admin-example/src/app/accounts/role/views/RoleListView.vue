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
} from "../../constants/RoleConstants.ts";
import { apiClient } from "@/pkg/api/apiClient";
import { DateStringDigitToDate } from "@devkitvue/form";

const tableProps: DatalistProps<
  typeof apiClient,
  RoleListRequest,
  RoleListRow
> = {
  context: {
    datalistKey: KEYS.DATALIST_KEY,
    rowIdentifier: ROW_IDENTIFIER,
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
          class="grid card-content grid-cols-5 glass shadow-sm rounded-lg h-full w-full cursor-pointer gap-4 min-h-[10rem]"
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
            class="card-info flex flex-col col-span-3 justify-between pt-12 pb-2"
          >
            <div class="top">
              <h2 class="font-bold mb-4 text-2xl max-w-[100px]">
                {{ data.roleName }}
              </h2>

              <h3 class="font-bold mb-4 text-xl max-w-[100px]">
                {{ data.tenantName }}
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
