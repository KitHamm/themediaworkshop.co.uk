"use client";

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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormTypes = {
    name: string;
    email: string;
    message: string;
};

export default function Header(props: {
    description: String;
    header: string;
    home: boolean;
    showreel: string;
}) {
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const form = useForm<FormTypes>();
    const { register, handleSubmit, formState, reset } = form;
    const { errors } = formState;
    const {
        isOpen: isOpenContact,
        onOpen: onOpenContact,
        onOpenChange: onOpenChangeContact,
    } = useDisclosure();
    const {
        isOpen: isOpenShowreel,
        onOpen: onOpenShowreel,
        onOpenChange: onOpenChangeShowreel,
    } = useDisclosure();

    useEffect(() => {
        console.log("Showreel", props.showreel);
        console.log("Type", typeof props.showreel);
    }, []);

    useEffect(() => {
        if (sending && success) {
            setTimeout(() => {
                setSending(false);
                setShowSuccess(true);

                setTimeout(() => {
                    setSuccess(false);
                    setShowSuccess(false);
                    reset();
                }, 3000);
            }, 2000);
        }
    }, [sending, success]);

    const onSubmit = (data: FormTypes) => {
        setSending(true);
        fetch("api/message", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (res.ok) {
                    setSuccess(true);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <div className="absolute top-0 left-0 z-20 grid grid-cols-2 h-full">
                <div className="flex justify-center">
                    <div className="m-auto text-center w-2/3">
                        {props.home ? <div>WE ARE</div> : ""}
                        <div className="font-bold text-4xl uppercase">
                            {props.header}
                        </div>
                        <div className="flex justify-evenly px-10 my-4">
                            {props.showreel !== null &&
                            props.showreel !== undefined &&
                            props.showreel !== "" ? (
                                <div>
                                    <button
                                        onClick={onOpenChangeShowreel}
                                        className="font-bold bg-orange-600 px-8 py-3">
                                        SHOWREEL
                                    </button>
                                </div>
                            ) : (
                                ""
                            )}
                            <div>
                                <button
                                    onClick={onOpenChangeContact}
                                    className="font-bold bg-white px-8 py-3 text-black">
                                    CONTACT
                                </button>
                            </div>
                        </div>
                        <p className="text-justify text-lg">
                            {props?.description}
                        </p>
                    </div>
                </div>
            </div>
            <Modal
                size="2xl"
                backdrop="blur"
                isOpen={isOpenContact}
                className="dark transition-all"
                onOpenChange={onOpenChangeContact}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full flex justify-center">
                                    <div className="font-bold text-3xl">
                                        Contact Us
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody className="light">
                                <div className="w-full">
                                    <div className="font-bold text-2xl">
                                        How can we help?
                                    </div>
                                    <p>
                                        Send us a message, give us a call, email
                                        us or get in touch on social.
                                    </p>
                                    <p>
                                        Let’s talk about your project and see
                                        how we can make some great things
                                        happen.
                                    </p>
                                    <br />
                                    <p>Tel: + 44 (0)845 8628456</p>
                                    <p>Email: info@themediaworkshop.co.uk</p>
                                    <br />
                                    <p>
                                        The Media Workshop, Dart Mills,
                                        Buckfastleigh, TQ11 0NF
                                    </p>
                                </div>

                                <div id="form-container" className="relative">
                                    <div
                                        className={`${
                                            showSuccess
                                                ? "opacity-100"
                                                : "opacity-0 hidden"
                                        } transition-opacity absolute flex justify-center w-full h-full top-0 left-0`}>
                                        <div className="m-auto text-center">
                                            <div className="font-bold text-3xl mb-4">
                                                Message received!
                                            </div>
                                            <div>
                                                We will get back to you as soon
                                                as possible.
                                            </div>
                                        </div>
                                    </div>
                                    <form
                                        className={`${
                                            showSuccess
                                                ? "opacity-0"
                                                : "opacity-100"
                                        } transition-opacity`}
                                        onSubmit={handleSubmit(onSubmit)}>
                                        <input
                                            className={`${
                                                errors.name
                                                    ? "placeholder:text-red-400"
                                                    : ""
                                            } text-black`}
                                            placeholder={
                                                errors.name
                                                    ? errors.name.message
                                                    : "Name"
                                            }
                                            type="text"
                                            {...register("name", {
                                                required: {
                                                    value: true,
                                                    message: "Name is required",
                                                },
                                            })}
                                        />
                                        <input
                                            className={`${
                                                errors.email
                                                    ? "placeholder:text-red-400"
                                                    : ""
                                            } text-black`}
                                            placeholder={
                                                errors.email
                                                    ? errors.email.message
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
                                        <textarea
                                            className={`${
                                                errors.message
                                                    ? "placeholder:text-red-400"
                                                    : ""
                                            } text-black h-52`}
                                            placeholder={
                                                errors.message
                                                    ? errors.message.message
                                                    : "Your message..."
                                            }
                                            {...register("message", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "You should probably write something here...",
                                                },
                                            })}
                                        />
                                        <div className="flex justify-between">
                                            <Button
                                                color="danger"
                                                variant="light"
                                                onPress={() => {
                                                    onClose();
                                                }}>
                                                Close
                                            </Button>
                                            {sending ? (
                                                <CircularProgress
                                                    className="fade-in"
                                                    color="warning"
                                                    aria-label="Loading..."
                                                />
                                            ) : (
                                                <Button
                                                    className="text-white bg-orange-400"
                                                    type="submit">
                                                    Send
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenShowreel}
                className="dark transition-all"
                onOpenChange={onOpenChangeShowreel}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            {props.showreel !== null &&
                            props.showreel !== undefined &&
                            props.showreel !== "" ? (
                                <video
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        props.showreel
                                    }
                                />
                            ) : (
                                ""
                            )}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
