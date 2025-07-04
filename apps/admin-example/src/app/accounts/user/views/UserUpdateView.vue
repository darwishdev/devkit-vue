<script setup lang="ts">
import { AppForm, type AppFormProps } from "@devkit/form";
import type {
  UserCreateUpdateRequest,
  UserCreateUpdateResponse,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import { useI18n } from "vue-i18n";
import { apiClient } from "@/pkg/api/apiClient";

const { t } = useI18n();
const formProps: AppFormProps<
  typeof apiClient,
  UserCreateUpdateRequest,
  UserCreateUpdateResponse
> = {
  context: {
    title: "user_create",
    formKey: "user-create",
    findHandler: {
      endpoint: "userFindForUpdate",
      responsePropertyName: "request",
      requestPropertyName: "recordId",
    },
    submitHandler: {
      endpoint: "userCreateUpdate",
      redirectRoute: "/accounts/user",
    },
    invalidateCaches: ["accounts-user"],
    sections: {
      user_info: {
        title: t("user_create_title"),
        gridConfig: {
          columns: 2,
          gap: 2,
        },
        inputs: [
          {
            $formkit: "text",
            prefixIcon: "search",
            name: "userName",
            label: t("userName"),
            validation: "required",
            placeholder: t("userName"),
          },

          {
            $formkit: "text",
            prefixIcon: "search",
            name: "userEmail",
            disabled: true,
            validation: "required",
            label: t("userEmail"),
            placeholder: t("userEmail"),
          },
          {
            $formkit: "devkitDropdown",
            fluid: true,
            name: "userTypeId",
            size: "small",
            options: "userTypeListInput",
            validation: "required",
            label: t("userType"),
            placeholder: t("userType"),
          },

          {
            $formkit: "devkitDropdown",
            fluid: true,
            name: "roles",
            size: "small",
            multiple: true,
            options: "roleListInput",
            validation: "required",
            label: t("roles"),
            placeholder: t("roles"),
          },
          {
            $formkit: "devkitDropdown",
            fluid: true,
            name: "tenantId",
            size: "small",
            options: "tenantListInput",
            label: t("tenant"),
            placeholder: t("tenant"),
          },
          {
            $formkit: "text",
            prefixIcon: "search",
            validation: "required",
            name: "userPhone",
            label: t("userPhone"),
            placeholder: t("userPhone"),
          },

          {
            $formkit: "password",
            validation: "",
            prefixIcon: "tools",
            outerClass: "col-span-2",
            name: "userPassword",
            placeholder: "password",
            label: "password",
          },
          {
            $formkit: "devkitUpload",
            prefixIcon: "search",
            bucketName: "abchotels",
            dashboardOptions: {
              height: "300px",
            },
            outerClass: "col-span-2",
            name: "userImage",
            label: t("userImage"),
            placeholder: t("userImage"),
          },
        ],
      },
    },
  },
};
</script>

<template>
  <div class="glass gap-8 rounded-lg p-4">
    <AppForm :context="formProps.context" />
  </div>
</template>
