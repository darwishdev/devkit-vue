<script setup lang="ts">
import { apiClient } from "@/pkg/api/apiClient";
import { ROUTES, USER_ROW_IDENTIFIER } from "../../constants/UserConstants";
import { DataView, type DataViewProps } from "@devkitvue/dataview";
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
      roles: {
        props: {
          label: "roles",
        },
        slots: {
          displayValue: ({ value }) =>
            h(
              "div",
              { class: "flex gap-2 flex-wrap" },
              value.map((role) => h(Tag, { value: role.roleName })),
            ),
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
    </template>
  </DataView>
</template>
