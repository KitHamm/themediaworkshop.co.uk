// Library Components
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    CircularProgress,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectItem,
} from "@nextui-org/react";

// React Components
import { useEffect, useState } from "react";

// Next Components
import Image from "next/image";

// Components
import EditCaseStudy from "../CaseStudy/EditCaseStudy";
import NewCaseStudy from "../CaseStudy/NewCaseStudy";

// Types
import { CaseStudy, Images, Segment } from "@prisma/client";
import { toLink } from "@prisma/client";

// Functions
import uploadHandler from "../uploadHandler";
import Markdown from "react-markdown";

export default function EditSegment(props: {
    segment: Segment;
    index: number;
    title: string;
    revalidateDashboard: any;
}) {
    // Pre populate state for title and c opy if present
    const [title, setTitle] = useState(
        props.segment.title ? props.segment.title : ""
    );

    const [copy, setCopy] = useState(
        props.segment.copy ? props.segment.copy : ""
    );

    // State for naming convention errors on upload
    const [topImageNamingError, setTopImageNamingError] = useState(false);
    const [segmentImageNamingError, setSegmentImageNamingError] =
        useState(false);

    // Uploading State
    const [uploading, setUploading] = useState(false);
    const [notImageError, setNotImageError] = useState(false);

    // State for already selected images of segment and available images from media pool
    const [images, setImages] = useState(props.segment.image);
    const [availableImages, setAvailableImages] = useState<Images[]>([]);
    const [linkTo, setLinkTo] = useState(props.segment.linkTo);
    const [headerImage, setHeaderImage] = useState(
        props.segment.headerimage ? props.segment.headerimage : ""
    );
    const [buttonText, setButtonText] = useState(
        props.segment.buttonText ? props.segment.buttonText : ""
    );

    // Segment order state
    const [order, setOrder] = useState<number>(
        props.segment.order ? props.segment.order : 0
    );
    // State for description preview
    const [previewText, setPreviewText] = useState(false);

    // State for if there are unsaved changes on the segment
    const [changes, setChanges] = useState(false);

    // State for selected case study to edit
    const [selectedCaseStudy, setSelectedCaseStudy] = useState(0);

    // Delete States
    const [deleteError, setDeleteError] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    // Top image modal declaration
    const {
        isOpen: isOpenTopImage,
        onOpen: onOpenTopImage,
        onOpenChange: onOpenChangeTopImage,
    } = useDisclosure();

    // Segment images modal declaration
    const {
        isOpen: isOpenAddImage,
        onOpen: onOpenAddImage,
        onOpenChange: onOpenChangeAddImage,
    } = useDisclosure();

    // Edit case study modal declaration
    const {
        isOpen: isOpenEditCaseStudy,
        onOpen: onOpenEditCaseStudy,
        onOpenChange: onOpenChangeEditCaseStudy,
    } = useDisclosure();

    // New case study modal declaration
    const {
        isOpen: isOpenNewCaseStudy,
        onOpen: onOpenNewCaseStudy,
        onOpenChange: onOpenChangeNewCaseStudy,
    } = useDisclosure();

    // Delete warning modal declaration
    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onOpenChange: onOpenChangeDelete,
    } = useDisclosure();

    // Constant check for unsaved changes
    useEffect(() => {
        if (
            title !== props.segment.title ||
            copy !== props.segment.copy ||
            JSON.stringify(images) !== JSON.stringify(props.segment.image) ||
            headerImage !== props.segment.headerimage ||
            order !== parseInt(props.segment.order) ||
            buttonText !== props.segment.buttonText ||
            linkTo !== props.segment.linkTo
        ) {
            setChanges(true);
        } else {
            setChanges(false);
        }
    }, [
        linkTo,
        buttonText,
        order,
        title,
        copy,
        images,
        headerImage,
        props.segment.linkTo,
        props.segment.buttonText,
        props.segment.order,
        props.segment.title,
        props.segment.copy,
        props.segment.image,
        props.segment.headerimage,
    ]);

    // Check naming conventions for uploads
    function namingConventionCheck(fileName: string, check: string) {
        if (fileName.split("_")[0] !== check) {
            return false;
        } else {
            return true;
        }
    }

    // Pre populate information for segment update
    function handleUpdate() {
        const json = {
            buttonText: buttonText,
            title: title,
            copy: copy,
            headerimage: headerImage,
            image: images,
            order: order,
            linkTo: linkTo as toLink,
        };
        updateSegment(json);
    }
    // Update segment with pre populated data
    async function updateSegment(json: any) {
        await fetch("/api/updatesegment", {
            method: "POST",
            body: JSON.stringify({
                id: props.segment.id as number,
                data: json,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    if (props.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.title);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    function removeImage(index: number) {
        setImages(
            images.filter((_image: string, _index: number) => _index !== index)
        );
    }

    async function uploadImage(file: File, target: string) {
        if (file.type.split("/")[0] !== "image") {
            console.log("Not Image");
            setNotImageError(true);
            setUploading(false);
            return;
        } else {
            await uploadHandler(file, "image")
                .then((res: any) => {
                    if (res.message) {
                        setUploading(false);
                        if (target === "header") {
                            setHeaderImage(res.message);
                            clearFileInput(target);
                        } else {
                            getImages();
                            clearFileInput(target);
                        }
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    function clearFileInput(target: string) {
        var id = target === "header" ? "-top-image-input" : "-image-input";
        const inputElm = document.getElementById(
            props.segment.id + id
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }
    async function getImages() {
        fetch("/api/images", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setAvailableImages(json))
            .catch((err) => console.log(err));
    }

    async function updatePublished(value: boolean) {
        await fetch("/api/publishsegment", {
            method: "POST",
            body: JSON.stringify({ id: props.segment.id, value: value }),
        })
            .then((res) => {
                if (res.ok) {
                    props.revalidateDashboard("/");
                }
            })
            .catch((err) => console.log(err));
    }

    async function deleteSegment() {
        await fetch("/api/deletesegment", {
            method: "POST",
            body: JSON.stringify({ id: props.segment.id }),
        })
            .then(async (res) => {
                if (res.ok) {
                    setDeleteError(false);
                    setDeleteSuccess(true);
                    if (props.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.title);
                    }
                } else {
                    setDeleteError(true);
                    setDeleteSuccess(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="light rounded-md xl:px-5 mb-4 py-4">
                <div className="flex justify-between">
                    {changes ? (
                        <div className="fade-in font-bold text-red-400">
                            Unsaved Changes
                        </div>
                    ) : (
                        <div></div>
                    )}
                    {props.segment.published ? (
                        <button
                            onClick={() => {
                                updatePublished(false);
                            }}
                            className="xl:px-4 xl:py-2 px-2 py-1 rounded bg-red-400">
                            UNPUBLISH
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                updatePublished(true);
                            }}
                            className="xl:px-4 xl:py-2 px-2 py-1 rounded bg-orange-600">
                            PUBLISH
                        </button>
                    )}
                </div>

                <div className="flex justify-between border-b pb-2">
                    <div className="text-orange-600 font-bold text-xl">
                        Top Image
                    </div>
                </div>
                <div className="relative my-2">
                    {headerImage !== null &&
                    headerImage !== undefined &&
                    headerImage !== "" ? (
                        <div>
                            <Image
                                height={2000}
                                width={1000}
                                src={
                                    process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                    headerImage
                                }
                                alt={headerImage}
                                className="w-full h-auto m-auto"
                            />
                            <div className="hover:opacity-100 flex justify-center transition-opacity opacity-0 absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
                                <div className="m-auto flex w-1/2 justify-evenly">
                                    <div className="w-1/2 text-center">
                                        <i
                                            onClick={() => {
                                                onOpenChangeTopImage();
                                                getImages();
                                            }}
                                            aria-hidden
                                            className="fa-solid cursor-pointer fa-pen-to-square fa-2xl"
                                        />
                                    </div>
                                    <div className="w-1/2 text-center">
                                        <i
                                            onClick={() => setHeaderImage(null)}
                                            aria-hidden
                                            className="fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg bg-neutral-800 w-full flex justify-evenly py-10">
                            {uploading ? (
                                <CircularProgress
                                    color="warning"
                                    aria-label="Loading..."
                                />
                            ) : (
                                <div className="grid xl:grid-cols-2 xl:gap-40 gap-4">
                                    <div>
                                        {topImageNamingError && (
                                            <div className="text-center text-red-400">
                                                File name prefix should be
                                                SEGHEAD_
                                            </div>
                                        )}
                                        <div className="file-input shadow-xl">
                                            <input
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        if (
                                                            namingConventionCheck(
                                                                e.target
                                                                    .files[0]
                                                                    .name,
                                                                "SEGHEAD"
                                                            )
                                                        ) {
                                                            setUploading(true);
                                                            uploadImage(
                                                                e.target
                                                                    .files[0],
                                                                "header"
                                                            );
                                                            setTopImageNamingError(
                                                                false
                                                            );
                                                        } else {
                                                            setTopImageNamingError(
                                                                true
                                                            );
                                                            clearFileInput(
                                                                "header"
                                                            );
                                                        }
                                                    }
                                                }}
                                                id={
                                                    props.segment.id +
                                                    "-top-image-input"
                                                }
                                                type="file"
                                                className="inputFile"
                                            />
                                            <label
                                                className="mx-auto"
                                                htmlFor={
                                                    props.segment.id +
                                                    "-top-image-input"
                                                }>
                                                Upload New
                                            </label>
                                        </div>
                                        <div className="w-full text-center text-red-400">
                                            {notImageError
                                                ? "Please upload media in Image format"
                                                : ""}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => {
                                                onOpenChangeTopImage();
                                                getImages();
                                            }}
                                            className="bg-orange-600 py-3 px-20 rounded shadow-xl">
                                            Select
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="xl:grid xl:grid-cols-2 xl:gap-10 mt-8">
                    <div id={"left-segment-" + props.index + "-column"}>
                        <div>
                            <div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
                                Title
                            </div>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                className="text-black"
                            />
                        </div>
                        <div className="mt-2">
                            <Select
                                onChange={(e) => setLinkTo(e.target.value)}
                                defaultSelectedKeys={[linkTo]}
                                className="dark"
                                variant="bordered"
                                label={"Link To"}>
                                <SelectItem
                                    className="text-black"
                                    key={"NONE"}
                                    value={"NONE"}>
                                    None
                                </SelectItem>
                                <SelectItem
                                    className="text-black"
                                    key={"FILM"}
                                    value={"FILM"}>
                                    Film
                                </SelectItem>
                                <SelectItem
                                    className="text-black"
                                    key={"DIGITAL"}
                                    value={"DIGITAL"}>
                                    Digital
                                </SelectItem>
                                <SelectItem
                                    className="text-black"
                                    key={"LIGHT"}
                                    value={"LIGHT"}>
                                    Light
                                </SelectItem>
                                <SelectItem
                                    className="text-black"
                                    key={"EVENTS"}
                                    value={"EVENTS"}>
                                    Events
                                </SelectItem>
                                <SelectItem
                                    className="text-black"
                                    key={"ART"}
                                    value={"ART"}>
                                    Art
                                </SelectItem>
                            </Select>
                        </div>
                        <div>
                            <div className="flex gap-4 w-full border-b pb-2 mb-2 mt-6">
                                <div className="text-orange-600 font-bold text-xl">
                                    Description
                                </div>
                                <Popover className="dark" placement="right-end">
                                    <PopoverTrigger>
                                        <i
                                            aria-hidden
                                            className="fa-solid fa-circle-info fa-xl cursor-pointer my-auto"
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="text-left p-2 xl:w-96">
                                            <div className="font-bold text-xl border-b pb-2 mb-2">
                                                Text Info
                                            </div>
                                            <p className="mb-2">
                                                The text is rendered using
                                                Markdown. This means that you
                                                can add headers, links, and line
                                                breaks
                                            </p>
                                            <p className="mb-2">
                                                **Header** (bold text)
                                            </p>
                                            <p className="mb-2">
                                                [Link Text
                                                Here](https://link-here.com/)
                                            </p>
                                            <p>New line\</p>
                                            <p>\</p>
                                            <p>New Paragraph</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <button
                                    onClick={() => setPreviewText(!previewText)}
                                    className="text-orange-600 cursor-pointer">
                                    {previewText ? "Edit" : "Preview"}
                                </button>
                            </div>
                            {previewText ? (
                                <div className="min-h-52">
                                    <Markdown>{copy}</Markdown>
                                </div>
                            ) : (
                                <textarea
                                    value={copy}
                                    onChange={(e) => setCopy(e.target.value)}
                                    className="text-black h-52"
                                    name=""
                                    id=""
                                />
                            )}
                        </div>
                        <div className="flex gap-10">
                            <div className="xl:w-1/6 w-1/2">
                                <div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
                                    Order
                                </div>
                                <input
                                    className="text-black"
                                    value={!Number.isNaN(order) ? order : ""}
                                    onChange={(e) =>
                                        setOrder(parseInt(e.target.value))
                                    }
                                    type="number"
                                />
                            </div>
                            <div className="w-full">
                                <div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
                                    Custom Button Text
                                </div>
                                <input
                                    className="text-black"
                                    value={buttonText}
                                    onChange={(e) =>
                                        setButtonText(e.target.value)
                                    }
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"right-segment-" + props.index + "-column"}>
                        <div className="">
                            <div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
                                Images
                            </div>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-4 p-2">
                                {images.map((image: string, index: number) => {
                                    return (
                                        <div
                                            key={image + "-" + index}
                                            className="relative">
                                            <Image
                                                height={100}
                                                width={100}
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                    image
                                                }
                                                alt={image}
                                                className="w-full h-auto"
                                            />
                                            <div className="hover:opacity-100 opacity-0 transition-opacity absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
                                                <div className="text-red-400 h-full flex justify-center">
                                                    <i
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                        aria-hidden
                                                        className="m-auto fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div
                                    onClick={() => {
                                        onOpenChangeAddImage();
                                        getImages();
                                    }}
                                    className="min-h-16 cursor-pointer w-full h-full bg-black hover:bg-opacity-25 transition-all bg-opacity-75 top-0 left-0">
                                    <div className="flex h-full justify-center">
                                        <i
                                            aria-hidden
                                            className="m-auto fa-solid fa-plus fa-2xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 border-b mt-6 bg">
                            <div className="py-4 text-orange-600 font-bold text-xl">
                                Case Studies
                            </div>
                            <button
                                onClick={onOpenChangeNewCaseStudy}
                                className="px-2 py-1 my-auto rounded bg-orange-600">
                                Add Case Study
                            </button>
                        </div>
                        <div className="text-green-600 font-bold text-lg my-4">
                            PUBLISHED
                        </div>
                        <div className="flex flex-wrap xl:gap-4 py-2 xl:py-3 gap-2 bg-neutral-800 xl:mt-2 rounded-lg px-2 min-h-10">
                            {props.segment.casestudy.map(
                                (caseStudy: CaseStudy, index: number) => {
                                    if (caseStudy.published) {
                                        return (
                                            <button
                                                onClick={() => {
                                                    setSelectedCaseStudy(index);
                                                    onOpenChangeEditCaseStudy();
                                                }}
                                                key={
                                                    caseStudy.title +
                                                    "-" +
                                                    index
                                                }
                                                className="transition-all hover:bg-orange-600 px-4 py-2 bg-neutral-600 rounded">
                                                {caseStudy.title}
                                            </button>
                                        );
                                    }
                                }
                            )}
                        </div>
                        <div className="text-red-400 font-bold text-lg my-4">
                            DRAFTS
                        </div>
                        <div className="flex flex-wrap xl:gap-4 py-2 xl:py-3 gap-2 bg-neutral-800 xl:mt-2 rounded-lg px-2 min-h-10">
                            {props.segment.casestudy.map(
                                (caseStudy: CaseStudy, index: number) => {
                                    if (!caseStudy.published) {
                                        return (
                                            <button
                                                onClick={() => {
                                                    setSelectedCaseStudy(index);
                                                    onOpenChangeEditCaseStudy();
                                                }}
                                                key={
                                                    caseStudy.title +
                                                    "-" +
                                                    index
                                                }
                                                className="transition-all hover:bg-orange-600 px-4 py-2 bg-neutral-600 rounded">
                                                {caseStudy.title}
                                            </button>
                                        );
                                    }
                                }
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onOpenChangeDelete}
                        className="px-4 py-2 hover:bg-red-800 hover:text-white text-red-600 rounded transition-all">
                        Delete
                    </button>
                    {
                        <button
                            disabled={!changes}
                            onClick={() => handleUpdate()}
                            className="disabled:bg-neutral-400 disabled:cursor-not-allowed px-4 py-2 bg-orange-600 rounded ms-4">
                            Update
                        </button>
                    }
                </div>
                {/* Top Image modal */}
                <Modal
                    size="5xl"
                    backdrop="blur"
                    isOpen={isOpenTopImage}
                    className="dark"
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeTopImage}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    {"Top Image for " + props.segment.title}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="grid xl:grid-cols-4 gap-5">
                                        {availableImages.map(
                                            (image: Images, index: number) => {
                                                if (
                                                    image.name.split("_")[0] ===
                                                    "SEGHEAD"
                                                ) {
                                                    return (
                                                        <div
                                                            key={
                                                                image.name +
                                                                "-" +
                                                                index
                                                            }
                                                            className="flex cursor-pointer"
                                                            onClick={() =>
                                                                setHeaderImage(
                                                                    image.name
                                                                )
                                                            }>
                                                            <Image
                                                                height={300}
                                                                width={300}
                                                                src={
                                                                    process.env
                                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                    image.name
                                                                }
                                                                alt={image.name}
                                                                className="w-full h-auto m-auto"
                                                            />
                                                        </div>
                                                    );
                                                }
                                            }
                                        )}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
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
                {/* Segment images select modal */}
                <Modal
                    size="2xl"
                    backdrop="blur"
                    isOpen={isOpenAddImage}
                    className="dark"
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeAddImage}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center font-bold">
                                        Select or Upload Image
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    {segmentImageNamingError && (
                                        <div className="text-center text-red-400">
                                            File name prefix should be SEGMENT_
                                        </div>
                                    )}
                                    <div className="w-full flex justify-center mb-10">
                                        {uploading ? (
                                            <CircularProgress
                                                color="warning"
                                                aria-label="Loading..."
                                            />
                                        ) : (
                                            <>
                                                <div className="file-input shadow-xl">
                                                    <input
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.files
                                                            ) {
                                                                if (
                                                                    namingConventionCheck(
                                                                        e.target
                                                                            .files[0]
                                                                            .name,
                                                                        "SEGMENT"
                                                                    )
                                                                ) {
                                                                    setSegmentImageNamingError(
                                                                        false
                                                                    );
                                                                    setUploading(
                                                                        true
                                                                    );
                                                                    uploadImage(
                                                                        e.target
                                                                            .files[0],
                                                                        "image"
                                                                    );
                                                                } else {
                                                                    setSegmentImageNamingError(
                                                                        true
                                                                    );
                                                                    clearFileInput(
                                                                        "SEGMENT"
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                        id={
                                                            props.segment.id +
                                                            "-image-input"
                                                        }
                                                        type="file"
                                                        className="inputFile"
                                                    />
                                                    <label
                                                        htmlFor={
                                                            props.segment.id +
                                                            "-image-input"
                                                        }>
                                                        Upload New
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="grid xl:grid-cols-4 grid-cols-2 gap-5">
                                        {availableImages.map(
                                            (image: Images, index: number) => {
                                                if (
                                                    image.name.split("_")[0] ===
                                                    "SEGMENT"
                                                )
                                                    return (
                                                        <div
                                                            key={
                                                                image.name +
                                                                "-" +
                                                                index
                                                            }
                                                            className="flex cursor-pointer"
                                                            onClick={() => {
                                                                setImages([
                                                                    ...images,
                                                                    image.name,
                                                                ]);
                                                                onClose();
                                                            }}>
                                                            <Image
                                                                height={300}
                                                                width={300}
                                                                src={
                                                                    process.env
                                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                    image.name
                                                                }
                                                                alt={image.name}
                                                                className="w-full h-auto m-auto"
                                                            />
                                                        </div>
                                                    );
                                            }
                                        )}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
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
                {/* Edit Case Study modal */}
                <Modal
                    size="5xl"
                    backdrop="blur"
                    isOpen={isOpenEditCaseStudy}
                    className="dark"
                    isDismissable={false}
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeEditCaseStudy}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader></ModalHeader>
                                <ModalBody>
                                    <EditCaseStudy
                                        onOpenChangeEditCaseStudy={
                                            onOpenChangeEditCaseStudy
                                        }
                                        revalidateDashboard={
                                            props.revalidateDashboard
                                        }
                                        caseStudy={
                                            props.segment.casestudy[
                                                selectedCaseStudy
                                            ]
                                        }
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            onClose();
                                            setSelectedCaseStudy(0);
                                        }}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                {/* New Case Study modal */}
                <Modal
                    size="5xl"
                    backdrop="blur"
                    isOpen={isOpenNewCaseStudy}
                    className="dark"
                    isDismissable={false}
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeNewCaseStudy}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center text-3xl font-bold text-orange-600">
                                        New Case Study
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    <NewCaseStudy
                                        segmentId={props.segment.id as number}
                                        revalidateDashboard={
                                            props.revalidateDashboard
                                        }
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            onClose();
                                            setSelectedCaseStudy(0);
                                        }}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                {/* Delete warning modal */}
                <Modal
                    size="2xl"
                    backdrop="blur"
                    isOpen={isOpenDelete}
                    className="dark"
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeDelete}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center font-bold text-red-400">
                                        Are you sure?
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    {deleteError ? (
                                        <div>
                                            <div className="font-bold text-2xl text-center text-red-400">
                                                Unable to delete.
                                            </div>
                                            <div className="font-bold text-base text-center">
                                                Segment may have Case Studies.
                                                Please delete them first.
                                            </div>
                                        </div>
                                    ) : deleteSuccess ? (
                                        <div className="font-bold text-green-400 text-2xl text-center">
                                            Successfully Deleted
                                        </div>
                                    ) : (
                                        <div className="font-bold text-2xl text-center">
                                            {"Delete " +
                                                props.segment.title +
                                                "?"}
                                        </div>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    {!deleteError && !deleteSuccess && (
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={() => {
                                                deleteSegment();
                                            }}>
                                            Delete
                                        </Button>
                                    )}
                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            onClose();
                                            setDeleteError(false);
                                            setDeleteSuccess(false);
                                        }}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}
