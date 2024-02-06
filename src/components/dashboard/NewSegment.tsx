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
} from "@nextui-org/react";

// React Components
import { useState } from "react";

// Next Components
import Image from "next/image";

// Types
import { Images } from "@prisma/client";

// Functions
import uploadHandler from "./uploadHandler";

export default function NewSegment(props: {
    revalidateDashboard: any;
    title: string;
    pageID: number;
}) {
    // States for title, copy and order of segment
    const [title, setTitle] = useState("");
    const [copy, setCopy] = useState("");
    const [order, setOrder] = useState(0);

    // State for images selected and header image for segment
    const [images, setImages] = useState<string[]>([]);
    const [headerImage, setHeaderImage] = useState("");

    // State for images from image media pool
    const [availableImages, setAvailableImages] = useState<Images[]>([]);

    // Uploading, not image error and success states
    const [uploading, setUploading] = useState(false);
    const [notImageError, setNotImageError] = useState(false);
    const [success, setSuccess] = useState(false);
    // Top image select modal
    const {
        isOpen: isOpenTopImage,
        onOpen: onOpenTopImage,
        onOpenChange: onOpenChangeTopImage,
    } = useDisclosure();
    // Segment images select modal
    const {
        isOpen: isOpenAddImage,
        onOpen: onOpenAddImage,
        onOpenChange: onOpenChangeAddImage,
    } = useDisclosure();

    async function getImages() {
        fetch("/api/images", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setAvailableImages(json))
            .catch((err) => console.log(err));
    }

    function removeImage(index: number) {
        setImages(
            images.filter((_image: string, _index: number) => _index !== index)
        );
    }
    function clearFileInput(target: string) {
        var id = target === "header" ? "top-image-input" : "image-input";
        const inputElm = document.getElementById(id) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }

    async function uploadImage(file: File, target: string) {
        if (file.type.split("/")[0] !== "image") {
            console.log("Not Image");
            setNotImageError(true);
            setUploading(false);
            return;
        } else {
            await uploadHandler(file, "image")
                .then((res) => {
                    console.log(res);
                    if (res === 1) {
                        setUploading(false);
                        if (target === "header") {
                            setHeaderImage(file.name);
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

    async function addSegment() {
        await fetch("/api/addsegment", {
            method: "POST",
            body: JSON.stringify({
                title: title,
                copy: copy,
                headerimage: headerImage,
                image: images,
                order: order,
                page: {
                    connect: {
                        id: props.pageID,
                    },
                },
            }),
        })
            .then((response) => {
                if (response.ok) {
                    setSuccess(true);
                    setTitle("");
                    setCopy("");
                    setHeaderImage("");
                    setImages([]);
                    if (props.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.title);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <>
            {success ? (
                <div className="w-full text-center">
                    <div className="font-bold text-3xl">Success!</div>
                </div>
            ) : (
                <div className="light rounded-md px-5 mb-4 py-4">
                    <div className="flex justify-between border-b pb-2">
                        <div className="">Top Image</div>
                    </div>
                    <div className="relative my-2">
                        {headerImage !== "" ? (
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
                                                onClick={() =>
                                                    setHeaderImage("")
                                                }
                                                aria-hidden
                                                className="fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex justify-evenly my-10">
                                {uploading ? (
                                    <CircularProgress
                                        color="warning"
                                        aria-label="Loading..."
                                    />
                                ) : (
                                    <>
                                        <div>
                                            <div className="file-input shadow-xl">
                                                <input
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            setUploading(true);
                                                            uploadImage(
                                                                e.target
                                                                    .files[0],
                                                                "header"
                                                            );
                                                        }
                                                    }}
                                                    id={"top-image-input"}
                                                    type="file"
                                                    className="inputFile"
                                                />
                                                <label
                                                    className="mx-auto"
                                                    htmlFor={"top-image-input"}>
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
                                                className="bg-orange-400 py-3 px-20 rounded shadow-xl">
                                                Select
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="xl:grid xl:grid-cols-2 xl:gap-10 ">
                        <div id={"left-segment-column"}>
                            <div>
                                <div className="border-b pb-2 mb-2">Title</div>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    type="text"
                                    className="text-black"
                                />
                            </div>
                            <div>
                                <div className="border-b pb-2 mb-2">Copy</div>
                                <textarea
                                    value={copy}
                                    onChange={(e) => setCopy(e.target.value)}
                                    className="text-black h-52"
                                    name=""
                                    id=""
                                />
                            </div>
                            <div>
                                <div className="border-b pb-2 mb-2">Order</div>
                                <div className="w-1/6">
                                    <input
                                        value={
                                            !Number.isNaN(order) ? order : ""
                                        }
                                        onChange={(e) =>
                                            setOrder(parseInt(e.target.value))
                                        }
                                        className="text-black"
                                        type="number"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={"right-segment-column"}>
                            <div className="">
                                <div className="border-b pb-2">Images</div>
                                <div className="grid grid-cols-4 gap-4 p-2">
                                    {images.map(
                                        (image: string, index: number) => {
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
                                                                    removeImage(
                                                                        index
                                                                    )
                                                                }
                                                                aria-hidden
                                                                className="m-auto fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}

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
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={addSegment}
                            className="px-4 py-2 bg-orange-400 rounded">
                            Submit
                        </button>
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
                                    <ModalHeader>{"Top Image"}</ModalHeader>
                                    <ModalBody>
                                        <div className="grid grid-cols-4 gap-5">
                                            {availableImages.map(
                                                (
                                                    image: Images,
                                                    index: number
                                                ) => {
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
                    {/* Segment images modal */}
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
                                        <div className="w-full flex justify-center mb-10">
                                            {uploading ? (
                                                <CircularProgress
                                                    color="warning"
                                                    aria-label="Loading..."
                                                />
                                            ) : (
                                                <div className="file-input shadow-xl">
                                                    <input
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.files
                                                            ) {
                                                                setUploading(
                                                                    true
                                                                );
                                                                uploadImage(
                                                                    e.target
                                                                        .files[0],
                                                                    "image"
                                                                );
                                                            }
                                                        }}
                                                        id={"image-input"}
                                                        type="file"
                                                        className="inputFile"
                                                    />
                                                    <label
                                                        htmlFor={"image-input"}>
                                                        Upload New
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-4 gap-5">
                                            {availableImages.map(
                                                (
                                                    image: Images,
                                                    index: number
                                                ) => {
                                                    if (
                                                        !images.includes(
                                                            image.name
                                                        )
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
                                                                        process
                                                                            .env
                                                                            .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                        image.name
                                                                    }
                                                                    alt={
                                                                        image.name
                                                                    }
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
                </div>
            )}
        </>
    );
}
