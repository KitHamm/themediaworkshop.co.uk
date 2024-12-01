"use client";

import { UserPasswordFormTypes } from "@/lib/types";
import { changePassword } from "@/server/userActions/changePassword";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ChangePasswordModal(props: {
    isOpen: boolean;
    onOpenChange: () => void;
    adminID: string;
}) {
    const { isOpen, onOpenChange, adminID } = props;
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [passwordError, setPasswordError] = useState(false);
    const passwordChangeForm = useForm<UserPasswordFormTypes>();
    const {
        getValues,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = passwordChangeForm;

    function onSubmitNewPassword(data: UserPasswordFormTypes) {
        data.id = adminID;
        changePassword(data)
            .then(() => {
                setPasswordSuccess(true);
                setPasswordError(false);
            })
            .catch((err) => {
                console.log(err);
                setPasswordSuccess(false);
                setPasswordError(true);
            });
    }

    return (
        <Modal
            backdrop="blur"
            className="dark"
            isDismissable={false}
            isOpen={isOpen}
            onOpenChange={onOpenChange}>
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
                                        Your password has been changed. Please
                                        log out and log back in with your new
                                        password.
                                    </div>
                                    <div className="flex justify-end my-4">
                                        <Button
                                            onClick={() =>
                                                signOut({
                                                    callbackUrl: "/dashboard",
                                                })
                                            }
                                            className="bg-orange-600 rounded-md">
                                            Log Out
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <form
                                    onSubmit={handleSubmit(
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
                                        {...register("password", {
                                            required: {
                                                value: true,
                                                message:
                                                    "New Password is required",
                                            },
                                        })}
                                        className={
                                            errors.password
                                                ? "placeholder:text-red-400"
                                                : ""
                                        }
                                        placeholder={
                                            errors.password
                                                ? errors.password.message
                                                : "New Password"
                                        }
                                        id="new-password"
                                        type={
                                            passwordHidden ? "password" : "text"
                                        }
                                    />

                                    <div className="font-bold text-xl mt-4">
                                        Confirm password
                                    </div>
                                    <input
                                        {...register("confirmPassword", {
                                            validate: (value) =>
                                                value ===
                                                    getValues("password") ||
                                                "Passwords do not match.",
                                        })}
                                        placeholder="Confirm New Password"
                                        id="confirm-new-password"
                                        type={
                                            passwordHidden ? "password" : "text"
                                        }
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-400">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                    <div className="font-bold text-xl mt-4">
                                        Current Password
                                    </div>
                                    <input
                                        {...register("currentPassword", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Current Password is required",
                                            },
                                        })}
                                        className={
                                            errors.currentPassword
                                                ? "placeholder:text-red-400"
                                                : ""
                                        }
                                        placeholder={
                                            errors.currentPassword
                                                ? errors.currentPassword.message
                                                : "Current password"
                                        }
                                        id="current-password"
                                        type={
                                            passwordHidden ? "password" : "text"
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
                                            className="rounded=md"
                                            onPress={() => {
                                                onClose();
                                                reset();
                                            }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-orange-600 rounded-md">
                                            Submit Changes
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
