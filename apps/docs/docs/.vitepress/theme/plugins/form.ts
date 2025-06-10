/// <reference path="../../../../tsconfig.json" />
import { App } from "vue";
import DevkitFormPlugin, {
  DevkitFormConfig,
formKitConfig,
  LoginForm,
  AppForm
} from "@devkit/form";
import {apiClient} from '../../../../src/apiClient'
export function registerDevkitForm(app: App) {

  const baseConfig: DevkitFormConfig<typeof apiClient> = {
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
  app.use(DevkitFormPlugin, baseConfig);
  app.component('AppForm' , AppForm)
  app.component('LoginForm' , LoginForm)
}

