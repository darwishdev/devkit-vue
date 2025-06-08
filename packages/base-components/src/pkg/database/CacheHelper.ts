import { type Table } from 'dexie';

export class CacheHelper {
  private readonly table: Table<{ key: string; value: string | boolean | number }>;

  constructor(cacheTable: Table<{ key: string; value: string | boolean | number }>) {
    this.table = cacheTable;
  }

  private async getValue(key: string): Promise<string | boolean | number | undefined> {
    const result = await this.table.get(key);
    return result?.value;
  }

  private async setValue(key: string, value: string | boolean | number): Promise<void> {
    await this.table.put({ key, value });
  }

  public async setLocale<TAllowedLocales extends string[]>(locale: TAllowedLocales[number]): Promise<void> {
    await this.setValue('locale', locale);
  }
  public async getLocale(): Promise<string> {
    return (await this.getValue('locale')) as string ?? 'en';
  }
  public async setIsDark(isDark: boolean): Promise<void> {
    await this.setValue('isDark', isDark);
  }
}
