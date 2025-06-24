---
title: LoginForm
---

# `<LoginForm>`

A complete authentication form built on top of `<AppForm>`, designed for DevKit’s API structure. It supports both **standard login** and **OAuth provider login**, with automatic access token caching, user info storage, and navigation bar setup.

Key features include:

* **Customizable login schema** with FormKit
* **API handler injection** for modular login logic
* **Redirect + callback on success**
* **Auto-login via access\_token in URL hash (OAuth)**
* **Provider login buttons** (e.g. Google, GitHub)

## Props

None explicitly — this is a usage composition of `<AppForm>` with injected logic.

## Slots

None.

## Examples

### 1. Basic Usage with Injected Handlers

```ts
// AuthHandler example provided during app setup
app.use(App, {
  apiClient,
  authHandler: {
    login: 'authLogin',
    redirectRoute: '/',
    providerLogin: 'authProviderLogin',
    providerLoginCallback: 'authProviderCallback',
    allowedProviders: ['google', 'github']
  }
})
```

```vue
<template>
  <LoginForm />
</template>
```

<LoginForm />

### 2. OAuth Redirect Handling

This form auto-handles `#access_token` in the URL after redirection from OAuth provider. If present, it:

* Calls the `providerLoginCallback` endpoint
* Saves `token`, `user_info`, and `sidebar` to `localStorage`

No additional code is required — it's handled in `onMounted()`.

### 3. Custom Styling or Placement

You can wrap `<LoginForm />` in layout containers or apply Tailwind/grid classes to structure the page.

```vue
<template>
  <section class="max-w-md mx-auto mt-12">
    <LoginForm />
  </section>
</template>
```

<section class="max-w-md mx-auto mt-12">
  <LoginForm />
</section>
