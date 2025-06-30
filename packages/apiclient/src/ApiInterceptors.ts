import { Code, ConnectError, type Interceptor } from "@connectrpc/connect";

import {
  BadRequestSchema,
  BadRequest_FieldViolation as FieldViolation,
} from "@buf/googleapis_googleapis.bufbuild_es/google/rpc/error_details_pb";
export const AuthInterceptor = (tokenkey: string): Interceptor => {
  const authInterceptor: Interceptor = (next) => async (req) => {
    const token = localStorage.getItem(tokenkey) as string;
    req.header.append("authorization", `bearer ${token}`);
    const response = await next(req);
    return response;
  };
  return authInterceptor;
};

export type FieldErrors = {
  /** key = form field name, value = human-readable message */
  [field: string]: string;
};

export type GlobalErrorPayload = {
  /** messages that are not tied to a field */
  globalErrors: string[];
  /** field-level problems (often from BadRequest.field_violations) */
  fieldErrors: FieldErrors;
};

/**
 * Hooks so the host app can react (redirect, toast, etc.) without
 * hard dependencies inside the package.
 */
export type ErrorInterceptorHooks = {
  onUnauthenticated?: (err: ConnectError) => void;
  onUnauthorized?: (err: ConnectError) => void;
  onInternal?: (err: ConnectError) => void;
};

/**
 * Creates a single interceptor that
 *   • extracts structured validation details
 *   • attaches {fieldErrors, globalErrors} to the thrown error
 *   • invokes optional hooks for UX control
 *
 * Usage:
 *   const transport = createConnectTransport({
 *     baseUrl,
 *     interceptors: [createErrorInterceptor({ onUnauthenticated: … })],
 *   });
 */
export const ErrorInterceptor =
  (hooks?: ErrorInterceptorHooks): Interceptor =>
  (next) =>
  async (req) => {
    try {
      return await next(req);
    } catch (err) {
      if (!(err instanceof ConnectError)) throw err;

      // Payload skeleton
      (err as any).fieldErrors = {} as FieldErrors;
      (err as any).globalErrors = [] as string[];

      // ------------------------------------------
      // 1. Fast-path “normal” codes → hooks → throw
      // ------------------------------------------
      switch (err.code) {
        case Code.Unauthenticated:
          hooks?.onUnauthenticated?.(err);
          throw err; // 🔙 early return – no BadRequest parsing

        case Code.PermissionDenied:
          hooks?.onUnauthorized?.(err);
          throw err;

        case Code.Internal:
          hooks?.onInternal?.(err);
          throw err;
      }

      // -------------------------------------------------
      // 2. Reaching here means switch “failed”.
      //    Decode BadRequest ONLY for InvalidArgument.
      // -------------------------------------------------

      console.log("from the interceptor", err, err.code, Code.InvalidArgument);
      if (
        err.code === Code.InvalidArgument ||
        err.code === Code.AlreadyExists
      ) {
        const badReqs = err.findDetails(BadRequestSchema); // BadRequest[]
        console.log("from the interceptor", badReqs, err);
        for (const br of badReqs) {
          for (const fv of br.fieldViolations ?? []) {
            const { field, description } = fv as FieldViolation;
            if (field) (err as any).fieldErrors[field] = description;
            else (err as any).globalErrors.push(description);

            console.log("from the interceptor", badReqs, err);
          }
        }

        console.log("from the interceptor", badReqs, err);
      }

      // 3.  Fire generic hook & propagate
      throw err;
    }
  };
