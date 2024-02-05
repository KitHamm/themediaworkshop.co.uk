"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { User } from "@nextui-org/react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
} from "@nextui-org/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

export default function SidePanel(props: { session: any }) {
    const [avatar, setAvatar] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [uploading, setUploading] = useState(false);
    const [changeSuccess, setChangeSuccess] = useState(false);

    useEffect(() => {
        getAvatar();
    }, []);

    async function handleUpload(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/uploadavatar" as string, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    setUploading(false);
                    setNewAvatar(file.name);
                    clearFileInput();
                }
            })
            .catch((error) => console.log(error));
    }

    async function updateAvatar() {
        fetch("/api/updateuser", {
            method: "POST",
            body: JSON.stringify({
                id: props.session.user.id,
                data: { image: newAvatar },
            }),
        })
            .then((res) => {
                if (res.ok) {
                    getAvatar();
                    setChangeSuccess(true);
                    setNewAvatar("");
                }
            })
            .catch((err) => console.log(err));
    }

    function clearFileInput() {
        const inputElm = document.getElementById(
            "new-avatar"
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }

    async function getAvatar() {
        fetch("/api/avatar", {
            method: "POST",
            body: JSON.stringify({
                id: props.session.user.id,
            }),
        })
            .then((res) => res.json())
            .then((json) => setAvatar(json.avatar))
            .catch((err) => console.log(err));
    }

    return (
        <>
            <div className="min-h-screen h-full fixed top-0 w-1/6 bg-neutral-800 border-r border-orange-400">
                <div className="xl:flex xl:p-10">
                    <Image
                        onClick={() => (window.location.href = "/")}
                        src={"/images/tmw-logo.png"}
                        alt="TMW Logo"
                        priority
                        height={75}
                        width={720}
                        className="cursor-pointer"
                    />
                </div>
                <div className="xl:flex pb-5 border-b border-neutral-400 mb-20">
                    <div className="px-5 w-full flex justify-between">
                        <User
                            name={
                                <div className="font-bold text-xl">
                                    {props.session.user.name}
                                </div>
                            }
                            description={
                                <div className="text-md">
                                    {props.session.user.position}
                                </div>
                            }
                            avatarProps={{
                                src: avatar
                                    ? process.env.NEXT_PUBLIC_BASE_AVATAR_URL +
                                      avatar
                                    : undefined,
                                name: props.session.user.name,
                                size: "lg",
                                className: "text-large ms-auto",
                            }}
                        />
                        <Dropdown className="dark z-0">
                            <DropdownTrigger>
                                <div className="xl:basis-1/5 xl:flex xl:cursor-pointer">
                                    <i
                                        aria-hidden
                                        className="xl:m-auto fa-solid fa-ellipsis-vertical"></i>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        onClick={() => onOpen()}
                                        key="new-avatar">
                                        Change Avatar
                                    </DropdownItem>
                                </DropdownSection>

                                <DropdownSection>
                                    <DropdownItem
                                        onClick={() =>
                                            signOut({ callbackUrl: "/" })
                                        }
                                        key="logout"
                                        className="text-red-400">
                                        Log Out
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <Link
                    href={"?view=dashboard"}
                    className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl pe-5 py-5 ps-10">
                    Dashboard
                </Link>
                <Link
                    href={"?view=pages"}
                    className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl pe-5 py-5 ps-10">
                    Pages
                </Link>
                <Link
                    href={"?view=media"}
                    className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl pe-5 py-5 ps-10">
                    Media
                </Link>
                <Link
                    href={"?view=messages"}
                    className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl pe-5 py-5 ps-10">
                    Messages
                </Link>
                <Link
                    href={"?view=settings"}
                    className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl pe-5 py-5 ps-10">
                    Settings
                </Link>
            </div>

            <Modal
                backdrop="blur"
                isOpen={isOpen}
                className="dark"
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Update Avatar</ModalHeader>
                            <ModalBody>
                                {changeSuccess ? (
                                    <>
                                        <div className="text-center text-2xl font-bold">
                                            Success!
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                color="danger"
                                                onPress={() => {
                                                    onClose();
                                                    setNewAvatar("");
                                                    setChangeSuccess(false);
                                                }}>
                                                Close
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex">
                                            {newAvatar === "" ? (
                                                <div className="file-input flex w-full justify-center">
                                                    <input
                                                        id="new-avatar"
                                                        className="inputFile mx-auto"
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.files
                                                            ) {
                                                                setUploading(
                                                                    true
                                                                );
                                                                handleUpload(
                                                                    e.target
                                                                        .files[0]
                                                                );
                                                            }
                                                        }}
                                                        type="file"
                                                    />
                                                    <label htmlFor="new-avatar">
                                                        {newAvatar !== ""
                                                            ? newAvatar
                                                            : "Select file"}
                                                    </label>
                                                </div>
                                            ) : (
                                                <div>{newAvatar}</div>
                                            )}
                                            {uploading ? (
                                                <CircularProgress
                                                    color="warning"
                                                    aria-label="Loading..."
                                                />
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <div>
                                                <Button
                                                    color="danger"
                                                    onPress={() => {
                                                        onClose();
                                                        setNewAvatar("");
                                                    }}>
                                                    Close
                                                </Button>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        updateAvatar();
                                                    }}
                                                    disabled={
                                                        newAvatar === ""
                                                            ? true
                                                            : false
                                                    }
                                                    className="disabled:bg-neutral-600 disabled:cursor-not-allowed bg-orange-400 px-4 py-2 rounded-lg">
                                                    Save
                                                </button>
                                            </div>
                                        </div>{" "}
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
