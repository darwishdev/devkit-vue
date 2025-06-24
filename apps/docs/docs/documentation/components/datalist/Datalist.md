---
title: Datalist
---

# `<Datalist>`

A full-featured, generic data table component built on PrimeVue’s `<DataTable>`, enhanced with a Vuex-like store, advanced filters, bulk actions, server-side pagination, dynamic column generation, and contextual modals. It supports CRUD flows and is deeply integrated with DevKit's form and API layer.

Key features include:

* **Server-side and client-side data fetching**
* **FormKit-based filters with lazy loading & persistence**
* **Row-level and global action slots**
* **Dynamic schema-driven modals for create/update**
* **Soft/hard delete with restore support**
* **Card and table display modes**
* **Route-aware detail views**

## Props

| Prop      | Type              | Description                                                       | Default |
| --------- | ----------------- | ----------------------------------------------------------------- | ------- |
| `context` | `DatalistContext` | Full configuration object for data, filters, layout, and behavior | —       |

## Slots

* `card`, `cardStart`, `cardEnd` — Render custom card views per record
* `column.{key}` — Override rendering for individual column keys
* `globalActions`, `rowActions.{key}` — Custom buttons for global/row actions
* `filtersPanel`, `filtersForm`, `filtersPresist`, `filtersReset` — Customize the filter UI
* `header`, `empty` — Override the table header and empty state
* `actions`, `actionsPrepend`, `actionsAppend` — Customize the row "actions" column

## Examples

### 1. Server-side Table with Update Form

```vue
<script setup lang="ts">
import { apiClient } from "../../../../src/apiClient.ts";
import Datalist from "@devkit/datalist";

const columns = {
  id: { props: { field: "id", header: "ID" }, isGlobalFilter: true },
  name: { props: { field: "name", header: "Name" } },
};

const tableProps = {
  context: {
    datalistKey: "users",
    rowIdentifier: "id",
    records: apiClient.userList,
    columns,
    displayType: "table",
    isServerSide: true,
    formSections: {
      main: {
        inputs: [
          { $formkit: "text", name: "name", label: "Name", validation: "required" },
        ],
      },
    },
    options: {
      createHandler: {
        title: "Create User",
        routeName: "UserCreate",
        endpoint: "userCreate",
        redirectRoute: "/users",
      },
      updateHandler: {
        title: "Edit User",
        routeName: "UserEdit",
        endpoint: "userUpdate",
        findEndpoint: "userFind",
        findRequestProperty: "id",
        findResponseProperty: "request",
      },
      deleteHandler: {
        endpoint: "userDelete",
        requestProperty: "ids",
      },
    },
  },
};
</script>

<template>
  <Datalist :context="tableProps.context" />
</template>
```
<script setup lang="ts">
import { apiClient } from "../../../../src/apiClient.ts";
import Datalist from "@devkit/datalist";

const columns = {
  id: { props: { field: "id", header: "ID" }, isGlobalFilter: true },
  name: { props: { field: "name", header: "Name" } },
};

const tableProps = {
  context: {
    datalistKey: "users",
    rowIdentifier: "id",
    records: apiClient.userList,
    columns,
    displayType: "table",
    isServerSide: true,
    formSections: {
      main: {
        inputs: [
          { $formkit: "text", name: "name", label: "Name", validation: "required" },
        ],
      },
    },
    options: {
      createHandler: {
        title: "Create User",
        routeName: "UserCreate",
        endpoint: "userCreate",
        redirectRoute: "/users",
      },
      updateHandler: {
        title: "Edit User",
        routeName: "UserEdit",
        endpoint: "userUpdate",
        findEndpoint: "userFind",
        findRequestProperty: "id",
        findResponseProperty: "request",
      },
      deleteHandler: {
        endpoint: "userDelete",
        requestProperty: "ids",
      },
    },
  },
};
</script>

  <Datalist :context="tableProps.context" />
<DatalistExample />


### 2. Client-Side Cards with Custom Column Render

```vue
<script setup lang="ts">
const columns = {
  avatar: {
    renderHtml: (record) =>
      h("img", { src: record.avatar, class: "rounded-full w-12 h-12" }),
  },
};

const tableProps = {
  context: {
    datalistKey: "staff-cards",
    rowIdentifier: "staffId",
    displayType: "card",
    columns,
    records: [], // or preloaded array
  },
};
</script>

<template>
  <Datalist :context="tableProps.context">
    <template #card="{ data }">
      <div class="p-4 rounded shadow bg-white">
        <h3>{{ data.name }}</h3>
        <p>{{ data.role }}</p>
      </div>
    </template>
  </Datalist>
</template>
```

### 3. Custom Global Actions

```vue
<template>
  <Datalist :context="props.context">
    <template #globalActions.create="{ store }">
      <AppBtn
        label="New Record"
        icon="plus"
        action={() => store.createUpdateRecord((res) => console.log(res))}
      />
    </template>
  </Datalist>
</template>
```

  <Datalist :context="tableProps.context" />
<DatalistExample />
