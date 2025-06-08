// apps/docs-site/.vitepress/theme/plugins/pinia.ts
import { App } from 'vue'
import { createPinia } from 'pinia'

export function registerPinia(app: App) {
	const pinia = createPinia()
	app.use(pinia)
}
