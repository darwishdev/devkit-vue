<script setup lang="ts">
import { AppForm } from "@devkitvue/form";
import type {
  UserCreateUpdateRequest,
  UserCreateUpdateResponse,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import type { AppFormProps } from "@devkitvue/config";
import { apiClient } from "@/pkg/api/apiClient";
import {
  ENDPOINTS,
  KEYS,
  ROUTES,
  BASE_INPUTS,
  TITLE,
} from "../../constants/RoleConstants";
import type {
  RoleCreateUpdateRequest,
  RoleCreateUpdateResponse,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_role_pb";
const formProps: AppFormProps<
  typeof apiClient,
  RoleCreateUpdateRequest,
  RoleCreateUpdateResponse
> = {
  context: {
    title: TITLE,
    formKey: KEYS.CREATE_FORM_KEY,
    submitHandler: {
      endpoint: ENDPOINTS.CREATE_UPDATE,
      redirectRoute: ROUTES.LIST.path,
    },
    invalidateCaches: [KEYS.DATALIST_KEY],
    sections: {
      user_info: {
        gridConfig: { columns: 1, mdColumns: 2, gap: 2, gridType: "columns" },
        inputs: [...BASE_INPUTS], // ⬅️ fields from the factory
      },
    },
  },
};
</script>

<template>
  <div class="glass rounded p-4">
    <AppForm :context="formProps.context" />
  </div>
</template>
