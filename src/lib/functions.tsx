export function DateRender(date: Date) {
    var formattedDate;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    formattedDate = day + "/" + month + "/" + year;
    return formattedDate;
}
