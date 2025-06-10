/// <reference path="../../../../tsconfig.json" />
import { App } from "vue";
import DatalistExample from '../../../../src/DatalistExample.vue'
import DevkitDatalistPlugin, {
  Datalist,
  DevkitDatalistConfig
} from "@devkit/datalist";
import {apiClient} from '../../../../src/apiClient'
export function registerDevkitDatalist(app: App) {

  const baseConfig: DevkitDatalistConfig<typeof apiClient> = {
    apiClient,
   authHandler: {
    login: 'authLogin',
    allowedProviders: ['google'],
    providerLogin: 'authLoginProvider',
    providerLoginCallback: 'authLoginProviderCallback',
    resetPasswordEmail: 'authResetPasswordEmail',
    resetPassword: 'authResetPassword'
  },
	filesHandler: {
		fileDelete: 'fileDelete',
		galleryListEndpoint: 'galleryList',
		fileUploadUrlFind: 'fileUploadUrlFind',
		bucketList: 'bucketList',
		fileDeleteByBucket: 'fileDeleteByBucket',
		bucketCreateUpdate: 'bucketCreateUpdate',
	}
 };
  app.use(DevkitDatalistPlugin , baseConfig);
  app.component('Datalist' , Datalist  as unknown as import('vue').DefineComponent<{}, {}, any>)
  app.component('DatalistExample' , DatalistExample)
}

