import { type Table } from 'dexie';
export type DBCacheEntry<TValue = unknown> = {
  key: string;
  value: TValue;
  expirationTime: number;
}
export class CacheHelper<TValue> {
  private readonly table: Table<DBCacheEntry<TValue>>;
  constructor(table: Table<DBCacheEntry<TValue>>) {
    this.table = table;
  }
  public async cleanupExpiredEntries(): Promise<void> {
    const currentTime = Date.now();
    const expiredEntries = await this.table
      .where('expirationTime')
      .belowOrEqual(currentTime)
      .toArray();

    const expiredKeys = expiredEntries.map(entry => entry.key);
    await this.table.bulkDelete(expiredKeys);
  }
  private isCacheValid(expirationTime: number): boolean {
    return Date.now() < expirationTime;
  }
  public async find(key: string): Promise<TValue | undefined> {
    const result = await this.table.get(key);
    if (result && this.isCacheValid(result.expirationTime)) {
      return result.value;
    } else if (result) {
      await this.table.delete(key);
    }
    return undefined;
  }

  public async create(key: string, value: TValue, expirationMs: number): Promise<void> {
    const expirationTime = Date.now() + expirationMs;
    await this.table.put({ key, value, expirationTime });
  }
  public async bulkDelete(keys: string[]): Promise<void> {
    await this.table.bulkDelete(keys);
  }
}
