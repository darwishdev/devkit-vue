---
sidebarPosition: 3
---

# src/ApiInterceptors.ts

This module provides a gRPC Connect interceptor that injects an authorization header from `localStorage` into each request.

---

## `authinterceptor(tokenKey: string): interceptor`

```ts
import { type interceptor } from "@connectrpc/connect";

export const authinterceptor = (tokenKey: string): interceptor => {
  const authinterceptor: interceptor = (next) => async (req) => {
    const token = localStorage.getItem(tokenKey) as string;
    req.header.append("authorization", `Bearer ${token}`);
    const response = await next(req);
    return response;
  };
  return authinterceptor;
};
````

* **Signature**

  ```ts
  authinterceptor(tokenKey: string): interceptor
  ```

* **Description**
  Returns an interceptor function that:

  1. Reads a JWT or token string from `localStorage` under the given `tokenKey`.
  2. Appends an `Authorization: Bearer <token>` header to each outgoing gRPC request.
  3. Calls the next handler in the chain and returns its response.

* **Parameters**

  * `tokenKey: string` — the key in `localStorage` where your token is stored.

* **Example**

  ```ts
  import { authinterceptor } from "@devkit/api-client";
  import { createConnectTransport } from "@connectrpc/connect";

  const transport = createConnectTransport({
    baseUrl: "https://api.example.com",
    interceptors: [authinterceptor("authToken")],
  });

  // then use `transport` with your generated client:
  const client = new MyServiceClient(transport);
  ```

