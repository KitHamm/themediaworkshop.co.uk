import type { Metadata } from "next";

export const getMetadata = (title: string) => {
	const defaultUrl = "https://themediaworkshop.co.uk/";
	const url =
		process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_BASE_URL ?? defaultUrl
			: defaultUrl;
	const description =
		"The Media Workshop is a digital production and development company who work creatively with new media and developing technologies.";

	const metadata: Metadata = {
		metadataBase: new URL(url),
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			url: url,
			siteName: title,
			locale: "en-US",
			type: "website",
			images: [
				{
					url: "/og-image.png",
					width: 400,
					height: 200,
					alt: "The Media Workshop Ltd",
				},
			],
		},
	};

	return metadata;
};

// og-image.png
