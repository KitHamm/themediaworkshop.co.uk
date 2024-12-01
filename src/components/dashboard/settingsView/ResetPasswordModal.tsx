"use client";

import { randomPassword } from "@/lib/functions";
import { ResetUserPasswordFormType } from "@/lib/types";
import { resetUserPassword } from "@/server/userActions/resetUserPassword";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ResetPasswordModal(props: {
    isOpen: boolean;
    onOpenChange: () => void;
    adminID: string;
    userID: string;
}) {
    const { isOpen, onOpenChange, adminID, userID } = props;
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [passwordError, setPasswordError] = useState(false);
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
    const [newPassword, setNewPassword] = useState<string | null>(null);

    const resetPasswordForm = useForm<ResetUserPasswordFormType>({
        defaultValues: {
            adminId: adminID,
            userId: userID,
        },
    });
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = resetPasswordForm;

    async function resetPassword(data: ResetUserPasswordFormType) {
        data.userId = userID;
        data.password = randomPassword(10);
        resetUserPassword(data)
            .then((res) => {
                setResetPasswordSuccess(true);
                setNewPassword(res.message);
            })
            .catch((err) => {
                console.log(err);
                setResetPasswordSuccess(false);
                setPasswordError(true);
            });
    }

    return (
        <Modal
            size="xl"
            backdrop="blur"
            className="dark"
            isDismissable={false}
            isOpen={isOpen}
            onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="text-center flex flex-col gap-1 text-red-400">
                            Reset Password
                        </ModalHeader>
                        <form onSubmit={handleSubmit(resetPassword)}>
                            <ModalBody>
                                {resetPasswordSuccess ? (
                                    <>
                                        <div className="flex flex-col text-center text-2xl text-orange-600">
                                            Success
                                        </div>
                                        <div className="flex flex-col text-center text-lg">
                                            This users password has been
                                            changed. They will receive an email
                                            with their new password shortly.
                                        </div>
                                        <div className="text-center">
                                            Or please send them their password
                                        </div>
                                        <div className="text-center bg-white text-black p-2 rounded-xl">
                                            {newPassword}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col text-center text-xl">
                                            Are you sure you want to reset this
                                            users password?
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="mt-6">
                                                Enter your password to continue.
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
                                                errors.adminPassword
                                                    ? "placeholder:text-red-400"
                                                    : ""
                                            } text-center`}
                                            placeholder={
                                                errors.adminPassword
                                                    ? errors.adminPassword
                                                          .message
                                                    : "Password"
                                            }
                                            {...register("adminPassword", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Password is required.",
                                                },
                                            })}
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
                                        reset({
                                            adminId: adminID,
                                            adminPassword: "",
                                        });
                                    }}
                                    variant="light"
                                    color="danger"
                                    className="rounded-md">
                                    Cancel
                                </Button>
                                {!resetPasswordSuccess && (
                                    <Button
                                        type="submit"
                                        className="rounded-md bg-orange-600">
                                        Reset Password
                                    </Button>
                                )}
                            </ModalFooter>
                        </form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
