/* ------------------------------------------------------------------ */
/*  DATALIST / TABLE COLUMN DEFINITIONS                               */

import type { AuthSession } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/accounts_auth_pb";
import {
  ColumnDate,
  ColumnText,
  type DatalistColumnsBase,
} from "@devkitvue/datalist";
import { baseDateRangeInput } from "./UserConstants";
import { ColumnFlag } from "@devkitvue/datalist";

/* ------------------------------------------------------------------ */
/*  ROUTES                                                            */
/* ------------------------------------------------------------------ */

export const ROUTE_PARAM_NAME = "tokenId";
export const FIND_REQUEST_PROP_NAME = "recordId";
export const FIND_RESPONSE_PROP_NAME = "request";
export const TITLE = "list_session";
export const DESCRIPTION = "list_session_description";

export const BREADCRUMBS = {
  ACCOUNTS: { label: "accounts", icon: "user-community-line" } as const,
  SESSIONS: { label: "sessions", icon: "timer-2-line" } as const,
  SESSIONS_LINK: {
    label: "sessions",
    icon: "timer-2-line",
    to: "/accounts/session",
  } as const,
};

export const ROUTES = {
  LIST: {
    path: "/accounts/session",
    name: "session_list",
    breadcrumbs: [BREADCRUMBS.ACCOUNTS, BREADCRUMBS.SESSIONS],
  },
  CREATE: {
    path: "/accounts/session/create",
    name: "session_create",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.SESSIONS_LINK,
      { label: "session create", icon: "add-line" },
    ],
  },
  FIND: {
    path: `/accounts/session/:${ROUTE_PARAM_NAME}`,
    name: "session_find",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.SESSIONS_LINK,
      { label: "session details", icon: "eye-line" },
    ],
  },
  UPDATE: {
    path: `/accounts/session/update/:${ROUTE_PARAM_NAME}`,
    name: "session_update",
    breadcrumbs: [
      BREADCRUMBS.ACCOUNTS,
      BREADCRUMBS.SESSIONS_LINK,
      { label: "session update", icon: "edit-line" },
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*  API ENDPOINT KEYS (Buf / Connect)                                 */
/* ------------------------------------------------------------------ */
export const ENDPOINTS = {
  CREATE_UPDATE: "sessionCreateUpdate",
  FIND_FOR_UPDATE: "sessionFindForUpdate",
  DELETE_RESTORE: "sessionDeleteRestore",
  DELETE: "sessionDelete",
} as const;

/* ------------------------------------------------------------------ */
/*  CACHING OR IDENTIFIER KEYS                                        */
/* ------------------------------------------------------------------ */
export const KEYS = {
  DATALIST_KEY: "accounts-session",
  CREATE_FORM_KEY: "session-create",
} as const;
/* ------------------------------------------------------------------ */
export const ROW_IDENTIFIER = "tokenId" as const;

/* ------------------------------------------------------------------ */
/*  INDIVIDUAL COLUMN CONSTANTS                                       */
/* ------------------------------------------------------------------ */
export const colTokenId = new ColumnText<AuthSession>("tokenId", {
  isSortable: true,
});

export const colUserId = new ColumnText<AuthSession>("userId", {
  isSortable: true,
});

export const colIpAddress = new ColumnText<AuthSession>("ipAddress", {
  isSortable: true,
});

export const colUserAgent = new ColumnText<AuthSession>("userAgent", {
  isSortable: true,
});

export const colIsBlocked = new ColumnFlag<AuthSession>("isBlocked", {
  isSortable: true,
});

export const colAccessTokenExpiresAt = new ColumnDate("accessTokenExpiresAt", {
  isSortable: true,
  filters: [
    {
      isGlobal: false,
      matchMode: "between",
      input: {
        ...(baseDateRangeInput as Object),
        name: "accessTokenExpiresAt",
        outerClass: "col-span-2",
        label: "accessTokenExpiresAt",
        placeholder: "accessTokenExpiresAt",
        showTime: true,
      },
    },
  ],
});

export const colRefreshTokenExpiresAt = new ColumnDate(
  "refreshTokenExpiresAt",
  {
    isSortable: true,
    filters: [
      {
        isGlobal: false,
        matchMode: "between",
        input: {
          ...(baseDateRangeInput as Object),
          name: "refreshTokenExpiresAt",
          outerClass: "col-span-2",
          label: "refreshTokenExpiresAt",
          placeholder: "refreshTokenExpiresAt",
          showTime: true,
        },
      },
    ],
  },
);

/* ------------------------------------------------------------------ */
/*  COLUMNS MAP                                                       */
/* ------------------------------------------------------------------ */
export const COLUMNS_MAP = {
  tokenId: colTokenId,
  userId: colUserId,
  ipAddress: colIpAddress,
  userAgent: colUserAgent,
  isBlocked: colIsBlocked,
  accessTokenExpiresAt: colAccessTokenExpiresAt,
  refreshTokenExpiresAt: colRefreshTokenExpiresAt,
} as const satisfies DatalistColumnsBase<AuthSession>;
