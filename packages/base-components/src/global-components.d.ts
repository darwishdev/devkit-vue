import type { AppBtn, AppIcon, AppImage } from "./app/base/index";

declare module "vue" {
	export interface GlobalComponents {
		AppBtn: typeof AppBtn;
		AppIcon: typeof AppIcon;
		AppImage: typeof AppImage;
	}
}

export { };
