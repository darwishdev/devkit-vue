import type { AppImageProps } from "@devkitvue/base-components";
import type { GridConfig } from "@devkitvue/config";
import type { VNode } from "vue";
export type AppCardGridPassThrough = {
  header?: string;
  "header-start"?: string;
  "header-end"?: string;
  start?: string;
  imageWrapper?: string;
  image?: string;
  title?: string;
  subtitle?: string;
  createdAt?: string;
  deletedAt?: string;
  badge?: string;
  info?: string;
  "footer-start"?: string;
  "footer-end"?: string;
  footer?: string;
};
export type AppCardGridProps<TRecord> = {
  layout?: "default" | "horizontal" | "vertical"; // layout variants
  data: TRecord;
  titleKey?: keyof TRecord;
  titleRouter?: string;
  imageHeight?: string;
  identefier?: keyof TRecord;
  imageKey?: keyof TRecord;
  gridConfig?: GridConfig;
  imageProps?: AppImageProps;
  pt?: AppCardGridPassThrough;
  badgeKey?: keyof TRecord;
  dateAdapter?: (data: string) => Date;
  createdAtKey?: keyof TRecord;
  deletedAtKey?: keyof TRecord;
};
export type AppCardGridSlots = {
  header?: () => VNode | VNode[];
  "header-start"?: () => VNode | VNode[];
  "header-end"?: () => VNode | VNode[];

  start?: () => VNode | VNode[];
  "start-content"?: () => VNode | VNode[];
  "card-image"?: () => VNode | VNode[];

  "card-info"?: () => VNode | VNode[];
  subtitle?: () => VNode | VNode[];

  footer?: () => VNode | VNode[];
  "footer-start"?: () => VNode | VNode[];
  createdAt?: () => VNode | VNode[];
  deletedAt?: () => VNode | VNode[];
  "footer-middle"?: () => VNode | VNode[];
  "footer-end"?: () => VNode | VNode[];
  badgeContent?: () => VNode | VNode[];
};
