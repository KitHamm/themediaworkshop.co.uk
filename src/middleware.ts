export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/dashboard",
		"/api/auth",
		"/api/delete",
		"/api/image",
		"/api/video",
	],
};
