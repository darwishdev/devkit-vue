import { type interceptor } from "@connectrpc/connect";
export const authinterceptor = (tokenkey: string): interceptor => {
	const authinterceptor: interceptor = (next) => async (req) => {
		const token = localstorage.getitem(tokenkey) as string
		req.header.append("authorization", `bearer ${token}`)
		const response = await next(req);
		return response
	}
	return authinterceptor
}
