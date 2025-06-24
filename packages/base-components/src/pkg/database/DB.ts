import Dexie from 'dexie';
import { BasicCacheEntry, CacheHelper } from './CacheHelper';
import { IconHelper } from './IconHelper';
export class DevkitStaticDB extends Dexie {
  public cache: CacheHelper;
  public iconHelper: IconHelper;
  private cacheHelper!: Dexie.Table<{ key: string; value: BasicCacheEntry }, string>;
  private icon!: Dexie.Table<{ key: string, value: string }, string>;
  constructor() {
    super(`DEVKIT_BASE`);
    this.version(1).stores({
      cacheHelper: 'key',
      icon: 'key',
    });

    this.iconHelper = new IconHelper(this.icon);
    this.cache = new CacheHelper(this.cacheHelper);
  }
}

export default DevkitStaticDB;
