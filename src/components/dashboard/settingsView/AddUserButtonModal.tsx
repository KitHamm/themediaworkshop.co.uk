"use client";

import MediaUploadButton from "@/components/shared/MediaUploadButton";
import { MediaType } from "@/lib/constants";
import { randomPassword } from "@/lib/functions";
import { UserFormTypes } from "@/lib/types";
import { createUser } from "@/server/userActions/createUser";
import {
    Avatar,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { Role } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddUserButtonModal() {
    const [error, setError] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [password, setPassword] = useState("");
    const [uploadError, setUploadError] = useState<string | null>(null);
    const { isOpen, onOpenChange } = useDisclosure();

    const form = useForm<UserFormTypes>({
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            position: "",
            image: "profile_placeholder.jpg",
            password: "",
            role: Role.EDITOR,
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        getValues,
        setValue,
    } = form;

    const image = watch("image");
    const name = watch("firstName");

    function handleUploadCallback(imageURL: string) {
        console.log(imageURL);
        setValue("image", imageURL);
    }

    async function onSubmit(data: UserFormTypes) {
        data.password = randomPassword(10);
        createUser(data)
            .then((res) => {
                setPassword(res.message);
                setUserCreated(true);
                setError(false);
            })
            .catch((err) => {
                console.log(err);
                setError(true);
            });
    }

    return (
        <>
            <Button
                className="bg-orange-600 rounded-md my-5 text-white text-md"
                onPress={onOpenChange}>
                Add User Account
            </Button>
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                className="dark"
                isDismissable={false}
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader
                                className={`${
                                    error ? "text-red-400" : ""
                                } flex flex-col gap-1`}>
                                {error
                                    ? "Account with email already exists"
                                    : userCreated
                                    ? "User Account Created"
                                    : "Add User Account"}
                            </ModalHeader>
                            <ModalBody>
                                {userCreated ? (
                                    <>
                                        <div className="text-center">
                                            Please send them their password
                                        </div>
                                        <div className="text-center bg-white text-black p-2 rounded-xl">
                                            {password}
                                        </div>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={() => {
                                                onClose();
                                                reset();
                                                setPassword("");
                                                setUserCreated(false);
                                            }}>
                                            Close
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div>First Name</div>
                                            <input
                                                className={`${
                                                    errors.firstName
                                                        ? "placeholder:text-red-400"
                                                        : ""
                                                } `}
                                                placeholder={
                                                    errors.firstName
                                                        ? "First Name is required."
                                                        : "First Name"
                                                }
                                                type="text"
                                                {...register("firstName", {
                                                    required: {
                                                        value: true,
                                                        message:
                                                            "First Name is required",
                                                    },
                                                })}
                                            />

                                            <div>Last Name</div>
                                            <input
                                                className={`${
                                                    errors.lastName
                                                        ? "placeholder:text-red-400"
                                                        : ""
                                                } `}
                                                placeholder={
                                                    errors.lastName
                                                        ? "Last Name is required."
                                                        : "Last Name"
                                                }
                                                type="text"
                                                {...register("lastName", {
                                                    required: {
                                                        value: true,
                                                        message:
                                                            "Last Name is required",
                                                    },
                                                })}
                                            />
                                            <div>Email</div>
                                            <input
                                                className={`${
                                                    errors.email
                                                        ? "placeholder:text-red-400"
                                                        : ""
                                                } `}
                                                placeholder={
                                                    errors.email
                                                        ? "Email is required."
                                                        : "Email"
                                                }
                                                type="email"
                                                {...register("email")}
                                            />
                                            {errors.email && (
                                                <p className="text-red-400 mb-4">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                            <div>Position</div>
                                            <input
                                                className=""
                                                placeholder="Position"
                                                type="text"
                                                {...register("position")}
                                            />
                                            <div className="mb-2">Avatar</div>
                                            {uploadError && (
                                                <div className="w-full flex justify-center text-red-400">
                                                    {uploadError}
                                                </div>
                                            )}
                                            <div className="w-full flex justify-center">
                                                {image ===
                                                "profile_placeholder.jpg" ? (
                                                    <div className="flex flex-col gap-4">
                                                        <MediaUploadButton
                                                            mediaType={
                                                                MediaType.AVATAR
                                                            }
                                                            returnURL={
                                                                handleUploadCallback
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full flex justify-center">
                                                        <Avatar
                                                            className="w-20 h-20 text-large"
                                                            showFallback
                                                            name={name}
                                                            src={
                                                                image
                                                                    ? process
                                                                          .env
                                                                          .NEXT_PUBLIC_CDN +
                                                                      "/avatars/" +
                                                                      image
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-between mt-5">
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    className="rounded-md text-md"
                                                    onPress={() => {
                                                        setUploadError(null);
                                                        onClose();
                                                        reset();
                                                        setPassword("");
                                                        setUserCreated(false);
                                                    }}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="bg-orange-600 rounded-md text-md">
                                                    Submit Details
                                                </Button>
                                            </div>
                                        </form>
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
