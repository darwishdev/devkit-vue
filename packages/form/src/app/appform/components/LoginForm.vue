<script setup lang="ts" generic="TApi extends Record<string, Function>">
import { AppForm, AppFormProps } from "@/app/appform";
import {
  AuthLoginProviderRequest,
  AuthLoginRequest,
  AuthLoginResponse,
} from "@devkit/config";
import { AuthHandler } from "@devkit/config";
import { resolveApiEndpoint } from "@devkit/apiclient";
import { AppBtn } from "@devkit/base-components";
import { inject } from "vue";
import { loginCallback, loginSectionInputs } from "../forms/AuthForms";

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
  <div class="form" v-else>
    <AppForm :context="loginFormProps.context" />
    <AppBtn
      v-for="provider in authHandler.allowedProviders"
      class="glass"
      :icon="provider"
      :key="provider"
      :action="() => providerLogin(provider)"
    />
  </div>
</template>
