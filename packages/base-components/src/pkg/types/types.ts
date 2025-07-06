import type { Ref, VNode } from "vue";
import type { MenuItem } from "primevue/menuitem";
import type { IconFindRequest, IconFindResponse } from "./api_types";
import { ApiEndpoint } from "@devkit/apiclient";
import { DialogProps, DrawerProps, MenubarRouterBindProps } from "primevue";
import { RouteLocationRaw } from "vue-router";

export type DevkitBaseConfig<TApi extends Record<string, Function>> = {
  apiClient: TApi;
  baseImageUrl?: string;
  noImageUrl?: string;
  locales: string[];
  iconFindApi?: ApiEndpoint<TApi, IconFindRequest, IconFindResponse>;
};

export type RouterLink = string;
export type ExternalLink = `http${string}`;
export type LinkType = RouterLink | ExternalLink;
export type AppIconSlots = {
  top(): VNode;
  bottom(): VNode;
};
export type AppBtnSlots = {
  default(): VNode;
  icon(): VNode;
  label(): VNode;
  end(): VNode;
};

export type AppImageEmits = {
  (e: "load", event: Event): void;
  (e: "error", error: Event): void;
  (e: "placeholder-loaded", event: Event): void;
  (e: "fallback-error", error: Event): void;
};
export type AppMenuItem = MenuItem & { labelAr?: string };
export type AppMenuProps = {
  items: AppMenuItem[];
  hideDrawerToggler?: boolean;
  isVertical?: boolean;
  isCollabsable?: boolean;
  useDrawerOnMobile?: boolean;
  drawerProps?: DrawerProps;
  breakpoint?: string;
  logo?:
    | string
    | {
        src: string;
        type?: "image" | "icon";
        size?: "small" | "medium" | "large";
      };
};
export type MenuItemScope = {
  item: MenuItem;
  label: string | ((...args: any) => string) | undefined;
  props: MenubarRouterBindProps;
  root: boolean;
  hasSubmenu: boolean;
};
export type AppMenuSlots = {
  logo(): VNode;
  item(scope: MenuItemScope): VNode;
  end(): VNode;
  mobileToggler(scope: { toggle: Function }): VNode;
  collabseToggler(scope: { toggle: Function }): VNode;
};
export type AppHeaderProps = {
  items: MenuItem & { labelAr?: string }[];
  hideLocalSwitch?: boolean;
  logo?:
    | string
    | {
        src: string;
        type?: "image" | "icon";
        size?: "small" | "medium" | "large";
      };
};
export type AppDialogProps = DialogProps & {
  errorRef?: Ref<string>;
};
export type AppDialogSlots = {
  default(): VNode;
  error(): VNode;
  actions(props: { confirm: () => void; close: (e?: any) => void }): VNode;
  confirm(props: { confirm: () => void }): VNode;
  cancel(props: { close: (e?: any) => void }): VNode;
};
