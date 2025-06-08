// apps/docs-site/.vitepress/theme/index.ts
/// <reference path="../../../tsconfig.json" />
import DefaultTheme from 'vitepress/theme'
import { App } from 'vue'
 
// Import each “register” function from plugins/
import { registerRouter } from './plugins/router'
import { registerVueQuery } from './plugins/tanstack-vue-query'
import { registerPinia } from './plugins/pinia'
import { registerPrimeVue } from './plugins/primevue'
import { registerFormKit } from './plugins/formkit'
import { registerI18n } from './plugins/i18n'
import { registerDevkitBase } from './plugins/devkit-base'
import '@devkit/tailwindconfig/style.css';
// We spread DefaultTheme so we keep the built‐in layouts & styles.
// Then we add our own enhanceApp() to register BaseComponents.

export default {
	...DefaultTheme,
	enhanceApp({ app }: { app: App }) {
		   // 1) If your components expect a router, register it first:
		   registerRouter(app)

		   // 2) Register state + data‐fetching plugins:
		   registerPinia(app)
		   registerVueQuery(app)
	   
		   // 3) Register UI frameworks & services:
		   registerPrimeVue(app)
		   registerFormKit(app)    // installs FormKit
		   registerI18n(app)       // installs vue-i18n
	   
		   // 4) Finally, register your DevKit plugin (which pulls in @devkit/api-client internally)
		   registerDevkitBase(app)
	}
}
