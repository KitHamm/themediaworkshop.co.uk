"use client";
// context
import { usePageHeaderState } from "../pageView/mainView/HeaderStateProvider";
// packages
import { useEffect, useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { UseFormSetValue } from "react-hook-form";
// components
import SelectVideoModal from "./SelectVideoModal";
// types
import { CaseStudyFromType, PageFormType } from "@/lib/types";
import VideoPreview from "../pageView/mainView/VideoPreviewModal";

const VideoSelect = ({
	target,
	currentVideo,
	setValueCaseStudy,
}: Readonly<{
	target?: keyof PageFormType;
	currentVideo?: string;
	setValueCaseStudy?: UseFormSetValue<CaseStudyFromType>;
}>) => {
	const { watch } = usePageHeaderState();
	const [videoFromTarget, setVideoFromTarget] = useState<string | undefined>(
		undefined
	);

	let targetValue: string | null = null;

	if (target) {
		targetValue = watch(target);
	}

	useEffect(() => {
		if (currentVideo) {
			setVideoFromTarget(currentVideo);
			return;
		}
		setVideoFromTarget(targetValue ?? undefined);
	}, [target, setVideoFromTarget, targetValue]);

	const titleFromTarget = () => {
		if (!target) {
			console.log("no target");
			return null;
		}
		return target
			.replace(/([A-Z])/g, " $1")
			.replace(/(\d)/g, " $1")
			.trim();
	};
	const { isOpen: isOpenSelect, onOpenChange: onOpenChangeSelect } =
		useDisclosure();

	if (!videoFromTarget) {
		return (
			<div className="flex flex-col" id="select-video">
				<div className="text-center capitalize">
					{titleFromTarget()}
				</div>
				<div className="text-center mt-4 grow flex items-center justify-center">
					None Selected
				</div>
				<div className="text-center mt-2">
					<Button
						type="button"
						onPress={() => {
							onOpenChangeSelect();
						}}
						className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto text-md text-white"
					>
						Select Video
					</Button>
				</div>
				<SelectVideoModal
					currentVideo={videoFromTarget}
					setValueCaseStudy={setValueCaseStudy}
					formTarget={target}
					isOpen={isOpenSelect}
					onOpenChange={onOpenChangeSelect}
				/>
			</div>
		);
	}

	return (
		<div id="video">
			<div className="text-center capitalize">{titleFromTarget()}</div>
			<VideoPreview videoUrl={videoFromTarget} />
			<div className="text-center truncate">
				{videoFromTarget.split("-")[0].split(".")[0] +
					"." +
					videoFromTarget.split(".")[1]}
			</div>
			<div className="text-center mt-2">
				<Button
					type="button"
					onPress={() => {
						onOpenChangeSelect();
					}}
					className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto text-md text-white"
				>
					Change Video
				</Button>
			</div>
			<SelectVideoModal
				currentVideo={videoFromTarget}
				setValueCaseStudy={setValueCaseStudy}
				formTarget={target}
				isOpen={isOpenSelect}
				onOpenChange={onOpenChangeSelect}
			/>
		</div>
	);
};

export default VideoSelect;
