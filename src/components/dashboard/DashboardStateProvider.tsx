"use client";

import { createContext, useState } from "react";

type DashboardContextType = {
    uploading: boolean;
    setUploading: React.Dispatch<React.SetStateAction<boolean>>;
    uploadProgress: number;
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
    notVideoError: boolean;
    setNotVideoError: React.Dispatch<React.SetStateAction<boolean>>;
    notImageError: boolean;
    setNotImageError: React.Dispatch<React.SetStateAction<boolean>>;
    sizeError: boolean;
    setSizeError: React.Dispatch<React.SetStateAction<boolean>>;
    backgroundNamingError: boolean;
    setBackgroundNamingError: React.Dispatch<React.SetStateAction<boolean>>;
    video1NamingError: boolean;
    setVideo1NamingError: React.Dispatch<React.SetStateAction<boolean>>;
    video2NamingError: boolean;
    setVideo2NamingError: React.Dispatch<React.SetStateAction<boolean>>;
    topImageNamingError: boolean;
    setTopImageNamingError: React.Dispatch<React.SetStateAction<boolean>>;
    segmentImageNamingError: boolean;
    setSegmentImageNamingError: React.Dispatch<React.SetStateAction<boolean>>;
    imageNamingError: boolean;
    setImageNamingError: React.Dispatch<React.SetStateAction<boolean>>;
    videoNamingError: boolean;
    setVideoNamingError: React.Dispatch<React.SetStateAction<boolean>>;
    previewVideo: string;
    setPreviewVideo: React.Dispatch<React.SetStateAction<string>>;
    videoModalTarget: string;
    setVideoModalTarget: React.Dispatch<React.SetStateAction<string>>;
};

export const DashboardStateContext = createContext<DashboardContextType>(
    {} as DashboardContextType
);

export default function DashboardStateProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [notVideoError, setNotVideoError] = useState(false);
    const [notImageError, setNotImageError] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [backgroundNamingError, setBackgroundNamingError] = useState(false);
    const [video1NamingError, setVideo1NamingError] = useState(false);
    const [video2NamingError, setVideo2NamingError] = useState(false);
    const [topImageNamingError, setTopImageNamingError] = useState(false);
    const [segmentImageNamingError, setSegmentImageNamingError] =
        useState(false);
    const [imageNamingError, setImageNamingError] = useState(false);
    const [videoNamingError, setVideoNamingError] = useState(false);
    const [previewVideo, setPreviewVideo] = useState("");
    const [videoModalTarget, setVideoModalTarget] = useState("");

    return (
        <DashboardStateContext.Provider
            value={{
                uploading,
                setUploading,
                uploadProgress,
                setUploadProgress,
                notVideoError,
                setNotVideoError,
                notImageError,
                setNotImageError,
                sizeError,
                setSizeError,
                backgroundNamingError,
                setBackgroundNamingError,
                video1NamingError,
                setVideo1NamingError,
                video2NamingError,
                setVideo2NamingError,
                topImageNamingError,
                setTopImageNamingError,
                segmentImageNamingError,
                setSegmentImageNamingError,
                imageNamingError,
                setImageNamingError,
                videoNamingError,
                setVideoNamingError,
                previewVideo,
                setPreviewVideo,
                videoModalTarget,
                setVideoModalTarget,
            }}>
            {children}
        </DashboardStateContext.Provider>
    );
}
