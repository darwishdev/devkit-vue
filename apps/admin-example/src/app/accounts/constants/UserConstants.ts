import {
  ColumnText,
  ColumnDate,
  ColumnImage,
  type DatalistColumnsBase,
  type DatalistFilter,
} from "@devkitvue/datalist";
import type { AccountsSchemaUserView } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_user_pb";
import type { FormKitSchemaNode } from "@formkit/core";
/* =====================================================================
 *  src/app/accounts/constants/UserConstants.ts
 * =================================================================== */

/* ------------------------------------------------------------------ */
/*  ROUTES                                                            */
/* ------------------------------------------------------------------ */

export const ROUTE_PARAM_NAME = "id";
export const FIND_REQUEST_PROP_NAME = "recordId";
export const FIND_RESPONSE_PROP_NAME = "request";
export const TITLE = "user";
export const DESCRIPTION = "user_description";

export const BREADCRUMBS = {
  ACCOUNTS: { label: "accounts", icon: "user-community-line" } as const,
  USERS: { label: "users", icon: "user-3-line" } as const,
  USERS_LINK: {
    label: "users",
    icon: "user-3-line",
    to: "/accounts/user",
  } as const,
};
export const ROUTES = {
  LIST: {
    path: "/accounts/user",
    name: "user_list",
    breadcrumbs: [BREADCRUMBS.ACCOUNTS, BREADCRUMBS.USERS],
  },

  CREATE: {
    path: `/accounts/user/create`,
    name: "user_create",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.USERS_LINK,
      { label: "user create", icon: "user-add-line" },
    ],
  },

  FIND: {
    path: `/accounts/user/:${ROUTE_PARAM_NAME}`,
    name: "user_find",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.USERS_LINK,
      { label: "user details", icon: "eye-line" },
    ],
  },

  UPDATE: {
    path: `/accounts/user/update/:${ROUTE_PARAM_NAME}`,
    name: "user_update",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.USERS_LINK,
      { label: "user update", icon: "user-settings-line" },
    ],
  },
} as const;
/* ------------------------------------------------------------------ */
/*  API ENDPOINT KEYS (Buf / Connect)                                 */
/* ------------------------------------------------------------------ */
export const ENDPOINTS = {
  CREATE_UPDATE: "userCreateUpdate",
  FIND_FOR_UPDATE: "userFindForUpdate",
} as const;

/* ------------------------------------------------------------------ */
/*  CACHING OR IDENTIFIER KEYS                                        */
/* ------------------------------------------------------------------ */
export const KEYS = {
  DATALIST_KEY: "accounts-user",
  CREATE_FORM_KEY: "user-create",
  USER_TYPES: "user-type-list",
} as const;
/* ------------------------------------------------------------------ */
/*  PERMISSION / RBAC KEYS (optional)                                 */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  FORMKIT INPUT DEFINITIONS                                         */
/* ------------------------------------------------------------------ */
export const userNameInput: FormKitSchemaNode & { name: "userName" } = {
  $formkit: "text",
  prefixIcon: "user-line", // 👤
  name: "userName",
  label: "userName",
  placeholder: "userName",
  validation: "required",
};
export const userEmailInput: FormKitSchemaNode & { name: "userEmail" } = {
  $formkit: "text",
  prefixIcon: "mail-line", // ✉️
  name: "userEmail",
  label: "userEmail",
  placeholder: "userEmail",
  validation: "required",
};
export const userRolesInput: FormKitSchemaNode & {
  name: "roles";
} = {
  $formkit: "devkitDropdown",
  fluid: true,
  multiple: true,
  name: "roles",
  options: "roleListInput",
  label: "roles",
  placeholder: "roles",
  validation: "",
};

export const userTypeInput: FormKitSchemaNode & { name: "userTypeId" } = {
  $formkit: "devkitDropdown",
  fluid: true,
  id: "userTypeId",
  name: "userTypeId",
  options: "userTypeListInput",
  size: "small",
  validation: "required",
  label: "userType",
  placeholder: "userType",
  prefixIcon: "award-line", // 🏅 (role/type)
};

