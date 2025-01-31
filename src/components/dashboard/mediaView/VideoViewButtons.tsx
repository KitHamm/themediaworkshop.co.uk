"use client";
import { Button } from "@heroui/react";
// context
import { useMediaState } from "./MediaStateProvider";

const selectionOptions: { label: string; value: "HEADER" | "VIDEO" }[] = [
	{ label: "Background", value: "HEADER" },
	{ label: "Videos", value: "VIDEO" },
];

const VideoViewButtons = ({}: Readonly<{}>) => {
	const { videoView, setVideoView } = useMediaState();
	return (
		<>
			{selectionOptions.map((option) => (
				<Button
					key={option.value}
					onPress={() => setVideoView(option.value)}
					className={`${
						videoView === option.value
							? "bg-orange-600"
							: "bg-neutral-600"
					} rounded-md text-white text-md transition-all`}
				>
					{option.label}
				</Button>
			))}
		</>
	);
};

export default VideoViewButtons;
