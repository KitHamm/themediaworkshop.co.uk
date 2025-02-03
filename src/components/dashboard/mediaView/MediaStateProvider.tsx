"use client";
// packages
import { createContext, useState, useEffect, useContext, useMemo } from "react";
// functions
import { imageSort } from "@/lib/utils/mediaUtils/imageSort";
import { videoSort } from "@/lib/utils/mediaUtils/videoSort";
import { itemOrder } from "@/lib/utils/mediaUtils/itemOrder";
// types
import { Images, Logos, Videos } from "@prisma/client";

type MediaContextType = {
	selectedVideos: Videos[];
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
	selectedImages: Images[];
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

const MediaStateProvider = ({
	children,
	images,
	videos,
	logos,
}: Readonly<{
	children: React.ReactNode;
	images: Images[];
	videos: Videos[];
	logos: Logos[];
}>) => {
	// Video Options
	const [selectedVideos, setSelectedVideos] = useState<Videos[]>(
		videoSort(videos, "HEADER")
	);
	const [videoView, setVideoView] = useState<"HEADER" | "VIDEO">("HEADER");
	const [videosPerPage, setVideosPerPage] = useState(8);
	const [videoPage, setVideoPage] = useState(1);
	const [sortVideosBy, setSortVideosBy] = useState("date");
	const [orderVideos, setOrderVideos] = useState("desc");

	// Set Videos
	useEffect(() => {
		setVideoPage(1);
	}, [videosPerPage, videoView]);

	useEffect(() => {
		setSelectedVideos(
			itemOrder(videoSort(videos, videoView), sortVideosBy, orderVideos)
		);
	}, [videoView, videos]);

	useEffect(() => {
		setSelectedVideos(itemOrder(selectedVideos, sortVideosBy, orderVideos));
	}, [sortVideosBy, orderVideos]);

	// Image Options
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

	// Set Images
	useEffect(() => {
		setImagePage(1);
	}, [imagesPerPage, imageView]);

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

	const mediaStateValue = useMemo(
		() => ({
			selectedVideos,
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
			selectedImages,
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
		}),
		[
			selectedVideos,
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
			selectedImages,
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
		]
	);

	return (
		<MediaStateContext.Provider value={mediaStateValue}>
			{children}
		</MediaStateContext.Provider>
	);
};

export const useMediaState = () => {
	const context = useContext(MediaStateContext);
	if (!context) {
		return {
			selectedVideos: null,
			videoView: null,
			setVideoView: null,
			videosPerPage: null,
			setVideosPerPage: null,
			videoPage: null,
			setVideoPage: null,
			sortVideosBy: null,
			setSortVideosBy: null,
			orderVideos: null,
			setOrderVideos: null,
			selectedImages: null,
			imageView: null,
			setImageView: null,
			imagesPerPage: null,
			setImagesPerPage: null,
			imagePage: null,
			setImagePage: null,
			sortImagesBy: null,
			setSortImagesBy: null,
			orderImages: null,
			setOrderImages: null,
		};
	}
	return context;
};

export default MediaStateProvider;
