
// apps/docs-site/.vitepress/theme/plugins/i18n.ts
import { App } from 'vue'
import { createI18n } from 'vue-i18n'

export function registerI18n(app: App) {
	const i18n = createI18n({
		locale: 'en',
		fallbackLocale: 'en',
		messages: {
			en: { hello: 'hello' },
			ar: { hello: 'اهلا' }
		}
	})

	app.use(i18n)
}
