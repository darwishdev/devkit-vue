
// apps/docs-site/.vitepress/theme/plugins/tanstack-vue-query.ts
import { App } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export function registerVueQuery(app: App) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 5 minutes
			},
		},
	})

	app.use(VueQueryPlugin, { queryClient })
}
