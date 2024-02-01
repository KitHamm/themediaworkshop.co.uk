"use client";

export default function Header(props: {
    description: String;
    header: string;
    home: boolean;
}) {
    return (
        <div className="absolute top-0 left-0 z-20 grid grid-cols-2 h-full">
            <div className="flex justify-center">
                <div className="m-auto text-center w-2/3">
                    {props.home ? <div>WE ARE</div> : ""}
                    <div className="font-bold text-4xl uppercase">
                        {props.header}
                    </div>
                    <div className="flex justify-evenly px-10 my-4">
                        <div>
                            <button className="font-bold bg-orange-600 px-8 py-3">
                                SHOWREEL
                            </button>
                        </div>
                        <div>
                            <button className="font-bold bg-white px-8 py-3 text-black">
                                CONTACT
                            </button>
                        </div>
                    </div>
                    <p className="text-justify text-lg">{props?.description}</p>
                </div>
            </div>
        </div>
    );
}
