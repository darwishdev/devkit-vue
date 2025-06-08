
// apps/docs-site/.vitepress/theme/plugins/primevue.ts
import { App } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice';

export function registerPrimeVue(app: App) {
	// Install PrimeVue core
	app.use(PrimeVue, {
		theme: 'none'  // or your chosen PrimeVue theme
	})
	// Install any PrimeVue services you need:
	app.use(ToastService)
	app.use(DialogService)
}
