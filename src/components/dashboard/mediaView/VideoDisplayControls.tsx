"use client";

import { Button, Pagination, Select, SelectItem } from "@heroui/react";
import { useContext } from "react";
import { MediaStateContext } from "./MediaStateProvider";
export default function VideoDisplayControls() {
	const {
		selectedVideos,
		videosPerPage,
		setVideosPerPage,
		videoPage,
		setVideoPage,
		sortVideosBy,
		setSortVideosBy,
		orderVideos,
		setOrderVideos,
		videoView,
		setVideoView,
	} = useContext(MediaStateContext);

	return (
		<>
			<div className="grid xl:grid-cols-5 grid-cols-2 gap-4 mb-4 text-center">
				<Button
					onPress={() => setVideoView("HEADER")}
					className={`${
						videoView === "HEADER"
							? "bg-orange-600"
							: "bg-neutral-600"
					} rounded-md text-white text-md transition-all`}
				>
					Background
				</Button>
				<Button
					onPress={() => setVideoView("VIDEO")}
					className={`${
						videoView === "VIDEO"
							? "bg-orange-600"
							: "bg-neutral-600"
					} rounded-md text-white text-md transition-all`}
				>
					Videos
				</Button>
			</div>
			<div className="flex justify-evenly gap-12 mt-10 xl:mt-4">
				<Select
					className="dark ms-auto me-auto xl:me-0"
					classNames={{
						popoverContent: "bg-neutral-600",
					}}
					variant="bordered"
					selectedKeys={[videosPerPage.toString()]}
					labelPlacement="outside"
					label={"Videos Per Page"}
					onChange={(e) => setVideosPerPage(parseInt(e.target.value))}
				>
					<SelectItem className="dark" key={8} value={8}>
						8
					</SelectItem>
					<SelectItem className="dark" key={12} value={12}>
						12
					</SelectItem>
					<SelectItem className="dark" key={16} value={16}>
						16
					</SelectItem>
					<SelectItem className="dark" key={20} value={20}>
						20
					</SelectItem>
					<SelectItem className="dark" key={1000000} value={1000000}>
						All
					</SelectItem>
				</Select>
				<Select
					className="dark ms-auto me-auto xl:me-0"
					classNames={{
						popoverContent: "bg-neutral-600",
					}}
					variant="bordered"
					selectedKeys={[sortVideosBy]}
					labelPlacement="outside"
					label={"Sort by"}
					onChange={(e) => setSortVideosBy(e.target.value)}
				>
					<SelectItem className="dark" key={"date"} value={"date"}>
						Date
					</SelectItem>
					<SelectItem className="dark" key={"name"} value={"name"}>
						Name
					</SelectItem>
				</Select>
				<Select
					className="dark ms-auto me-auto xl:me-0"
					classNames={{
						popoverContent: "bg-neutral-600",
					}}
					variant="bordered"
					selectedKeys={[orderVideos]}
					labelPlacement="outside"
					label={"Order"}
					onChange={(e) => setOrderVideos(e.target.value)}
				>
					<SelectItem className="dark" key={"asc"} value={"asc"}>
						Ascending
					</SelectItem>
					<SelectItem className="dark" key={"desc"} value={"desc"}>
						Descending
					</SelectItem>
				</Select>
			</div>
			<div className="flex justify-center my-4">
				<div className="flex justify-center">
					<Pagination
						className="dark mt-auto"
						classNames={{
							cursor: "bg-orange-600",
						}}
						showControls
						total={Math.ceil(selectedVideos.length / videosPerPage)}
						page={videoPage}
						onChange={setVideoPage}
					/>
				</div>
			</div>
		</>
	);
}
