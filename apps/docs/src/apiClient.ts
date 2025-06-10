

import { Client, createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { DevkitService } from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/devkit_service_pb"
import { AuthInterceptor } from "@devkit/apiclient";

const transport = createConnectTransport({
	baseUrl: "http://192.168.100.40:9090",
	fetch: (input, init) => {
		return fetch(input, {
			...init,
			credentials: "include", // 👈 inject credentials here
		});
	},
  interceptors: [AuthInterceptor('token')],
	useHttpGet: true,
});

export const apiClient: Client<typeof DevkitService> = createClient(DevkitService, transport);
