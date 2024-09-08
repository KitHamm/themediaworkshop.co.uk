"use client";

import {
    Button,
    CircularProgress,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateMessage } from "./server/messageActions/createMessage";

export type ContactFormTypes = {
    name: string;
    email: string;
    message: string;
};

export default function ContactModal(props: {
    onOpenChange: any;
    isOpen: any;
    onClose: any;
}) {
    const form = useForm<ContactFormTypes>();
    const [showSuccess, setShowSuccess] = useState(false);
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const { register, handleSubmit, formState, reset } = form;
    const { errors } = formState;

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

    const onSubmit = (data: ContactFormTypes) => {
        setSending(true);
        CreateMessage(data)
            .then((res) => {
                if (res.status === 200) {
                    setSuccess(true);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <Modal
            size="2xl"
            backdrop="blur"
            isOpen={props.isOpen}
            className="dark transition-all"
            placement="center"
            onOpenChange={props.onOpenChange}>
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
                                    Send us a message, give us a call, email us
                                    or get in touch on social.
                                </p>
                                <p>
                                    Let’s talk about your project and see how we
                                    can make some great things happen.
                                </p>
                                <br />
                                <p>Tel: + 44 (0)845 8628456</p>
                                <p>Email: info@themediaworkshop.co.uk</p>
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
                                            We will get back to you as soon as
                                            possible.
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="flex justify-evenly gap-10 py-5">
                                        <div className="cursor-pointer hover:text-orange-600 transition-all">
                                            <a
                                                href="https://www.instagram.com/themediaworkshopltd/"
                                                target="_blank"
                                                rel="noreferrer">
                                                <i
                                                    aria-hidden
                                                    className="fa-brands fa-instagram fa-2xl"
                                                />
                                            </a>
                                        </div>
                                        <div className="cursor-pointer hover:text-orange-600 transition-all">
                                            <a
                                                href="https://vimeo.com/themediaworkshop"
                                                target="_blank"
                                                rel="noreferrer">
                                                <i
                                                    aria-hidden
                                                    className="fa-brands fa-vimeo-v fa-2xl"
                                                />
                                            </a>
                                        </div>
                                        <div className="cursor-pointer hover:text-orange-600 transition-all">
                                            <a
                                                href="https://www.facebook.com/TheMediaWorkshopLtd/"
                                                target="_blank"
                                                rel="noreferrer">
                                                <i
                                                    aria-hidden
                                                    className="fa-brands fa-facebook-f fa-2xl"
                                                />
                                            </a>
                                        </div>
                                        <div className="cursor-pointer hover:text-orange-600 transition-all">
                                            <a
                                                href="https://www.linkedin.com/company/themediaworkshopltd/"
                                                target="_blank"
                                                rel="noreferrer">
                                                <i
                                                    aria-hidden
                                                    className="fa-brands fa-linkedin fa-2xl"
                                                />
                                            </a>
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
                                                message: "Email is required",
                                            },
                                        })}
                                    />
                                    <textarea
                                        className={`${
                                            errors.message
                                                ? "placeholder:text-red-400"
                                                : ""
                                        } text-black h-auto xl:h-52`}
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
                                                className="text-white bg-orange-600"
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
    );
}
