import { Images, Logos, Videos } from "@prisma/client";

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
