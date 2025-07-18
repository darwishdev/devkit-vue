import { createClient } from "@connectrpc/connect";
import { AuthInterceptor, ErrorInterceptor } from "@devkitvue/apiclient";
import { createConnectTransport } from "@connectrpc/connect-web";
import { DevkitService } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/devkit_service_pb";
import router from "@/pkg/router";
const transport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_URL,
  fetch: (input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include", // 👈 inject credentials here
    });
  },

  interceptors: [
    AuthInterceptor("token"),

    ErrorInterceptor({
      onUnauthenticated: (e) => {
        console.log("err", e);
      },
      onUnauthorized: () => router.push("/forbidden"),
      onInternal: (err) => {
        console.log("show me the internal error here", err);
      },
    }),
  ],
  useHttpGet: true,
});

export const apiClient = createClient(DevkitService, transport);
