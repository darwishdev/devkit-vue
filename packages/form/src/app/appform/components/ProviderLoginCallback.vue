<script setup lang="ts" generic="TApi extends Record<string, Function>">
import { inject, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { loginCallback } from "../forms/AuthForms";
import { ObjectKeys, resolveApiEndpoint } from "@devkitvue/apiclient";
import { AuthHandler } from "@devkitvue/config";
import { ref } from "vue";
import { AppBtn } from "@devkitvue/base-components";
const apiClient = inject<TApi>("apiClient");
const authHandler = inject<AuthHandler<TApi>>("authHandler");
const { push } = useRouter();
const isLoadingRef = ref(true);
const errorRef = ref<string | null>(null);
onBeforeMount(() => {
  if (!apiClient) return;
  if (!authHandler) return;
  if (!authHandler.providerLogin) return;
  const hash = window.location.hash;
  if (!hash) return;
  const paramsString = hash.substring(1);
  const params = new URLSearchParams(paramsString);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const providerToken = params.get("provider_token");
  if (accessToken) {
    console.log("Extracted Access Token:", accessToken);
    resolveApiEndpoint(authHandler.providerLogin.callbackEndpoint, apiClient, {
      accessToken,
      refreshToken,
      providerToken,
    })
      .then((res) => {
        console.log("Asd", res);
        loginCallback(res);
        push(authHandler.redirectRoute || "/");
      })
      .catch((err: unknown) => {
        /* ---- granularity up to you ---- */
        console.log(typeof err);
        console.log("error", err);
        if (!err) return;

        if (typeof err == "object") {
          // const connectErr : ConnecConnectErro
          console.log("error obje is", ObjectKeys(err));
        }
        if (typeof err == "string") {
          console.log("error is", err);
          try {
            const errObject = JSON.parse(err);
            if (errObject) {
              console.log("erro ibj is", errObject);
            }
          } catch (error) {
            console.log("error parsing", error);
          }
        }
        console.error("provider-login callback failed:", err);
        errorRef.value = "We couldn’t find an account with that email.";
      })
      .finally(() => {
        isLoadingRef.value = false;
      });
  }
});
</script>

<template>
  <h2 v-if="isLoadingRef">logging you in</h2>
  <div v-else-if="errorRef">
    <h2 class="text-red-600">{{ errorRef }}</h2>
    <AppBtn
      action="/auth/login"
      class="text-blue-600 underline"
      label="Back to login"
    />
  </div>
</template>
