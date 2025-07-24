<script setup lang="ts" generic="TApi extends Record<string, Function>">
import { AppFormProps } from "@devkitvue/config";
import AppForm from "../AppForm.vue";
import {
  AuthLoginProviderRequest,
  AuthLoginRequest,
  AuthLoginResponse,
} from "@devkitvue/config";
import { AuthHandler } from "@devkitvue/config";
import { resolveApiEndpoint } from "@devkitvue/apiclient";
import { AppBtn } from "@devkitvue/base-components";
import { inject } from "vue";
import { loginCallback, loginSectionInputs } from "../forms/AuthForms";
import Message from "primevue/message";

const authHandler = inject<AuthHandler<TApi>>("authHandler");
const apiClient = inject<TApi>("apiClient");
const formTitle = "login";
const formKey = "login";
const loginFormProps: AppFormProps<
  TApi,
  AuthLoginRequest,
  AuthLoginRequest,
  AuthLoginResponse
> = {
  context: {
    title: formTitle,
    formKey: formKey,
    options: {
      successMessageSummary: "logged in",
    },
    submitHandler: {
      endpoint: authHandler ? authHandler.login : "",
      redirectRoute: authHandler?.redirectRoute || "/",
      callback: loginCallback,
    },
    sections: {
      login: {
        gridConfig: {
          columns: 1,
        },
        inputs: loginSectionInputs,
      },
    },
  },
};

const providerLogin = async (provider: string) => {
  if (!authHandler?.providerLogin) return;
  const request: AuthLoginProviderRequest = {
    provider,
    redirectUrl: authHandler.providerLogin.callbackRoute,
  };
  const { url } = await resolveApiEndpoint(
    authHandler.providerLogin.endpoint,
    apiClient,
    request,
  );

  window.open(url, "_blank");
};
</script>
<template>
  <Message v-if="!authHandler" severity="error">{{
    "provide auth handler"
  }}</Message>
  <div class="form flex flex-col items-center gap-4" v-else>
    <div class="w-full">
      <AppForm :context="loginFormProps.context" />
    </div>
    <AppBtn
      v-for="provider in authHandler.allowedProviders"
      class="glass"
      :icon="provider"
      :key="provider"
      :action="() => providerLogin(provider)"
    />
  </div>
</template>
