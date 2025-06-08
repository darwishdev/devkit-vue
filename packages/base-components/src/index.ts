import DevkitBaseDB from '@/pkg/database/DB'
import { type App, type Plugin } from 'vue'
import { useI18n } from 'vue-i18n';
import { toggleLocale } from '@/pkg/utils/LocaleUtils';
import { ApiEndpoint } from '@devkit/apiclient';
import { IconFindRequest, IconFindResponse } from '@/pkg/types/api_types';

export * from '@/pkg/types/types'
export * from '@/pkg/types/api_types'
export * from '@/app/base/index'
export * from '@/pkg/utils/LocaleUtils'

export type DevkitBaseConfig<TApi extends Record<string, Function>> = {
	apiClient: TApi
	baseImageUrl?: string
	noImageUrl?: string
	locales: string[]
	iconFindApi?: ApiEndpoint<TApi, IconFindRequest, IconFindResponse>
}
const db = new DevkitBaseDB()
export const cacheHelper = db.cache
export const iconHelper = db.iconHelper
// Function to sync i18n locale inside setup()
export function setupI18nSync() {
	const i18n = useI18n() // Must be inside setup()
	cacheHelper.getLocale().then((locale: string) => {
		if (locale === 'ar') {
			toggleLocale({ i18n, cacheHelper })
		}
	})
}
const DevkitBaseComponentsPlugin: Plugin<DevkitBaseConfig<any>> = {
	install<TApi extends Record<string, Function>>(app: App, { baseImageUrl, noImageUrl, apiClient, iconFindApi }: DevkitBaseConfig<TApi>) {
		app.provide('apiClient', apiClient)
		app.provide('baseImageUrl', baseImageUrl)
		app.provide('noImageUrl', noImageUrl)
		if (iconFindApi) {
			app.provide<ApiEndpoint<TApi, IconFindRequest, IconFindResponse>>('iconFindApi', iconFindApi)
		}
	}
}

export default DevkitBaseComponentsPlugin

