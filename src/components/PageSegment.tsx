import { Segment } from "@prisma/client";
import Image from "next/image";

export default function PageSegment(props: {
    segment: Segment;
    index: number;
}) {
    return (
        <div className="xl:grid xl:grid-cols-2 xl:gap-20 w-full px-60 py-10">
            {props.index % 2 === 0 ? (
                <div className="text-center m-auto">
                    <div className="uppercase font-bold text-3xl mb-4">
                        {props.segment.title}
                    </div>
                    <div className="text-justify text-lg">
                        {props.segment.copy}
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className="text-center">
                <img
                    alt="Placeholder"
                    src={process.env.BASE_IMAGE_URL + "placeholder.jpg"}
                    className="m-auto w-full h-auto"
                />
            </div>
            {props.index % 2 !== 0 ? (
                <div className="text-center m-auto">
                    <div className="uppercase font-bold text-3xl mb-4">
                        {props.segment.title}
                    </div>
                    <div className="text-justify text-lg">
                        {props.segment.copy}
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
