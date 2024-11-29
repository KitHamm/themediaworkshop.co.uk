import { Images, Logos, Message, Videos } from "@prisma/client";

export function DateRender(date: Date) {
    var formattedDate;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    formattedDate = day + "/" + month + "/" + year;
    return formattedDate;
}

export function imageSort(images: Images[], logos: Logos[], type: string) {
    return images.concat(logos).filter(function (image: Images | Logos) {
        switch (type) {
            case "header":
                return image.name.split("_")[0] === "SEGHEAD";
            case "segment":
                return image.name.split("_")[0] === "SEGMENT";
            case "study":
                return image.name.split("_")[0] === "STUDY";
            case "logos":
                return image.name.split("_")[0] === "LOGO";
            case "thumbnails":
                return image.name.split("_")[0] === "THUMBNAIL";
            case "all":
                return true;
        }
    });
}

export function videoSort(videos: Videos[], type: string) {
    return videos.filter(function (video: Videos) {
        switch (type) {
            case "background":
                return video.name.split("_")[0] === "HEADER";
            case "video":
                return video.name.split("_")[0] === "VIDEO";
            case "all":
                return true;
        }
    });
}
type Items = {
    name: string;
    createdAt: Date;
};
export function itemOrder(items: Items[], sortBy: string, orderBy: string) {
    const temp: Items[] = [...items];
    switch (sortBy) {
        case "date":
            if (orderBy === "desc") {
                temp.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                return temp;
            } else {
                temp.sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );
                return temp;
            }
        case "name":
            if (orderBy === "desc") {
                temp.sort((a, b) => b.name.localeCompare(a.name));
                return temp;
            } else {
                temp.sort((a, b) => a.name.localeCompare(b.name));
                return temp;
            }
        default:
            return temp;
    }
}

export function handleChevronOnScroll(chevron: HTMLDivElement) {
    if (chevron) {
        chevron.classList.replace("opacity-100", "opacity-0");
    }
}

export function parallaxOnScroll(
    headerImageContainerEl: HTMLDivElement,
    headerImageEl: HTMLImageElement,
    setParallaxValue: React.Dispatch<React.SetStateAction<number>>,
    setContainerHeight: React.Dispatch<React.SetStateAction<number>>
) {
    if (headerImageContainerEl && headerImageEl) {
        const containerHeight = headerImageContainerEl.offsetHeight;
        const imageHeight = headerImageEl.offsetHeight;
        setContainerHeight((imageHeight / 8) * 6);
        if (
            headerImageContainerEl.getBoundingClientRect().top <
                window.innerHeight &&
            headerImageContainerEl.getBoundingClientRect().top >
                0 - containerHeight
        ) {
            setParallaxValue(
                0 -
                    mapNumRange(
                        headerImageContainerEl.getBoundingClientRect().top,
                        window.innerHeight,
                        0,
                        imageHeight - containerHeight,
                        0
                    )
            );
        }
    }
}

export const mapNumRange = (
    num: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
) => ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

export function countUnreadMessages(messages: Message[]) {
    let unreadMessages = 0;
    messages.forEach((message: Message) => {
        if (message.read === false) {
            unreadMessages += 1;
        }
    });
    return unreadMessages;
}
