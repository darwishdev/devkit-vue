<script setup lang="ts">
import { apiClient } from "@/pkg/api/apiClient";
import { ROUTES, USER_ROW_IDENTIFIER } from "../../constants/UserConstants";
import { type DataViewProps } from "./types";
import DataView from "./DataView.vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import Tag from "primevue/tag";
import type {
  UserFindRow,
  UserFindRequest,
  UserFindResponse,
  UserSession,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import {
  dateHumanFormat,
  DateStringDigitToDate,
} from "@devkitvue/base-components";
import DataList from "@/pkg/components/DataList.vue";
import { h, ref } from "vue";
import {
  ColumnDate,
  ColumnFlag,
  ColumnText,
  type DatalistContext,
} from "@devkitvue/datalist";
import type { StringUnknownRecord } from "@devkitvue/config";
const props: DataViewProps<
  typeof apiClient,
  UserFindRequest,
  UserFindRow,
  UserFindResponse
> = {
  context: {
    title: "user details",
    viewKey: "user_find",
    startFields: {
      userEmail: { props: { label: "user email" } },
      userPhone: { props: { label: "user Phone" } },
      createdAt: {
        props: {
          label: "joined",
          valueAdapter: (v: string) =>
            dateHumanFormat(v, DateStringDigitToDate) || "",
        },
      },
      userTypeName: {
        props: {
          label: "user type",
        },
        slots: {
          displayValue: ({ displayValue }) => h(Tag, { value: displayValue }),
        },
      },
    },

    endFields: {
      lastLogIn: {
        props: {
          label: "latest login",
          icon: "login-circle-line",
          useCardStyle: true,
          defaultValue: "Never Logged In",
          valueAdapter: (v: string) =>
            dateHumanFormat(v, DateStringDigitToDate) || "Never Logged In",
        },
      },
      userSecurityLevel: {
        props: {
          label: "Security Level",
          icon: "user-community-line",
          useCardStyle: true,
        },
      },
      tenantName: {
        props: {
          label: "User Company",
          icon: "building-line",
          useCardStyle: true,
          defaultValue: "No Company",
        },
      },
      permissionCount: {
        props: {
          label: "permissions count",
          icon: "award-line",
          useCardStyle: true,
        },
      },
    },
    pt: { endFieldsWrapper: "grid gap-4 p-4 grid-cols-4" },
    cardConfig: {
      deletedAtKey: "deletedAt" as const,
      createdAtKey: "createdAt" as const,
      badgeKey: "userSecurityLevel" as const,
      gridConfig: { columns: 2 },
      imageHeight: "10rem",
      pt: { title: "me-[3rem]", info: "col-span-1" },
      layout: "vertical",
      imageKey: "userImage" as const,
      titleRouter: "/accounts/user/",
      titleKey: "userName" as const,
      dateAdapter: DateStringDigitToDate,
    },
    record: apiClient.userFind,
    listRoute: ROUTES.LIST.path,
    rowIdentifier: USER_ROW_IDENTIFIER,
  },
};
const sessionsTableContext: Omit<
  DatalistContext<typeof apiClient, StringUnknownRecord, UserSession>,
  "records"
> = {
  datalistKey: "user_sessions",
  rowIdentifier: "sessionKey",
  columns: {
    sessionKey: new ColumnText("sessionKey"),
    isBlocked: new ColumnFlag("isBlocked"),
    createdAt: new ColumnDate("accessTokenExpiresAt"),
    accessTokenExpiresAt: new ColumnDate("accessTokenExpiresAt"),
    refreshTokenExpiresAt: new ColumnDate("accessTokenExpiresAt"),
  },
  filters: [
    {
      matchMode: "in",
      isGlobal: true,
      input: {
        $formkit: "devkitDropdown",
        name: "actionType",
        label: "Action Type",
        outerClass: "col-span-2",
        fluid: true,
        optionLabel: "label",
        placeholder: "Select action types",
        multiple: true,
        options: [
          { label: "Create", value: "create" },
          { label: "Update", value: "update" },
          { label: "Delete", value: "delete" },
          { label: "Delete Restore", value: "restore" },
        ],
      },
    },
    {
      matchMode: "in",
      isGlobal: true,
      input: {
        $formkit: "devkitDropdown",
        fluid: true,

        outerClass: "col-span-2",
        name: "statusCode",
        label: "Status Code",
        placeholder: "Select status codes",
        multiple: true,
        options: [
          { label: "OK", value: "ok" },
          { label: "NOT_FOUND", value: "not_found" },
          { label: "INVALID_ARGUMENT", value: "invalid_argument" },
          { label: "INTERNAL", value: "internal" },
          { label: "UNAUTHENTICATED", value: "unauthenticated" },
          { label: "PERMISSION_DENIED", value: "permission_denied" },
        ],
      },
    },
  ],
  options: {
    title: "Sessions",
    description: "sessions_desc",
  },
};
// const queryClient = useQueryClient();
const isSessionsLoadingRef = ref(false);
const setBlocked = (data: UserSession) => {
  isSessionsLoadingRef.value = true;
  apiClient
    .authSessionSetBlocked({
      sessionKey: data.sessionKey,
      isBlocked: !data.isBlocked,
    })
    .then(() => {
      isSessionsLoadingRef.value = false;
    });
};
</script>
<template>
  <DataView v-bind="props">
    <template #footer="{ response }">
      <div class="w-full glass rounded-lg p-4 mt-8">
        <DataList
          v-if="!isSessionsLoadingRef"
          :context="
            {
              records: { records: response.sessions },
              ...sessionsTableContext,
            } as DatalistContext<
              typeof apiClient,
              StringUnknownRecord,
              UserSession
            >
          "
        >
          <template #actions="{ data }">
            <AppBtn :action="() => setBlocked(data)" label="set block" />
          </template>
        </DataList>
        <div v-else>loading</div>
      </div>
      <!-- <div class="w-full glass rounded-lg p-4 mt-8"> -->
      <!--   <DataList -->
      <!--     class="w-full" -->
      <!--     :context="{ -->
      <!--       datalistKey: 'user-logs', -->
      <!--       records: data.logs, -->
      <!--       filters: [ -->
      <!--         { -->
      <!--           matchMode: 'in', -->
      <!--           isGlobal: true, -->
      <!--           input: { -->
      <!--             $formkit: 'devkitDropdown', -->
      <!--             name: 'actionType', -->
      <!--             label: 'Action Type', -->
      <!--             outrClass: 'col-span-2', -->
      <!--             fluid: true, -->
      <!--             optionLabel: 'label', -->
      <!--             placeholder: 'Select action types', -->
      <!--             multiple: true, -->
      <!--             options: [ -->
      <!--               { label: 'Create', value: 'create' }, -->
      <!--               { label: 'Update', value: 'update' }, -->
      <!--               { label: 'Delete', value: 'delete' }, -->
      <!--               { label: 'Delete Restore', value: 'restore' }, -->
      <!--             ], -->
      <!--           }, -->
      <!--         }, -->
      <!--         { -->
      <!--           matchMode: 'in', -->
      <!--           isGlobal: true, -->
      <!--           input: { -->
      <!--             $formkit: 'devkitDropdown', -->
      <!--             fluid: true, -->
      <!---->
      <!--             outrClass: 'col-span-2', -->
      <!--             name: 'statusCode', -->
      <!--             label: 'Status Code', -->
      <!--             placeholder: 'Select status codes', -->
      <!--             multiple: true, -->
      <!--             options: [ -->
      <!--               { label: 'OK', value: 'ok' }, -->
      <!--               { label: 'NOT_FOUND', value: 'not_found' }, -->
      <!--               { label: 'INVALID_ARGUMENT', value: 'invalid_argument' }, -->
      <!--               { label: 'INTERNAL', value: 'internal' }, -->
      <!--               { label: 'UNAUTHENTICATED', value: 'unauthenticated' }, -->
      <!--               { label: 'PERMISSION_DENIED', value: 'permission_denied' }, -->
      <!--             ], -->
      <!--           }, -->
      <!--         }, -->
      <!--       ], -->
      <!--       displayType: 'table', -->
      <!--       cardConfig: { -->
      <!--         createdAtKey: 'creaddAt', -->
      <!--         dateAdapter: DateStringDigitToDate, -->
      <!--       }, -->
      <!--       options: { -->
      <!--         title: 'Logs', -->
      <!--         description: 'User activity logs', -->
      <!--       }, -->
      <!--     }" -->
      <!--   /> -->
      <!-- </div> -->
    </template>
    <!-- <template #cardHeaderStart> -->
    <!--   <h2 class="text-3xl z-30 border-l-8 font-bold border-l-primary p-4"> -->
    <!--     {{ t("user details") }} -->
    <!--   </h2> -->
    <!-- </template> -->
    <template #cardStart="{ data }"> </template>
    <!--   <div class="mt-32 p-8"> -->
    <!--     <div class="flex flex-wrap gap-4 items-center"> -->
    <!--       <AppImage -->
    <!--         class="w-[8rem] h-[8rem] rounded-full overflow-hidden my-4" -->
    <!--         :src="data.userImage" -->
    <!--       /> -->
    <!--       <!-- User Info -->
    -->
    <!--       <div class="flex flex-col space-y-2"> -->
    <!--         <h3 class="text-4xl font-bold mb-4">{{ data.userName }}</h3> -->
    <!--         <div class="flex items-center gap-8 flex-wrap"> -->
    <!--           <div class="info-block"> -->
    <!--             <h3 class="text-xl mb-2">User Email</h3> -->
    <!--             <a -->
    <!--               class="font-bold flex text-2xl items-center" -->
    <!--               v-if="data.userEmail" -->
    <!--               :title="`${t('userEmail')} : ${data.userEmail}`" -->
    <!--               :href="`mailto:${data.userEmail}`" -->
    <!--             > -->
    <!--               <span class="line-clamp-1">{{ data.userEmail }}</span> -->
    <!--             </a> -->
    <!--           </div> -->
    <!--           <div class="info-block"> -->
    <!--             <h3 class="text-xl mb-2">User Phone</h3> -->
    <!--             <a -->
    <!--               class="font-bold flex text-2xl items-center" -->
    <!--               v-if="data.userEmail" -->
    <!--               :title="`${t('userEmail')} : ${data.userEmail}`" -->
    <!--               :href="`mailto:${data.userEmail}`" -->
    <!--             > -->
    <!--               <span class="line-clamp-1">{{ data.userPhone }}</span> -->
    <!--             </a> -->
    <!--           </div> -->
    <!---->
    <!--           <div class="info-block"> -->
    <!--             <h3 class="text-xl mb-2">User Type</h3> -->
    <!--             <div> -->
    <!--               <Tag :value="data.userTypeName" severity="warn" /> -->
    <!--             </div> -->
    <!--           </div> -->
    <!---->
    <!--           <!--   <div> -->
    -->
    <!--           <!--     <span class="font-medium mb-4 ">Phone Number</span -->
    -->
    <!--           <!--     ><br /> -->
    -->
    <!--           <!--     {{ data.userPhone }} -->
    -->
    <!--           <!--   </div> -->
    -->
    <!--           <!--   <div class="col-span-2"> -->
    -->
    <!--           <!--     <span class="font-medium ">Email Address</span><br /> -->
    -->
    <!--           <!--     {{ data.userEmail }} -->
    -->
    <!--           <!--   </div> -->
    -->
    <!--           <div> -->
    <!--             <h3 class="text-xl mb-2">Roles</h3> -->
    <!--             <div class="flex gap-2 mu-4 user_roles" v-if="data.roles"> -->
    <!--               <Tag -->
    <!--                 v-for="role in data.roles" -->
    <!--                 :key="role.roleId" -->
    <!--                 :value="role.roleName" -->
    <!--               /> -->
    <!--             </div> -->
    <!--           </div> -->
    <!--           <div class="info-block"> -->
    <!--             <h3 class="text-xl mb-2">created at</h3> -->
    <!--             <div> -->
    <!--               <span -->
    <!--                 class="line-clamp-1 font-bold flex text-2xl items-center" -->
    <!--                 >{{ -->
    <!--                   dateHumanFormat(data.createdAt, DateStringDigitToDate) -->
    <!--                 }}</span -->
    <!--               > -->
    <!--             </div> -->
    <!--           </div> -->
    <!--         </div> -->
    <!--       </div> -->
    <!--     </div> -->
    <!--   </div> -->
    <!-- </template> -->
    <!-- <template #cardEnd="{ data }"> -->
    <!--   <div class="grid lg:grid-cols-4 p-4 gap-4"> -->
    <!--     <div class="glass items-center flex gap-4 rounded-lg p-4"> -->
    <!--       <div -->
    <!--         class="glass w-12 h-12 flex items-center justify-center rounded-full" -->
    <!--       > -->
    <!--         <AppIcon icon="login-circle-line" class="custom-icon w-8 h-8" /> -->
    <!--       </div> -->
    <!--       <div class="info"> -->
    <!--         <h2 class="text-xl font-bold mb-2"> -->
    <!--           {{ -->
    <!--             data.lastLogIn -->
    <!--               ? dateHumanFormat(data.lastLogIn, DateStringDigitToDate) -->
    <!--               : "Never Logged In" -->
    <!--           }} -->
    <!--         </h2> -->
    <!--         <span class="text-xl">latest login</span> -->
    <!--       </div> -->
    <!--     </div> -->
    <!--     <div class="glass items-center flex gap-4 rounded-lg p-4"> -->
    <!--       <div -->
    <!--         class="glass w-12 h-12 flex items-center justify-center rounded-full" -->
    <!--       > -->
    <!--         <AppIcon icon="user-community-line" class="custom-icon w-8 h-8" /> -->
    <!--       </div> -->
    <!--       <div class="info"> -->
    <!--         <h2 class="text-xl font-bold mb-2">{{ data.userSecurityLevel }}</h2> -->
    <!--         <span class="text-xl">Security Level</span> -->
    <!--       </div> -->
    <!--     </div> -->
    <!--     <div class="glass items-center flex gap-4 rounded-lg p-4"> -->
    <!--       <div -->
    <!--         class="glass w-12 h-12 flex items-center justify-center rounded-full" -->
    <!--       > -->
    <!--         <AppIcon icon="building-line" class="custom-icon w-8 h-8" /> -->
    <!--       </div> -->
    <!--       <div class="info"> -->
    <!--         <h2 class="text-xl font-bold mb-2"> -->
    <!--           {{ data.tenantName ? data.tenantName : "No Company" }} -->
    <!--         </h2> -->
    <!--         <span class="text-xl">User Company</span> -->
    <!--       </div> -->
    <!--     </div> -->
    <!--     <div class="glass items-center flex gap-4 rounded-lg p-4"> -->
    <!--       <div -->
    <!--         class="glass w-12 h-12 flex items-center justify-center rounded-full" -->
    <!--       > -->
    <!--         <AppIcon icon="award-line" class="custom-icon w-8 h-8" /> -->
    <!--       </div> -->
    <!--       <div class="info"> -->
    <!--         <h2 class="text-xl font-bold mb-2">{{ data.permissionCount }}</h2> -->
    <!--         <span class="text-xl">permissions count</span> -->
    <!--       </div> -->
    <!--     </div> -->
    <!--   </div> -->
    <!-- </template> -->
  </DataView>
</template>
