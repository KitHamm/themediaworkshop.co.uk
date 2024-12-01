"use client";

import { Images, Videos } from "@prisma/client";
import { createContext } from "react";

type MediaFilesContextType = {
    images: Images[];
    videos: Videos[];
};

export const MediaFilesContext = createContext<MediaFilesContextType>(
    {} as MediaFilesContextType
);

export default function MediaFilesProvider({
    children,
    images,
    videos,
}: {
    children: React.ReactNode;
    images: Images[];
    videos: Videos[];
}) {
    return (
        <MediaFilesContext.Provider value={{ images, videos }}>
            {children}
        </MediaFilesContext.Provider>
    );
}
