# API Client

The **`@devkit/api-client`** package provides utility functions and types to help you:

1. Assert and resolve API endpoints  
2. Merge objects deeply  
3. Work with typed API endpoint names and functions  
4. Attach interceptors (e.g. for auth)

**Exports**:

- **Utility modules**:
  - [`ObjectUtils`](./object-utils.md)  
  - [`TypeUtils`](./type-utils.md)  
- **API interceptors**:
  - [`AuthInterceptor`](./api-interceptors.md)  
- **Types**:
  - [`ApiTypes`](./api-types.md)  

**Quick Start**:

```ts
import { resolveApiEndpoint, subtractRecords } from '@devkit/api-client'

// Example 1: Call an endpoint function directly
async function fetchData() {
  // Suppose `myApi` is your typed client with shape { getUsers: (req) => Promise<{…}>, ... }
  const users = await resolveApiEndpoint(myApi.getUsers, myApi, { page: 1 })
  console.log(users)
}

// Example 2: Subtract two record arrays
const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
const selected = [{ id: 2 }]
const result = subtractRecords(data, selected, 'id')
// result === [{ id: 1 }, { id: 3 }]
