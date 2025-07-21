import {
  ColumnText,
  ColumnDate,
  type DatalistColumnsBase,
} from "@devkitvue/datalist";

import type { FormKitSchemaNode } from "@formkit/core";
import type { AccountsSchemaRole } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_role_pb";
import { baseDateRangeInput } from "./UserConstants";
/* =====================================================================
 *  src/app/accounts/constants/UserConstants.ts
 * =================================================================== */

/* ------------------------------------------------------------------ */
/*  ROUTES                                                            */
/* ------------------------------------------------------------------ */

export const ROUTE_PARAM_NAME = "id";
export const FIND_REQUEST_PROP_NAME = "recordId";
export const FIND_RESPONSE_PROP_NAME = "request";
export const TITLE = "role";
export const DESCRIPTION = "role_description";

export const BREADCRUMBS = {
  ACCOUNTS: { label: "accounts", icon: "user-community-line" } as const,
  ROLES: { label: "roles", icon: "award-line" } as const,
  ROLES_LINK: {
    label: "roles",
    icon: "award-line",
    to: "/accounts/role",
  } as const,
};

export const ROUTES = {
  LIST: {
    path: "/accounts/role",
    name: "role_list",
    breadcrumbs: [BREADCRUMBS.ACCOUNTS, BREADCRUMBS.ROLES],
  },

  CREATE: {
    path: `/accounts/role/create`,
    name: "role_create",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.ROLES_LINK,
      { label: "role create", icon: "user-add-line" },
    ],
  },

  FIND: {
    path: `/accounts/role/:${ROUTE_PARAM_NAME}`,
    name: "role_find",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.ROLES_LINK,
      { label: "role details", icon: "eye-line" },
    ],
  },

  UPDATE: {
    path: `/accounts/role/update/:${ROUTE_PARAM_NAME}`,
    name: "role_update",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.ROLES_LINK,
      { label: "role update", icon: "user-settings-line" },
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*  API ENDPOINT KEYS (Buf / Connect)                                 */
/* ------------------------------------------------------------------ */
export const ENDPOINTS = {
  CREATE_UPDATE: "roleCreateUpdate",
  FIND_FOR_UPDATE: "roleFindForUpdate",
} as const;

/* ------------------------------------------------------------------ */
/*  CACHING OR IDENTIFIER KEYS                                        */
/* ------------------------------------------------------------------ */
export const KEYS = {
  DATALIST_KEY: "accounts-role",
  CREATE_FORM_KEY: "role-create",
} as const;
/* ------------------------------------------------------------------ */
/*  PERMISSION / RBAC KEYS (optional)                                 */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  FORMKIT INPUT DEFINITIONS                                         */
/* ------------------------------------------------------------------ */
export const roleNameInput: FormKitSchemaNode & { name: "roleName" } = {
  $formkit: "text",
  prefixIcon: "award-line", // 🏅
  name: "roleName",
  label: "roleName",
  placeholder: "roleName",
  validation: "required",
};
export const roleDescriptionInput: FormKitSchemaNode & {
  name: "roleDescription";
} = {
  $formkit: "textarea",
  innerClass: "p-3",
  prefixIcon: "align-left", // 📝
  name: "roleDescription",
  label: "roleDescription",
  placeholder: "Enter a short description of the role",
  validation: "required",
  rows: 3,
};
export const roleSecurityLevelInput: FormKitSchemaNode & {
  name: "roleSecurityLevel";
} = {
  $formkit: "number",
  number: "integer",
  prefixIcon: "award-line", // 🏅
  name: "roleSecurityLevel",
  label: "roleSecurityLevel",
  placeholder: "roleSecurityLevel",
  validation: "required",
};
export const permissionsInput: FormKitSchemaNode & {
  name: "permissions";
} = {
  $formkit: "devkitToggleCollection",
  outerClass: "col-span-2",
  fluid: true,
  dataTableProps: { rows: 4 },
  multiple: true,
  prefixIcon: "shield-keyhole-line", // 🛡️ optional: pick any icon you prefer
  bypassCache: true,

  value: [85, 86],
  name: "permissions",
  useGroup: true,
  options: "userPermissionListInput",

  label: "permissions",
  validation: "",
};
export const BASE_INPUTS = [roleNameInput, roleDescriptionInput];

/* ------------------------------------------------------------------ */
/*  DATALIST / TABLE COLUMN DEFINITIONS                               */
/* ------------------------------------------------------------------ */
export const ROW_IDENTIFIER = "roleId" as const;
/* ------------------------------------------------------------------ */
/*  INDIVIDUAL COLUMN CONSTANTS                                       */
/* ------------------------------------------------------------------ */
export const colRoleId = new ColumnText<AccountsSchemaRole>("roleId", {
  isSortable: true,
});
export const FILTERS = [
  {
    isGlobal: true,
    matchMode: "contains",
    input: { ...roleNameInput, validation: "" },
  },
  {
    isGlobal: false,
    matchMode: "between",
    input: {
      ...baseDateRangeInput,
      name: "createdAt",
      outerClass: "col-span-2 ",
      label: "createdAt",
      placeholder: "createdAt",
      showTime: true,
    },
  },
  {
    ...baseDateRangeInput,
    name: "updatedAt",
    outerClass: "col-span-2 ",
    label: "updatedAt",
    placeholder: "updatedAt",
    showTime: true,
  },
  {
    ...baseDateRangeInput,
    name: "updatedAt",
    outerClass: "col-span-2 ",
    label: "updatedAt",
    placeholder: "updatedAt",
    showTime: true,
  },
];
export const colRoleName = new ColumnText<AccountsSchemaRole>("roleName", {
  isSortable: true,
  isGlobalFilter: true,
  filters: [
    {
      isGlobal: true,
      matchMode: "contains",
      input: { ...roleNameInput, validation: "" },
    },
  ],
});
export const colRoleDescription = new ColumnText<AccountsSchemaRole>(
  "roleDescription",
  {
    isSortable: true,
    isGlobalFilter: true,
    filters: [
      {
        isGlobal: true,
        matchMode: "contains",
        input: roleDescriptionInput,
      },
    ],
  },
);
export const colCreatedAt = new ColumnDate("createdAt", {
  isSortable: true,
  filters: [
    {
      isGlobal: false,
      matchMode: "between",
      input: {
        ...baseDateRangeInput,
        name: "createdAt",
        outerClass: "col-span-2 ",
        label: "createdAt",
        placeholder: "createdAt",
      },
    },
  ],
});

export const colUpdatedAt = new ColumnDate("updatedAt", {
  isSortable: true,
  filters: [
    {
      isGlobal: false,
      matchMode: "between",
      input: {
        ...baseDateRangeInput,
        name: "updatedAt",
        outerClass: "col-span-2 ",
        label: "updatedAt",
        placeholder: "updatedAt",
        showTime: true,
      },
    },
  ],
});

export const colDeletedAt = new ColumnDate("deletedAt", {
  isSortable: true,
  filters: [
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
  ],
});

/* ------------------------------------------------------------------ */
/*  OPTIONAL: aggregated helper you can still pass to <Datalist>      */
/* ------------------------------------------------------------------ */
export const COLUMNS_MAP = {
  roleId: colRoleId,
  roleName: colRoleName,
  createdAt: colCreatedAt,
  updatedAt: colUpdatedAt,
  deletedAt: colDeletedAt,
} as const satisfies DatalistColumnsBase<AccountsSchemaRole>;
