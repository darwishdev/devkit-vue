
import { App } from 'vue'
import { createRouter, createMemoryHistory, RouterOptions, createWebHistory } from 'vue-router'

/**
 * Creates a “mock” router with no real routes. This prevents
 * “router.push is not a function” or “<RouterLink> not found” errors
 * when rendering components that expect a router, but you don't need actual navigation.
 */
export function registerRouter(app: App) {
	const routes = [] as RouterOptions['routes']  // no real routes
	const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
		routes
	})

	app.use(router)
}
