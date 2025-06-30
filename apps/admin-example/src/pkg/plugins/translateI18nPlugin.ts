// src/plugins/translateI18nPlugin.ts
import type { FormKitPlugin, FormKitNode } from "@formkit/core";
import { watch } from "vue";
import { i18n } from "@/pkg/plugins/i18n.config";

/* private symbols = hidden properties to preserve the raw key */
const RAW_LABEL = Symbol("rawLabel");
const RAW_PLACEHOLDER = Symbol("rawPlaceholder");
const RAW_LEGEND = Symbol("rawLegend");

const translateI18nPlugin: FormKitPlugin = (node: FormKitNode) => {
  const xlate = () => {
    const t = i18n.global.t;
    console.log("xlateing");
    const props = node.props as Record<string | symbol, unknown>;

    /* ------ helper: translate one prop, remember its raw key once ------- */
    const run = (prop: "label" | "placeholder" | "legend", rawKey: symbol) => {
      if (typeof props[prop] === "string") {
        /* remember original key on first pass */
        props[rawKey] ??= props[prop];
        /* always translate from the remembered key */
        props[prop] = t(props[rawKey] as string);
      }
    };

    run("label", RAW_LABEL);
    run("placeholder", RAW_PLACEHOLDER);
    run("legend", RAW_LEGEND);
  };

  /* ───────── initial & prop-mutation passes ───────── */
  xlate();
  // node.on("props", xlate);

  /* ───────── react to locale changes ───────── */
  const stopLocale = watch(
    () => i18n.global.locale, // <-- .value, you already had this right
    xlate,
  );

  /* ───────── react when new messages are merged in async ─────────
     This triggers when you call set/mergeLocaleMessage or lazy-load
     translation files from the server after the component is mounted.     */
  const stopMsgs = watch(
    () => i18n.global.getLocaleMessage(i18n.global.locale),
    xlate,
  );

  node.on("destroyed", () => {
    stopLocale();
    stopMsgs();
  });
};

export default translateI18nPlugin;
