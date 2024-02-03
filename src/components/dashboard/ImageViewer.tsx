import Image from "next/image";

export default function ImageViewer(props: {
    open: boolean;
    image: string;
    setImageModalOpen: any;
}) {
    return (
        <div
            className={`${
                props.open ? "" : "hidden"
            } fade-in z-60 fixed flex justify-center top-0 left-0 w-full h-full bg-black bg-opacity-75`}>
            <div className="w-1/2 h-1/2 m-auto">
                {props.image !== "" ? (
                    <div className="h-full flex">
                        <Image
                            height={500}
                            width={700}
                            src={
                                process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                props.image
                            }
                            alt={props.image}
                            className="m-auto h-auto w-auto"
                        />
                    </div>
                ) : (
                    ""
                )}
                <div className="flex justify-end mt-2">
                    <button
                        onClick={() => {
                            props.setImageModalOpen(false);
                        }}
                        className="px-4 py-2 rounded bg-orange-400">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
