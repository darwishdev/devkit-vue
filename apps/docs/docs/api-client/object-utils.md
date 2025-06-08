
---
sidebarPosition: 2
---

# src/ObjectUtils.ts

A set of helper functions for working with plain objects and records in TypeScript.

---

## `ObjectKeys<T>(obj: T): (keyof T)[]`

```ts
export const ObjectKeys = <T extends {}>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
}
````

* **Description**
  Returns all own enumerable property names of `obj`, typed as the keys of `T`.
* **Use cases**

  * Iterating over an object’s properties in a type-safe way.
* **Example**

  ```ts
  const user = { id: 1, name: 'Alice' };
  const keys = ObjectKeys(user); // type: ('id' | 'name')[]
  // keys = ['id', 'name']
  ```

---

## `ObjectEntries<T>(obj: T): [keyof T, T[keyof T]][]`

```ts
export const ObjectEntries = <T extends Record<string, any>>(
  obj: T
): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}
```

* **Description**
  Returns an array of `[key, value]` pairs from `obj`, with each key typed as `keyof T` and its corresponding value.
* **Use cases**

  * Transforming objects into key/value tuples for mapping or filtering.
* **Example**

  ```ts
  const settings = { darkMode: true, fontSize: 14 };
  const entries = ObjectEntries(settings);
  // entries = [ ['darkMode', true], ['fontSize', 14] ]
  ```

---

## `AssertIsDefined<T>(value: T | undefined, message?: string): asserts value is T`

```ts
export const AssertIsDefined: <T>(
  value: T | undefined,
  message?: string
) => asserts value is T = (value, message = "Value is undefined") => {
  if (value === undefined) {
    throw new Error(message);
  }
};
```

* **Description**
  Asserts that `value` is not `undefined`, throwing an `Error` otherwise. After this call, TypeScript will narrow the type of `value` to `T`.
* **Use cases**

  * Guarding against missing or optional values before using them.
* **Example**

  ```ts
  function greet(name?: string) {
    AssertIsDefined(name, "Name must be provided");
    // here `name` is narrowed to `string`
    console.log(`Hello, ${name.toUpperCase()}`);
  }
  ```

---

## `subtractRecords<TRecord>(dataRef: TRecord[], modelSelectionRef: TRecord[], dataKey: keyof TRecord): TRecord[]`

```ts
export const subtractRecords = <TRecord>(
  dataRef: TRecord[],
  modelSelectionRef: TRecord[],
  dataKey: keyof TRecord
): TRecord[] => {
  const dataCopy = [...dataRef];
  const selectionIds = new Set(modelSelectionRef.map(item => item[dataKey]));
  return dataCopy.filter(item => !selectionIds.has(item[dataKey]));
};
```

* **Description**
  Returns a new array containing only those items from `dataRef` whose `dataKey` value does *not* appear in `modelSelectionRef`.
* **Use cases**

  * Removing already-selected items from a larger dataset.
* **Example**

  ```ts
  const allUsers = [ { id:1 }, { id:2 }, { id:3 } ];
  const selected = [ { id:2 } ];
  const remaining = subtractRecords(allUsers, selected, 'id');
  // remaining = [ { id:1 }, { id:3 } ]
  ```

---

## `deepMerge<T>(target: T, source?: Partial<T>): T`

```ts
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  source?: Partial<T>
): T => {
  if (!source) return target;
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (
        typeof targetValue === 'object' &&
        targetValue !== null &&
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(targetValue) &&
        !Array.isArray(sourceValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}
```

* **Description**
  Recursively merges properties from `source` into `target`, producing a new object.
* **Use cases**

  * Combining configuration objects with defaults.
* **Example**

  ```ts
  const defaultConfig = { theme: { color: 'blue' }, debug: false };
  const userConfig   = { theme: { fontSize: 16 } };
  const merged = deepMerge(defaultConfig, userConfig);
  // merged = { theme: { color:'blue', fontSize:16 }, debug:false }
  ```
