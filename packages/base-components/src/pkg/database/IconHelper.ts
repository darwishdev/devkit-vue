
import { type Table } from 'dexie';

export class IconHelper {
  private readonly table: Table<{ key: string; value: string }>;

  constructor(cacheTable: Table<{ key: string; value: string }>) {
    this.table = cacheTable;
  }

  public async iconFind(key: string): Promise<string | undefined> {
    const result = await this.table.get(key);
    return result?.value;
  }

  public async iconCreate(key: string, value: string): Promise<void> {
    console.log("put the icon")
    await this.table.put({ key, value });
  }
}
