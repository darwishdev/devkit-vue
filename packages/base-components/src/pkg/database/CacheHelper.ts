import { type Table } from 'dexie';

export type BasicCacheEntry = string | boolean | number | Record<any,any>
export class CacheHelper {
  private readonly table: Table<{ key: string; value: BasicCacheEntry}>;
  constructor(cacheTable: Table<{ key: string; value: BasicCacheEntry}>) {
    this.table = cacheTable;
  }

  private async getValue(key: string): Promise<BasicCacheEntry | undefined> {
    const result = await this.table.get(key);
    return result?.value;
  }

  private async setValue(key: string, value: BasicCacheEntry): Promise<void> {
    await this.table.put({ key, value });
  }

  public async setLocale<TAllowedLocales extends string[]>(locale: TAllowedLocales[number]): Promise<void> {
    await this.setValue('locale', locale);
  }
  public async getLocale(): Promise<string> {
    return (await this.getValue('locale')) as string ?? 'en';
  }
  public async setLocaleTranslations<TAllowedLocales extends string[]>(locale: TAllowedLocales[number] , translations : Record<string , string>): Promise<void> {
    await this.setValue(`locale_${locale}_translations`, translations);
  }
  public async getLocaleTranslations<TAllowedLocales extends string[]>(locale: TAllowedLocales[number]): Promise<Record<string , string> | null> {
    return (await this.getValue(`locale_${locale}_translations`)) as Record<string , string> ?? null;
  }
  public async setIsDark(isDark: boolean): Promise<void> {
    await this.setValue('isDark', isDark);
  }

  public async getIsDark(): Promise<boolean> {
    return (await this.getValue('isDark')) as boolean ?? false;
  }
}
