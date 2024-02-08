export default function DashboardView(props: { hidden: boolean }) {
    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20 fade-in`}>
            <div className="my-10">
                <div className="border-b py-4 mb-10 text-3xl font-bold capitalize">
                    Welcome to your Dashboard!
                </div>
                <div className="text-xl font-bold">
                    This will soon be populated with more stuff...
                </div>
                <div className="text-lg mt-10">
                    But for now just poke around and try to break it.
                </div>
                <div className="text-lg">
                    If you do manage to break it, let me know so I can work on
                    it!
                </div>
            </div>
        </div>
    );
}
