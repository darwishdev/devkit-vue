

import type { Ref, VNode } from 'vue'
import type { MenuItem } from 'primevue/menuitem'
import type { IconFindRequest, IconFindResponse } from './api_types'
import { ApiEndpoint } from '@devkit/apiclient'
import { DialogProps, DrawerProps, MenubarRouterBindProps } from 'primevue'

export type DevkitBaseConfig<TApi extends Record<string, Function>> = {
	apiClient: TApi
	baseImageUrl?: string
	noImageUrl?: string
	locales: string[]
	iconFindApi?: ApiEndpoint<TApi, IconFindRequest, IconFindResponse>
}

export type RouterLink = string
export type ExternalLink = `http${string}`
export type LinkType = RouterLink | ExternalLink;
export type AppIconSlots = {
	top(): VNode;
	bottom(): VNode;
}
export type AppIconProps = {
	icon: string
	size?: 'small' | 'medium' | 'large'
	iconType?: 'primevue' | 'svg'
	useReset?: boolean
	color?: string
}
export type AppBtnProps = {
	action?: string | Function,
	route?: string
	label?: string,
	labelAr?: string,
	style?: any;
	class?: any;
	icon?: string | undefined;
	iconPos?: 'left' | 'right' | 'top' | 'bottom' | undefined;
	iconClass?: string | object | undefined;
	badge?: string | undefined;
	badgeClass?: string | object | undefined;
	badgeSeverity?: 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null | undefined;
	loading?: boolean | undefined;
	loadingIcon?: string | undefined;
	as?: string | object | undefined;
	asChild?: boolean | undefined;
	disabled?: boolean,
	link?: boolean | undefined;
	severity?: 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast' | undefined;
	raised?: boolean | undefined;
	rounded?: boolean | undefined;
	text?: boolean | undefined;
	outlined?: boolean | undefined;
	size?: 'small' | 'large' | undefined;
	plain?: boolean | undefined;
	fluid?: boolean | undefined;
	dt?: any;
	pt?: any;
	key?: string;
	ptOptions?: any;
	unstyled?: boolean;
	variant?: "outlined" | "text" | "link"
} & Partial<AppIconProps>;

export type AppBtnSlots = {
	default(): VNode;
	icon(): VNode;
	label(): VNode;
	end(): VNode;
}

export type AppImageEmits = {
	(e: 'load', event: Event): void
	(e: 'error', error: Event): void
	(e: 'placeholder-loaded', event: Event): void
	(e: 'fallback-error', error: Event): void
}
export type AppMenuProps = {
	items: MenuItem & { labelAr?: string }[]
	isVertical?: boolean
	isCollabsable?: boolean
	useDrawerOnMobile?: boolean
	drawerProps?: DrawerProps
	breakpoint?: number
	logo?: string | {
		src: string, type?: 'image' | 'icon',
		size?: 'small' | 'medium' | 'large'
	}
}
export type MenuItemScope = {
	item: MenuItem;
	label: string | ((...args: any) => string) | undefined;
	props: MenubarRouterBindProps;
	root: boolean;
	hasSubmenu: boolean;

}
export type AppMenuSlots = {
	logo(): VNode;
	item(scope: MenuItemScope): VNode;
	end(): VNode;
	mobileToggler(scope: { toggle: Function }): VNode;
	collabseToggler(scope: { toggle: Function }): VNode
}
export type AppHeaderProps = {
	items: MenuItem & { labelAr?: string }[]
	hideLocalSwitch?: boolean
	logo?: string | {
		src: string, type?: 'image' | 'icon',
		size?: 'small' | 'medium' | 'large'
	}
}
export type AppDialogProps = DialogProps & {
	errorRef?: Ref<string>
}
export type AppDialogSlots = {
	default(): VNode;
	error(): VNode;
	actions(props: { confirm: () => void, close: (e?: any) => void }): VNode;
	confirm(props: { confirm: () => void }): VNode;
	cancel(props: { close: (e?: any) => void }): VNode;
}
