import {
  EventBus
} from "./chunk-K5A633JT.js";
import {
  inject,
  markRaw
} from "./chunk-GQV6R5GZ.js";

// ../../node_modules/.pnpm/primevue@4.3.5_vue@3.5.16_typescript@5.7.3_/node_modules/primevue/dynamicdialogeventbus/index.mjs
var DynamicDialogEventBus = EventBus();

// ../../node_modules/.pnpm/primevue@4.3.5_vue@3.5.16_typescript@5.7.3_/node_modules/primevue/usedialog/index.mjs
var PrimeVueDialogSymbol = Symbol();
function useDialog() {
  var PrimeVueDialog = inject(PrimeVueDialogSymbol);
  if (!PrimeVueDialog) {
    throw new Error("No PrimeVue Dialog provided!");
  }
  return PrimeVueDialog;
}

// ../../node_modules/.pnpm/primevue@4.3.5_vue@3.5.16_typescript@5.7.3_/node_modules/primevue/dialogservice/index.mjs
var DialogService = {
  install: function install(app) {
    var DialogService2 = {
      open: function open(content, options) {
        var instance = {
          content: content && markRaw(content),
          options: options || {},
          data: options && options.data,
          close: function close(params) {
            DynamicDialogEventBus.emit("close", {
              instance,
              params
            });
          }
        };
        DynamicDialogEventBus.emit("open", {
          instance
        });
        return instance;
      }
    };
    app.config.globalProperties.$dialog = DialogService2;
    app.provide(PrimeVueDialogSymbol, DialogService2);
  }
};

export {
  DynamicDialogEventBus,
  PrimeVueDialogSymbol,
  useDialog,
  DialogService
};
//# sourceMappingURL=chunk-UWJ6LGRX.js.map
