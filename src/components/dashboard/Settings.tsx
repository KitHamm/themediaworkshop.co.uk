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
} from "@nextui-org/react";

// React Components
import { useEffect, useState } from "react";

// Types
type FormValues = {
    email: string;
    firstName: string;
    lastName: string;
    position: string;
    image: string;
    password: string;
};

// Function
import uploadHandler from "./uploadHandler";

export default function Settings(props: { hidden: boolean; session: any }) {
    // Initial Users
    const [users, setUsers] = useState([]);
    // User created or error state boolean
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(false);

    // Random password created by api handler
    const [password, setPassword] = useState("");
    // Uploading state for avatar and state for avatar file name
    const [uploading, setUploading] = useState(false);
    const [avatar, setAvatar] = useState("");
    // user Id used for deleting user
    const [userId, setUserId] = useState("");
    // Disclosure for create user modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // Disclosure for delete user warning
    const {
        isOpen: deleteIsOpen,
        onOpen: deleteOnOpen,
        onOpenChange: deleteOnChange,
    } = useDisclosure();
    const form = useForm<FormValues>({
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            position: "",
            image: "profile_placeholder.jpg",
            password: "",
        },
    });
    // React Hook Form declarations
    const { register, handleSubmit, formState, reset } = form;
    const { errors } = formState;

    // Get initial users
    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {
        fetch("/api/users", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setUsers(json))
            .catch((err) => console.log(err));
    }

    async function deleteUser() {
        fetch("/api/deleteuser", {
            method: "POST",
            body: JSON.stringify({
                id: userId,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    setUserId("");
                    getUsers();
                }
            })
            .catch((err) => {
                setUserId("");
                console.log(err);
            });
    }

    async function uploadAvatar(file: File) {
        await uploadHandler(file, "avatar")
            .then((res: any) => {
                if (res.message) {
                    setUploading(false);
                    setAvatar(file.name);
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

    // Submit user to database and retrieve password to display one time
    async function onSubmit(data: FormValues) {
        await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                position: data.position,
                image: avatar,
                password: randomPassword(10),
            }),
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.message) {
                    setPassword(json.password);
                    setUserCreated(true);
                    getUsers();
                    setError(false);
                    setAvatar("");
                } else {
                    setError(true);
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20 fade-in`}>
            <div className="my-10">
                <div className="border-b py-4 text-3xl font-bold capitalize">
                    Settings
                </div>
                <div className="font-bold mt-10 mb-5 text-xl">Users</div>
                <Button
                    className="py-2 px-4 bg-orange-400 rounded mb-5"
                    onPress={onOpen}>
                    Add User Account
                </Button>
                <table className="table-auto text-left">
                    <thead className="bg-neutral-600">
                        <tr>
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
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-left bg-neutral-800">
                        {users.map((user: any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td scope="col" className="px-6 py-4">
                                        {user.name}
                                    </td>
                                    <td scope="col" className="px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td scope="col" className="px-6 py-4">
                                        {user.position}
                                    </td>
                                    {user.id !== props.session.user.id ? (
                                        <td
                                            onClick={() => {
                                                setUserId(user.id);
                                                deleteOnOpen();
                                            }}
                                            scope="col"
                                            className="px-6 py-4 text-red-400 cursor-pointer">
                                            Delete
                                        </td>
                                    ) : (
                                        <td
                                            scope="col"
                                            className="px-6 py-4 text-neutral-400 cursor-pointer">
                                            Delete
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
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
                                        <form
                                            className=""
                                            onSubmit={handleSubmit(onSubmit)}>
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
                                                {...register("email", {
                                                    required: {
                                                        value: true,
                                                        message:
                                                            "Email is required",
                                                    },
                                                })}
                                            />
                                            <div>Position</div>
                                            <input
                                                className=""
                                                placeholder="Position"
                                                type="text"
                                                {...register("position")}
                                            />
                                            <div className="mb-2">Avatar</div>
                                            <div className="w-full flex justify-center">
                                                {avatar === "" ? (
                                                    uploading ? (
                                                        <CircularProgress
                                                            color="warning"
                                                            aria-label="Loading..."
                                                            className="ms-4"
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
                                                                        setUploading(
                                                                            true
                                                                        );
                                                                        uploadAvatar(
                                                                            e
                                                                                .target
                                                                                .files[0]
                                                                        );
                                                                    }
                                                                }}
                                                                type="file"
                                                                className="inputFile"
                                                                id="new-avatar"
                                                            />
                                                            <label htmlFor="new-avatar">
                                                                {avatar !== ""
                                                                    ? avatar
                                                                    : "Select file"}
                                                            </label>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div>{avatar}</div>
                                                )}
                                            </div>
                                            <div className="flex justify-between mt-5">
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    onPress={() => {
                                                        onClose();
                                                        reset();
                                                        setPassword("");
                                                        setAvatar("");
                                                        setUserCreated(false);
                                                    }}>
                                                    Close
                                                </Button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-orange-400 rounded-xl">
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
                                    color="danger"
                                    onPress={() => {
                                        onClose();
                                        setUserId("");
                                    }}>
                                    Close
                                </Button>
                                <Button
                                    variant="light"
                                    color="danger"
                                    onPress={() => {
                                        deleteUser();
                                        onClose();
                                    }}>
                                    Delete
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
