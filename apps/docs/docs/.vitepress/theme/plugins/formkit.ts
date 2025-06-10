
// apps/docs-site/.vitepress/theme/plugins/formkit.ts
import { App } from 'vue'
import { plugin as FormKitPlugin} from '@formkit/vue'
import { formKitConfig } from '@devkit/form'

export function registerFormKit(app: App) {
	app.use(FormKitPlugin, formKitConfig({}))
}
