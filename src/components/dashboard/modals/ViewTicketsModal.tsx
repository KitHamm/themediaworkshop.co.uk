"use client";

import { revalidateDashboard } from "@/components/server/revalidateDashboard";
import {
    deleteTicket,
    resolveTicket,
} from "@/components/server/userActions/adminTickets";
import {
    Accordion,
    AccordionItem,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { Tickets } from "@prisma/client";

export default function ViewTicketsModal(props: {
    tickets: Tickets[];
    isOpenTickets: any;
    onOpenChangeTickets: any;
}) {
    return (
        <Modal
            size="5xl"
            backdrop="blur"
            isDismissable={false}
            isOpen={props.isOpenTickets}
            className="dark"
            onOpenChange={props.onOpenChangeTickets}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <div className="flex w-full gap-4">
                                <div>Tickets</div>
                                <div>
                                    <i
                                        onClick={() => revalidateDashboard()}
                                        aria-hidden
                                        className="cursor-pointer fa-solid my-auto fa-xl fa-arrows-rotate"
                                    />
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            {props.tickets.length > 0 ? (
                                <Accordion variant="splitted">
                                    {props.tickets.map(
                                        (ticket: Tickets, index: number) => {
                                            return (
                                                <AccordionItem
                                                    key={"ticket-" + index}
                                                    aria-label="Accordion 1"
                                                    title={
                                                        <div className="flex gap-4">
                                                            <div>
                                                                {ticket.from}
                                                            </div>
                                                            <div>{" | "}</div>
                                                            <div>
                                                                {ticket.dashboard
                                                                    ? "Dashboard"
                                                                    : "Main Page"}
                                                            </div>
                                                            <div>{" | "}</div>
                                                            <div>
                                                                {ticket.reproducible
                                                                    ? "Reproducible"
                                                                    : "Not Reproducible"}
                                                            </div>
                                                            <div>{" | "}</div>
                                                            <div
                                                                className={
                                                                    ticket.resolved
                                                                        ? "text-green-400"
                                                                        : "text-red-400"
                                                                }>
                                                                {ticket.resolved
                                                                    ? "Closed"
                                                                    : "Open"}
                                                            </div>
                                                        </div>
                                                    }>
                                                    <div>
                                                        <div className="font-bold text-xl mb-4">
                                                            The Problem:
                                                        </div>
                                                        <div>
                                                            {ticket.description}
                                                        </div>
                                                        <div className="flex justify-end gap-4">
                                                            <Button
                                                                onPress={() =>
                                                                    deleteTicket(
                                                                        ticket.id
                                                                    ).catch(
                                                                        (err) =>
                                                                            console.log(
                                                                                err
                                                                            )
                                                                    )
                                                                }
                                                                color="danger"
                                                                variant="light">
                                                                Delete
                                                            </Button>
                                                            <Button
                                                                onPress={() =>
                                                                    resolveTicket(
                                                                        ticket.id,
                                                                        !ticket.resolved
                                                                    ).then(
                                                                        (res) =>
                                                                            console.log(
                                                                                res
                                                                            )
                                                                    )
                                                                }
                                                                color={
                                                                    ticket.resolved
                                                                        ? "danger"
                                                                        : "success"
                                                                }>
                                                                {ticket.resolved
                                                                    ? "Open Ticket"
                                                                    : "Close Ticket"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </AccordionItem>
                                            );
                                        }
                                    )}
                                </Accordion>
                            ) : (
                                <div className="text-2xl font-bold w-full text-center">
                                    No Tickets!
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                onPress={() => {
                                    onClose();
                                }}
                                color="danger"
                                variant="light">
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
