<script setup lang="ts">
import { LoginForm } from "@devkitvue/form";
const s = async () => null;
await s();
</script>

<template>
  <LoginForm />
  <AppBtn action="/auth/reset-password-email" label="reset password" />
</template>
