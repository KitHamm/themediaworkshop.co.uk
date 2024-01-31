export default function Settings(props: { hidden: boolean }) {
    return (
        <div className={`${props.hidden ? "hidden" : ""} p-20`}>Settings</div>
    );
}
