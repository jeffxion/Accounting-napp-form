export const dataFormatForPayload = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const dateFormatUTC = (dateString) => {
    const date = new Date(dateString);

    // Get year, month, day, hours, and minutes
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? String(hours).padStart(2, '0') : '12'; // Handle 12:00 as 12 not 00

    // Combine all parts into the desired format
    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
}

export const dateFormatLocal = (date) => {
    var utc = new Date(date);
    var offset = utc.getTimezoneOffset();
    var local = new Date(utc.getTime() - offset * 60000);

    var year = local.getFullYear();
    var month = String(local.getMonth() + 1).padStart(2, '0');
    var day = String(local.getDate()).padStart(2, '0');

    var hours = String(local.getHours()).padStart(2, '0');
    var minutes = String(local.getMinutes()).padStart(2, '0');
    var seconds = String(local.getSeconds()).padStart(2, '0');

    const amPm = hours < 12 ? 'AM' : 'PM';

    return `${year}-${month}-${day} ${hours}:${minutes} ${amPm}`;
}