
---
sidebarPosition: 4
---

# src/ApiTypes.ts

This module exports core type definitions used throughout the API client.

---

## `StringUnknownRecord`

```ts
export type StringUnknownRecord = Record<string, unknown>
````

A generic object whose keys are strings and whose values can be anything.
Use it when you need a map-like type but don’t know the exact shape in advance.

---

## `EndpointFunction<TReq, TResp>`

```ts
export type EndpointFunction<
  TReq extends Record<string, unknown> = {},
  TResp extends Record<string, unknown> = {}
> = (req: TReq) => Promise<TResp>
```

A function type representing one API call:

* **`TReq`** — the shape of the request object (defaults to empty object).
* **`TResp`** — the shape of the response (defaults to empty object).

#### Example

```ts
import type { EndpointFunction } from '@devkit/api-client'

type UserRequest  = { id: number }
type UserResponse = { name: string; email: string }

const getUser: EndpointFunction<UserRequest, UserResponse> = async ({ id }) => {
  // call your HTTP/gRPC layer…
  return { name: 'Alice', email: 'alice@example.com' }
}
```

---

## `ApiEndpoint<TApi, TReq, TResp>`

```ts
export type ApiEndpoint<
  TApi extends Record<string, Function>,
  TReq extends Record<string, unknown> = {},
  TResp extends Record<string, unknown> = {}
> = keyof TApi
  | EndpointFunction<TReq, TResp>
  | Promise<TResp>
```

A union type that lets you refer to an API endpoint in three ways:

1. **A key of your client interface** (`keyof TApi`), e.g. `'getUser'`.
2. **A concrete function** matching our `EndpointFunction` signature.
3. **A raw `Promise<TResp>`**, for cases where you already have a Promise response.

#### Example

```ts
import type { ApiEndpoint } from '@devkit/api-client'

interface UserApi {
  getUser: (req: { id: number }) => Promise<{ name: string }>
}

// 1) by name
const epByName: ApiEndpoint<UserApi, {id:number}, {name:string}> = 'getUser'

// 2) inline function
const epFunc: ApiEndpoint<UserApi, {id:number}, {name:string}> = async ({ id }) => {
  return { name: 'Bob' }
}

// 3) direct promise
const epPromise: ApiEndpoint<UserApi, {}, {foo:string}> = Promise.resolve({ foo: 'bar' })
```