export const tenantInput: FormKitSchemaNode & { name: "tenantId" } = {
  $formkit: "devkitDropdown",
  fluid: true,
  name: "tenantId" as const,
  if: "$get(userTypeId).value == 2",
  options: "tenantListInput",
  size: "small",
  label: "tenant",
  placeholder: "tenant",
  prefixIcon: "building-line", // 🏢
} satisfies Object;

export const userPhoneInput: FormKitSchemaNode & { name: "userPhone" } = {
  $formkit: "text",
  prefixIcon: "phone-line", // 📞
  name: "userPhone",
  label: "userPhone",
  placeholder: "userPhone",
  validation: "required",
};

export const userPasswordInput: FormKitSchemaNode & { name: "userPassword" } = {
  $formkit: "password",
  prefixIcon: "lock-line", // 🔒
  name: "userPassword",
  label: "password",
  placeholder: "password",
};

export const userImageInput: FormKitSchemaNode & { name: "userImage" } = {
  $formkit: "devkitUpload",
  bucketName: "images",
  dashboardOptions: { width: "100%" },
  prefixIcon: "image-line", // 🖼️
  outerClass: "col-span-2",
  name: "userImage",
  label: "userImage",
  placeholder: "userImage",
};
export const baseDateRangeInput: FormKitSchemaNode = {
  $formkit: "devkitDatepicker",
  selectionMode: "range",
  fluid: true,
  size: "small",
  convertToNumber: true,
  label: "dateRange", // will be overridden below
  placeholder: "dateRange",
};
/** Convenient bundles – feel free to make more */

export const USER_BASE_INPUTS = [
  userNameInput,
  userEmailInput,
  userRolesInput,
  userTypeInput,
  tenantInput,
  userPhoneInput,
  userPasswordInput,
  userImageInput,
];
export const FILTERS: DatalistFilter[] = [
  {
    isGlobal: true,
    matchMode: "contains",
    input: { ...userNameInput, validation: "" },
  },
  {
    isGlobal: true,
    matchMode: "contains",
    input: { ...userEmailInput, validation: "" },
  },
  {
    isGlobal: true,
    matchMode: "contains",
    input: { ...userPhoneInput, validation: "" },
  },
  {
    isGlobal: true,
    matchMode: "in",
    input: {
      ...userTypeInput,
      validation: "",
      multiple: true,
      hideReload: true,
    },
  },
  {
    isGlobal: true,
    matchMode: "lt",
    input: {
      $formkit: "number",
      number: "integer",
      prefixIcon: "award-line", // 🏅
      name: "userSecurityLevel",
      label: "userSecurityLevelLt",
      placeholder: "userSecurityLevelLt",
    },
  },
  {
    isGlobal: true,
    matchMode: "gt",
    input: {
      $formkit: "number",
      number: "integer",
      prefixIcon: "award-line", // 🏅
      name: "userSecurityLevel",
      label: "userSecurityLevelGt",
      placeholder: "userSecurityLevelGt",
    },
  },

  {
    isGlobal: true,
    matchMode: "in",
    input: {
      ...tenantInput,
      if: undefined,
      outerClass: "col-span-2",
      validation: "",
      multiple: true,
      hideReload: true,
    },
  },
  {
    isGlobal: false,
    matchMode: "between",
    input: {
      ...baseDateRangeInput,
      showTime: true,
      name: "createdAt",
      outerClass: "col-span-2 ",
      label: "createdAt",
      placeholder: "createdAt",
    },
  },

  {
    isGlobal: false,
    matchMode: "between",
    input: {
      ...baseDateRangeInput,
      name: "deletedAt",
      outerClass: "col-span-2 ",
      label: "deletedAt",
      placeholder: "deletedAt",
      showTime: true,
    },
  },
];
/* ------------------------------------------------------------------ */
/*  DATALIST / TABLE COLUMN DEFINITIONS                               */
/* ------------------------------------------------------------------ */
export const USER_ROW_IDENTIFIER = "userId" as const;
