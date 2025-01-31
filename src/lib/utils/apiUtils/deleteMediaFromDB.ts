import prisma from "@/lib/prisma";

export const deleteFileFromPrisma = async (
	fileName: string,
	prefix: string
) => {
	// Mapping of prefixes to table names
	const tableMapping: { [key: string]: string | undefined } = {
		SEGHEAD: "images",
		SEGMENT: "images",
		STUDY: "images",
		THUMBNAIL: "images",
		VIDEO: "videos",
		HEADER: "videos",
		LOGO: "logos",
	};

	const table = tableMapping[prefix];

	// If no valid table is found, throw an error
	if (!table) {
		throw new Error(`Invalid table prefix: ${prefix}`);
	}

	// Explicitly handle each model separately
	if (table === "images") {
		await prisma.images.delete({
			where: { name: fileName },
		});
	} else if (table === "videos") {
		await prisma.videos.delete({
			where: { name: fileName },
		});
	} else if (table === "logos") {
		await prisma.logos.delete({
			where: { name: fileName },
		});
	}
};
