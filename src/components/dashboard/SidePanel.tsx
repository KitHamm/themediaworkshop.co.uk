"use client";

// Library Components
import {
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    CircularProgress,
    Badge,
    User,
} from "@nextui-org/react";

//  React Components
import { useEffect, useState } from "react";

// Next Auth
import { signOut } from "next-auth/react";

// Next Components
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

//  Functions
import uploadHandler from "./uploadHandler";
import { Message } from "@prisma/client";

export default function SidePanel(props: { session: any; messages: Message }) {
    // Search params for which view is active
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "dashboard";
    // Current avatar and possible new avatar for user
    const [avatar, setAvatar] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    // The count of unread messages
    const [unreadMessages, setUnreadMessages] = useState(0);
    // Change avatar success state
    const [changeSuccess, setChangeSuccess] = useState(false);
    // Uploading avatar state
    const [uploading, setUploading] = useState(false);
    // Modal states
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // First render get current avatar from DB
    useEffect(() => {
        getAvatar();
    }, []);

    useEffect(() => {
        handleMessageCount(props.messages);
    }, [props.messages]);

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

    function handleMessageCount(messages: Message) {
        var count = 0;
        messages.forEach((message: any) => {
            if (!message.read) {
                count++;
            }
            setUnreadMessages(count);
        });
    }

    // Handler for uploading avatar
    // Uses the upload handler returning a promise
    async function uploadAvatar(file: File) {
        await uploadHandler(file, "avatar")
            .then((res: any) => {
                if (res.message) {
                    setUploading(false);
                    setNewAvatar(res.message);
                    clearFileInput();
                }
            })
            .catch((err) => console.log(err));
    }

    // After the avatar has been uploaded the success message is displayed
    // The user can then save the avatar to their profile with this function
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

    return (
        <>
            {/* Mobile Navigation Bar */}
            <div className="z-40 fixed w-screen bottom-0 left-0 xl:hidden bg-neutral-800 border-t border-orange-600">
                <div className="flex justify-evenly pb-2 pt-2">
                    <Dropdown placement="top-start" className="dark z-0">
                        <DropdownTrigger>
                            <Avatar
                                showFallback
                                name={
                                    Array.from(
                                        props.session.user.name
                                    )[0] as string
                                }
                                src={
                                    avatar
                                        ? process.env
                                              .NEXT_PUBLIC_BASE_AVATAR_URL +
                                          avatar
                                        : undefined
                                }
                            />
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

                    <Link
                        href={"?view=dashboard"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "dashboard"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-solid fa-house fa-xl`}
                        />
                        <div className="mt-1">Dash</div>
                    </Link>
                    <Link
                        href={"?view=pages"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "pages"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-regular fa-window-restore fa-xl`}
                        />
                        <div className="mt-1">Pages</div>
                    </Link>
                    <Link
                        href={"?view=media"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "media"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-regular fa-images fa-xl`}
                        />
                        <div className="mt-1">Media</div>
                    </Link>
                    <Link
                        href={"?view=messages"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "messages"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-regular fa-message fa-xl`}
                        />
                        <Badge
                            placement="top-right"
                            color="danger"
                            isInvisible={unreadMessages === 0 ? true : false}
                            content={unreadMessages}>
                            {""}
                        </Badge>
                        <div className="mt-1">Msg</div>
                    </Link>

                    <Link
                        href={"?view=settings"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "settings"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-solid fa-gear fa-xl`}
                        />
                        <div className="mt-1">Settings</div>
                    </Link>
                </div>
            </div>
            {/* Desktop Side Panel */}
            {/* Side panel set to 1/6 width of the screen in a fixed position on the left */}
            <div className="hidden xl:block min-h-screen h-full fixed top-0 w-1/6 bg-neutral-800 border-r border-orange-600">
                <div className="xl:flex xl:p-10 border-b border-neutral-400 mb-4">
                    <Image
                        onClick={() => (window.location.href = "/")}
                        src={"/images/tmw-logo.png"}
                        alt="TMW Logo"
                        priority
                        id="title-logo"
                        height={75}
                        width={720}
                        className="cursor-pointer max-w-full"
                    />
                </div>
                {/* User information and avatar */}
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
                                name: Array.from(
                                    props.session.user.name
                                )[0] as string,
                                size: "lg",
                                className: "text-large ms-auto",
                            }}
                        />
                        {/* User dropdown containing upload new avatar and logout */}
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
                {/* Navigation Links using state props */}
                <Link
                    href={"?view=dashboard"}
                    className={`${
                        view === "dashboard"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <i
                        aria-hidden
                        className="fa-solid fa-house fa-xl my-auto"
                    />
                    <div className="my-auto">Dashboard</div>
                </Link>
                <Link
                    href={"?view=pages"}
                    className={`${
                        view === "pages"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <i
                        aria-hidden
                        className="fa-regular fa-window-restore fa-xl my-auto"
                    />
                    <div className="my-auto">Pages</div>
                </Link>
                <Link
                    href={"?view=media"}
                    className={`${
                        view === "media"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <i
                        aria-hidden
                        className="fa-regular fa-images fa-xl my-auto"
                    />
                    <div className="my-auto">Media</div>
                </Link>
                <Link
                    href={"?view=messages"}
                    className={`${
                        view === "messages"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <Badge
                        color="danger"
                        isInvisible={unreadMessages === 0 ? true : false}
                        content={unreadMessages}>
                        <i
                            aria-hidden
                            className="fa-regular fa-message fa-xl my-auto"
                        />
                    </Badge>
                    <div className="my-auto">Messages</div>
                </Link>
                <Link
                    href={"?view=settings"}
                    className={`${
                        view === "settings"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <i aria-hidden className="fa-solid fa-gear fa-xl my-auto" />
                    <div className="my-auto">Settings</div>
                </Link>
            </div>
            {/* Modal for uploading new avatar */}
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
                                {/* Show success message on successful upload of avatar */}
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
                                                uploading ? (
                                                    <div className="w-full flex justify-center">
                                                        <CircularProgress
                                                            color="warning"
                                                            aria-label="Loading..."
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="file-input flex w-full justify-center">
                                                        <input
                                                            id="new-avatar"
                                                            className="inputFile mx-auto"
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .files
                                                                ) {
                                                                    setUploading(
                                                                        true
                                                                    );
                                                                    uploadAvatar(
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
                                                )
                                            ) : (
                                                <div>{newAvatar}</div>
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
                                                    className="disabled:bg-neutral-600 disabled:cursor-not-allowed bg-orange-600 px-4 py-2 rounded-lg">
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
