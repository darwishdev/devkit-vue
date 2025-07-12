<script setup lang="ts" generic="TApi extends Record<string, Function>">
import AppForm from "@/app/appform/AppForm.vue";
import {
  AuthResetPasswordRequest,
  AuthResetPasswordResponse,
} from "@devkitvue/config";
import { AuthHandler, AppFormProps } from "@devkitvue/config";
import { inject } from "vue";
import { loginCallback, resetPasswordSectionInputs } from "../forms/AuthForms";

const authHandler = inject<AuthHandler<TApi>>("authHandler");
const formTitle = "login";
const formKey = "login";
const loginFormProps: AppFormProps<
  TApi,
  AuthResetPasswordRequest,
  AuthResetPasswordRequest,
  AuthResetPasswordResponse
> = {
  context: {
    title: formTitle,
    formKey: formKey,
    options: {
      successMessageSummary: "logged in",
    },
    submitHandler: {
      mapFunction: (req) => {
        const hash = window.location.hash;
        console.log("Extracted Access Token:", hash);
        // Check if the hash contains the access token
        if (hash) {
          // Remove the leading '#' to make it a valid search string
          const paramsString = hash.substring(1);

          // Create a URLSearchParams object
          const params = new URLSearchParams(paramsString);

          // Get the access_token
          const accessToken = params.get("access_token");

          if (accessToken) {
            console.log("Extracted Access Token:", accessToken);
          }
          return {
            ...req,
            resetToken: accessToken,
          } as AuthResetPasswordRequest;
        }
        return {
          ...req,
        } as AuthResetPasswordRequest;
      },

      endpoint: authHandler ? authHandler.resetPassword?.endpoint || "" : "",
      redirectRoute: {
        path: authHandler?.redirectRoute || "/",
      },
      callback: loginCallback,
    },
    sections: {
      login: {
        inputs: resetPasswordSectionInputs,
      },
    },
  },
};
</script>
<template>
  <Message v-if="!authHandler" severity="error">{{
    "provide auth handler"
  }}</Message>
  <div class="form" v-else>
    <AppForm :context="loginFormProps.context" />
  </div>
</template>
