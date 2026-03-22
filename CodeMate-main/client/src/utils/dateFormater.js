function getDate(time)
{
    const date = new Date(time);
    
    let hr = date.getHours();

    let mn = String(date.getMinutes()).padStart(2, "0");

    let amPm = hr < 12 ? "AM" : "PM";

    hr = hr % 12;
    hr = hr ? hr : 12;

    return `${hr}:${mn} ${amPm}`;
}

export default getDate;