<script setup lang="ts">
import { type DatalistProps } from "@devkitvue/datalist";
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
import { DateStringDigitToDate } from "@devkitvue/base-components";
import { useI18n } from "vue-i18n";

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
    cardConfig: {
      dateAdapter: DateStringDigitToDate,
      pt: { info: "justify-center" },
      badgeKey: "roleSecurityLevel",
      deletedAtKey: "deletedAt",
      titleRouter: "/accounts/role/",
      titleKey: "roleName",
      createdAtKey: "createdAt",
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
const { t } = useI18n();
</script>

<template>
  <div class="glass rounded-lg">
    <DataList :context="tableProps.context">
      <template #cardStartContent="{ data }">
        <div class="mt-8 mb-2">
          <h3 class="font-bold text-center text-md">
            {{ t("permissions") }}
          </h3>
          <h2 class="font-bold text-center text-4xl" v-tooltip="data.roleName">
            {{ data.permissionCount }}
          </h2>
          <h3 class="font-bold text-center text-md">{{ t("USERS") }}</h3>
          <h2 class="font-bold text-center text-4xl">
            {{ data.userCount }}
          </h2>
        </div>
      </template>
      <template #cardSubtitle="{ data }">
        <AppBtn
          :action="`/tenants/tenant/${data.tenantId}`"
          justify="start"
          icon="building-line"
          :label="data.tenantName"
          v-tooltip="data.tenantName"
          class="max-w-[200px] text-left"
          v-if="data.tenantName"
        />
        <h3
          class="max-w-[200px] font-bold flex gap-2 text-left"
          v-tooltip="`${t('Tenant')} : ${t('General')}`"
          v-else
        >
          <AppIcon icon="building-line" />
          <span class="line-clamp-2 break-words">
            {{ t("General") }}
          </span>
        </h3>
      </template>
      <!-- <template #card="{ data }"> -->
      <!--   <DataCard -->
      <!--     :data="data" -->
      <!--     identefier="roleId" -->
      <!--     :dateAdapter="DateStringDigitToDate" -->
      <!--     :pt="{ info: 'justify-center' }" -->
      <!--     badgeKey="roleSecurityLevel" -->
      <!--     deletedAtKey="deletedAt" -->
      <!--     titleRouter="/accounts/role/" -->
      <!--     titleKey="roleName" -->
      <!--     createdAtKey="createdAt" -->
      <!--   > -->
      <!--     <template #start-content> -->
      <!--       <div class="mt-8 mb-2"> -->
      <!--         <h3 class="font-bold text-center text-md"> -->
      <!--           {{ t("permissions") }} -->
      <!--         </h3> -->
      <!--         <h2 -->
      <!--           class="font-bold text-center text-4xl" -->
      <!--           v-tooltip="data.roleName" -->
      <!--         > -->
      <!--           {{ data.permissionCount }} -->
      <!--         </h2> -->
      <!--         <h3 class="font-bold text-center text-md">{{ t("USERS") }}</h3> -->
      <!--         <h2 class="font-bold text-center text-4xl"> -->
      <!--           {{ data.userCount }} -->
      <!--         </h2> -->
      <!--       </div> -->
      <!--     </template> -->
      <!--     <template #subtitle> -->
      <!--       <AppBtn -->
      <!--         :action="`/tenants/tenant/${data.tenantId}`" -->
      <!--         justify="start" -->
      <!--         icon="building-line" -->
      <!--         :label="data.tenantName" -->
      <!--         v-tooltip="data.tenantName" -->
      <!--         class="max-w-[200px] text-left" -->
      <!--         v-if="data.tenantName" -->
      <!--       /> -->
      <!--       <h3 -->
      <!--         class="max-w-[200px] font-bold flex gap-2 text-left" -->
      <!--         v-tooltip="`${t('Tenant')} : ${t('General')}`" -->
      <!--         v-else -->
      <!--       > -->
      <!--         <AppIcon icon="building-line" /> -->
      <!--         <span class="line-clamp-2 break-words"> -->
      <!--           {{ t("General") }} -->
      <!--         </span> -->
      <!--       </h3> -->
      <!--     </template> -->
      <!--   </DataCard> -->
      <!-- </template> -->
    </DataList>
  </div>
</template>
