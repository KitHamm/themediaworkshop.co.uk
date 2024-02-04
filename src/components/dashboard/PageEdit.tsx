"use client";

import { Page, Segment } from "@prisma/client";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import EditSegment from "./Segment";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    CircularProgress,
} from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import NewSegment from "./NewSegment";

export default function PageEdit(props: {
    data: Page;
    hidden: boolean;
    revalidateDashboard: any;
    bgVideos: string[];
}) {
    const [description, setDescription] = useState(
        props.data.description ? props.data.description : ""
    );
    const [header, setHeader] = useState(
        props.data.header ? props.data.header : ""
    );
    const [video, setVideo] = useState(
        props.data.video ? props.data.video : "None"
    );
    const [showreel, setShowreel] = useState(
        props.data.showreel ? props.data.showreel : "None"
    );
    const [changes, setChanges] = useState(false);
    const {
        isOpen: isOpenAddSegment,
        onOpen: onOpenAddSegment,
        onOpenChange: onOpenChangeAddSegment,
    } = useDisclosure();

    useEffect(() => {
        if (
            description !== props.data.description ||
            header !== props.data.header ||
            video !== props.data.video ||
            showreel !== props.data.showreel
        ) {
            setChanges(true);
        } else {
            setChanges(false);
        }
    }, [
        description,
        header,
        video,
        showreel,
        props.data.description,
        props.data.header,
        props.data.video,
        props.data.showreel,
    ]);

    function handleUpdate() {
        const json = {
            description: description,
            header: header,
            video: video,
            showreel: showreel,
        };
        updatePage(json);
    }

    async function updatePage(json: any) {
        const response = await fetch("/api/updatepage", {
            method: "POST",
            body: JSON.stringify({
                id: props.data.id as number,
                data: json,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    if (props.data.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.data.title);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20 fade-in mb-10`}>
            <div className="my-10 border-b py-4 flex justify-between">
                <div className="text-3xl font-bold capitalize">
                    {props.data.title}
                </div>
                {changes ? (
                    <div className="fade-in my-auto font-bold text-red-400">
                        There are unsaved Changes
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div className="">
                <div id="top" className="xl:grid xl:grid-cols-2 xl:gap-10">
                    <div id="left-column">
                        <div className="border-b pb-2">Page Videos</div>
                        <div className="xl:grid xl:grid-cols-2 xl:gap-10">
                            <div>
                                {props.bgVideos.length > 1 ? (
                                    <Select
                                        disabledKeys={["None"]}
                                        label="Background Video"
                                        placeholder="Select a video"
                                        className="max-w-xs text-black my-4"
                                        defaultSelectedKeys={[video]}
                                        onChange={(e) =>
                                            setVideo(e.target.value)
                                        }>
                                        {props.bgVideos.map(
                                            (videoName: string) => {
                                                return (
                                                    <SelectItem
                                                        className="text-black"
                                                        key={videoName}>
                                                        {videoName}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                    </Select>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div>
                                {props.bgVideos.length > 1 ? (
                                    <Select
                                        label="Showreel"
                                        placeholder="Select a video"
                                        className="max-w-xs text-black my-4"
                                        defaultSelectedKeys={[showreel]}
                                        onChange={(e) =>
                                            setShowreel(e.target.value)
                                        }>
                                        {props.bgVideos.map(
                                            (videoName: string) => {
                                                return (
                                                    <SelectItem
                                                        className="text-black"
                                                        key={videoName}>
                                                        {videoName}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                    </Select>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div className="my-10">
                            <div className="border-b pb-2 mb-2">Header</div>
                            <input
                                placeholder="Title"
                                value={header}
                                onChange={(e) => setHeader(e.target.value)}
                                id={"header-" + props.data.title}
                                name={"header-" + props.data.title}
                                type="text"
                                className="text-black"
                            />
                        </div>
                    </div>
                    <div id="right-colum">
                        <div>
                            <div className="border-b pb-2 mb-2">
                                Description
                            </div>
                            <textarea
                                value={description ? description : ""}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                name={"description-" + props.data.title}
                                id={"description-" + props.data.title}
                                className="text-black h-52"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdate();
                                    }}
                                    disabled={!changes}
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-400 bg-orange-400 disabled:text-black rounded-md px-4 py-2">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="segments">
                    <div className="flex justify-between border-b pb-2 mt-10 mb-2">
                        <div className="font-bold text-2xl">Segments</div>
                        <button
                            onClick={onOpenAddSegment}
                            className="px-4 py-2 bg-orange-400 rounded">
                            Add Segment
                        </button>
                    </div>
                    <Accordion variant="splitted">
                        {props.data.segment.map(
                            (segment: Segment, index: number) => {
                                return (
                                    <AccordionItem
                                        className="dark"
                                        key={index}
                                        aria-label={segment.title}
                                        title={segment.title}>
                                        <div key={segment.title + "-" + index}>
                                            <EditSegment
                                                revalidateDashboard={
                                                    props.revalidateDashboard
                                                }
                                                title={props.data.title}
                                                segment={segment}
                                                index={index}
                                            />
                                        </div>
                                    </AccordionItem>
                                );
                            }
                        )}
                    </Accordion>
                </div>
            </div>
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenAddSegment}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangeAddSegment}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Add Segment
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <NewSegment
                                    revalidateDashboard={
                                        props.revalidateDashboard
                                    }
                                    title={props.data.title}
                                    pageID={props.data.id}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
