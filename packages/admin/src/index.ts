
import { ApiEndpoint } from '@devkit/apiclient';
import { FilesHandler, AuthHandler ,  IconFindRequest , IconFindResponse } from '@devkit/config';
import { type App, type Plugin } from 'vue'
import { registerDevkitBase } from './plugins/devkit-base';
import { registerDevkitDatalist } from './plugins/datalist';
import { registerDevkitFilemanager } from './plugins/filemanager';
import { registerDevkitForm } from './plugins/form';
export type DevkitAdminConfig<TApi extends Record<string, Function>> = {
	apiClient: TApi
	baseImageUrl?: string
	fallbackImageUrl?: string
  fallbackImageSvg?: string
	locales: string[]
	iconFindApi?: ApiEndpoint<TApi, IconFindRequest, IconFindResponse>
	filesHandler?: FilesHandler<TApi>
	authHandler?: AuthHandler<TApi>
}

const DevkitAdminPlugin: Plugin<DevkitAdminConfig<any>> = {
	install<TApi extends Record<string, Function>>(app: App, config: DevkitAdminConfig<TApi>) {
		const {
			apiClient,
			baseImageUrl,
			fallbackImageSvg,
      fallbackImageUrl,
			locales,
			iconFindApi,
			filesHandler,
			authHandler
		} = config
		app.provide('apiClient', apiClient)
		if (filesHandler) app.provide('filesHandler', filesHandler)
		if (baseImageUrl) app.provide('baseImageUrl', baseImageUrl)
		if (fallbackImageSvg) app.provide('fallbackImageSvg', fallbackImageSvg)
		if (fallbackImageUrl) app.provide('fallbackImageUrl', fallbackImageUrl)
		if (locales) app.provide('locales', locales)
		if (iconFindApi) app.provide('iconFindApi', iconFindApi)
		if (authHandler) app.provide('authHandler', authHandler)
		registerDevkitBase(app , config)
		registerDevkitForm(app , config)
		registerDevkitDatalist(app , config)
		registerDevkitFilemanager(app , config)
	}
}
export default DevkitAdminPlugin

