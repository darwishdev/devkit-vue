import Dexie from 'dexie';
import { type DBDropdownOptions } from './DbTypes';
import { CacheHelper, DBCacheEntry } from './CacheHelper';
export class DevkitFormDB extends Dexie {
  public dropdownHelper: CacheHelper<DBDropdownOptions>;
  private dropdown!: Dexie.Table<DBCacheEntry<DBDropdownOptions>, string>;
  constructor() {
    super(`DEVKIT_FORM`);
    this.version(1).stores({
      dropdown: 'key',
    });

    this.dropdownHelper = new CacheHelper<DBDropdownOptions>(this.dropdown);
  }
}

export default DevkitFormDB;
