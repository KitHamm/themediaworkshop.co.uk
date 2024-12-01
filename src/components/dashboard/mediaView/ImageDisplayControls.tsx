"use client";

import { Button, Pagination, Select, SelectItem } from "@nextui-org/react";
import { useContext } from "react";
import { MediaStateContext } from "./MediaStateProvider";
export default function ImageDisplayControls() {
    const {
        selectedImages,
        imagesPerPage,
        setImagesPerPage,
        imagePage,
        setImagePage,
        sortImagesBy,
        setSortImagesBy,
        orderImages,
        setOrderImages,
        imageView,
        setImageView,
    } = useContext(MediaStateContext);

    return (
        <>
            <div className="grid xl:grid-cols-5 grid-cols-2 gap-4 mb-4 text-center">
                <Button
                    onClick={() => setImageView("SEGHEAD")}
                    className={`${
                        imageView === "SEGHEAD"
                            ? "bg-orange-600"
                            : "bg-neutral-600"
                    } rounded-md text-white text-md transition-all`}>
                    Header
                </Button>
                <Button
                    onClick={() => setImageView("SEGMENT")}
                    className={`${
                        imageView === "SEGMENT"
                            ? "bg-orange-600"
                            : "bg-neutral-600"
                    } rounded-md text-white text-md transition-all`}>
                    Segment
                </Button>
                <Button
                    onClick={() => setImageView("STUDY")}
                    className={`${
                        imageView === "STUDY"
                            ? "bg-orange-600"
                            : "bg-neutral-600"
                    } rounded-md text-white text-md transition-all`}>
                    Case Study
                </Button>
                <Button
                    onClick={() => setImageView("THUMBNAIL")}
                    className={`${
                        imageView === "THUMBNAIL"
                            ? "bg-orange-600"
                            : "bg-neutral-600"
                    } rounded-md text-white text-md transition-all`}>
                    Thumbnail
                </Button>
                <Button
                    onClick={() => setImageView("LOGO")}
                    className={`${
                        imageView === "LOGO"
                            ? "bg-orange-600"
                            : "bg-neutral-600"
                    } rounded-md text-white text-md transition-all`}>
                    Logos
                </Button>
            </div>
            <div className="flex justify-evenly gap-12 mt-10 xl:mt-4">
                <Select
                    className="dark ms-auto me-auto xl:me-0"
                    classNames={{
                        popoverContent: "bg-neutral-600",
                    }}
                    variant="bordered"
                    selectedKeys={[imagesPerPage.toString()]}
                    labelPlacement="outside"
                    label={"Images Per Page"}
                    onChange={(e) =>
                        setImagesPerPage(parseInt(e.target.value))
                    }>
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
                    selectedKeys={[sortImagesBy]}
                    labelPlacement="outside"
                    label={"Sort by"}
                    onChange={(e) => setSortImagesBy(e.target.value)}>
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
                    selectedKeys={[orderImages]}
                    labelPlacement="outside"
                    label={"Order"}
                    onChange={(e) => setOrderImages(e.target.value)}>
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
                        total={Math.ceil(selectedImages.length / imagesPerPage)}
                        page={imagePage}
                        onChange={setImagePage}
                    />
                </div>
            </div>
        </>
    );
}
