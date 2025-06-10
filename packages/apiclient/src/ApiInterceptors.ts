import { type Interceptor } from "@connectrpc/connect";
export const AuthInterceptor = (tokenkey: string): Interceptor =>  {
	const authInterceptor: Interceptor = (next) => async (req) => {
		const token = localStorage.getItem(tokenkey) as string
		req.header.append("authorization", `bearer ${token}`)
		const response = await next(req);
		return response
	}
	return authInterceptor
}
