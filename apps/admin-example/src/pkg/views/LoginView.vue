<script setup lang="ts">
import { LoginForm } from "@devkitvue/form";
</script>

<template>
  <LoginForm />
  <AppBtn action="/auth/reset-password-email" label="reset password" />
</template>
