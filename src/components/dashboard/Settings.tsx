"use client";

// Library Components
import { useForm } from "react-hook-form";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    CircularProgress,
    Switch,
    Avatar,
    Accordion,
    AccordionItem,
} from "@nextui-org/react";

// React Components
import { useEffect, useState } from "react";

// Next Components
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// Types
export type UserFormTypes = {
    email: string;
    firstName: string;
    lastName: string;
    position: string;
    image: string;
    password: string;
    role: Role;
};
export type UserPasswordFormTypes = {
    id: string;
    password: string;
    confirmPassword: string;
    currentPassword: string;
};
export type ResetUserPasswordFormType = {
    userId: string;
    password: string;
    adminId: string;
    adminPassword: string;
};

// Function
import axios from "axios";
import { UserWithoutPassword } from "../types/customTypes";
import { CreateUser } from "../server/userActions/createUser";
import { UpdateEmailHost } from "../server/userActions/updateEmailHost";
import { DeleteUser } from "../server/userActions/deleteUser";
import { Role } from "@prisma/client";
import { UpdateUser } from "../server/userActions/updateUser";
import { Session } from "next-auth";
import { ResetUserPassword } from "../server/userActions/resetUserPassword";
import { ChangePassword } from "../server/userActions/changePassword";

export default function Settings(props: {
    hidden: boolean;
    session: Session;
    emailHost: string;
    users: UserWithoutPassword[];
}) {
    // Search params for if modal open from side panel click
    const searchParams = useSearchParams();
    const modalOpen: string = searchParams.get("open")
        ? searchParams.get("open")!
        : "false";

    // User created or error state boolean
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(false);

    // Random password created by api handler
    const [password, setPassword] = useState("");

    // Uploading state for avatar and state for avatar file name
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [notImageError, setNotImageError] = useState(false);

    // Update password states
    const [passwordError, setPasswordError] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

    // Password hidden State
    const [passwordHidden, setPasswordHidden] = useState(true);

    // user Id used for deleting user
    const [userId, setUserId] = useState("");

    // Disclosure for create user modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Edit user values
    const [newRole, setNewRole] = useState("");

    // Settings states
    const [emailHost, setEmailHost] = useState(props.emailHost);

    // Disclosure for delete user warning
    const {
        isOpen: deleteIsOpen,
        onOpen: deleteOnOpen,
        onOpenChange: deleteOnChange,
    } = useDisclosure();
    // Disclosure for edit user modal
    const {
        isOpen: IsOpenEditUser,
        onOpen: OnOpenEditUser,
        onOpenChange: OnChangeEditUser,
    } = useDisclosure();
    // Disclosure for new password modal
    const {
        isOpen: IsOpenNewPassword,
        onOpen: OnOpenNewPassword,
        onOpenChange: OnChangeNewPassword,
    } = useDisclosure();
    // Disclosure for reset password modal
    const {
        isOpen: IsOpenResetPassword,
        onOpen: OnOpenResetPassword,
        onOpenChange: OnChangeResetPassword,
    } = useDisclosure();

    // Form for creating user
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

    const updateUserForm = useForm<UserFormTypes>();
    const {
        register: registerUpdateUser,
        handleSubmit: handleSubmitUpdateUser,
        reset: resetUpdateUser,
        getValues: getValuesUpdateUser,
        setValue: setValueUpdateUser,
        formState: { errors: errorsUpdateUser },
    } = updateUserForm;

    const resetPasswordForm = useForm<ResetUserPasswordFormType>({
        defaultValues: {
            adminId: props.session.user.id!,
        },
    });
    const {
        register: registerResetPassword,
        handleSubmit: handleSubmitResetPassword,
        reset: resetResetPassword,
        setValue: setValueResetPassword,
        formState: { errors: errorsResetPassword },
    } = resetPasswordForm;

    const passwordChangeForm = useForm<UserPasswordFormTypes>();
    const {
        getValues,
        register: newPassRegister,
        handleSubmit: newPassHandleSubmit,
        formState: newPassFormState,
        reset: newPassReset,
    } = passwordChangeForm;
    const { errors: newPassErrors } = newPassFormState;

    // React Hook Form declarations
    const {
        register,
        handleSubmit,
        formState,
        reset,
        setValue,
        getValues: getValueNewUser,
    } = form;
    const { errors } = formState;

    async function deleteUser() {
        DeleteUser(userId)
            .then((res) => {
                if (res.status === 200) {
                    setUserId("");
                }
            })
            .catch((err) => console.log(err));
    }

    async function uploadAvatar(file: File) {
        setUploadProgress(0);
        const formData = new FormData();
        formData.append("file", file);
        axios
            .post("/api/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (ProgressEvent) => {
                    if (ProgressEvent.bytes) {
                        let percent = Math.round(
                            (ProgressEvent.loaded / ProgressEvent.total!) * 100
                        );
                        setUploadProgress(percent);
                    }
                },
            })
            .then((res) => {
                if (res.data.message) {
                    setUploading(false);
                    setValue("image", res.data.message);
                    clearFileInput();
                }
            })
            .catch((err) => console.log(err));
    }

    function clearFileInput() {
        const inputElm = document.getElementById(
            "new-video"
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }

    // Update the email host
    async function updateEmailHost() {
        UpdateEmailHost(props.emailHost, emailHost);
    }

    // Submit user to database and retrieve password to display one time
    async function onSubmit(data: UserFormTypes) {
        data.password = randomPassword(10);
        CreateUser(data)
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.message);
                    setPassword(res.message);
                    setUserCreated(true);
                    setError(false);
                    setValue("image", "");
                } else {
                    setError(true);
                    console.log(res.message);
                }
            })
            .catch((err) => console.log(err));
    }

    function onSubmitNewPassword(data: UserPasswordFormTypes) {
        data.id = props.session.user.id!;
        ChangePassword(data).then((res) => {
            if (res.status === 200) {
                setPasswordSuccess(true);
                setPasswordError(false);
            } else {
                console.log(res.message);
                setPasswordSuccess(false);
                setPasswordError(true);
            }
        });
    }

    async function resetPassword(data: ResetUserPasswordFormType) {
        data.userId = userId;
        data.password = randomPassword(10);
        ResetUserPassword(data)
            .then((res) => {
                if (res.status === 200) {
                    setResetPasswordSuccess(true);
                    setPassword(res.message);
                } else {
                    console.log(res.message);
                    setResetPasswordSuccess(false);
                    setPasswordError(true);
                }
            })
            .catch((err) => console.log(err));
    }

    function updateUser(data: UserFormTypes) {
        UpdateUser(data, userId)
            .then((res) => {
                if (res.status === 200) {
                    setNewRole("");
                    setUserId("");
                    OnChangeEditUser();
                } else {
                    console.log(res.message);
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div
            className={`${
                props.hidden ? "hidden" : ""
            } xl:mx-20 mx-4 fade-in xl:pb-0 pb-20`}>
            <div className="xl:my-10">
                <div className="border-b py-4 text-3xl font-bold capitalize">
                    Settings
                </div>
                {props.session.user.role === "ADMIN" && (
                    <>
                        <div className="">
                            <div className="mt-5 font-bold text-xl">
                                Notification Email:
                            </div>
                            <div className="grid gap-2 xl:flex xl:gap-4">
                                <div className="flex gap-4">
                                    <input
                                        value={emailHost}
                                        onChange={(e) =>
                                            setEmailHost(e.target.value)
                                        }
                                        className="text-black xl:min-w-80"
                                        type="email"
                                    />
                                    <div
                                        onClick={() => {
                                            if (emailHost !== props.emailHost) {
                                                updateEmailHost();
                                            }
                                        }}
                                        className={`${
                                            emailHost !== props.emailHost
                                                ? "text-orange-600 cursor-pointer"
                                                : "text-neutral-400 cursor-not-allowed"
                                        } xl:my-auto my-5`}>
                                        Set
                                    </div>
                                </div>
                                <em className="text-neutral-500 my-auto xl:ms-10">
                                    This is the email address that you will
                                    receive notifications of new messages on. It
                                    will also appear as the sender email on
                                    outgoing messages.
                                </em>
                            </div>
                        </div>
                        <Button
                            className="py-2 px-4 xl:mt-10 mt-5 bg-orange-600 rounded"
                            onPress={onOpen}>
                            Add User Account
                        </Button>
                    </>
                )}
                <div className="font-bold mb-5 mt-5 text-xl">All Users</div>

                {/* Mobile Accordion */}
                <div className="xl:hidden">
                    <Accordion className="dark" variant="splitted">
                        {props.users.map(
                            (user: UserWithoutPassword, index: number) => {
                                return (
                                    <AccordionItem
                                        key={index}
                                        aria-label={
                                            user.firstname + " " + user.lastname
                                        }
                                        startContent={
                                            <Avatar
                                                radius="lg"
                                                src={
                                                    user.image
                                                        ? process.env
                                                              .NEXT_PUBLIC_BASE_AVATAR_URL +
                                                          user.image
                                                        : undefined
                                                }
                                            />
                                        }
                                        subtitle={
                                            <div
                                                className={`${
                                                    user.activated
                                                        ? "text-green-600"
                                                        : "text-neutral-600"
                                                }`}>
                                                {user.activated
                                                    ? "Activated"
                                                    : "Not Activated"}
                                            </div>
                                        }
                                        title={
                                            user.firstname + " " + user.lastname
                                        }>
                                        <div className="px-6 py-2">
                                            <div className="font-bold text-lg">
                                                Email:
                                            </div>
                                            {user.email}
                                        </div>
                                        <div className="px-6 py-2">
                                            <div className="font-bold text-lg">
                                                Position:
                                            </div>
                                            {user.position}
                                        </div>
                                        <div className="px-6 py-2">
                                            <div className="font-bold text-lg">
                                                Role:
                                            </div>
                                            {user.role}
                                        </div>
                                        {props.session.user.role ===
                                            "ADMIN" && (
                                            <div className="flex justify-end gap-2 my-2">
                                                <Button
                                                    onPress={() => {
                                                        resetUpdateUser({
                                                            firstName:
                                                                user.firstname,
                                                            lastName:
                                                                user.lastname,
                                                            email: user.email,
                                                            role: user.role as Role,
                                                            position:
                                                                user.position
                                                                    ? user.position
                                                                    : "",
                                                        });
                                                        setUserId(user.id);
                                                        OnOpenEditUser();
                                                    }}
                                                    className="bg-orange-600">
                                                    Edit
                                                </Button>
                                                {user.id !==
                                                    props.session.user.id && (
                                                    <Button
                                                        onPress={() => {
                                                            setUserId(user.id);
                                                            deleteOnOpen();
                                                        }}
                                                        color="danger"
                                                        variant="light">
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </AccordionItem>
                                );
                            }
                        )}
                    </Accordion>
                </div>
                {/* Desktop Table */}
                <table className="hidden xl:block table-auto text-left">
                    <thead className="bg-neutral-600">
                        <tr>
                            <th scope="col" className="px-6 py-2">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-2">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-2">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-2">
                                Position
                            </th>
                            <th scope="col" className="px-6 py-2">
                                Role
                            </th>
                            {props.session.user.role === "ADMIN" && (
                                <>
                                    <th scope="col" className="px-6 py-2">
                                        <span className="sr-only">Edit</span>
                                    </th>

                                    <th scope="col" className="px-6 py-2">
                                        <span className="sr-only">Delete</span>
                                    </th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-left bg-neutral-800">
                        {props.users.map(
                            (user: UserWithoutPassword, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td
                                            scope="col"
                                            className={`${
                                                user.activated
                                                    ? "text-green-600"
                                                    : "text-neutral-600"
                                            } px-6 py-4`}>
                                            {user.activated
                                                ? "Activated"
                                                : "Not Activated"}
                                        </td>
                                        <td
                                            scope="col"
                                            className="px-6 py-4 flex gap-2">
                                            <Avatar
                                                src={
                                                    user.image
                                                        ? process.env
                                                              .NEXT_PUBLIC_BASE_AVATAR_URL +
                                                          user.image
                                                        : undefined
                                                }
                                                size="md"
                                            />
                                            <div className="my-auto">
                                                {user.firstname +
                                                    " " +
                                                    user.lastname}
                                            </div>
                                        </td>
                                        <td scope="col" className="px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td scope="col" className="px-6 py-4">
                                            {user.position}
                                        </td>
                                        <td scope="col" className="px-6 py-4">
                                            {user.role}
                                        </td>

                                        <td scope="col">
                                            {props.session.user.role ===
                                                "ADMIN" && (
                                                <div
                                                    onClick={() => {
                                                        resetUpdateUser({
                                                            firstName:
                                                                user.firstname,
                                                            lastName:
                                                                user.lastname,
                                                            email: user.email,
                                                            role: user.role as Role,
                                                            position:
                                                                user.position
                                                                    ? user.position
                                                                    : "",
                                                        });
                                                        setNewRole(user.role);
                                                        setUserId(user.id);
                                                        OnOpenEditUser();
                                                    }}
                                                    className="px-6 py-2 text-orange-600 cursor-pointer">
                                                    Edit
                                                </div>
                                            )}
                                        </td>
                                        <td scope="col">
                                            {props.session.user.role ===
                                                "ADMIN" &&
                                            user.id !==
                                                props.session.user.id ? (
                                                <div
                                                    onClick={() => {
                                                        setUserId(user.id);
                                                        deleteOnOpen();
                                                    }}
                                                    className="px-6 py-4 text-red-400 cursor-pointer">
                                                    Delete
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
            {/* Create user modal */}
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
                                            {notImageError && (
                                                <div className="w-full flex justify-center text-red-400">
                                                    File is not an image
                                                </div>
                                            )}
                                            <div className="w-full flex justify-center">
                                                {getValueNewUser("image") ===
                                                "profile_placeholder.jpg" ? (
                                                    uploading ? (
                                                        <CircularProgress
                                                            classNames={{
                                                                svg: "w-20 h-20 text-orange-600 drop-shadow-md",
                                                                value: "text-xl",
                                                            }}
                                                            className="m-auto"
                                                            showValueLabel={
                                                                true
                                                            }
                                                            value={
                                                                uploadProgress
                                                            }
                                                            color="warning"
                                                            aria-label="Loading..."
                                                        />
                                                    ) : (
                                                        <div className="file-input">
                                                            <input
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.target
                                                                            .files
                                                                    ) {
                                                                        if (
                                                                            e.target.files[0].type.split(
                                                                                "/"
                                                                            )[0] ===
                                                                            "image"
                                                                        ) {
                                                                            setNotImageError(
                                                                                false
                                                                            );
                                                                            setUploading(
                                                                                true
                                                                            );
                                                                            uploadAvatar(
                                                                                e
                                                                                    .target
                                                                                    .files[0]
                                                                            );
                                                                        } else {
                                                                            setNotImageError(
                                                                                true
                                                                            );
                                                                        }
                                                                    }
                                                                }}
                                                                type="file"
                                                                className="inputFile"
                                                                id="new-avatar"
                                                            />
                                                            <label htmlFor="new-avatar">
                                                                {getValueNewUser(
                                                                    "image"
                                                                ) !==
                                                                "profile_placeholder.jpg"
                                                                    ? getValueNewUser(
                                                                          "image"
                                                                      )
                                                                    : "Select file"}
                                                            </label>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="w-full flex justify-center">
                                                        <Avatar
                                                            className="w-20 h-20 text-large"
                                                            showFallback
                                                            name={
                                                                props.session
                                                                    .user.name!
                                                            }
                                                            src={
                                                                getValueNewUser(
                                                                    "image"
                                                                )
                                                                    ? process
                                                                          .env
                                                                          .NEXT_PUBLIC_BASE_AVATAR_URL +
                                                                      getValueNewUser(
                                                                          "image"
                                                                      )
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
                                                    onPress={() => {
                                                        setNotImageError(false);
                                                        onClose();
                                                        reset();
                                                        setPassword("");
                                                        setUserCreated(false);
                                                    }}>
                                                    Close
                                                </Button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-orange-600 rounded-xl">
                                                    Submit
                                                </button>
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
            {/* Edit user modal */}
            <Modal
                backdrop="blur"
                className="dark"
                isOpen={IsOpenEditUser}
                onOpenChange={OnChangeEditUser}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-orange-600">
                                Edit User
                            </ModalHeader>
                            <form onSubmit={handleSubmitUpdateUser(updateUser)}>
                                <ModalBody>
                                    <div>First Name:</div>
                                    <input
                                        {...registerUpdateUser("firstName", {
                                            required: {
                                                value: true,
                                                message:
                                                    "First Name is required.",
                                            },
                                        })}
                                        placeholder={
                                            errorsUpdateUser.firstName
                                                ? errorsUpdateUser.firstName
                                                      .message
                                                : "First Name"
                                        }
                                        className={
                                            errorsUpdateUser.firstName
                                                ? "placeholder:text-red-400"
                                                : ""
                                        }
                                        type="text"
                                    />
                                    <div>Last Name:</div>
                                    <input
                                        {...registerUpdateUser("lastName", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Last Name is required.",
                                            },
                                        })}
                                        placeholder={
                                            errorsUpdateUser.lastName
                                                ? errorsUpdateUser.lastName
                                                      .message
                                                : "Last Name"
                                        }
                                        className={
                                            errorsUpdateUser.lastName
                                                ? "placeholder:text-red-400"
                                                : ""
                                        }
                                        type="text"
                                    />
                                    <div>Email:</div>
                                    <input
                                        {...registerUpdateUser("email", {
                                            required: {
                                                value: true,
                                                message: "Email is required.",
                                            },
                                        })}
                                        placeholder={
                                            errorsUpdateUser.email
                                                ? errorsUpdateUser.email.message
                                                : "Email"
                                        }
                                        className={
                                            errorsUpdateUser.email
                                                ? "placeholder:text-red-400"
                                                : ""
                                        }
                                        type="email"
                                    />
                                    <div>Position:</div>
                                    <input
                                        {...registerUpdateUser("position")}
                                        placeholder="Position"
                                        type="text"
                                    />
                                    <Switch
                                        onChange={() => {
                                            if (newRole === "ADMIN") {
                                                setNewRole("EDITOR");
                                                setValueUpdateUser(
                                                    "role",
                                                    Role.EDITOR,
                                                    { shouldDirty: true }
                                                );
                                            } else {
                                                setNewRole("ADMIN");
                                                setValueUpdateUser(
                                                    "role",
                                                    Role.ADMIN,
                                                    { shouldDirty: true }
                                                );
                                            }
                                        }}
                                        isSelected={
                                            newRole === "ADMIN" ? true : false
                                        }
                                        color="warning">
                                        Admin
                                    </Switch>
                                    {userId === props.session.user.id ? (
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                onClick={OnOpenNewPassword}
                                                className="px-2 py-1 rounded bg-orange-600">
                                                Change Password
                                            </button>
                                        </div>
                                    ) : props.session.user.role === "ADMIN" ? (
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    OnOpenResetPassword();
                                                }}
                                                className="px-2 py-1 rounded bg-orange-600">
                                                Reset Password
                                            </button>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        type="button"
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            onClose();
                                            setUserId("");
                                            setNewRole("");
                                        }}>
                                        Close
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-orange-600">
                                        Submit
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* change password modal */}
            <Modal
                backdrop="blur"
                className="dark"
                isDismissable={false}
                isOpen={IsOpenNewPassword}
                onOpenChange={OnChangeNewPassword}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-center flex flex-col gap-1 text-orange-600">
                                Change Password
                            </ModalHeader>
                            <ModalBody>
                                {passwordSuccess ? (
                                    <>
                                        <div className="flex flex-col text-center text-2xl text-orange-600">
                                            Success
                                        </div>
                                        <div className="flex flex-col text-center text-lg">
                                            Your password has been changed.
                                            Please log out and log back in with
                                            your new password.
                                        </div>
                                        <div className="flex justify-end my-4">
                                            <Button
                                                onClick={() =>
                                                    signOut({
                                                        callbackUrl:
                                                            "/dashboard",
                                                    })
                                                }
                                                className="bg-orange-600">
                                                Log Out
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <form
                                        onSubmit={newPassHandleSubmit(
                                            onSubmitNewPassword
                                        )}>
                                        <div className="flex justify-between">
                                            <div className="font-bold text-xl mt-4">
                                                New password
                                            </div>
                                            <i
                                                onClick={() =>
                                                    setPasswordHidden(
                                                        !passwordHidden
                                                    )
                                                }
                                                aria-hidden
                                                className={`fa-solid my-auto cursor-pointer ${
                                                    passwordHidden
                                                        ? "fa-eye"
                                                        : "fa-eye-slash"
                                                } fa-2xl`}
                                            />
                                        </div>

                                        <input
                                            {...newPassRegister("password", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "New Password is required",
                                                },
                                            })}
                                            className={
                                                newPassErrors.password
                                                    ? "placeholder:text-red-400"
                                                    : ""
                                            }
                                            placeholder={
                                                newPassErrors.password
                                                    ? newPassErrors.password
                                                          .message
                                                    : "New Password"
                                            }
                                            id="new-password"
                                            type={
                                                passwordHidden
                                                    ? "password"
                                                    : "text"
                                            }
                                        />

                                        <div className="font-bold text-xl mt-4">
                                            Confirm password
                                        </div>
                                        <input
                                            {...newPassRegister(
                                                "confirmPassword",
                                                {
                                                    validate: (value) =>
                                                        value ===
                                                            getValues(
                                                                "password"
                                                            ) ||
                                                        "Passwords do not match.",
                                                }
                                            )}
                                            placeholder="Confirm New Password"
                                            id="confirm-new-password"
                                            type={
                                                passwordHidden
                                                    ? "password"
                                                    : "text"
                                            }
                                        />
                                        {newPassErrors.confirmPassword && (
                                            <p className="text-red-400">
                                                {
                                                    newPassErrors
                                                        .confirmPassword.message
                                                }
                                            </p>
                                        )}
                                        <div className="font-bold text-xl mt-4">
                                            Current Password
                                        </div>
                                        <input
                                            {...newPassRegister(
                                                "currentPassword",
                                                {
                                                    required: {
                                                        value: true,
                                                        message:
                                                            "Current Password is required",
                                                    },
                                                }
                                            )}
                                            className={
                                                newPassErrors.currentPassword
                                                    ? "placeholder:text-red-400"
                                                    : ""
                                            }
                                            placeholder={
                                                newPassErrors.currentPassword
                                                    ? newPassErrors
                                                          .currentPassword
                                                          .message
                                                    : "Current password"
                                            }
                                            id="current-password"
                                            type={
                                                passwordHidden
                                                    ? "password"
                                                    : "text"
                                            }
                                        />
                                        {passwordError && (
                                            <p className="text-red-400">
                                                Password is incorrect.
                                            </p>
                                        )}
                                        <div className="flex justify-end my-4 gap-4">
                                            <Button
                                                variant="light"
                                                color="danger"
                                                onPress={() => {
                                                    onClose();
                                                    newPassReset();
                                                }}>
                                                Close
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-orange-600">
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Reset password modal */}
            <Modal
                size="xl"
                backdrop="blur"
                className="dark"
                isDismissable={false}
                isOpen={IsOpenResetPassword}
                onOpenChange={OnChangeResetPassword}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-center flex flex-col gap-1 text-red-400">
                                Reset Password
                            </ModalHeader>
                            <form
                                onSubmit={handleSubmitResetPassword(
                                    resetPassword
                                )}>
                                <ModalBody>
                                    {resetPasswordSuccess ? (
                                        <>
                                            <div className="flex flex-col text-center text-2xl text-orange-600">
                                                Success
                                            </div>
                                            <div className="flex flex-col text-center text-lg">
                                                This users password has been
                                                changed. They will receive an
                                                email with their new password
                                                shortly.
                                            </div>
                                            <div className="text-center">
                                                Or please send them their
                                                password
                                            </div>
                                            <div className="text-center bg-white text-black p-2 rounded-xl">
                                                {password}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col text-center text-xl">
                                                Are you sure you want to reset
                                                this users password?
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="mt-6">
                                                    Enter your password to
                                                    continue.
                                                </div>
                                                <i
                                                    onClick={() =>
                                                        setPasswordHidden(
                                                            !passwordHidden
                                                        )
                                                    }
                                                    aria-hidden
                                                    className={`fa-solid my-auto cursor-pointer ${
                                                        passwordHidden
                                                            ? "fa-eye"
                                                            : "fa-eye-slash"
                                                    } fa-2xl`}
                                                />
                                            </div>
                                            <input
                                                className={`${
                                                    errorsResetPassword.adminPassword
                                                        ? "placeholder:text-red-400"
                                                        : ""
                                                } text-center`}
                                                placeholder={
                                                    errorsResetPassword.adminPassword
                                                        ? errorsResetPassword
                                                              .adminPassword
                                                              .message
                                                        : "Password"
                                                }
                                                {...registerResetPassword(
                                                    "adminPassword",
                                                    {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Password is required.",
                                                        },
                                                    }
                                                )}
                                                type={
                                                    passwordHidden
                                                        ? "password"
                                                        : "text"
                                                }
                                            />
                                            {passwordError && (
                                                <p className="text-red-400">
                                                    Password is incorrect.
                                                </p>
                                            )}
                                        </>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                            setResetPasswordSuccess(false);
                                            setPasswordError(false);
                                            resetResetPassword({
                                                adminId: props.session.user.id!,

                                                adminPassword: "",
                                            });
                                        }}
                                        variant="light"
                                        color="danger">
                                        Close
                                    </Button>
                                    {!resetPasswordSuccess && (
                                        <Button
                                            type="submit"
                                            className="bg-orange-600">
                                            Reset Password
                                        </Button>
                                    )}
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Delete user warning modal */}
            <Modal
                backdrop="blur"
                className="dark"
                isOpen={deleteIsOpen}
                onOpenChange={deleteOnChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-red-400">
                                WARNING
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to delete this user?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    color="danger"
                                    onPress={() => {
                                        deleteUser();
                                        onClose();
                                    }}>
                                    Delete
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        onClose();
                                        setUserId("");
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

function randomPassword(length: number) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
}
