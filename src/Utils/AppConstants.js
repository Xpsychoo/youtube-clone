export function getTimeSinceUpload(uploadDate) {
    const now = new Date();
    const uploaded = new Date(uploadDate);
    const diffInSeconds = Math.floor((now - uploaded) / 1000);

    const years = Math.floor(diffInSeconds / (365 * 24 * 60 * 60));
    const months = Math.floor((diffInSeconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60));
    const days = Math.floor((diffInSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
    const seconds = diffInSeconds % 60;

    let result = "";

    if (years > 0) {
        result = `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
        result = `${months} month${months > 1 ? "s" : ""}`;
    } else if (days > 0) {
        result = `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
        result = `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
        result = `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
        result = `${seconds} second${seconds > 1 ? "s" : ""}`;
    }

    return result;
}