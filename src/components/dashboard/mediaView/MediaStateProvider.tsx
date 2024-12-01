"use client";

import { imageSort, itemOrder, videoSort } from "@/lib/functions";
import { Images, Logos, Videos } from "@prisma/client";
import { createContext, useState, useEffect } from "react";

type MediaContextType = {
    images: Images[];
    videos: Videos[];
    logos: Logos[];
    //
    selectedVideos: Videos[];
    setSelectedVideos: React.Dispatch<React.SetStateAction<Videos[]>>;
    videoView: "HEADER" | "VIDEO";
    setVideoView: React.Dispatch<React.SetStateAction<"HEADER" | "VIDEO">>;
    videosPerPage: number;
    setVideosPerPage: React.Dispatch<React.SetStateAction<number>>;
    videoPage: number;
    setVideoPage: React.Dispatch<React.SetStateAction<number>>;
    sortVideosBy: string;
    setSortVideosBy: React.Dispatch<React.SetStateAction<string>>;
    orderVideos: string;
    setOrderVideos: React.Dispatch<React.SetStateAction<string>>;
    //
    selectedImages: Images[];
    setSelectedImages: React.Dispatch<React.SetStateAction<Images[]>>;
    imageView: "SEGHEAD" | "SEGMENT" | "STUDY" | "LOGO" | "THUMBNAIL";
    setImageView: React.Dispatch<
        React.SetStateAction<
            "SEGHEAD" | "SEGMENT" | "STUDY" | "LOGO" | "THUMBNAIL"
        >
    >;
    imagesPerPage: number;
    setImagesPerPage: React.Dispatch<React.SetStateAction<number>>;
    imagePage: number;
    setImagePage: React.Dispatch<React.SetStateAction<number>>;
    sortImagesBy: string;
    setSortImagesBy: React.Dispatch<React.SetStateAction<string>>;
    orderImages: string;
    setOrderImages: React.Dispatch<React.SetStateAction<string>>;
};

export const MediaStateContext = createContext<MediaContextType>(
    {} as MediaContextType
);

export default function MediaStateProvider({
    children,
    images,
    videos,
    logos,
}: {
    children: React.ReactNode;
    images: Images[];
    videos: Videos[];
    logos: Logos[];
}) {
    const [selectedVideos, setSelectedVideos] = useState<Videos[]>(
        videoSort(videos, "HEADER")
    );
    const [videoView, setVideoView] = useState<"HEADER" | "VIDEO">("HEADER");
    const [videosPerPage, setVideosPerPage] = useState(8);
    const [videoPage, setVideoPage] = useState(1);
    const [sortVideosBy, setSortVideosBy] = useState("date");
    const [orderVideos, setOrderVideos] = useState("desc");

    useEffect(() => {
        setVideoPage(1);
    }, [videosPerPage]);

    useEffect(() => {
        setSelectedVideos(
            itemOrder(videoSort(videos, videoView), sortVideosBy, orderVideos)
        );
    }, [videoView, videos]);

    useEffect(() => {
        setSelectedVideos(itemOrder(selectedVideos, sortVideosBy, orderVideos));
    }, [sortVideosBy, orderVideos]);

    const [selectedImages, setSelectedImages] = useState<Images[]>(
        imageSort(images, logos, "SEGHEAD")
    );
    const [imageView, setImageView] = useState<
        "SEGHEAD" | "SEGMENT" | "STUDY" | "LOGO" | "THUMBNAIL"
    >("SEGHEAD");
    const [imagesPerPage, setImagesPerPage] = useState(8);
    const [imagePage, setImagePage] = useState(1);
    const [sortImagesBy, setSortImagesBy] = useState("date");
    const [orderImages, setOrderImages] = useState("desc");

    useEffect(() => {
        setImagePage(1);
    }, [imagesPerPage]);

    useEffect(() => {
        setSelectedImages(
            itemOrder(
                imageSort(images, logos, imageView),
                sortImagesBy,
                orderImages
            )
        );
    }, [imageView, images, logos]);

    useEffect(() => {
        setSelectedImages(itemOrder(selectedImages, sortImagesBy, orderImages));
    }, [sortImagesBy, orderImages]);

    return (
        <MediaStateContext.Provider
            value={{
                images,
                videos,
                logos,
                //
                selectedVideos,
                setSelectedVideos,
                videoView,
                setVideoView,
                videosPerPage,
                setVideosPerPage,
                videoPage,
                setVideoPage,
                sortVideosBy,
                setSortVideosBy,
                orderVideos,
                setOrderVideos,
                //
                selectedImages,
                setSelectedImages,
                imageView,
                setImageView,
                imagesPerPage,
                setImagesPerPage,
                imagePage,
                setImagePage,
                sortImagesBy,
                setSortImagesBy,
                orderImages,
                setOrderImages,
            }}>
            {children}
        </MediaStateContext.Provider>
    );
}
