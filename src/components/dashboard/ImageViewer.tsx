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
                        <img
                            id="image"
                            className="m-auto h-auto w-auto"
                            src={
                                process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                props.image
                            }
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
