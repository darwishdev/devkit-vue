<script setup lang="ts">
import { LoginForm } from "@devkit/form";
</script>

<template>
  <LoginForm />
  <AppBtn action="/auth/reset-password-email" label="reset password" />
</template>
