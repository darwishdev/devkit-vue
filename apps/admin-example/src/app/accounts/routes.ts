export default [
  {
    path: "/accounts/role",
    name: "roles_list",
    component: import("./role/views/RoleListView.vue"),
    meta: {
      breadcrumbs: [
        {
          label: "accounts",
          icon: "user-community-line",
        },
        {
          label: "roles",
          icon: "award-line",
        },
      ],
    },
  },

  {
    path: "/accounts/user",
    name: "user_list",
    component: import("./user/views/UserListView.vue"),
    meta: {
      breadcrumbs: [
        {
          label: "accounts",
          icon: "user-community-line",
        },
        {
          label: "users",
          icon: "user-3-line",
        },
      ],
    },
  },
  {
    path: "/accounts/user/create",
    name: "user_create",
    component: import("./user/views/UserCreateView.vue"),
    meta: {
      breadcrumbs: [
        {
          label: "accounts",
          icon: "user-community-line",
        },
        {
          label: "users",
          icon: "user-3-line",
          route: "/accounts/user",
        },
        {
          label: "user create",
          icon: "user-add-line",
        },
      ],
    },
  },
  {
    path: "/accounts/user/:id",
    name: "user_update",
    component: import("./user/views/UserUpdateView.vue"),
    meta: {
      breadcrumbs: [
        { label: "accounts", icon: "user-community-line" },
        { label: "users", icon: "user-3-line", route: "/accounts/user" },
        { label: "user update", icon: "user-settings-line" },
      ],
    },
  },
];
