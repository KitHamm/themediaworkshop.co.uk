export default function Footer() {
    const date = new Date();
    return (
        <div className="w-full">
            <div className="flex justify-center bg-neutral-800 py-10">
                <div className="flex justify-evenly gap-10">
                    <div className="cursor-pointer hover:text-orange-400 transition-all">
                        <a
                            href="https://www.instagram.com/themediaworkshopltd/"
                            target="_blank"
                            rel="noreferrer">
                            <i
                                aria-hidden
                                className="fa-brands fa-instagram fa-2xl"
                            />
                        </a>
                    </div>
                    <div className="cursor-pointer hover:text-orange-400 transition-all">
                        <a
                            href="https://vimeo.com/themediaworkshop"
                            target="_blank"
                            rel="noreferrer">
                            <i
                                aria-hidden
                                className="fa-brands fa-vimeo-v fa-2xl"
                            />
                        </a>
                    </div>
                    <div className="cursor-pointer hover:text-orange-400 transition-all">
                        <a
                            href="https://www.facebook.com/TheMediaWorkshopLtd/"
                            target="_blank"
                            rel="noreferrer">
                            <i
                                aria-hidden
                                className="fa-brands fa-facebook-f fa-2xl"
                            />
                        </a>
                    </div>
                    <div className="cursor-pointer hover:text-orange-400 transition-all">
                        <a
                            href="https://www.linkedin.com/company/themediaworkshopltd/"
                            target="_blank"
                            rel="noreferrer">
                            <i
                                aria-hidden
                                className="fa-brands fa-linkedin fa-2xl"
                            />
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center bg-black py-4">
                Copyright &copy; The Media Workshop {date.getFullYear()}
            </div>
        </div>
    );
}
