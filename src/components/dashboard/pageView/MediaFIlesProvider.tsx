"use client";

import { Images, Videos } from "@prisma/client";
import { Session } from "next-auth";
import { createContext } from "react";

type MediaFilesContextType = {
    images: Images[];
    videos: Videos[];
    session: Session;
};

export const MediaFilesContext = createContext<MediaFilesContextType>(
    {} as MediaFilesContextType
);

export default function MediaFilesProvider({
    children,
    images,
    videos,
    session,
}: {
    children: React.ReactNode;
    images: Images[];
    videos: Videos[];
    session: Session;
}) {
    return (
        <MediaFilesContext.Provider value={{ images, videos, session }}>
            {children}
        </MediaFilesContext.Provider>
    );
}
