"use client";

import { createTicket } from "@/components/server/userActions/adminTickets";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Switch,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export type TicketFormType = {
    dashboard: boolean;
    reproducible: boolean;
    problem: string;
    submittedBy: string;
};

export default function CreateTicketModal(props: {
    name: string;
    isOpenReport: any;
    onOpenChangeReport: any;
}) {
    const [ticketSuccess, setTicketSuccess] = useState(false);
    const [dashboard, setDashboard] = useState(false);
    const [reproducible, setReproducible] = useState(false);
    const ticketForm = useForm<TicketFormType>({
        defaultValues: {
            dashboard: false,
            reproducible: false,
            submittedBy: props.name,
        },
    });
    const { register, handleSubmit, reset, setValue, getValues, formState } =
        ticketForm;
    const { errors } = formState;

    function onSubmitTicket(data: TicketFormType) {
        createTicket(data)
            .then(() => {
                reset({
                    dashboard: false,
                    reproducible: false,
                    problem: "",
                    submittedBy: props.name,
                });
                setDashboard(false);
                setReproducible(false);
                setTicketSuccess(true);
            })
            .catch((err) => console.log(err));
    }

    return (
        <Modal
            backdrop="blur"
            isDismissable={false}
            isOpen={props.isOpenReport}
            className="dark"
            onOpenChange={props.onOpenChangeReport}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Ticket Submission</ModalHeader>
                        <form onSubmit={handleSubmit(onSubmitTicket)}>
                            <ModalBody>
                                {ticketSuccess ? (
                                    <div className="w-full text-xl text-green-400 text-center">
                                        Ticket Successfully Submitted!
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-lg">
                                            Where is the problem?
                                        </div>
                                        <div className="flex gap-2">
                                            <div
                                                className={`${
                                                    getValues("dashboard")
                                                        ? ""
                                                        : "text-orange-600"
                                                }
                                transition-all`}>
                                                Main Site
                                            </div>
                                            <Switch
                                                color="default"
                                                isSelected={dashboard}
                                                onChange={(e) => {
                                                    setValue(
                                                        "dashboard",
                                                        !dashboard
                                                    );
                                                    setDashboard(!dashboard);
                                                }}>
                                                <div
                                                    className={`
                                    ${
                                        getValues("dashboard")
                                            ? "text-orange-600"
                                            : ""
                                    }
                                transition-all`}>
                                                    Dashboard
                                                </div>
                                            </Switch>
                                        </div>
                                        <div className="text-lg">
                                            Is it easily reproducible?
                                        </div>
                                        <Switch
                                            color="success"
                                            isSelected={reproducible}
                                            onChange={() => {
                                                setValue(
                                                    "reproducible",
                                                    !reproducible
                                                );
                                                setReproducible(!reproducible);
                                            }}
                                            // onValueChange={setReproducible}
                                        >
                                            <div>
                                                {getValues("reproducible")
                                                    ? "Yes"
                                                    : "No"}
                                            </div>
                                        </Switch>
                                        <div className="text-lg">
                                            Describe the problem...
                                        </div>
                                        <textarea
                                            {...register("problem", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Please describe the problem.",
                                                },
                                            })}
                                            placeholder={
                                                errors.problem
                                                    ? errors.problem.message
                                                    : "Type here..."
                                            }
                                            className={`${
                                                errors.problem
                                                    ? "placeholder:text-red-400"
                                                    : ""
                                            } min-h-52`}
                                        />
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    type="button"
                                    onPress={() => {
                                        onClose();
                                        reset({
                                            dashboard: false,
                                            reproducible: false,
                                            problem: "",
                                            submittedBy: props.name,
                                        });
                                        setDashboard(false);
                                        setReproducible(false);
                                        setTicketSuccess(false);
                                    }}
                                    color="danger"
                                    variant="light">
                                    Close
                                </Button>
                                {!ticketSuccess && (
                                    <Button
                                        type="submit"
                                        className="bg-orange-600">
                                        Submit Ticket
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
