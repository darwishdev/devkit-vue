
import { type App, type Plugin } from 'vue'
import type { DevkitFormConfig } from './pkg/types/types'
import * as adminTypes from './pkg/types/types';
export * from './app/appform';
export type { DevkitFormConfig }
import Datepicker from './app/appform/inputs/Datepicker.vue';
import DevkitFormDB from './pkg/database/DB';

const db = new DevkitFormDB()

export { db, Datepicker, adminTypes }
const DevkitFormPlugin: Plugin<DevkitFormConfig<any>> = {
	install<TApi extends Record<string, Function>>(app: App, { apiClient, authHandler, filesHandler, }: DevkitFormConfig<TApi>) {
		app.provide('apiClient', apiClient)
		if (filesHandler) app.provide('filesHandler', filesHandler)
		if (authHandler) app.provide('authHandler', authHandler)
	}
}
export default DevkitFormPlugin

