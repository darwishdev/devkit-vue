<script setup lang="ts">
import { AppForm } from "@devkit/form";
import type {
  UserCreateUpdateRequest,
  UserCreateUpdateResponse,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import type { AppFormProps } from "@devkit/config";
import { apiClient } from "@/pkg/api/apiClient";
import {
  ENDPOINTS,
  KEYS,
  ROUTES,
  USER_BASE_INPUTS,
  USER_TITLE,
} from "../../constants/UserConstants";
const formProps: AppFormProps<
  typeof apiClient,
  UserCreateUpdateRequest,
  UserCreateUpdateResponse
> = {
  context: {
    title: USER_TITLE,
    formKey: KEYS.CREATE_FORM_KEY,
    submitHandler: {
      endpoint: ENDPOINTS.CREATE_UPDATE,
      redirectRoute: ROUTES.LIST,
    },
    invalidateCaches: [KEYS.DATALIST_KEY],
    sections: {
      user_info: {
        gridConfig: { columns: 1, mdColumns: 2, gap: 2, gridType: "columns" },
        inputs: [...USER_BASE_INPUTS], // ⬅️ fields from the factory
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
