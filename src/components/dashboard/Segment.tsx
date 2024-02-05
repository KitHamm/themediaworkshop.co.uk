import { Images, Segment } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";
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

export default function EditSegment(props: {
    segment: Segment;
    index: number;
    title: string;
    revalidateDashboard: any;
}) {
    const [title, setTitle] = useState(
        props.segment.title ? props.segment.title : ""
    );
    const [copy, setCopy] = useState(
        props.segment.copy ? props.segment.copy : ""
    );
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState(props.segment.image);
    const [availableImages, setAvailableImages] = useState<Images[]>([]);
    const [headerImage, setHeaderImage] = useState(
        props.segment.headerimage ? props.segment.headerimage : ""
    );
    const [order, setOrder] = useState<number>(
        props.segment.order ? props.segment.order : 0
    );
    const [changes, setChanges] = useState(false);
    const {
        isOpen: isOpenTopImage,
        onOpen: onOpenTopImage,
        onOpenChange: onOpenChangeTopImage,
    } = useDisclosure();
    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onOpenChange: onOpenChangeDelete,
    } = useDisclosure();
    const {
        isOpen: isOpenAddImage,
        onOpen: onOpenAddImage,
        onOpenChange: onOpenChangeAddImage,
    } = useDisclosure();

    useEffect(() => {
        if (
            title !== props.segment.title ||
            copy !== props.segment.copy ||
            JSON.stringify(images) !== JSON.stringify(props.segment.image) ||
            headerImage !== props.segment.headerimage ||
            order !== parseInt(props.segment.order)
        ) {
            setChanges(true);
        } else {
            setChanges(false);
        }
    }, [
        order,
        title,
        copy,
        JSON.stringify(images),
        headerImage,
        props.segment.order,
        props.segment.title,
        props.segment.copy,
        JSON.stringify(props.segment.image),
        props.segment.headerimage,
    ]);

    function handleUpdate() {
        const json = {
            title: title,
            copy: copy,
            headerimage: headerImage,
            image: images,
            order: order,
        };
        updateSegment(json);
    }

    function removeImage(index: number) {
        setImages(
            images.filter((_image: string, _index: number) => _index !== index)
        );
    }

    async function handleUpload(file: File, target: string) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/uploadimage" as string, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
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
            .catch((error) => console.log(error));
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

    async function updateSegment(json: any) {
        const response = await fetch("/api/updatesegment", {
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

    async function deleteSegment() {
        const response = await fetch("/api/deletesegment", {
            method: "POST",
            body: JSON.stringify({ id: props.segment.id }),
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
            .catch((err) => console.log(err));
    }

    return (
        <>
            <div className="light  rounded-md px-5 mb-4 py-4">
                <div className="flex justify-between border-b pb-2">
                    <div className="">Top Image</div>
                    {changes ? (
                        <div className="fade-in font-bold text-red-400">
                            There are unsaved changes on this segment
                        </div>
                    ) : (
                        ""
                    )}
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
                        <div className="w-full flex justify-evenly my-10">
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
                                                if (e.target.files) {
                                                    setUploading(true);
                                                    handleUpload(
                                                        e.target.files[0],
                                                        "header"
                                                    );
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
                                            htmlFor={
                                                props.segment.id +
                                                "-top-image-input"
                                            }>
                                            Upload New
                                        </label>
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
                    <div id={"left-segment-" + props.index + "-column"}>
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
                        <div className="w-1/6">
                            <div className="border-b pb-2 mb-2">Order</div>
                            <input
                                className="text-black"
                                value={order}
                                onChange={(e) =>
                                    setOrder(parseInt(e.target.value))
                                }
                                type="number"
                            />
                        </div>
                    </div>
                    <div className={"right-segment-" + props.index + "-column"}>
                        <div className="">
                            <div className="border-b pb-2">Images</div>
                            <div className="grid grid-cols-4 gap-4 p-2">
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
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onOpenChangeDelete}
                        className="px-4 py-2 hover:bg-red-800 hover:text-white text-red-600 rounded transition-all">
                        Delete
                    </button>
                    {
                        <button
                            disabled={!changes}
                            onClick={() => handleUpdate()}
                            className="disabled:bg-neutral-400 disabled:cursor-not-allowed px-4 py-2 bg-orange-400 rounded ms-4">
                            Update
                        </button>
                    }
                </div>
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
                                    <div className="grid grid-cols-4 gap-5">
                                        {availableImages.map(
                                            (image: Images, index: number) => {
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
                                        {"Delete " +
                                            props.segment.title +
                                            " segment?"}
                                    </div>
                                </ModalHeader>
                                <ModalBody></ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            deleteSegment();
                                            onClose();
                                        }}>
                                        Delete
                                    </Button>
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
                                                        if (e.target.files) {
                                                            setUploading(true);
                                                            handleUpload(
                                                                e.target
                                                                    .files[0],
                                                                "image"
                                                            );
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
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 gap-5">
                                        {availableImages.map(
                                            (image: string, index: number) => {
                                                if (
                                                    image !== "None" &&
                                                    !images.includes(image)
                                                )
                                                    return (
                                                        <div
                                                            key={
                                                                image +
                                                                "-" +
                                                                index
                                                            }
                                                            className="flex cursor-pointer"
                                                            onClick={() => {
                                                                setImages([
                                                                    ...images,
                                                                    image,
                                                                ]);
                                                                onClose();
                                                            }}>
                                                            <Image
                                                                height={300}
                                                                width={300}
                                                                src={
                                                                    process.env
                                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                    image
                                                                }
                                                                alt={image}
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
        </>
    );
}
