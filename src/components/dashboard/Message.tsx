export default function Messages(props: { hidden: boolean }) {
    return (
        <div className={`${props.hidden ? "hidden" : ""} p-20`}>Messages</div>
    );
}
