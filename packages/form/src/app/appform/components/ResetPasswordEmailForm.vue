<script setup lang="ts" generic="TApi extends Record<string, Function>">
import AppForm from "@/app/appform/AppForm.vue";
import {
  AuthResetPasswordEmailRequest,
  AuthResetPasswordEmailResponse,
} from "@devkitvue/config";
import { AuthHandler, AppFormProps } from "@devkitvue/config";
import Message from "primevue/message";
import { inject } from "vue";
import {
  loginRoute,
  resetPasswordEmailSectionInputs,
} from "../forms/AuthForms";

const authHandler = inject<AuthHandler<TApi>>("authHandler");
const formTitle = "login";
const formKey = "login";
const loginFormProps: AppFormProps<
  TApi,
  AuthResetPasswordEmailRequest,
  AuthResetPasswordEmailRequest,
  AuthResetPasswordEmailResponse
> = {
  context: {
    title: formTitle,
    formKey: formKey,
    options: {
      successMessageSummary: "logged in",
    },
    submitHandler: {
      endpoint: authHandler
        ? authHandler.resetPassword?.emailEndpoint || ""
        : "",
      redirectRoute: {
        path: loginRoute,
      },
    },
    sections: {
      login: {
        inputs: resetPasswordEmailSectionInputs,
      },
    },
  },
};
</script>
<template>
  <Message v-if="!authHandler" severity="error">{{
    "provide auth handler"
  }}</Message>
  <Message v-else-if="!authHandler.resetPassword" severity="error">{{
    "provide auth handler"
  }}</Message>
  <div class="form" v-else>
    <AppForm :context="loginFormProps.context" />
  </div>
</template>
