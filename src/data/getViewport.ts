import { Viewport } from "next";

export const getViewport = (themeColor: string) => {
	const viewport: Viewport = {
		initialScale: 1,
		width: "device-width",
		minimumScale: 1,
		themeColor: themeColor,
	};

	return viewport;
};
