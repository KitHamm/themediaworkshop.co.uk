"use client";
// packages
import { Images, User, Videos } from "@prisma/client";
import { createContext, useContext, useMemo } from "react";

type MediaFilesContextType = {
	images: Images[];
	videos: Videos[];
	currentUser: User;
};

export const MediaFilesContext = createContext<MediaFilesContextType>(
	{} as MediaFilesContextType
);

const MediaFilesProvider = ({
	children,
	images,
	videos,
	currentUser,
}: Readonly<{
	children: React.ReactNode;
	images: Images[];
	videos: Videos[];
	currentUser: User;
}>) => {
	const mediaFilesValue = useMemo(
		() => ({
			images,
			videos,
			currentUser,
		}),
		[images, videos, currentUser]
	);
	return (
		<MediaFilesContext.Provider value={mediaFilesValue}>
			{children}
		</MediaFilesContext.Provider>
	);
};

export const useMediaFiles = () => useContext(MediaFilesContext);
export default MediaFilesProvider;
