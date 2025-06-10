import {
  EventBus
} from "./chunk-K5A633JT.js";
import {
  inject
} from "./chunk-GQV6R5GZ.js";

// ../../node_modules/.pnpm/primevue@4.3.5_vue@3.5.16_typescript@5.7.3_/node_modules/primevue/toasteventbus/index.mjs
var ToastEventBus = EventBus();

// ../../node_modules/.pnpm/primevue@4.3.5_vue@3.5.16_typescript@5.7.3_/node_modules/primevue/usetoast/index.mjs
var PrimeVueToastSymbol = Symbol();
function useToast() {
  var PrimeVueToast = inject(PrimeVueToastSymbol);
  if (!PrimeVueToast) {
    throw new Error("No PrimeVue Toast provided!");
  }
  return PrimeVueToast;
}

// ../../node_modules/.pnpm/primevue@4.3.5_vue@3.5.16_typescript@5.7.3_/node_modules/primevue/toastservice/index.mjs
var ToastService = {
  install: function install(app) {
    var ToastService2 = {
      add: function add(message) {
        ToastEventBus.emit("add", message);
      },
      remove: function remove(message) {
        ToastEventBus.emit("remove", message);
      },
      removeGroup: function removeGroup(group) {
        ToastEventBus.emit("remove-group", group);
      },
      removeAllGroups: function removeAllGroups() {
        ToastEventBus.emit("remove-all-groups");
      }
    };
    app.config.globalProperties.$toast = ToastService2;
    app.provide(PrimeVueToastSymbol, ToastService2);
  }
};

export {
  ToastEventBus,
  PrimeVueToastSymbol,
  useToast,
  ToastService
};
//# sourceMappingURL=chunk-F7M6KFBQ.js.map
