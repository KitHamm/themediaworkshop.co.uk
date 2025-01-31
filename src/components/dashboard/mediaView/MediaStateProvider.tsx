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
	videoPage: number;
	selectedImages: Images[];
	imageView: "SEGHEAD" | "SEGMENT" | "STUDY" | "LOGO" | "THUMBNAIL";
	setImageView: React.Dispatch<
		React.SetStateAction<
			"SEGHEAD" | "SEGMENT" | "STUDY" | "LOGO" | "THUMBNAIL"
		>
	>;
	imagesPerPage: number;
	imagePage: number;
	setMediaPerPage: (value: number, isImage: boolean) => void;
	getMediaPerPage: (isImage: boolean) => number;
	setSortMediaBy: (value: string, isImage: boolean) => void;
	getSortMediaBy: (isImage: boolean) => string;
	setMediaOrderBy: (value: string, isImage: boolean) => void;
	getMediaOrderBy: (isImage: boolean) => string;
	getMediaLength: (isImage: boolean) => number;
	getMediaPage: (isImage: boolean) => number;
	setMediaPage: (value: number, isImage: boolean) => void;
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

	const setMediaPerPage = (value: number, isImage: boolean) => {
		if (isImage) {
			setImagesPerPage(value);
		} else {
			setVideosPerPage(value);
		}
	};

	const getMediaPerPage = (isImage: boolean) => {
		if (isImage) {
			return imagesPerPage;
		} else {
			return videosPerPage;
		}
	};

	const setSortMediaBy = (value: string, isImage: boolean) => {
		if (isImage) {
			setSortImagesBy(value);
		} else {
			setSortVideosBy(value);
		}
	};

	const getSortMediaBy = (isImage: boolean) => {
		if (isImage) {
			return sortImagesBy;
		} else {
			return sortVideosBy;
		}
	};

	const setMediaOrderBy = (value: string, isImage: boolean) => {
		if (isImage) {
			setOrderImages(value);
		} else {
			setOrderVideos(value);
		}
	};

	const getMediaOrderBy = (isImage: boolean) => {
		if (isImage) {
			return orderImages;
		} else {
			return orderVideos;
		}
	};

	const getMediaLength = (isImage: boolean) => {
		if (isImage) {
			return selectedImages.length;
		} else {
			return selectedVideos.length;
		}
	};

	const getMediaPage = (isImage: boolean) => {
		if (isImage) {
			return imagePage;
		} else {
			return videoPage;
		}
	};

	const setMediaPage = (value: number, isImage: boolean) => {
		if (isImage) {
			setImagePage(value);
		} else {
			setVideoPage(value);
		}
	};

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
			videoPage,
			selectedImages,
			imageView,
			setImageView,
			imagesPerPage,
			imagePage,
			setMediaPerPage,
			getMediaPerPage,
			setSortMediaBy,
			getSortMediaBy,
			setMediaOrderBy,
			getMediaOrderBy,
			getMediaLength,
			getMediaPage,
			setMediaPage,
		}),
		[
			selectedVideos,
			videoView,
			setVideoView,
			videosPerPage,
			videoPage,
			selectedImages,
			imageView,
			setImageView,
			imagesPerPage,
			imagePage,
			setMediaPerPage,
			getMediaPerPage,
			setSortMediaBy,
			getSortMediaBy,
			setMediaOrderBy,
			getMediaOrderBy,
			getMediaLength,
			getMediaPage,
			setMediaPage,
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
			selectedVideos: [],
			videoView: "HEADER",
			setVideoView: () => {},
			videosPerPage: 8,
			videoPage: 1,
			selectedImages: [],
			imageView: "SEGHEAD",
			setImageView: () => {},
			imagesPerPage: 8,
			imagePage: 1,
			setMediaPerPage: null,
			getMediaPerPage: null,
			setSortMediaBy: null,
			getSortMediaBy: null,
			setMediaOrderBy: null,
			getMediaOrderBy: null,
			getMediaLength: null,
			getMediaPage: null,
			setMediaPage: null,
		};
	}
	return context;
};

export default MediaStateProvider;
