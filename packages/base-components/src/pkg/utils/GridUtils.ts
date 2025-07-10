import type { GridConfig } from "@devkitvue/config";
const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 1,
  gridType: "grid",
  gap: 2,
  smColumns: 2,
  mdColumns: 4,
};

/* ------------------------------------------------------------------ */
/* 2.  Class-builder helpers                                          */
/* ------------------------------------------------------------------ */
const GRID_CLASS_MAP: Record<
  Required<GridConfig>["gridType"],
  { display: string[]; colPrefix: string }
> = {
  grid: { display: ["grid"], colPrefix: "grid-cols-" },
  columns: { display: ["block"], colPrefix: "columns-" },
  flex: { display: ["flex", "flex-wrap"], colPrefix: "[&>*]:basis-1/" },
};

export function makeGridWrapperClassName(
  cfg: GridConfig | undefined = DEFAULT_GRID_CONFIG,
): string {
  const { display, colPrefix } = GRID_CLASS_MAP[cfg.gridType || "grid"];
  return [
    ...display,
    `${colPrefix}${cfg.columns}`,
    cfg.smColumns && `sm:${colPrefix}${cfg.smColumns}`,
    cfg.mdColumns && `md:${colPrefix}${cfg.mdColumns}`,
    cfg.lgColumns && `lg:${colPrefix}${cfg.lgColumns}`,
    cfg.xlColumns && `xl:${colPrefix}${cfg.xlColumns}`,
    `gap-${cfg.gap}`,
  ]
    .filter(Boolean)
    .join(" ");
}
