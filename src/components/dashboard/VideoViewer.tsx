export default function VideoViewer(props: {
    open: boolean;
    video: string;
    setVideoModalOpen: any;
}) {
    return (
        <div
            className={`${
                props.open ? "" : "hidden"
            } fade-in fixed flex justify-center top-0 left-0 w-full h-full bg-black bg-opacity-75`}>
            <div className="w-1/2 h-1/2 m-auto">
                {props.video !== "" ? (
                    <video
                        id="bg-video"
                        controls={true}
                        src={
                            process.env.NEXT_PUBLIC_BASE_VIDEO_URL + props.video
                        }
                    />
                ) : (
                    ""
                )}
                <div className="flex justify-end mt-2">
                    <button
                        onClick={() => {
                            props.setVideoModalOpen(false);
                        }}
                        className="px-4 py-2 rounded bg-orange-400">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
