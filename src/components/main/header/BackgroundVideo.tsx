const BackgroundVideo = ({
	backgroundVideo,
}: Readonly<{
	backgroundVideo: string | null | undefined;
}>) => {
	if (!backgroundVideo) {
		return <div className="no-video" />;
	}
	const posterUrl = backgroundVideo.split(".")[0] + ".webp";

	return (
		<video
			playsInline
			disablePictureInPicture
			id="bg-video"
			className={`fade-in h-screen w-auto xl:w-full z-20`}
			poster={
				process.env.NEXT_PUBLIC_CDN + "/videos/posters/" + posterUrl
			}
			autoPlay={true}
			muted
			loop
			src={process.env.NEXT_PUBLIC_CDN + "/videos/" + backgroundVideo}
		/>
	);
};

export default BackgroundVideo;
