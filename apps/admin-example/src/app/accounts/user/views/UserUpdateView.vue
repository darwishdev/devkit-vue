<script setup lang="ts">
import { type AppFormProps } from "@devkitvue/config";
import { AppForm } from "@devkitvue/form";
import type {
  UserCreateUpdateRequest,
  UserCreateUpdateResponse,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import {
  USER_TITLE,
  FIND_RESPONSE_PROP_NAME,
  FIND_REQUEST_PROP_NAME,
  KEYS,
  ENDPOINTS,
  ROUTES,
  USER_BASE_INPUTS,
} from "../../constants/UserConstants";
import { apiClient } from "@/pkg/api/apiClient";
const formProps: AppFormProps<
  typeof apiClient,
  UserCreateUpdateRequest,
  UserCreateUpdateResponse
> = {
  context: {
    title: USER_TITLE,
    formKey: KEYS.CREATE_FORM_KEY,
    findHandler: {
      endpoint: ENDPOINTS.FIND_FOR_UPDATE,
      responsePropertyName: FIND_RESPONSE_PROP_NAME,
      requestPropertyName: FIND_REQUEST_PROP_NAME,
    },
    submitHandler: {
      endpoint: ENDPOINTS.CREATE_UPDATE,
      redirectRoute: ROUTES.LIST.path,
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
  <div class="glass gap-8 rounded-lg p-4">
    <AppForm :context="formProps.context" />
  </div>
</template>
