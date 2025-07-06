import { ROUTES as USER_ROUTES } from "./constants/UserConstants";

export default [
  {
    path: USER_ROUTES.LIST.path,
    name: USER_ROUTES.LIST.name,
    component: import("./user/views/UserListView.vue"),
    meta: {
      breadcrumbs: USER_ROUTES.LIST.breadcrumbs,
    },
  },
  {
    path: USER_ROUTES.CREATE.path,
    name: USER_ROUTES.CREATE.name,
    component: () => import("./user/views/UserCreateView.vue"),
    meta: { breadcrumbs: USER_ROUTES.CREATE.breadcrumbs },
  },
  {
    path: USER_ROUTES.UPDATE.path,
    name: USER_ROUTES.UPDATE.name,
    component: () => import("./user/views/UserUpdateView.vue"),
    meta: { breadcrumbs: USER_ROUTES.UPDATE.breadcrumbs },
  },
  {
    path: USER_ROUTES.CREATE.path,
    name: USER_ROUTES.CREATE.name,
    component: () => import("./user/views/UserCreateView.vue"),
    meta: { breadcrumbs: USER_ROUTES.CREATE.breadcrumbs },
  },
  {
    path: USER_ROUTES.FIND.path,
    name: USER_ROUTES.FIND.name,
    component: () => import("./user/views/UserFindView.vue"),
    meta: { breadcrumbs: USER_ROUTES.FIND.breadcrumbs },
  },
];
